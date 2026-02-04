// next.config.js
import path from "path";
import dotenv from "dotenv";

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'export',
  assetPrefix: './',
};

// 只使用 module.exports（因为是 .js 文件）
module.exports = nextConfig;