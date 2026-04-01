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
      // ========== CANONICAL DOMAIN: redirect www to non-www ==========
      // All requests to www.passzap.net/* → https://passzap.net/*
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.passzap.net',
          },
        ],
        destination: 'https://passzap.net/:path*',
        permanent: true, // 308 redirect (permanent)
      },
      // Note: Vercel automatically redirects HTTP → HTTPS at the platform level,
      // so no explicit HTTP rules are needed here.

      // ========== EXISTING PATH REDIRECTS (keep as is) ==========
      { source: '/qr-code-generator', destination: '/tools/design-tools/qr-generator', permanent: true },
      { source: '/qr-code-generator/', destination: '/tools/design-tools/qr-generator', permanent: true },
      { source: '/qr-generator', destination: '/tools/design-tools/qr-generator', permanent: true },
      { source: '/file-hash', destination: '/tools/security/file-hash', permanent: true },
      { source: '/file-hash-generator', destination: '/tools/security/file-hash', permanent: true },
      { source: '/base64-encoder', destination: '/tools/developer/base64-tools', permanent: true },
      { source: '/base64-tools', destination: '/tools/developer/base64-tools', permanent: true },
      { source: '/javascript-minifier', destination: '/tools/developer/javascript-minifier', permanent: true },
      { source: '/javascript-minifier', destination: '/tools/developer/javascript-minifier', permanent: true },
      { source: '/json-formatter', destination: '/tools/developer/json-formatter', permanent: true },
      { source: '/color-picker', destination: '/tools/design-tools/color-picker', permanent: true },
      { source: '/calculator', destination: '/tools/utilities/calculator', permanent: true },
      { source: '/currency-converter', destination: '/tools/utilities/currency-converter', permanent: true },
      { source: '/stopwatch-timer', destination: '/tools/date-time-tools/stopwatch-timer', permanent: true },
      { source: '/css-minifier', destination: '/tools/developer/css-minifier', permanent: true },
      { source: '/image-tools/:path*', destination: '/tools/graphics/:path*', permanent: true },
      { source: '/design-tools/:path*', destination: '/tools/design-tools/:path*', permanent: true },
      { source: '/graphics/:path*', destination: '/tools/graphics/:path*', permanent: true },
      { source: '/cheatsheets/:path*', destination: '/tools/cheatsheets/:path*', permanent: true },
    ]
  }
}

module.exports = nextConfig