import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Only keep this entry if you have a custom-built
   * Prisma Client or you’re on a version < 15.
   * For v15+ it’s redundant but harmless.
   */
  serverExternalPackages: ["@prisma/client"],

  /** Optional: exclude Prisma only when bundling the server */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
