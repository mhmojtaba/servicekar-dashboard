/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: "export",
  basePath: "/dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
