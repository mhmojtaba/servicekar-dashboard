/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: "export",
  basePath: "/servicekar",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
