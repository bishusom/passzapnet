const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Skip type checking in build for faster deployment
  typescript: {
    ignoreBuildErrors: false,
  },
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig