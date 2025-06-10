/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: "export",
  basePath: "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
