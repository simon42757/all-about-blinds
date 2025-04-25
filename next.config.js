/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable image optimization
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig;
