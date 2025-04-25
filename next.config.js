/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  reactStrictMode: true,
  swcMinify: true,
  // Disable image optimization to make static export work
  images: {
    unoptimized: true
  },
  // Add basePath for GitHub Pages deployment
  // Change this to your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/UI' : '',
  // Set asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/UI/' : ''
}

module.exports = nextConfig;
