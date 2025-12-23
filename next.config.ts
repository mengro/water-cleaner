import type { NextConfig } from "next";
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // 开启独立打包模式
  reactCompiler: true,
  turbopack: {
    rules: {
      ...codeInspectorPlugin({ bundler: 'turbopack' }),
    },
  },
  images: {
    contentDispositionType: 'inline', // 即使是图片也设为预览
  },
  // 强制全局响应头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'inline', // 强制所有页面预览而非下载
          },
        ],
      },
    ];
  },
};

export default nextConfig;
