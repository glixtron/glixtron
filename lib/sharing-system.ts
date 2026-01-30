/**
 * Sharing System for Real Audience Distribution
 * Multiple server URLs with load balancing and analytics
 */

import { serverManager } from './server-config'

export interface ShareLink {
  id: string
  url: string
  title: string
  description: string
  category: 'resume' | 'job' | 'assessment' | 'general'
  serverUrl: string
  createdAt: Date
  expiresAt?: Date
  analytics: {
    views: number
    uses: number
    lastUsed?: Date
    region: string
  }
}

export interface SharingConfig {
  baseUrl: string
  trackAnalytics: boolean
  enableRegionRouting: boolean
  customDomain?: string
  socialMedia: {
    twitter: string
    linkedin: string
    facebook: string
    email: string
  }
}

// Main sharing configuration
export const SHARING_CONFIG: SharingConfig = {
  baseUrl: 'https://careerpath-pro.vercel.app',
  trackAnalytics: true,
  enableRegionRouting: true,
  customDomain: 'https://careerpath-pro.app',
  socialMedia: {
    twitter: 'https://twitter.com/intent/tweet',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    email: 'mailto:'
  }
}

export class SharingSystem {
  private static instance: SharingSystem
  private shareLinks: Map<string, ShareLink> = new Map()

  private constructor() {}

  static getInstance(): SharingSystem {
    if (!SharingSystem.instance) {
      SharingSystem.instance = new SharingSystem()
    }
    return SharingSystem.instance
  }

  /**
   * Create a shareable link for the application
   */
  public createShareLink(config: {
    title: string
    description: string
    category: ShareLink['category']
    expiresAt?: Date
    customParams?: Record<string, string>
  }): ShareLink {
    const id = this.generateShareId()
    const serverUrl = serverManager.getServerUrl()
    
    // Build URL with parameters
    const url = new URL(serverUrl)
    url.pathname = '/shared'
    url.searchParams.set('id', id)
    url.searchParams.set('category', config.category)
    url.searchParams.set('title', config.title)
    
    if (config.expiresAt) {
      url.searchParams.set('expires', config.expiresAt.toISOString())
    }
    
    if (config.customParams) {
      Object.entries(config.customParams).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    const shareLink: ShareLink = {
      id,
      url: url.toString(),
      title: config.title,
      description: config.description,
      category: config.category,
      serverUrl,
      createdAt: new Date(),
      expiresAt: config.expiresAt,
      analytics: {
        views: 0,
        uses: 0,
        region: 'global'
      }
    }

    this.shareLinks.set(id, shareLink)
    return shareLink
  }

  /**
   * Get all available server URLs for different regions
   */
  public getServerUrls(): Array<{
    url: string
    region: string
    name: string
    priority: number
  }> {
    const status = serverManager.getServerStatus()
    const allServers = [...status.primary, ...status.fallback]
    
    return allServers
      .filter(server => server.isHealthy)
      .sort((a, b) => a.priority - b.priority)
      .map(server => ({
        url: server.url,
        region: server.region,
        name: server.name,
        priority: server.priority
      }))
  }

  /**
   * Get the best server URL based on user's region
   */
  public getOptimalServerUrl(userRegion?: string): string {
    const servers = this.getServerUrls()
    
    if (!userRegion) {
      return servers[0]?.url || SHARING_CONFIG.baseUrl
    }

    // Try to find server in the same region
    const regionalServer = servers.find(server => 
      server.region.toLowerCase().includes(userRegion.toLowerCase())
    )

    return regionalServer?.url || servers[0]?.url || SHARING_CONFIG.baseUrl
  }

  /**
   * Generate social media sharing links
   */
  public generateSocialLinks(shareLink: ShareLink): {
    twitter: string
    linkedin: string
    facebook: string
    email: string
    direct: string
  } {
    const encodedUrl = encodeURIComponent(shareLink.url)
    const encodedTitle = encodeURIComponent(shareLink.title)
    const encodedDescription = encodeURIComponent(shareLink.description)

    return {
      twitter: `${SHARING_CONFIG.socialMedia.twitter}?text=${encodedTitle}%20${encodedDescription}&url=${encodedUrl}`,
      linkedin: `${SHARING_CONFIG.socialMedia.linkedin}?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      facebook: `${SHARING_CONFIG.socialMedia.facebook}?u=${encodedUrl}`,
      email: `${SHARING_CONFIG.socialMedia.email}?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      direct: shareLink.url
    }
  }

  /**
   * Generate QR code data for sharing
   */
  public generateQRCode(shareLink: ShareLink): string {
    // This would integrate with a QR code library
    // For now, return the URL that can be used to generate QR code
    return shareLink.url
  }

  /**
   * Track analytics for a share link
   */
  public trackAnalytics(shareId: string, action: 'view' | 'use', region?: string): void {
    const shareLink = this.shareLinks.get(shareId)
    if (!shareLink) return

    if (action === 'view') {
      shareLink.analytics.views++
    } else if (action === 'use') {
      shareLink.analytics.uses++
      shareLink.analytics.lastUsed = new Date()
    }

    if (region) {
      shareLink.analytics.region = region
    }

    // Update the share link
    this.shareLinks.set(shareId, shareLink)
  }

  /**
   * Get analytics for a share link
   */
  public getAnalytics(shareId: string): ShareLink['analytics'] | null {
    const shareLink = this.shareLinks.get(shareId)
    return shareLink?.analytics || null
  }

  /**
   * Get system-wide analytics
   */
  public getSystemAnalytics(): {
    totalShares: number
    totalViews: number
    totalUses: number
    topCategories: Array<{ category: string; count: number }>
    regionalDistribution: Array<{ region: string; count: number }>
  } {
    const shareLinks = Array.from(this.shareLinks.values())
    
    const totalShares = shareLinks.length
    const totalViews = shareLinks.reduce((sum, link) => sum + link.analytics.views, 0)
    const totalUses = shareLinks.reduce((sum, link) => sum + link.analytics.uses, 0)

    // Calculate top categories
    const categoryCounts = shareLinks.reduce((acc, link) => {
      acc[link.category] = (acc[link.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate regional distribution
    const regionCounts = shareLinks.reduce((acc, link) => {
      acc[link.analytics.region] = (acc[link.analytics.region] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const regionalDistribution = Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)

    return {
      totalShares,
      totalViews,
      totalUses,
      topCategories,
      regionalDistribution
    }
  }

  /**
   * Clean up expired share links
   */
  public cleanupExpiredLinks(): number {
    const now = new Date()
    let cleaned = 0

    for (const [id, link] of this.shareLinks.entries()) {
      if (link.expiresAt && link.expiresAt < now) {
        this.shareLinks.delete(id)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * Generate a unique share ID
   */
  private generateShareId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  /**
   * Create a comprehensive sharing package
   */
  public createSharingPackage(config: {
    title: string
    description: string
    category: ShareLink['category']
    expiresAt?: Date
    customParams?: Record<string, string>
    includeQR?: boolean
    includeAnalytics?: boolean
  }): {
    shareLink: ShareLink
    socialLinks: ReturnType<SharingSystem['generateSocialLinks']>
    qrCode?: string
    analytics?: ShareLink['analytics']
    serverUrls: ReturnType<SharingSystem['getServerUrls']>
  } {
    const shareLink = this.createShareLink(config)
    const socialLinks = this.generateSocialLinks(shareLink)
    const serverUrls = this.getServerUrls()

    const result: any = {
      shareLink,
      socialLinks,
      serverUrls
    }

    if (config.includeQR) {
      result.qrCode = this.generateQRCode(shareLink)
    }

    if (config.includeAnalytics) {
      result.analytics = shareLink.analytics
    }

    return result
  }
}

// Export singleton instance
export const sharingSystem = SharingSystem.getInstance()

// Utility functions for common sharing scenarios
export const createResumeShareLink = (resumeId: string, jobTitle?: string) => {
  return sharingSystem.createShareLink({
    title: `Resume Analysis: ${jobTitle || 'Professional Resume'}`,
    description: 'Check out this AI-powered resume analysis and career insights',
    category: 'resume',
    customParams: {
      type: 'resume',
      resumeId
    }
  })
}

export const createJobShareLink = (jobUrl: string, jobTitle: string, company?: string) => {
  return sharingSystem.createShareLink({
    title: `Job Opportunity: ${jobTitle}`,
    description: `Exciting opportunity at ${company || 'Leading Company'}. Apply now!`,
    category: 'job',
    customParams: {
      type: 'job',
      jobUrl,
      company
    }
  })
}

export const createAssessmentShareLink = (assessmentType: string) => {
  return sharingSystem.createShareLink({
    title: `Career Assessment: ${assessmentType}`,
    description: 'Discover your career DNA and unlock your potential with our AI-powered assessment',
    category: 'assessment',
    customParams: {
      type: 'assessment',
      assessmentType
    }
  })
}
