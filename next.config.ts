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
  images: {
    remotePatterns: [new URL("https://http.cat/*")],
  },
};

export default nextConfig;
