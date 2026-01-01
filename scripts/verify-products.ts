/**
 * 验证COS中的产品数据
 */

import { config } from 'dotenv';
config();

import { readConfigJson } from '../src/lib/cos';

async function main() {
  console.log('🔍 验证COS中的产品数据...\n');

  try {
    const data = await readConfigJson<{ products: any[] }>('products.json');

    console.log(`✅ 成功读取产品数据`);
    console.log(`📦 产品数量: ${data.products.length}\n`);

    data.products.forEach((product, index) => {
      console.log(`产品 ${index + 1}: ${product.name}`);
      console.log(`  分类: ${product.categoryIds?.join(', ') || product.categoryId || '-'}`);
      console.log(`  图片数量: ${product.images?.length || 0}`);
      if (product.images && product.images.length > 0) {
        console.log(`  第一张图片URL:`);
        console.log(`    ${product.images[0]}`);

        // 检查是否包含签名参数
        const hasSignature = product.images[0].includes('q-sign-time');
        console.log(`  是否包含签名: ${hasSignature ? '❌ 是（临时签名）' : '✅ 否（永久URL）'}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ 读取失败:', error);
  }
}

main().catch((error) => {
  console.error('💥 执行失败:', error);
  process.exit(1);
});
