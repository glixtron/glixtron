/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Suppress warnings in production
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Enable TypeScript and ESLint for code quality
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
    dirs: ['app', 'components', 'lib', 'pages'], // Specify directories to lint
  },
  
  // Suppress console warnings in production
  webpack: (config, { dev, isServer }) => {
    // Fix module resolution for deployment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Ensure TypeScript path resolution works
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    
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
        module: /supabase/,
        message: /Node.js 18 and below are deprecated/,
      },
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
