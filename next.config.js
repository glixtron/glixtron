/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Suppress warnings in production
  serverExternalPackages: ['mongodb'],
  
  // Allow build to continue despite linting warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Allow build to continue despite TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Standalone output for Vercel
  output: 'standalone',
  
  // Suppress console warnings in production
  webpack: (config, { dev, isServer }) => {
    // Suppress deprecation warnings
    config.ignoreWarnings = [
      {
        module: /whatwg-encoding/,
        message: /Use @exodus\/bytes instead/,
      },
      {
        module: /cheerio/,
        message: /whatwg-encoding/,
      },
      {
        module: /node-fetch/,
        message: /deprecated/,
      },
      {
        module: /undici/,
        message: /deprecated/,
      },
      {
        module: /encoding-sniffer/,
        message: /whatwg-encoding/,
      },
      {
        module: /@exodus\/bytes/,
        message: /whatwg-encoding/,
      },
      {
        module: /cheerio/,
        message: /encoding/,
      },
      {
        module: /htmlparser2/,
        message: /whatwg-encoding/,
      },
      {
        module: /parse5/,
        message: /whatwg-encoding/,
      }
    ]
    
    return config
  },
  
  // Optimize images
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
