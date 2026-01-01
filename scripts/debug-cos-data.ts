/**
 * 调试：检查COS中实际存储的产品数据
 */

import { config } from 'dotenv';
config({ path: '/Users/limeng/makemoney/water-cleaner/.env' });

import COS from 'cos-nodejs-sdk-v5';

const {
  COS_SECRET_ID,
  COS_SECRET_KEY,
  COS_SETTING_BUCKET,
  COS_REGION,
} = process.env;

if (!COS_SECRET_ID || !COS_SECRET_KEY) {
  console.error('❌ 缺少COS凭证');
  process.exit(1);
}

const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

async function main() {
  console.log('🔍 正在读取COS setting bucket中的 products.json...\n');

  try {
    const data = await new Promise<any>((resolve, reject) => {
      cos.getObject({
        Bucket: COS_SETTING_BUCKET!,
        Region: COS_REGION!,
        Key: 'products.json',
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const content = data.Body.toString('utf-8');
    const productsData = JSON.parse(content);

    console.log(`✅ 成功读取 products.json`);
    console.log(`📦 产品数量: ${productsData.products.length}\n`);

    productsData.products.forEach((product: any, index: number) => {
      console.log(`\n产品 ${index + 1}: ${product.name}`);
      if (product.images && product.images.length > 0) {
        console.log(`  图片数量: ${product.images.length}`);
        console.log(`  第一张图片:`);
        console.log(`    ${product.images[0].substring(0, 100)}...`);

        // 检查URL类型
        if (product.images[0].includes('/products/')) {
          console.log(`  ✅ 类型: 新的永久URL (/products/目录)`);
        } else if (product.images[0].includes('/uploads/')) {
          console.log(`  ❌ 类型: 旧的临时URL (/uploads/目录)`);
        }
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('📋 第一个产品的完整数据：');
    console.log(JSON.stringify(productsData.products[0], null, 2));
  } catch (error) {
    console.error('❌ 读取失败:', error);
    process.exit(1);
  }
}

main();
