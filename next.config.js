/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Suppress warnings in production
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Suppress console warnings in production
  webpack: (config, { dev, isServer }) => {
    // Suppress deprecation warnings
    config.ignoreWarnings = [
      {
        module: /whatwg-encoding/,
        message: /Use @exodus\/bytes instead/,
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
