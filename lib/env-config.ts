/**
 * Environment Configuration
 * Dynamic server URLs with fallback support
 */

export const ENV_CONFIG = {
  // Server URLs - will be dynamically determined
  get SERVER_URL(): string {
    if (typeof window !== 'undefined') {
      // Client-side - use current origin
      return window.location.origin
    }
    
    // Server-side - use environment or fallback
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }

    return 'https://glixtron.vercel.app'
  },

  get API_BASE(): string {
    return `${this.SERVER_URL}/api`
  },

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Server Configuration
  get IS_PRODUCTION(): boolean {
    return process.env.NODE_ENV === 'production'
  },

  get IS_DEVELOPMENT(): boolean {
    return process.env.NODE_ENV === 'development'
  },

  get IS_VERCEL(): boolean {
    return !!process.env.VERCEL || !!process.env.VERCEL_URL
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      SIGNIN: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
      REGISTER: '/api/auth/register',
      VERIFY_EMAIL: '/api/auth/verify-email',
      SESSION: '/api/auth/session'
    },
    USER: {
      PROFILE: '/api/user/profile',
      ASSESSMENT: '/api/user/assessment',
      RESUME_SCANS: '/api/user/resume-scans',
      RESUME_TEXT: '/api/user/resume-text',
      DATA: '/api/user/data'
    },
    ADMIN: {
      USERS: '/api/admin/users'
    },
    TOOLS: {
      JD_EXTRACTOR: '/api/jd/extract',
      RESUME_ANALYZER: '/api/resume/analyze'
    },
    HEALTH: '/api/health',
    TEST: {
      AUTH_STATUS: '/api/test/auth-status',
      USERS: '/api/test/users',
      CONNECTION: '/api/test/connection'
    }
  },

  // Feature Flags
  get FEATURES() {
    return {
      ENABLE_SUPABASE: !!process.env.SUPABASE_URL,
      ENABLE_ANALYTICS: this.IS_PRODUCTION,
      ENABLE_ERROR_REPORTING: this.IS_PRODUCTION,
      ENABLE_PERFORMANCE_MONITORING: this.IS_PRODUCTION
    }
  },

  // Timeouts and Limits
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 seconds
    AUTH_SESSION: 60 * 60 * 24 * 7, // 7 days
    CACHE_DURATION: 60 * 5, // 5 minutes
    HEALTH_CHECK: 30000 // 30 seconds
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred.'
  }
}

// Utility function to get full API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = ENV_CONFIG.API_BASE
  return endpoint.startsWith('/') 
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/${endpoint}`
}

// Utility function to handle API errors
export function handleApiError(error: any): string {
  if (error && error.response && error.response.data && error.response.data.error) {
    return error.response.data.error
  }
  
  if (error && error.message) {
    if (error.message.includes('fetch')) {
      return ENV_CONFIG.ERROR_MESSAGES.NETWORK_ERROR
    }
    if (error.message.includes('401') || error.message.includes('403')) {
      return ENV_CONFIG.ERROR_MESSAGES.AUTH_ERROR
    }
    if (error.message.includes('500')) {
      return ENV_CONFIG.ERROR_MESSAGES.SERVER_ERROR
    }
    return error.message
  }
  
  return ENV_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

// Export configuration for use in components
export default ENV_CONFIG
