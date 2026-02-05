import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // assetPrefix: './', // Often causes issues with client-side routing. Use basePath if deploying to subdirectory.
};

export default nextConfig;
