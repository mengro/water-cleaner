/**
 * 初始化脚本：将本地 site-config.json 上传到 COS
 * 
 * 使用方法：
 * 1. 确保 .env 文件中配置了 COS 相关环境变量
 * 2. 运行：node scripts/init-site-config.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // 读取本地配置文件
    const configPath = path.join(__dirname, '../src/config/site-config.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    
    console.log('本地配置内容：', config);
    console.log('\n下一步操作：');
    console.log('1. 登录后台管理系统：http://localhost:3000/admin/settings');
    console.log('2. 填写网站配置信息并保存');
    console.log('3. 配置将自动上传到 COS，之后所有页面将从 COS 读取配置');
    console.log('\n注意：首次访问页面时，如果 COS 中没有配置文件，将使用默认配置');
  } catch (error) {
    console.error('错误：', error);
  }
}

main();
