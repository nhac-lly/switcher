import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* ignore build errors */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
