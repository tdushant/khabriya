import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['tv.khabriya.in','dashboard.khabriya.in'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;
