# 产品数据初始化指南

## 📋 概述

本项目提供了一套完整的产品数据初始化方案，可以从图片URL批量创建产品。

## 🗂️ 文件结构

```
src/data/init/
├── imgList.json          # 产品图片URL列表
├── product-mapping.ts    # 产品信息映射配置
└── README.md            # 本说明文档

scripts/
└── init-products.ts     # 初始化脚本
```

## 🚀 使用方法

### 一键初始化

```bash
npm run init:products
```

脚本会自动：
1. ✅ 读取 `imgList.json` 中的图片URL
2. ✅ 从URL中提取产品名称（自动解码）
3. ✅ 根据产品名称匹配预设的产品信息
4. ✅ 批量创建产品到 COS
5. ✅ 输出初始化结果

## 📝 添加新产品

### 步骤1：添加图片URL

编辑 `src/data/init/imgList.json`，添加新的图片URL：

```json
[
  "https://your-bucket.cos.xxx.com/path/新产品图片1.jpg",
  "https://your-bucket.cos.xxx.com/path/新产品图片2.jpg"
]
```

**注意事项：**
- 文件名必须包含产品名称关键词
- 文件名会自动 URL 解码
- 一个产品可以有多张图片

### 步骤2：配置产品信息

编辑 `src/data/init/product-mapping.ts`，添加产品映射：

```typescript
{
  keywords: ["关键词1", "关键词2"],  // 从文件名匹配
  name: "产品正式名称",
  categoryIds: ["agents"],           // 所属分类ID
  description: "简短描述（列表页显示）",
  content: `## 详细介绍
  支持Markdown格式`
}
```

**分类ID对照表：**

| ID | 名称 | 说明 |
|----|------|------|
| `agents` | 净水药剂 | 絮凝剂、助凝剂等 |
| `filter-media` | 滤料系列 | 活性炭、石英砂等 |
| `fillers` | 填料系列 | 各种环保填料 |
| `bio-culture` | 生物菌种 | 微生物菌种 |
| `integrated-equipment` | 一体化污水处理 | 成套处理设备 |

### 步骤3：重新运行初始化

```bash
npm run init:products
```

## 🎯 产品信息模板

```typescript
{
  keywords: ["产品关键词"],
  name: "产品名称",
  categoryIds: ["分类ID"],
  description: "一句话描述产品特点",
  content: `## 产品介绍

产品详细介绍...

## 产品特点

- 特点1
- 特点2

## 技术参数

- 参数1：数值
- 参数2：数值

## 应用领域

- 应用场景1
- 应用场景2

## 包装规格

包装信息...`
}
```

## 📊 已配置产品

当前已配置的产品：

| 产品名称 | 分类 | 图片数量 |
|---------|------|---------|
| 活性炭滤料 | 滤料系列 | 3 |
| 聚丙烯酰胺（PAM） | 净水药剂 | 3 |
| 聚合氯化铝（PAC） | 净水药剂 | 4 |
| 硫酸铝 | 净水药剂 | 1 |

## ⚙️ 脚本工作原理

### 1. 图片URL解析

```typescript
// 原始URL
"https://xxx.com/初始化产品图片/活性炭1.jpg?params=..."

// 提取并解码
filename = "活性炭"

// 匹配关键词
keywords.includes("活性炭") ✅
```

### 2. 产品创建

```typescript
await createProduct({
  name: "活性炭滤料",
  categoryIds: ["filter-media"],
  description: "优质活性炭滤料...",
  content: "## 产品介绍...",
  images: [
    "https://xxx.com/活性炭1.jpg",
    "https://xxx.com/活性炭2.jpg",
    "https://xxx.com/活性炭3.jpg"
  ]
})
```

### 3. 数据存储

产品数据保存到 COS `products.json`：
```json
{
  "products": [
    {
      "id": "xxx",
      "name": "活性炭滤料",
      "categoryIds": ["filter-media"],
      "description": "...",
      "content": "...",
      "images": [...],
      "isPublished": true,
      ...
    }
  ]
}
```

## 🔧 初始化后管理

初始化完成后，可以通过后台管理：

### 1. 查看产品
访问：`/admin/products`

### 2. 编辑产品
- 点击产品右侧的"编辑"按钮
- 可以修改任何字段（名称、分类、描述、图片等）
- 支持重新排序

### 3. 删除产品
- 点击产品右侧的"删除"按钮
- 确认后永久删除

### 4. 发布/下架
- 切换"已发布/草稿"状态
- 只有已发布的产品会在前台显示

## 🎨 前台展示

初始化的产品会自动展示在：

- **首页** (`/`) - 推荐产品区块
- **产品列表页** (`/products`) - 按分类展示
- **产品详情页** (`/products/[id]`) - 完整产品信息

## 💡 最佳实践

### 1. 图片命名规范

✅ **推荐：**
```
活性炭1.jpg
活性炭2.jpg
聚丙烯酰胺.jpg
聚合氯化铝PAC-白色.jpg
```

❌ **避免：**
```
IMG_001.jpg
photo (1).jpg
未命名图片.jpg
```

### 2. 产品信息完整性

- ✅ 至少填写 `name`、`categoryIds`、`description`
- ✅ `content` 使用 Markdown 格式
- ✅ 包含技术参数、应用领域等关键信息

### 3. 图片URL处理

脚本会自动：
- ✅ URL 解码（中文文件名）
- ✅ 移除临时签名参数
- ✅ 保留永久访问链接

## 🐛 常见问题

### Q1: 图片无法识别？

**检查：**
1. 文件名是否包含产品关键词
2. 关键词是否在 `product-mapping.ts` 中配置
3. URL 是否正确编码

### Q2: 产品重复创建？

**原因：** 每次运行都会创建新产品（ID不同）

**解决：**
- 在后台删除重复产品
- 或修改脚本添加重复检测

### Q3: 分类显示不正确？

**检查：**
1. `categoryIds` 是否正确
2. 分类是否在 `categories.json` 中存在

### Q4: 图片URL失效？

**原因：** 临时签名过期

**解决：**
- 脚本已自动清理签名参数
- 使用永久访问链接

## 🔄 重新初始化

如果需要重新初始化：

```bash
# 1. 清空现有产品（可选）
# 访问 /admin/products 手动删除

# 2. 更新 imgList.json
# 编辑文件，添加/修改URL

# 3. 重新运行
npm run init:products
```

## 📞 技术支持

如有问题，请检查：
1. 控制台输出的错误信息
2. `products.json` 文件格式
3. COS 连接状态

---

**最后更新：** 2026-01-01
**版本：** 1.0.0
