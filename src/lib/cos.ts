import crypto from 'crypto';

const SecretId = process.env.SecretId;
const SecretKey = process.env.SecretKey;

// 通过 npm 安装 sdk npm install cos-nodejs-sdk-v5
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
// nodejs 端可直接使用 CAM 密钥计算签名，建议用限制最小权限的子用户的 CAM 密钥
// 最小权限原则说明 https://cloud.tencent.com/document/product/436/38618
const COS = require('cos-nodejs-sdk-v5');

if (!SecretId || !SecretKey) {
  throw new Error('Missing COS env vars: COS_SECRET_ID / COS_SECRET_KEY');
}

const cos = new COS({
  SecretId, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});

type UploadToCosOptions = {
  buffer: Buffer;
  filename: string;
  contentType?: string;
};

export async function uploadToCos({ buffer, filename, contentType }: UploadToCosOptions): Promise<{ key: string; url: string }> {
  const Bucket = process.env.COS_BUCKET ?? 'water-cleaner-1256398508';
  const Region = process.env.COS_REGION ?? 'ap-shanghai';

  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = safeFilename.includes('.') ? safeFilename.split('.').pop() : undefined;
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;

  return await new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket,
        Region,
        Key: key,
        StorageClass: 'MAZ_STANDARD',
        Body: buffer,
        ContentType: contentType,
      },
      function (err: any, data: any) {
        if (err) {
          reject(err);
          return;
        }

        const location: string | undefined = data?.Location;
        const url = location ? (location.startsWith('http') ? location : `https://${location}`) : `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
        resolve({ key, url });
      }
    );
  });
}

export default uploadToCos;
