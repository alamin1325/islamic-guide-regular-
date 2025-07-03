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
  // Vercel deployment এর জন্য
  trailingSlash: false,
  // basePath: process.env.NODE_ENV === 'production' ? '/islamic-guide-regular' : '',
}

export default nextConfig
