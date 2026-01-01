/**
 * 产品数据初始化脚本
 *
 * 使用方法：
 * npm run init:products
 *
 * 功能：
 * 1. 读取产品图片URL列表
 * 2. 根据文件名匹配产品信息
 * 3. 批量创建产品到 COS
 */

import { config } from 'dotenv';
// 加载环境变量
config();

import { createProduct } from '../src/lib/products';
import imageList from '../src/data/init/imgList.json';
import { matchProductByUrl, cleanImageUrl } from '../src/data/init/product-mapping';

interface ProductGroup {
  mapping: ReturnType<typeof matchProductByUrl>;
  images: string[];
}

async function main() {
  console.log('🚀 开始初始化产品数据...\n');

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
        mapping,
        images: [],
      });
    }

    productGroups.get(productName)!.images.push(cleanUrl);
  }

  console.log(`📦 识别到 ${productGroups.size} 个产品\n`);

  // 2. 批量创建产品
  let successCount = 0;
  let skipCount = 0;

  for (const [productName, { mapping, images }] of productGroups.entries()) {
    try {
      console.log(`\n处理产品: ${productName}`);
      console.log(`  - 分类: ${mapping.categoryIds.join(', ')}`);
      console.log(`  - 图片: ${images.length} 张`);

      // 检查产品是否已存在（根据名称）
      // 注意：这里需要调用 getAllProducts，但为了避免循环依赖，我们直接创建
      // 如果产品已存在，createProduct 会正常创建新的（因为ID不同）
      // 后期可以通过管理后台删除重复的产品

      const product = await createProduct({
        name: mapping.name,
        categoryIds: mapping.categoryIds,
        description: mapping.description,
        content: mapping.content,
        images: images,
      });

      console.log(`  ✅ 创建成功: ${product.id}`);
      successCount++;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('已存在') || error.message.includes('duplicate')) {
          console.log(`  ⏭️  跳过（已存在）`);
          skipCount++;
        } else {
          console.error(`  ❌ 创建失败: ${error.message}`);
        }
      } else {
        console.error(`  ❌ 创建失败: 未知错误`);
      }
    }
  }

  // 3. 输出结果
  console.log('\n' + '='.repeat(50));
  console.log('✨ 初始化完成！');
  console.log(`  ✅ 成功: ${successCount} 个`);
  console.log(`  ⏭️  跳过: ${skipCount} 个`);
  console.log(`  📊 总计: ${productGroups.size} 个产品`);
  console.log('='.repeat(50));

  console.log('\n💡 提示：');
  console.log('  1. 访问 /admin/products 查看所有产品');
  console.log('  2. 访问 /products 查看前台展示');
  console.log('  3. 可在后台编辑产品信息、调整分类等');
  console.log('');
}

// 执行初始化
main().catch((error) => {
  console.error('💥 初始化失败:', error);
  process.exit(1);
});
