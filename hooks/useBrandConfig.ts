'use client'

import { useState, useEffect } from 'react'

interface BrandConfig {
  name: string
  description: string
  tagline: string
  logo: string
  colors: {
    primary: string
    secondary: string
    accent: string
    danger: string
    warning: string
    success: string
  }
  aiPersona: {
    name: string
    style: string
    instruction: string
    tone: string
    communication: {
      greeting: string
      signoff: string
      encouragement: string
    }
  }
}

const defaultConfig: BrandConfig = {
  name: "Glixtron Pilot",
  description: "AI-Powered Career Intelligence Platform",
  tagline: "Transform your career with AI-driven insights",
  logo: "/logo.png",
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e"
  },
  aiPersona: {
    name: "Aria",
    style: "Professional & Data-Driven",
    instruction: "You are an elite Silicon Valley recruiter. Be blunt about skill gaps but provide high-ROI solutions. Focus heavily on ATS optimization and salary negotiation.",
    tone: "formal",
    communication: {
      greeting: "Hello! I'm Aria, your AI career advisor.",
      signoff: "Best regards on your career journey!",
      encouragement: "You're making great progress toward your goals."
    }
  }
}

export function useBrandConfig() {
  const [config, setConfig] = useState<BrandConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(false) // Start with false to prevent loading state
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBrandConfig()
  }, [])

  const loadBrandConfig = async () => {
    try {
      // Don't show loading initially to prevent client-side exceptions
      if (config !== defaultConfig) {
        setIsLoading(true)
      }
      setError(null)
      
      // Try to load from API first (for dynamic config)
      const response = await fetch('/api/admin/config')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Transform API response to BrandConfig format
          const apiConfig: BrandConfig = {
            name: data.data.name || defaultConfig.name,
            description: data.data.description || defaultConfig.description,
            tagline: data.data.tagline || defaultConfig.tagline,
            logo: data.data.logo || defaultConfig.logo,
            colors: {
              primary: data.data.primaryColor || defaultConfig.colors.primary,
              secondary: data.data.secondaryColor || defaultConfig.colors.secondary,
              accent: data.data.accentColor || defaultConfig.colors.accent,
              danger: data.data.dangerColor || defaultConfig.colors.danger,
              warning: data.data.warningColor || defaultConfig.colors.warning,
              success: data.data.successColor || defaultConfig.colors.success
            },
            aiPersona: {
              name: data.data.aiName || defaultConfig.aiPersona.name,
              style: data.data.aiStyle || defaultConfig.aiPersona.style,
              instruction: data.data.aiInstruction || defaultConfig.aiPersona.instruction,
              tone: data.data.aiTone || defaultConfig.aiPersona.tone,
              communication: {
                greeting: data.data.aiGreeting || defaultConfig.aiPersona.communication.greeting,
                signoff: data.data.aiSignoff || defaultConfig.aiPersona.communication.signoff,
                encouragement: data.data.aiEncouragement || defaultConfig.aiPersona.communication.encouragement
              }
            }
          }
          setConfig(apiConfig)
        }
      }
    } catch (error) {
      console.error('Failed to load brand config:', error)
      setError('Failed to load brand configuration')
      // Fall back to default config
      setConfig(defaultConfig)
    } finally {
      setIsLoading(false)
    }
  }

  return { config, isLoading, error, refetch: loadBrandConfig }
}

export default useBrandConfig
