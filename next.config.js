const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Skip type checking in build for faster deployment
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig