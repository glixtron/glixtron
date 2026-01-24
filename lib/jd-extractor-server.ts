/**
 * Job Description Extractor - Server-Safe Version
 * Fallback to mock data for now until fetch issue is resolved
 */

import { analyzeResume as analyzeResumeOriginal, type ResumeAnalysis } from './resume-analyzer'

export interface JDExtractionResult {
  success: boolean
  content: string
  title?: string
  company?: string
  location?: string
  error?: string
  source: string
}

// Re-export types and functions from the original module
export type { ResumeAnalysis }
export const analyzeResume = analyzeResumeOriginal

/**
 * Extract job description from a URL
 * Currently using mock data until fetch issue is resolved
 */
export async function extractJDFromURL(url: string): Promise<string> {
  try {
    // Basic URL validation without using URL constructor
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided')
    }

    // For now, return mock data until fetch issue is resolved
    console.log('Using mock data for JD extraction (fetch issue being investigated)')
    return getMockJobDescription(url)

  } catch (error: any) {
    console.error('JD Extraction Error:', error)
    
    // Fallback to mock data
    return getMockJobDescription(url)
  }
}

/**
 * Extract job description from HTML content using site-specific selectors
 */
function extractJobDescriptionFromHTML(html: string, url: string): JDExtractionResult {
  const domain = url.split('/')[2]?.toLowerCase() || 'unknown'

  // For now, return mock data
  return {
    success: true,
    content: getMockJobDescription(url),
    source: 'Mock Data (Server-Safe Mode)'
  }
}

/**
 * Format job description with consistent structure
 */
function formatJobDescription(title: string, company: string, location: string, content: string): string {
  let formatted = ''
  
  if (title) formatted += `${title}\n\n`
  if (company) formatted += `Company: ${company}\n`
  if (location) formatted += `Location: ${location}\n`
  if (company || location) formatted += '\n'
  
  formatted += content
  
  return formatted.trim()
}

/**
 * Validate if URL is properly formatted
 */
function isValidURL(url: string): boolean {
  // Basic URL validation without using URL constructor
  return !!(url && 
         typeof url === 'string' && 
         (url.startsWith('http://') || url.startsWith('https://')) &&
         url.length > 10)
}

/**
 * Fallback mock job description when extraction fails
 */
function getMockJobDescription(url: string): string {
  const domain = url.split('/')[2]?.toLowerCase() || 'unknown'
  
  const mockJDs: Record<string, string> = {
    'linkedin.com': `Senior Full Stack Developer

We are looking for an experienced Full Stack Developer to join our dynamic team.

Requirements:
- 5+ years of experience in software development
- Proficiency in React, Node.js, and TypeScript
- Strong knowledge of databases (PostgreSQL, MongoDB)
- Experience with cloud platforms (AWS, Azure)
- Excellent problem-solving skills
- Strong communication and teamwork abilities

Nice to have:
- Experience with Docker and Kubernetes
- Knowledge of CI/CD pipelines
- Experience with microservices architecture
- Experience with agile methodologies

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers`,

    'indeed.com': `Product Manager - Tech Startup

Join our fast-growing startup as a Product Manager.

Key Qualifications:
- 3+ years of product management experience
- Strong analytical skills
- Experience with Agile methodologies
- Excellent communication skills
- Technical background preferred
- Experience with data analysis tools

Skills Required:
- Product strategy
- User research
- Roadmap planning
- Stakeholder management
- A/B testing

Responsibilities:
- Lead product development from concept to launch
- Work with engineering teams to deliver features
- Analyze user feedback and data
- Create and maintain product roadmap
- Collaborate with cross-functional teams`,

    'default': `Job Position

We are seeking a talented professional to join our team.

Requirements:
- Relevant experience in the field
- Strong communication skills
- Problem-solving abilities
- Team collaboration
- Adaptability and learning mindset

Responsibilities:
- Perform core job functions
- Collaborate with team members
- Contribute to project success
- Maintain professional standards
- Continuously develop skills

We offer:
- Competitive compensation
- Professional development opportunities
- Collaborative work environment
- Career growth potential`
  }

  // Find the best match or use default
  for (const [site, jd] of Object.entries(mockJDs)) {
    if (domain.includes(site)) {
      return jd
    }
  }

  return mockJDs.default
}
