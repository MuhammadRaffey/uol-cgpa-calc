import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Only keep this entry if you have a custom-built
   * Prisma Client or you're on a version < 15.
   * For v15+ it's redundant but harmless.
   */
  serverExternalPackages: ["@prisma/client"],

  /** Configure Turbopack for better performance */
  turbopack: {
    // Configure external packages for server-side rendering
    resolveAlias: {
      // Ensure Prisma client is properly handled
      "@prisma/client": "@prisma/client",
    },
  },
};

export default nextConfig;
