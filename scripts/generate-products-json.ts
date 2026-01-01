/**
 * 生成产品数据JSON文件
 *
 * 使用方法：
 * npm run generate:products
 *
 * 生成的文件将保存在 scripts/output/products.json
 * 然后你可以通过管理后台手动上传，或直接上传到COS
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import imageList from '../src/data/init/imgList.json';
import { matchProductByUrl, cleanImageUrl } from '../src/data/init/product-mapping';
import { createId } from '@paralleldrive/cuid2';

interface ProductGroup {
  name: string;
  categoryIds: string[];
  description: string;
  content: string;
  images: string[];
}

async function main() {
  console.log('🚀 开始生成产品数据JSON...\n');

  // 1. 按产品分组图片
  const productGroups = new Map<string, ProductGroup>();

  for (const url of imageList) {
    const mapping = matchProductByUrl(url);

    if (!mapping) {
      console.warn(`⚠️  无法匹配产品: ${url}`);
      continue;
    }

    const productName = mapping.name;
    const cleanUrl = cleanImageUrl(url);

    if (!productGroups.has(productName)) {
      productGroups.set(productName, {
        name: mapping.name,
        categoryIds: mapping.categoryIds,
        description: mapping.description,
        content: mapping.content,
        images: [],
      });
    }

    productGroups.get(productName)!.images.push(cleanUrl);
  }

  console.log(`📦 识别到 ${productGroups.size} 个产品\n`);

  // 2. 生成产品数组
  const now = new Date().toISOString();
  const products = Array.from(productGroups.values()).map((product) => ({
    id: createId(),
    name: product.name,
    categoryIds: product.categoryIds,
    description: product.description,
    content: product.content,
    images: product.images,
    isPublished: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  }));

  // 3. 创建输出目录
  const outputDir = join(process.cwd(), 'scripts', 'output');
  mkdirSync(outputDir, { recursive: true });

  // 4. 生成JSON文件
  const outputFile = join(outputDir, 'products.json');
  const outputData = { products };

  writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf-8');

  // 5. 输出结果
  console.log('✨ 产品数据生成完成！\n');
  console.log(`📄 文件位置: ${outputFile}`);
  console.log(`📊 产品数量: ${products.length}\n`);

  console.log('产品列表:');
  products.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name}`);
    console.log(`     - 分类: ${product.categoryIds.join(', ')}`);
    console.log(`     - 图片: ${product.images.length} 张`);
    console.log(`     - ID: ${product.id}`);
    console.log('');
  });

  console.log('='.repeat(60));
  console.log('💡 下一步操作：');
  console.log('');
  console.log('方法1 - 通过COS控制台上传：');
  console.log('  1. 登录腾讯云COS控制台');
  console.log(`  2. 找到桶：${process.env.COS_SETTING_BUCKET}`);
  console.log('  3. 上传文件到：products.json');
  console.log('  4. 覆盖现有文件（如果有）');
  console.log('');
  console.log('方法2 - 使用COSCLI工具：');
  console.log('  coscmd upload scripts/output/products.json /products.json');
  console.log('');
  console.log('方法3 - 启动开发服务器后通过管理后台添加：');
  console.log('  npm run dev');
  console.log('  访问 /admin/products 手动添加产品');
  console.log('='.repeat(60));
}

// 执行
main().catch((error) => {
  console.error('💥 生成失败:', error);
  process.exit(1);
});
