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
  async redirects() {
    return [
      { source: '/qr-code-generator', destination: '/tools/design-tools/qr-generator', permanent: true },
      { source: '/qr-code-generator/', destination: '/tools/design-tools/qr-generator', permanent: true },
      { source: '/file-hash', destination: '/tools/security/file-hash', permanent: true },
      { source: '/file-hash-generator', destination: '/tools/security/file-hash', permanent: true },
      { source: '/base64-encoder', destination: '/tools/developer/base64-tools', permanent: true },
      { source: '/base64-tools', destination: '/tools/developer/base64-tools', permanent: true },
      { source: '/javascript-minifier', destination: '/tools/developer/javascript-minifier', permanent: true },
      { source: '/currency-converter', destination: '/tools/utilities/currency-converter', permanent: true },
      { source: '/image-tools/:path*', destination: '/tools/graphics/:path*', permanent: true },
      { source: '/design-tools/:path*', destination: '/tools/design-tools/:path*', permanent: true },
      { source: '/graphics/:path*', destination: '/tools/graphics/:path*', permanent: true },
      { source: '/cheatsheets/:path*', destination: '/tools/cheatsheets/:path*', permanent: true },
      // Force HTTPS + non-www
      { source: '/', destination: 'https://passzap.net/', permanent: true },
    ]
  }
}

module.exports = nextConfig