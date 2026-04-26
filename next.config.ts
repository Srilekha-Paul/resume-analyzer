import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "canvas", "utf-8-validate", "bufferutil"],
};

export default nextConfig;