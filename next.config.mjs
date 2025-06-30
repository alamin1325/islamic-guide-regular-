/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages এর জন্য
  // output: 'export', // Static export disabled for server mode
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/islamic-guide-regular' : '',
}

export default nextConfig
