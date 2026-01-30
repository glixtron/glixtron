/**
 * Brand Configuration - White Label Settings
 * Update these values to customize the application for different deployments
 */

export const BRAND_CONFIG = {
  // Application Identity
  appName: 'Glixtron',
  appFullName: 'Glixtron Career Intelligence',
  appTagline: 'AI-Powered Career Assessment Platform',
  
  // Company Information
  companyName: 'Glixtron Technologies',
  companyWebsite: 'https://glixtron.com',
  supportEmail: 'support@glixtron.com',
  
  // URLs and Domains
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  website: process.env.NEXT_PUBLIC_WEBSITE || 'https://glixtron.com',
  
  // Social Media
  socialLinks: {
    twitter: process.env.NEXT_PUBLIC_TWITTER || 'https://twitter.com/glixtron',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN || 'https://linkedin.com/company/glixtron',
    github: process.env.NEXT_PUBLIC_GITHUB || 'https://github.com/glixtron',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || 'https://facebook.com/glixtron'
  },
  
  // Brand Colors
  colors: {
    primary: '#3b82f6',      // Blue
    secondary: '#10b981',    // Green
    accent: '#f59e0b',       // Amber
    neutral: '#6b7280',      // Gray
    success: '#22c55e',      // Green
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    info: '#3b82f6'          // Blue
  },
  
  // Features
  features: {
    resumeAnalysis: true,
    jobDescriptionExtraction: true,
    careerGuidance: true,
    atsAnalysis: true,
    skillAssessment: true,
    roadmapGeneration: true,
    aiIntegration: true,
    bulkProcessing: true
  },
  
  // Limits and Quotas
  limits: {
    freeUsers: {
      resumeScans: 5,
      jobExtractions: 10,
      careerAssessments: 3
    },
    premiumUsers: {
      resumeScans: 100,
      jobExtractions: 500,
      careerAssessments: 50
    }
  },
  
  // API Configuration
  api: {
    version: 'v1',
    timeout: 30000,
    retryAttempts: 3
  },
  
  // Security
  security: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.pdf', '.docx', '.doc', '.txt', '.html', '.htm'],
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8
  },
  
  // Email Templates
  email: {
    fromName: 'Glixtron',
    fromEmail: 'noreply@glixtron.com',
    supportEmail: 'support@glixtron.com'
  },
  
  // Analytics and Tracking
  analytics: {
    enabled: false, // Set to true to enable analytics
    trackingId: '', // Add your tracking ID here
    domain: '' // Add your domain for analytics
  },
  
  // Customization
  customization: {
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    customCSS: false,
    customJS: false
  },
  
  // Legal
  legal: {
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    cookiePolicyUrl: '/cookies'
  },
  
  // Development
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    mockData: process.env.USE_MOCK_DATA === 'true'
  }
}

// Brand-specific configurations for different deployments
export const BRAND_VARIANTS = {
  default: {
    ...BRAND_CONFIG,
    appName: 'Glixtron',
    companyName: 'Glixtron Technologies'
  }
}

// Get the current brand configuration based on environment
export function getBrandConfig() {
  const brandVariant = process.env.BRAND_VARIANT || 'default'
  return BRAND_VARIANTS[brandVariant as keyof typeof BRAND_VARIANTS] || BRAND_CONFIG
}

// Export the current brand configuration
export const brandConfig = getBrandConfig()

// Helper functions for brand-specific operations
export const brandHelpers = {
  getFullAppName: () => brandConfig.appFullName,
  getSupportEmail: () => brandConfig.supportEmail,
  getCompanyWebsite: () => brandConfig.companyWebsite,
  getSocialLinks: () => brandConfig.socialLinks,
  getFeatureFlag: (feature: keyof typeof brandConfig.features) => brandConfig.features[feature],
  getLimit: (tier: 'freeUsers' | 'premiumUsers', limit: keyof typeof brandConfig.limits.freeUsers) => 
    brandConfig.limits[tier][limit as keyof typeof brandConfig.limits.freeUsers],
  isDevelopment: () => brandConfig.development.debugMode,
  getLegalUrl: (type: 'privacy' | 'terms' | 'cookies') => {
    const urls = {
      privacy: brandConfig.legal.privacyPolicyUrl,
      terms: brandConfig.legal.termsOfServiceUrl,
      cookies: brandConfig.legal.cookiePolicyUrl
    }
    return urls[type]
  }
}

// Brand validation
export const validateBrandConfig = () => {
  const errors: string[] = []
  
  if (!brandConfig.appName) {
    errors.push('App name is required')
  }
  
  if (!brandConfig.companyName) {
    errors.push('Company name is required')
  }
  
  if (!brandConfig.supportEmail) {
    errors.push('Support email is required')
  }
  
  if (!brandConfig.baseUrl) {
    errors.push('Base URL is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export default brand config
export default brandConfig
