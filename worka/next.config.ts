import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  generateBuildId: async () => "build-ignore-errors",
  productionBrowserSourceMaps: false,
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://js.hs-scripts.com
                https://*.googletagmanager.com
                https://*.google-analytics.com
                https://js.hscollectedforms.net
                https://js.usemessages.com
                https://js.hsadspixel.net
                https://js.hs-banner.com
                https://js.hs-analytics.net;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' http://localhost:5000 https://api.talentiave.com https://*.hubspot.com https://*.google-analytics.com;
              img-src 'self' data: https://talentia-images.s3.us-east-2.amazonaws.com https://*.hubspot.com;
              frame-src 'self' https://*.hubspot.com;
            `.replace(/\s{2,}/g, ' '), // Minimize spaces in CSP
          },
        ],
      },
    ];
  },
};

export default nextConfig;
