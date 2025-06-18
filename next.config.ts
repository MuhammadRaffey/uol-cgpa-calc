import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), "@prisma/client"];
    return config;
  },
};

export default nextConfig;
