/**
 * White Label Utilities
 * Helper functions for white-labeling and brand customization
 */

import { brandConfig } from './brand-config'

/**
 * Get brand-specific text content
 */
export function getBrandText(key: string, fallback?: string): string {
  const texts: Record<string, string> = {
    appName: brandConfig.appName,
    companyName: brandConfig.companyName,
    supportEmail: brandConfig.supportEmail,
    website: brandConfig.website,
    appFullName: brandConfig.appFullName,
    appTagline: brandConfig.appTagline,
    companyWebsite: brandConfig.companyWebsite,
    
    // Common phrases
    'powered_by': `Powered by ${brandConfig.appName}`,
    'support_team': `${brandConfig.companyName} Support Team`,
    'contact_support': `Contact ${brandConfig.supportEmail}`,
    'visit_website': `Visit ${brandConfig.website}`,
    
    // Legal
    'privacy_policy': 'Privacy Policy',
    'terms_of_service': 'Terms of Service',
    'cookie_policy': 'Cookie Policy',
    
    // Support
    'get_help': 'Get Help',
    'contact_us': 'Contact Us',
    'support_24_7': '24/7 Support',
    'email_support': 'Email Support',
    'phone_support': 'Phone Support'
  }
  
  return texts[key] || fallback || key
}

/**
 * Get brand-specific URLs
 */
export function getBrandUrl(type: 'support' | 'website' | 'privacy' | 'terms' | 'cookies'): string {
  const urls: Record<string, string> = {
    support: `mailto:${brandConfig.supportEmail}`,
    website: brandConfig.website,
    privacy: brandConfig.legal.privacyPolicyUrl,
    terms: brandConfig.legal.termsOfServiceUrl,
    cookies: brandConfig.legal.cookiePolicyUrl
  }
  
  return urls[type] || '#'
}

/**
 * Get brand-specific social media links
 */
export function getBrandSocialLinks() {
  return brandConfig.socialLinks
}

/**
 * Get brand-specific colors
 */
export function getBrandColors() {
  return brandConfig.colors
}

/**
 * Get brand-specific feature flags
 */
export function getBrandFeatures() {
  return brandConfig.features
}

/**
 * Get brand-specific limits
 */
export function getBrandLimits() {
  return brandConfig.limits
}

/**
 * Generate brand-specific email content
 */
export function generateBrandEmail(template: 'welcome' | 'support' | 'reset', data?: any): { subject: string; body: string } {
  const templates = {
    welcome: {
      subject: `Welcome to ${brandConfig.appName}!`,
      body: `Thank you for signing up for ${brandConfig.appName}. We're excited to help you with your career journey!`
    },
    support: {
      subject: `${brandConfig.appName} Support`,
      body: `Thank you for contacting ${brandConfig.appName} support. We'll get back to you as soon as possible.`
    },
    reset: {
      subject: `Reset your ${brandConfig.appName} password`,
      body: `You requested to reset your password for ${brandConfig.appName}. Click the link below to continue.`
    }
  }
  
  const template_data = templates[template]
  
  let email_body = template_data.body
  
  if (data) {
    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
      email_body = email_body.replace(new RegExp(`{{${key}}}`, 'g'), data[key])
    })
  }
  
  return {
    subject: template_data.subject,
    body: email_body
  }
}

/**
 * Get brand-specific meta tags
 */
export function getBrandMetaTags() {
  return {
    title: `${brandConfig.appName} - ${brandConfig.tagline}`,
    description: brandConfig.description,
    keywords: ['career', 'assessment', 'guidance', 'ai', 'resume', 'job', 'development'],
    author: brandConfig.companyName,
    publisher: brandConfig.companyName,
    url: brandConfig.website,
    site_name: brandConfig.appName,
    locale: 'en_US',
    type: 'website',
    robots: 'index,follow'
  }
}

/**
 * Get brand-specific structured data
 */
export function getBrandStructuredData() {
  return {
    application: {
      name: brandConfig.appName,
      fullName: brandConfig.appFullName,
      description: brandConfig.description,
      tagline: brandConfig.tagline,
      url: brandConfig.website
    },
    organization: {
      name: brandConfig.companyName,
      email: brandConfig.supportEmail,
      website: brandConfig.website,
      logo: '/logo.svg'
    },
    contact: {
      email: brandConfig.supportEmail,
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
      supportHours: '24/7'
    },
    social: brandConfig.socialLinks,
    legal: {
      privacyPolicy: brandConfig.legal.privacyPolicyUrl,
      termsOfService: brandConfig.legal.termsOfServiceUrl,
      cookiePolicy: brandConfig.legal.cookiePolicyUrl
    }
  }
}

/**
 * Validate brand configuration
 */
export function validateBrandConfig() {
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
  
  if (!brandConfig.website) {
    errors.push('Website URL is required')
  }
  
  // Validate email format
  const emailRegex = /^[^\s*[^@\s]+@[^@\s]+\.[^@\s]+\s*$/
  if (!emailRegex.test(brandConfig.supportEmail)) {
    errors.push('Support email format is invalid')
  }
  
  // Validate URL format
  try {
    new URL(brandConfig.website)
  } catch {
    errors.push('Website URL format is invalid')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get brand-specific CSS variables
 */
export function getBrandCSSVariables() {
  const colors = brandConfig.colors
  
  return {
    '--brand-primary': colors.primary,
    '--brand-secondary': colors.secondary,
    '--brand-accent': colors.accent,
    '--brand-primary-rgb': hexToRgb(colors.primary),
    '--brand-secondary-rgb': hexToRgb(colors.secondary),
    '--brand-accent-rgb': hexToRgb(colors.accent)
  }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0'
}

/**
 * Get brand-specific logo URL
 */
export function getBrandLogoUrl(size: 'small' | 'medium' | 'large' = 'medium'): string {
  const sizes = {
    small: '/logo-small.svg',
    medium: '/logo.svg',
    large: '/logo-large.svg'
  }
  return sizes[size] || sizes.medium
}

/**
 * Get brand-specific favicon URL
 */
export function getBrandFaviconUrl(): string {
  return '/favicon.ico'
}

/**
 * Get brand-specific manifest data
 */
export function getBrandManifest() {
  return {
    name: brandConfig.appName,
    short_name: brandConfig.appName,
    description: brandConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: brandConfig.colors.primary,
    theme_color: brandConfig.colors.primary,
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon'
      },
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  }
}

/**
 * Get brand-specific Open Graph data
 */
export function getBrandOpenGraph() {
  return {
    title: `${brandConfig.appName} - ${brandConfig.tagline}`,
    description: brandConfig.description,
    url: brandConfig.website,
    site_name: brandConfig.appName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: brandConfig.appName
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
}

/**
 * Get brand-specific Twitter Card data
 */
export function getBrandTwitterCard() {
  return {
    card: 'summary_large_image',
    title: brandConfig.appName,
    description: brandConfig.description,
    images: ['/twitter-image.jpg'],
    creator: brandConfig.companyName
  }
}

/**
 * Get brand-specific schema.org data
 */
export function getBrandSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: brandConfig.appName,
    description: brandConfig.description,
    url: brandConfig.website,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@type': 'Organization',
      name: brandConfig.companyName,
      url: brandConfig.website,
      logo: {
        '@type': 'ImageObject',
        url: '/logo.svg'
      }
    },
    author: {
      '@type': 'Organization',
      name: brandConfig.companyName,
      url: brandConfig.website
    }
  }
}

/**
 * Get brand-specific JSON-LD
 */
export function getBrandJsonLd() {
  return JSON.stringify(getBrandSchema(), null, 2)
}

/**
 * Get brand-specific analytics configuration
 */
export function getBrandAnalytics() {
  return {
    enabled: brandConfig.analytics.enabled,
    trackingId: brandConfig.analytics.trackingId,
    domain: brandConfig.analytics.domain,
    customDimensions: {
      brand: brandConfig.appName,
      variant: process.env.BRAND_VARIANT || 'default'
    }
  }
}

/**
 * Get brand-specific configuration for API responses
 */
export function getBrandApiResponse(data: any) {
  return {
    ...data,
    brand: {
      name: brandConfig.appName,
      company: brandConfig.companyName,
      supportEmail: brandConfig.supportEmail,
      website: brandConfig.website,
      version: '1.0.0'
    }
  }
}

/**
 * Get brand-specific error messages
 */
export function getBrandErrorMessage(errorType: string, customMessage?: string): string {
  const messages: Record<string, string> = {
    'not_found': `The requested resource was not found on ${brandConfig.appName}.`,
    'unauthorized': `You are not authorized to access this resource on ${brandConfig.appName}.`,
    'forbidden': `Access to this resource on ${brandConfig.appName} is forbidden.`,
    'server_error': `An error occurred on ${brandConfig.appName}. Please try again later.`,
    'validation_error': `Please check your input and try again on ${brandConfig.appName}.`,
    'rate_limit': `You have exceeded the rate limit for ${brandConfig.appName}. Please try again later.`
  }
  
  return customMessage || messages[errorType] || `An error occurred on ${brandConfig.appName}.`
}

/**
 * Get brand-specific success messages
 */
export function getBrandSuccessMessage(action: string, customMessage?: string): string {
  const messages: Record<string, string> = {
    'login': `Welcome back to ${brandConfig.appName}!`,
    'register': `Welcome to ${brandConfig.appName}! Your account has been created successfully.`,
    'logout': `You have been logged out of ${brandConfig.appName}.`,
    'profile_updated': `Your profile has been updated successfully on ${brandConfig.appName}.`,
    'password_reset': `Your password has been reset successfully for ${brandConfig.appName}.`,
    'email_verified': `Your email has been verified successfully on ${brandConfig.appName}.`
  }
  
  return customMessage || messages[action] || `Action completed successfully on ${brandConfig.appName}.`
}

/**
 * Get brand-specific loading messages
 */
export function getBrandLoadingMessage(action: string): string {
  const messages: Record<string, string> = {
    'analyzing': `Analyzing your resume on ${brandConfig.appName}...`,
    'processing': `Processing your request on ${brandConfig.appName}...`,
    'loading': `Loading ${brandConfig.appName}...`,
    'saving': `Saving your data on ${brandConfig.appName}...`,
    'uploading': `Uploading your file to ${brandConfig.appName}...`,
    'generating': `Generating your career roadmap on ${brandConfig.appName}...`
  }
  
  return messages[action] || `Loading ${brandConfig.appName}...`
}

export default {
  getBrandText,
  getBrandUrl,
  getBrandSocialLinks,
  getBrandColors,
  getBrandFeatures,
  getBrandLimits,
  generateBrandEmail,
  getBrandMetaTags,
  getBrandStructuredData,
  validateBrandConfig,
  getBrandCSSVariables,
  getBrandLogoUrl,
  getBrandFaviconUrl,
  getBrandManifest,
  getBrandOpenGraph,
  getBrandTwitterCard,
  getBrandSchema,
  getBrandJsonLd,
  getBrandAnalytics,
  getBrandApiResponse,
  getBrandErrorMessage,
  getBrandSuccessMessage,
  getBrandLoadingMessage
}
