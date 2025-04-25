/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure for Netlify
  output: 'export',
  distDir: 'out',
  // Disable image optimization
  images: {
    unoptimized: true
  },
  // Important for static site generation with dynamic routes
  trailingSlash: true
}

module.exports = nextConfig;
