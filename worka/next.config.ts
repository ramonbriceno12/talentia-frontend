import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true,   // Disable TypeScript build errors
  },
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
