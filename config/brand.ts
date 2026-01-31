// White-label SaaS configuration
export const brandConfig = {
  // App Identity - Change these for white-label deployments
  name: "Glixtron Pilot",
  description: "AI-Powered Career Intelligence Platform",
  tagline: "Transform your career with AI-driven insights",
  logo: "/logo.png",
  
  // Brand Colors - Easy theming for clients
  colors: {
    primary: "#3b82f6",      // Tailwind blue-500
    secondary: "#8b5cf6",    // Tailwind purple-500  
    accent: "#10b981",       // Tailwind emerald-500
    danger: "#ef4444",       // Tailwind red-500
    warning: "#f59e0b",      // Tailwind amber-500
    success: "#22c55e",      // Tailwind green-500
  },
  
  // Contact & Support
  supportEmail: "support@glixtron.com",
  website: "https://glixtron.com",
  docs: "https://docs.glixtron.com",
  
  // Feature Flags - Enable/disable features for different tiers
  features: {
    aiAnalysis: true,
    resumeScanner: true,
    careerGuidance: true,
    jobMatching: true,
    whiteLabelReports: true,
    advancedAnalytics: false, // Premium tier
    apiAccess: false,         // Enterprise tier
  },
  
  // File processing settings
  supportedFormats: ['pdf', 'docx', 'txt'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // AI Configuration
  ai: {
    temperature: 0.7,
    maxTokens: 2000,
    model: "gemini-pro",
    systemPrompt: `You are an elite Career Coach with 20 years of experience. 
    Your advice must be data-driven, blunt but supportive, and focused on ROI for the candidate.
    Always provide specific, actionable advice with clear next steps.`
  },
  
  // White-label Settings
  whiteLabel: {
    enabled: false,
    customDomain: "",
    hideGlixtronBranding: false,
    customCSS: "",
  }
}

// Helper function to get brand color for Tailwind classes
export const getBrandColor = (colorName: keyof typeof brandConfig.colors) => {
  return brandConfig.colors[colorName] || brandConfig.colors.primary
}

// Helper function for CSS variables
export const getCSSVariables = () => {
  return Object.entries(brandConfig.colors).reduce((vars, [key, value]) => {
    vars[`--brand-${key}`] = value
    return vars
  }, {} as Record<string, string>)
}

export default brandConfig
