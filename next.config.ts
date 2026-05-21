import { BASE_API_URL } from "@/shared/config/api";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      new URL(`${BASE_API_URL}/**`),
      {
        protocol: "https",
        hostname: "ec53eb4c-8b5e-47b2-a574-6374c54b38d0.selstorage.ru",
      },
    ],
  },
};

export default nextConfig;
