import COS from 'cos-nodejs-sdk-v5';

// Environment variables
const {
  COS_SECRET_ID,
  COS_SECRET_KEY,
  COS_SETTING_BUCKET,
  COS_STATIC_BUCKET,
  COS_REGION,
} = process.env;

if (!COS_SECRET_ID || !COS_SECRET_KEY) {
  throw new Error('Missing COS credentials: SecretId or SecretKey');
}

if (!COS_SETTING_BUCKET || !COS_STATIC_BUCKET || !COS_REGION) {
  throw new Error('Missing COS bucket configuration: COS_SETTING_BUCKET, COS_STATIC_BUCKET, or COS_REGION');
}

// Initialize COS client
const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

// ============================================================================
// Types
// ============================================================================

type CosLocation = {
  Bucket: string;
  Region: string;
  Key: string;
};

type UploadStaticFileOptions = {
  buffer: Buffer;
  filename: string;
  contentType?: string;
};

// ============================================================================
// Internal Utilities
// ============================================================================

function buildCosLocation(bucket: string, key: string): CosLocation {
  return {
    Bucket: bucket,
    Region: COS_REGION!,
    Key: key,
  };
}

function buildPublicUrl({ Bucket, Region, Key }: CosLocation): string {
  return `https://${Bucket}.cos.${Region}.myqcloud.com/${Key}`;
}

/**
 * Extract the object key from a COS public URL
 * @param url - COS public URL
 * @returns The object key, or null if the URL is invalid
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const match = url.match(/\.cos\.[^/]+\.myqcloud\.com\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function putObject(
  location: CosLocation,
  body: Buffer | string,
  contentType?: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        ...location,
        StorageClass: 'STANDARD',
        Body: body,
        ContentType: contentType,
      },
      (err: unknown) => {
        if (err) {
          const error = err as Error;
          reject(new Error(`Failed to put object to COS: ${error.message || err}`));
          return;
        }
        resolve();
      }
    );
  });
}

async function getObject(location: CosLocation): Promise<Buffer> {
  const data = await new Promise<{ Body?: Buffer | string }>((resolve, reject) => {
    cos.getObject(location, (err: unknown, data: { Body?: Buffer | string }) => {
      if (err) {
        const error = err as Error;
        reject(new Error(`Failed to get object from COS: ${error.message || err}`));
        return;
      }
      resolve(data);
    });
  });

  const body = data?.Body;
  if (!body) {
    throw new Error('COS response missing body');
  }

  return Buffer.isBuffer(body) ? body : Buffer.from(body);
}

function getObjectUrl(location: CosLocation, expiresInSeconds: number = 3600): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    cos.getObjectUrl(
      {
        ...location,
        Sign: true,
        Expires: expiresInSeconds,
      },
      (err: unknown, data: { Url: string }) => {
        if (err) {
          const error = err as Error;
          reject(new Error(`Failed to generate signed URL: ${error.message || err}`));
          return;
        }
        resolve(data.Url);
      }
    );
  });
}

// ============================================================================
// Configuration Bucket (COS_SETTING_BUCKET) - JSON Operations Only
// ============================================================================

/**
 * Read JSON configuration from the settings bucket
 */
export async function readConfigJson<T>(key: string): Promise<T> {
  const location = buildCosLocation(COS_SETTING_BUCKET!, key);
  const buffer = await getObject(location);
  const content = buffer.toString('utf-8');
  
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON from config key "${key}": ${error}`);
  }
}

/**
 * Write JSON configuration to the settings bucket
 */
export async function writeConfigJson(key: string, data: unknown): Promise<{ key: string; url: string }> {
  const location = buildCosLocation(COS_SETTING_BUCKET!, key);
  const body = JSON.stringify(data, null, 2);
  
  await putObject(location, body, 'application/json; charset=utf-8');
  
  return {
    key: location.Key,
    url: buildPublicUrl(location),
  };
}

/**
 * Get a signed URL for a configuration file (for private read access)
 * @param key - The file key in the settings bucket
 * @param expiresInSeconds - URL expiration time in seconds (default: 1 hour)
 */
export async function getConfigSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  const location = buildCosLocation(COS_SETTING_BUCKET!, key);
  return await getObjectUrl(location, expiresInSeconds);
}

// ============================================================================
// Static Resources Bucket (COS_STATIC_BUCKET) - Media Assets Only
// ============================================================================

/**
 * Upload a static file (image, video, etc.) to the static resources bucket
 */
export async function uploadStaticFile({
  buffer,
  filename,
  contentType,
}: UploadStaticFileOptions): Promise<{ key: string; url: string }> {
  // Sanitize filename and extract extension
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = safeFilename.includes('.') ? safeFilename.split('.').pop() : '';
  const nameWithoutExt = safeFilename.includes('.') 
    ? safeFilename.substring(0, safeFilename.lastIndexOf('.'))
    : safeFilename;
  
  // Generate unique key with date-based organization and timestamp
  const date = new Date().toISOString().slice(0, 10);
  const timestamp = Date.now();
  const key = `uploads/${date}/${nameWithoutExt}_${timestamp}${ext ? `.${ext}` : ''}`;
  
  const location = buildCosLocation(COS_STATIC_BUCKET!, key);
  await putObject(location, buffer, contentType);
  
  return {
    key: location.Key,
    url: buildPublicUrl(location),
  };
}

/**
 * Download a static file from the static resources bucket
 */
export async function downloadStaticFile(key: string): Promise<Buffer> {
  const location = buildCosLocation(COS_STATIC_BUCKET!, key);
  return await getObject(location);
}

/**
 * Get a signed URL for a static file (for private read access)
 * @param key - The file key in the static bucket
 * @param expiresInSeconds - URL expiration time in seconds (default: 1 hour)
 */
export async function getStaticFileSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  const location = buildCosLocation(COS_STATIC_BUCKET!, key);
  return await getObjectUrl(location, expiresInSeconds);
}

/**
 * Batch get signed URLs for multiple static files
 * @param keys - Array of file keys in the static bucket
 * @param expiresInSeconds - URL expiration time in seconds (default: 1 hour)
 */
export async function batchGetStaticFileSignedUrls(
  keys: string[],
  expiresInSeconds: number = 3600
): Promise<Record<string, string>> {
  const results = await Promise.all(
    keys.map(async (key) => {
      const url = await getStaticFileSignedUrl(key, expiresInSeconds);
      return { key, url };
    })
  );
  
  return Object.fromEntries(results.map(({ key, url }) => [key, url]));
}

/**
 * Convert public COS URLs to signed URLs (for images stored in products, etc.)
 * @param urls - Array of public COS URLs
 * @param expiresInSeconds - URL expiration time in seconds (default: 1 hour)
 * @returns Array of signed URLs in the same order as input
 */
export async function convertToSignedUrls(
  urls: string[],
  expiresInSeconds: number = 3600
): Promise<string[]> {
  return await Promise.all(
    urls.map(async (url) => {
      const key = extractKeyFromUrl(url);
      if (!key) {
        // If not a valid COS URL, return as-is
        return url;
      }
      return await getStaticFileSignedUrl(key, expiresInSeconds);
    })
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default uploadStaticFile;
