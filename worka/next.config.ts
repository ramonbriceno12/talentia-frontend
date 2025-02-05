import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true,   // Disable TypeScript build errors
  },
  output: "standalone", // Avoid static export issues
  generateBuildId: async () => "build-ignore-errors", // Forces new build ID
  productionBrowserSourceMaps: false, // Prevents source map errors in production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'talentia-images.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
