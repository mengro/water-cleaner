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
      (err: any) => {
        if (err) {
          reject(new Error(`Failed to put object to COS: ${err.message || err}`));
          return;
        }
        resolve();
      }
    );
  });
}

async function getObject(location: CosLocation): Promise<Buffer> {
  const data = await new Promise<any>((resolve, reject) => {
    cos.getObject(location, (err: any, data: any) => {
      if (err) {
        reject(new Error(`Failed to get object from COS: ${err.message || err}`));
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
  const ext = safeFilename.includes('.') ? safeFilename.split('.').pop() : undefined;
  
  // Generate unique key with date-based organization
  const date = new Date().toISOString().slice(0, 10);
  const key = `uploads/${date}/${ext ? `.${ext}` : ''}`;
  
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

// ============================================================================
// Default Export
// ============================================================================

export default uploadStaticFile;
