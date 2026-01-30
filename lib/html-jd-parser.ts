/**
 * HTML JD Parser - Extract job descriptions from uploaded HTML files
 * Uses advanced parsing techniques to extract clean job description text
 */

import { JSDOM } from 'jsdom'

export interface HTMLJDResult {
  success: boolean
  content: string
  title?: string
  company?: string
  location?: string
  metadata?: {
    extractedAt: string
    source: 'html-upload'
    wordCount: number
    readingTime: number
  }
  error?: string
}

export class HTMLJDParser {
  /**
   * Parse HTML content and extract job description
   */
  async parseHTML(htmlContent: string): Promise<HTMLJDResult> {
    try {
      const dom = new JSDOM(htmlContent)
      const document = dom.window.document

      // Remove unwanted elements
      this.cleanupDocument(document)

      // Extract job title
      const title = this.extractJobTitle(document)

      // Extract company name
      const company = this.extractCompany(document)

      // Extract location
      const location = this.extractLocation(document)

      // Extract main content
      const content = this.extractMainContent(document)

      if (!content || content.trim().length < 50) {
        return {
          success: false,
          content: '',
          error: 'Could not extract sufficient job description content from HTML'
        }
      }

      const wordCount = this.countWords(content)
      const readingTime = Math.ceil(wordCount / 200) // Average reading speed

      return {
        success: true,
        content: this.cleanContent(content),
        title,
        company,
        location,
        metadata: {
          extractedAt: new Date().toISOString(),
          source: 'html-upload',
          wordCount,
          readingTime
        }
      }
    } catch (error) {
      console.error('HTML parsing error:', error)
      return {
        success: false,
        content: '',
        error: `Failed to parse HTML: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Clean up document by removing unwanted elements
   */
  private cleanupDocument(document: Document): void {
    const elementsToRemove = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      'aside',
      '.sidebar',
      '.navigation',
      '.menu',
      '.ads',
      '.advertisement',
      '.social-share',
      '.comments',
      '.related-jobs',
      '.popup',
      '.modal',
      '[role="banner"]',
      '[role="navigation"]',
      '[role="contentinfo"]',
      '[role="complementary"]'
    ]

    elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => el.remove())
    })

    // Remove elements with common ad/class names
    const adClasses = [
      'ad', 'ads', 'advertisement', 'banner', 'popup', 'modal',
      'social', 'share', 'follow', 'subscribe', 'newsletter'
    ]

    adClasses.forEach(className => {
      const elements = document.querySelectorAll(`[class*="${className}"]`)
      elements.forEach(el => {
        const classList = el.className.toLowerCase()
        if (adClasses.some(ad => classList.includes(ad))) {
          el.remove()
        }
      })
    })
  }

  /**
   * Extract job title from HTML
   */
  private extractJobTitle(document: Document): string | undefined {
    const titleSelectors = [
      'h1',
      '[class*="title"]',
      '[class*="job-title"]',
      '[data-testid="job-title"]',
      '.job-title',
      '.position-title',
      '.role-title',
      'title'
    ]

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent?.trim()) {
        const title = element.textContent.trim()
        if (title.length > 5 && title.length < 200) {
          return title
        }
      }
    }

    return undefined
  }

  /**
   * Extract company name from HTML
   */
  private extractCompany(document: Document): string | undefined {
    const companySelectors = [
      '[class*="company"]',
      '[data-testid="company-name"]',
      '.company-name',
      '.employer',
      '.organization',
      '[property="hiringOrganization"]',
      '[itemprop="hiringOrganization"]'
    ]

    for (const selector of companySelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent?.trim()) {
        const company = element.textContent.trim()
        if (company.length > 2 && company.length < 100) {
          return company
        }
      }
    }

    return undefined
  }

  /**
   * Extract location from HTML
   */
  private extractLocation(document: Document): string | undefined {
    const locationSelectors = [
      '[class*="location"]',
      '[data-testid="location"]',
      '.location',
      '.job-location',
      '.workplace',
      '[property="jobLocation"]',
      '[itemprop="jobLocation"]'
    ]

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent?.trim()) {
        const location = element.textContent.trim()
        if (location.length > 2 && location.length < 100) {
          return location
        }
      }
    }

    return undefined
  }

  /**
   * Extract main job description content
   */
  private extractMainContent(document: Document): string {
    const contentSelectors = [
      '[class*="description"]',
      '[class*="job-description"]',
      '[data-testid="job-description"]',
      '.job-description',
      '.description',
      '.role-description',
      '.position-description',
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.job-details'
    ]

    let bestContent = ''

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector)
      if (element) {
        const content = element.textContent?.trim() || ''
        if (content.length > bestContent.length) {
          bestContent = content
        }
      }
    }

    // If no specific content found, try to get the body content
    if (!bestContent || bestContent.length < 100) {
      const body = document.querySelector('body')
      if (body) {
        bestContent = body.textContent?.trim() || ''
      }
    }

    return bestContent
  }

  /**
   * Clean and format extracted content
   */
  private cleanContent(content: string): string {
    return content
      .replace(/\s+/g, ' ')           // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n')       // Replace multiple newlines with single newline
      .replace(/^\s+|\s+$/g, '')       // Trim leading and trailing whitespace
      .replace(/\s*([,.!?;:])\s*/g, '$1 ') // Ensure proper spacing around punctuation
      .replace(/\s+/g, ' ')           // Final cleanup of multiple spaces
      .trim()
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Validate if HTML contains job description
   */
  static validateHTMLContent(htmlContent: string): boolean {
    if (!htmlContent || htmlContent.length < 100) {
      return false
    }

    // Check for common job description indicators
    const jobIndicators = [
      'job description',
      'responsibilities',
      'requirements',
      'qualifications',
      'skills',
      'experience',
      'position',
      'role',
      'hiring',
      'employment',
      'career',
      'apply'
    ]

    const lowerContent = htmlContent.toLowerCase()
    const foundIndicators = jobIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    )

    return foundIndicators.length >= 2
  }
}

export const htmlJDParser = new HTMLJDParser()
