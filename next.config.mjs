import { BASE_PATH } from "./src/config/deployment-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: "export",
  ...(BASE_PATH ? { basePath: BASE_PATH } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
