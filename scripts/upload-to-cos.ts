/**
 * 上传产品数据到COS
 *
 * 使用方法：
 * npm run upload:products
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// 加载环境变量
config();

import COS from 'cos-nodejs-sdk-v5';

const {
  COS_SECRET_ID,
  COS_SECRET_KEY,
  COS_SETTING_BUCKET,
  COS_REGION,
} = process.env;

if (!COS_SECRET_ID || !COS_SECRET_KEY) {
  console.error('❌ 缺少COS凭证：请检查 .env 文件中的 COS_SECRET_ID 和 COS_SECRET_KEY');
  process.exit(1);
}

if (!COS_SETTING_BUCKET || !COS_REGION) {
  console.error('❌ 缺少COS配置：请检查 .env 文件中的 COS_SETTING_BUCKET 和 COS_REGION');
  process.exit(1);
}

// 初始化COS客户端
const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

async function uploadProductsToCos() {
  console.log('🚀 开始上传产品数据到COS...\n');

  // 读取生成的JSON文件
  const jsonPath = join(process.cwd(), 'scripts', 'output', 'products.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const productsData = JSON.parse(jsonContent);

  console.log(`📦 准备上传 ${productsData.products.length} 个产品\n`);

  try {
    // 上传到COS
    await new Promise<void>((resolve, reject) => {
      cos.putObject(
        {
          Bucket: COS_SETTING_BUCKET!,
          Region: COS_REGION!,
          Key: 'products.json',
          Body: JSON.stringify(productsData, null, 2),
          ContentType: 'application/json',
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    console.log('✅ 上传成功！\n');
    console.log('产品列表：');
    productsData.products.forEach((product: any, index: number) => {
      console.log(`  ${index + 1}. ${product.name}`);
      console.log(`     - ID: ${product.id}`);
      console.log(`     - 分类: ${product.categoryIds.join(', ')}`);
      console.log(`     - 图片: ${product.images.length} 张`);
      console.log('');
    });

    console.log('='.repeat(60));
    console.log('💡 下一步：');
    console.log('');
    console.log('1. 启动开发服务器：');
    console.log('   npm run dev');
    console.log('');
    console.log('2. 查看产品列表：');
    console.log('   访问 /products');
    console.log('');
    console.log('3. 管理产品：');
    console.log('   访问 /admin/products');
    console.log('');
    console.log('4. 查看产品详情：');
    productsData.products.forEach((p: any) => {
      console.log(`   /products/${p.id} - ${p.name}`);
    });
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ 上传失败：', error);
    process.exit(1);
  }
}

// 执行上传
uploadProductsToCos().catch((error) => {
  console.error('💥 发生错误：', error);
  process.exit(1);
});
