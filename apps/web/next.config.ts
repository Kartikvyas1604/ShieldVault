import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shieldvault/ui", "@shieldvault/db"],
};

export default nextConfig;
