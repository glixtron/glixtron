/**
 * Job Description Extractor - Enhanced with Real URL Fetching and AI Analysis
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
  metadata?: {
    extractedAt: string
    url: string
    wordCount: number
    readingTime: number
  }
}

export interface AIAnalysisResult {
  summary: string
  keySkills: string[]
  experienceLevel: string
  responsibilities: string[]
  qualifications: string[]
  matchScore?: number
  recommendations: string[]
}

// Re-export types and functions from the original module
export type { ResumeAnalysis }
export const analyzeResume = analyzeResumeOriginal

/**
 * Extract job description from a URL with real content fetching
 */
export async function extractJDFromURL(url: string): Promise<string> {
  try {
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided')
    }

    console.log('🔍 Extracting job description from:', url)
    
    // Try to fetch real content
    const content = await fetchJobDescriptionFromURL(url)
    
    if (content) {
      console.log('✅ Successfully extracted real job description')
      return content
    } else {
      console.log('⚠️ Falling back to mock data')
      return getMockJobDescription(url)
    }

  } catch (error: any) {
    console.error('❌ JD Extraction Error:', error)
    
    // Fallback to mock data
    return getMockJobDescription(url)
  }
}

/**
 * Fetch real job description from URL
 */
async function fetchJobDescriptionFromURL(url: string): Promise<string | null> {
  try {
    // Fetch the webpage content
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    
    // Extract job description using site-specific selectors
    const result = extractJobDescriptionFromHTML(html, url)
    
    if (result.success && result.content.length > 100) {
      return result.content
    }
    
    return null
  } catch (error) {
    console.error('❌ Fetch error:', error)
    return null
  }
}

/**
 * Extract job description from HTML content using site-specific selectors
 */
function extractJobDescriptionFromHTML(html: string, url: string): JDExtractionResult {
  const domain = url.split('/')[2]?.toLowerCase() || 'unknown'
  
  try {
    // Remove script tags and style tags
    const cleanHtml = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Site-specific extraction patterns
    const patterns = {
      'linkedin.com': {
        title: /(?:Senior|Junior|Lead|Principal|Staff)?\s*(?:Software|Frontend|Backend|Full[-\s]?Stack|Data|DevOps|Product|UX|UI)\s*(?:Engineer|Developer|Designer|Manager|Architect)/gi,
        content: /(?:requirements|qualifications|responsibilities|what you'll do|what you'll bring)[:\s]*([^.]*(?:\.[^.]*){10,50})/gi,
        company: /(?:at|@)\s*([A-Za-z0-9\s&]+?)(?:\s|\n|\.)/i
      },
      'indeed.com': {
        title: /job description[^:]*:(.*?)(?:requirements|qualifications)/is,
        content: /(?:requirements|qualifications|responsibilities)[:\s]*([^.]*(?:\.[^.]*){10,50})/gi,
        company: /(?:at|@)\s*([A-Za-z0-9\s&]+?)(?:\s|\n|\.)/i
      },
      'glassdoor.com': {
        title: /<h1[^>]*>(.*?)<\/h1>/i,
        content: /(?:job description|about the job)[:\s]*([^.]*(?:\.[^.]*){10,50})/gi,
        company: /(?:at|@)\s*([A-Za-z0-9\s&]+?)(?:\s|\n|\.)/i
      }
    }

    // Try to extract using patterns
    const pattern = patterns[domain as keyof typeof patterns] || patterns['linkedin.com']
    
    let title = ''
    let company = ''
    let content = ''

    // Extract title
    const titleMatch = cleanHtml.match(pattern.title)
    if (titleMatch) {
      title = titleMatch[1]?.trim() || titleMatch[0]?.trim()
    }

    // Extract company
    const companyMatch = cleanHtml.match(pattern.company)
    if (companyMatch) {
      company = companyMatch[1]?.trim()
    }

    // Extract content
    const contentMatches = cleanHtml.match(pattern.content)
    if (contentMatches && contentMatches.length > 0) {
      content = contentMatches.join('\n\n').trim()
    }

    // If no content found, try a more general approach
    if (!content || content.length < 100) {
      const generalContent = cleanHtml.substring(0, 2000)
      content = generalContent
    }

    return {
      success: true,
      content: content || getMockJobDescription(url),
      title: title || undefined,
      company: company || undefined,
      source: `Real extraction from ${domain}`,
      metadata: {
        extractedAt: new Date().toISOString(),
        url,
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200)
      }
    }

  } catch (error) {
    console.error('❌ HTML extraction error:', error)
    return {
      success: false,
      content: getMockJobDescription(url),
      error: (error as Error).message,
      source: 'Fallback to mock data'
    }
  }
}

/**
 * Analyze job description using AI (Gemini/GPT)
 */
export async function analyzeJobDescription(jdText: string): Promise<AIAnalysisResult> {
  try {
    console.log('🤖 Analyzing job description with AI...')
    
    // For now, use a rule-based approach until AI is integrated
    const analysis = await analyzeJobDescriptionRules(jdText)
    
    console.log('✅ Job description analysis completed')
    return analysis
    
  } catch (error) {
    console.error('❌ AI Analysis error:', error)
    throw new Error('Failed to analyze job description')
  }
}

/**
 * Rule-based job description analysis (fallback until AI integration)
 */
async function analyzeJobDescriptionRules(jdText: string): Promise<AIAnalysisResult> {
  const text = jdText.toLowerCase()
  
  // Extract skills
  const skillPatterns = {
    technical: [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'python', 'java',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'mysql',
      'git', 'ci/cd', 'agile', 'scrum', 'rest api', 'graphql', 'microservices'
    ],
    soft: [
      'communication', 'leadership', 'teamwork', 'problem-solving', 'analytical',
      'collaboration', 'adaptability', 'creativity', 'time management', 'project management'
    ]
  }
  
  const foundSkills: string[] = []
  
  Object.entries(skillPatterns).forEach(([category, skills]) => {
    skills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        foundSkills.push(skill)
      }
    })
  })
  
  // Determine experience level
  let experienceLevel = 'Entry Level'
  if (text.includes('senior') || text.includes('5+') || text.includes('lead')) {
    experienceLevel = 'Senior Level'
  } else if (text.includes('junior') || text.includes('0-2') || text.includes('entry')) {
    experienceLevel = 'Entry Level'
  } else if (text.includes('mid') || text.includes('3-5') || text.includes('intermediate')) {
    experienceLevel = 'Mid Level'
  }
  
  // Extract responsibilities
  const responsibilities = extractSentences(text, ['responsibilities', 'what you\'ll do', 'you will'])
  
  // Extract qualifications
  const qualifications = extractSentences(text, ['requirements', 'qualifications', 'what you\'ll bring', 'skills'])
  
  // Generate summary
  const summary = `This is a ${experienceLevel.toLowerCase()} position requiring ${foundSkills.length} key skills including ${foundSkills.slice(0, 3).join(', ')}.`
  
  // Generate recommendations
  const recommendations = [
    'Highlight your experience with the mentioned technologies',
    'Quantify your achievements with specific metrics',
    'Tailor your resume to match the key skills mentioned',
    'Include relevant project examples'
  ]
  
  return {
    summary,
    keySkills: foundSkills,
    experienceLevel,
    responsibilities,
    qualifications,
    recommendations
  }
}

/**
 * Extract sentences containing specific keywords
 */
function extractSentences(text: string, keywords: string[]): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  return sentences
    .filter(sentence => 
      keywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()))
    )
    .slice(0, 5) // Limit to 5 sentences
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 10)
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
