import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  assetPrefix: './', // Enable relative paths for static export compatibility
};

export default nextConfig;
