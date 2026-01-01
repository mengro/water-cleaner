/**
 * 产品图片重新上传到COS并获得永久URL
 *
 * 流程：
 * 1. 从临时签名URL下载图片
 * 2. 上传到COS公开目录
 * 3. 获得永久访问URL
 * 4. 生成产品数据并初始化
 *
 * 使用方法：
 * npm run init:products:full
 */

import { config } from 'dotenv';
config();

import { writeConfigJson } from '../src/lib/cos';
import imageList from '../src/data/init/imgList.json';
import { matchProductByUrl } from '../src/data/init/product-mapping';
import COS from 'cos-nodejs-sdk-v5';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createId } from '@paralleldrive/cuid2';

const {
  COS_SECRET_ID,
  COS_SECRET_KEY,
  COS_STATIC_BUCKET,
  COS_SETTING_BUCKET,
  COS_REGION,
} = process.env;

if (!COS_SECRET_ID || !COS_SECRET_KEY) {
  console.error('❌ 缺少COS凭证：COS_SECRET_ID 或 COS_SECRET_KEY');
  process.exit(1);
}

if (!COS_STATIC_BUCKET || !COS_SETTING_BUCKET || !COS_REGION) {
  console.error('❌ 缺少COS配置：COS_STATIC_BUCKET、COS_SETTING_BUCKET 或 COS_REGION');
  process.exit(1);
}

// 初始化COS客户端
const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

// 临时下载目录
const TEMP_DIR = join(process.cwd(), 'scripts', 'temp');

interface ProductGroup {
  mapping: ReturnType<typeof matchProductByUrl>;
  tempImages: string[]; // 本地临时文件路径
  originalUrls: string[]; // 原始URL
}

/**
 * 从URL下载图片到本地
 */
async function downloadImage(url: string, filename: string): Promise<Buffer> {
  console.log(`  ⬇️  下载: ${filename}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

/**
 * 上传图片到COS，返回永久URL
 */
async function uploadImageToCOS(buffer: Buffer, filename: string): Promise<string> {
  console.log(`  ⬆️  上传: ${filename}`);

  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: COS_STATIC_BUCKET!,
        Region: COS_REGION!,
        Key: filename,
        StorageClass: 'STANDARD',
        Body: buffer,
        ContentType: 'image/jpeg',
      },
      (err: unknown) => {
        if (err) {
          reject(new Error(`上传失败: ${err instanceof Error ? err.message : '未知错误'}`));
          return;
        }

        // 返回永久访问URL
        const url = `https://${COS_STATIC_BUCKET}.cos.${COS_REGION}.myqcloud.com/${filename}`;
        resolve(url);
      }
    );
  });
}

/**
 * 从URL中提取文件名
 */
function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = decodeURIComponent(urlObj.pathname);
    const filename = pathname.split('/').pop() || createId();
    return filename;
  } catch {
    return createId();
  }
}

async function main() {
  console.log('🚀 开始产品数据完整初始化...\n');

  // 创建临时目录
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }

  // 1. 按产品分组图片
  const productGroups = new Map<string, ProductGroup>();

  for (const url of imageList) {
    const mapping = matchProductByUrl(url);

    if (!mapping) {
      console.warn(`⚠️  无法匹配产品: ${url}`);
      continue;
    }

    const productName = mapping.name;

    if (!productGroups.has(productName)) {
      productGroups.set(productName, {
        mapping,
        tempImages: [],
        originalUrls: [],
      });
    }

    productGroups.get(productName)!.originalUrls.push(url);
  }

  console.log(`📦 识别到 ${productGroups.size} 个产品\n`);

  // 2. 处理每个产品：下载 → 上传 → 获得永久URL
  let successCount = 0;
  const finalProducts: Array<{
    name: string;
    categoryIds: string[];
    description: string;
    content: string;
    images: string[];
  }> = [];

  for (const [productName, { mapping, originalUrls }] of productGroups.entries()) {
    console.log(`\n处理产品: ${productName}`);
    console.log(`  - 分类: ${mapping.categoryIds.join(', ')}`);
    console.log(`  - 原始图片: ${originalUrls.length} 张`);

    try {
      const permanentUrls: string[] = [];

      // 下载并上传每张图片
      for (let i = 0; i < originalUrls.length; i++) {
        const originalUrl = originalUrls[i];

        // 提取文件名
        const originalFilename = extractFilename(originalUrl);
        const newFilename = `products/${productName}_${i + 1}.jpg`;

        console.log(`  [${i + 1}/${originalUrls.length}] ${originalFilename}`);

        // 下载
        const buffer = await downloadImage(originalUrl, originalFilename);

        // 上传到COS
        const permanentUrl = await uploadImageToCOS(buffer, newFilename);
        permanentUrls.push(permanentUrl);

        console.log(`     ✅ ${permanentUrl}`);
      }

      // 保存产品信息
      finalProducts.push({
        name: mapping.name,
        categoryIds: mapping.categoryIds,
        description: mapping.description,
        content: mapping.content,
        images: permanentUrls,
      });

      successCount++;
      console.log(`  ✅ 产品处理完成`);
    } catch (error) {
      console.error(`  ❌ 产品处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 3. 保存到COS
  console.log(`\n\n📝 保存产品数据到COS...`);

  const now = new Date().toISOString();
  const productsData = {
    products: finalProducts.map(p => ({
      id: createId(),
      name: p.name,
      categoryIds: p.categoryIds,
      description: p.description,
      content: p.content,
      images: p.images,
      isPublished: true,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    }))
  };

  try {
    // 直接使用COS SDK保存
    await new Promise<void>((resolve, reject) => {
      cos.putObject(
        {
          Bucket: COS_SETTING_BUCKET!, // 使用 setting bucket
          Region: COS_REGION!,
          Key: 'products.json',
          StorageClass: 'STANDARD',
          Body: JSON.stringify(productsData, null, 2),
          ContentType: 'application/json',
        },
        (err: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
    console.log(`  ✅ 保存成功: ${finalProducts.length} 个产品`);
  } catch (error) {
    console.error(`  ❌ 保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }

  // 4. 输出结果
  console.log('\n' + '='.repeat(60));
  console.log('✨ 初始化完成！');
  console.log(`  ✅ 成功: ${successCount} 个产品`);
  console.log(`  📊 总计: ${productGroups.size} 个产品`);
  console.log('='.repeat(60));

  console.log('\n💡 提示：');
  console.log('  1. 访问 /products 查看前台展示');
  console.log('  2. 访问 /admin/products 管理产品');
  console.log('  3. 图片已上传到COS永久可访问');
  console.log('');
}

// 执行
main().catch((error) => {
  console.error('💥 初始化失败:', error);
  process.exit(1);
});
