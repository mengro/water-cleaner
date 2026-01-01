# 图片访问问题解决方案

## 问题分析

当前图片URL包含临时签名，签名会过期（约1-2小时），导致图片无法访问。

示例URL：
```
https://water-cleaner-1362847923.cos.ap-shanghai.myqcloud.com/uploads/.../活性炭1.jpg?q-sign-time=1767276128;1767279728&...
```

`q-sign-time` 参数表明签名有效期到 `1767279728`（Unix时间戳），过期后图片将无法访问。

## 解决方案

### 方案1：设置COS桶为公开读（最简单）⭐

**步骤：**

1. 登录 [腾讯云COS控制台](https://console.cloud.tencent.com/cos5)
2. 找到桶：`water-cleaner-1362847923`
3. 点击桶名称进入详情页
4. 左侧菜单选择 **"权限管理"** → **"权限配置"**
5. 找到 **"公共访问"** 设置
6. 选择 **"公共读"**（私有写）
7. 点击保存

**重新生成数据：**

```bash
# 修改脚本，移除所有签名参数
# 编辑 src/data/init/product-mapping.ts
# 将 cleanImageUrl 函数改为移除所有查询参数：

export function cleanImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.search = ''; // 移除所有查询参数
    return urlObj.toString();
  } catch {
    return url;
  }
}

# 重新生成和上传
npm run generate:products
npm run upload:products
```

**优点：**
- ✅ 配置简单，一次设置永久有效
- ✅ 图片URL变短、更干净
- ✅ 无需担心签名过期

**缺点：**
- ⚠️ 任何人都可以访问图片
- ⚠️ 可能产生额外的流量费用

---

### 方案2：配置CDN加速（推荐生产环境）

**步骤：**

1. 在COS控制台，选择桶 `water-cleaner-1362847923`
2. 左侧菜单选择 **"域名管理"** → **"CDN加速"**
3. 开启CDN加速
4. 配置CDN域名（如：`cdn.water-cleaner.com`）
5. 等待CDN配置生效

**使用CDN域名：**

```typescript
// 在 product-mapping.ts 中修改
const CDN_DOMAIN = 'https://cdn.water-cleaner.com';

export function cleanImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return `${CDN_DOMAIN}${pathname}`; // 使用CDN域名
  } catch {
    return url;
  }
}
```

**优点：**
- ✅ 永久可访问
- ✅ 加速访问，提高加载速度
- ✅ 节省COS流量费用
- ✅ 可以配置HTTPS

**缺点：**
- ❌ 需要配置域名和CDN
- ❌ 需要等待CDN生效

---

### 方案3：重新上传图片到公开路径

**原理：**
将临时签名的图片下载后，重新上传到COS的公开路径。

**实施：**
这个方案较复杂，不建议使用。

---

## 推荐方案（根据场景）

### 开发/测试环境
→ **方案1**：设置桶为公开读

### 生产环境
→ **方案2**：配置CDN加速

## 快速测试

如果只是想快速测试，可以：

1. **设置桶为公开读**（方案1）
2. 重新生成数据：

```bash
# 临时修改脚本
npm run generate:products
npm run upload:products
```

3. 访问网站查看图片

---

## ✅ 已执行：方案3完整实现

### 已完成的工作

**执行时间：** 2026-01-01

**处理的产品：**
1. 活性炭滤料（3张图片）
2. 聚丙烯酰胺（PAM）（3张图片）
3. 聚合氯化铝（PAC）（5张图片）

**执行的步骤：**
1. ✅ 从临时签名URL下载了11张图片
2. ✅ 重新上传到COS `/products/` 目录，获得永久URL
3. ✅ 生成产品数据（包含新的永久URL）
4. ✅ 保存到COS setting bucket: `products.json`

**新的图片URL格式：**
```
旧格式（临时）:
https://water-cleaner-1362847923.cos.ap-shanghai.myqcloud.com/uploads/.../活性炭1.jpg?q-sign-time=1767276128;1767279728&...

新格式（永久）:
https://water-cleaner-1362847923.cos.ap-shanghai.myqcloud.com/products/活性炭滤料_1.jpg
```

**特点：**
- ✅ 无签名参数，永久可访问
- ✅ 简洁的URL结构
- ✅ 已组织在 `/products/` 目录下

---

## 如果图片仍显示旧URL

### 解决步骤：

1. **重启开发服务器**
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 重新启动
   npm run dev
   ```

2. **清除浏览器缓存**
   - Chrome/Edge: `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)
   - 或者打开开发者工具 → Application → Clear storage

3. **验证COS数据**
   ```bash
   npm run init:products:full
   ```
   查看输出，确认数据已保存成功

4. **检查图片是否可直接访问**
   - 打开浏览器，访问新的图片URL
   - 例如：`https://water-cleaner-1362847923.cos.ap-shanghai.myqcloud.com/products/活性炭滤料_1.jpg`
   - 如果能直接访问，说明图片上传成功

---

## 下一步优化建议

### 可选：设置COS桶为公开读

当前图片通过COS SDK访问，建议设置桶为公开读以提高访问速度：

1. 登录 [腾讯云COS控制台](https://console.cloud.tencent.com/cos5)
2. 找到桶：`water-cleaner-1362847923`
3. **权限管理** → **权限配置**
4. 设置为 **"公共读"**（私有写）
5. 保存

**好处：**
- 图片加载更快（无需通过服务器）
- 减少服务器负载
- 直接CDN加速

---

## 附加产品

**未匹配的产品：** 硫酸铝（1张图片未匹配）

如需添加，可在 `src/data/init/product-mapping.ts` 中添加对应的映射配置。
