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
};

export default nextConfig;
