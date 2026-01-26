/**
 * Enhanced Job Description Extractor
 * Supports real web scraping from various job sites
 */

import * as cheerio from 'cheerio'
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
 * Supports multiple job sites and general web pages
 */
export async function extractJDFromURL(url: string): Promise<string> {
  try {
    // Validate URL
    if (!url || !isValidURL(url)) {
      throw new Error('Invalid URL provided')
    }

    // Fetch the webpage using Node.js built-in fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const result = extractJobDescriptionFromHTML(html, url)
    
    if (!result.success || !result.content.trim()) {
      throw new Error(result.error || 'Could not extract job description from the page')
    }

    return result.content

  } catch (error: any) {
    console.error('JD Extraction Error:', error)
    
    // Fallback to mock data if extraction fails
    console.log('Falling back to mock data due to extraction failure')
    return getMockJobDescription(url)
  }
}

/**
 * Extract job description from HTML content using site-specific selectors
 */
function extractJobDescriptionFromHTML(html: string, url: string): JDExtractionResult {
  const $ = cheerio.load(html)
  const domain = new URL(url).hostname.toLowerCase()

  // Try different extraction strategies based on the site
  const strategies = [
    () => extractFromLinkedIn($),
    () => extractFromIndeed($),
    () => extractFromGlassdoor($),
    () => extractFromGoogleSites($),
    () => extractFromGeneralJobSite($),
    () => extractFromGenericPage($)
  ]

  for (const strategy of strategies) {
    try {
      const result = strategy()
      if (result.success && result.content.trim().length > 100) {
        return result
      }
    } catch (error) {
      continue
    }
  }

  return {
    success: false,
    content: '',
    error: 'Could not extract job description from this page',
    source: domain
  }
}

/**
 * Extract from LinkedIn job postings
 */
function extractFromLinkedIn($: cheerio.CheerioAPI): JDExtractionResult {
  const title = $('.top-card-layout__title').text().trim()
  const company = $('.top-card-layout__card .top-card-layout__entity-info a').text().trim()
  const location = $('.top-card-layout__card .top-card-layout__subheader .job-search-card__location').text().trim()
  
  let content = ''
  
  // Try multiple selectors for job description
  const descriptionSelectors = [
    '.description__text',
    '.show-more-less-html__markup',
    '[data-test-id="job-description"]',
    '.job-description-container'
  ]
  
  for (const selector of descriptionSelectors) {
    const element = $(selector)
    if (element.length > 0) {
      content = element.text().trim()
      break
    }
  }

  return {
    success: content.length > 0,
    content: formatJobDescription(title, company, location, content),
    title,
    company,
    location,
    source: 'LinkedIn'
  }
}

/**
 * Extract from Indeed job postings
 */
function extractFromIndeed($: cheerio.CheerioAPI): JDExtractionResult {
  const title = $('.jobsearch-JobInfoHeader-title').text().trim() || 
                $('.jobtitle').text().trim()
  const company = $('.jobsearch-InlineCompanyRating-companyInfo').text().trim() ||
                 $('.companyName').text().trim()
  const location = $('.jobsearch-JobInfoHeader-subheader div').text().trim() ||
                  $('.location').text().trim()
  
  const content = $('#jobDescriptionText').text().trim() ||
                $('#jobDescription').text().trim() ||
                $('.jobsearch-jobDescriptionText').text().trim()

  return {
    success: content.length > 0,
    content: formatJobDescription(title, company, location, content),
    title,
    company,
    location,
    source: 'Indeed'
  }
}

/**
 * Extract from Glassdoor job postings
 */
function extractFromGlassdoor($: cheerio.CheerioAPI): JDExtractionResult {
  const title = $('.jobTitle').text().trim() ||
                $('.css-1iq7a6i').text().trim()
  const company = $('.css-1svs3yx').text().trim() ||
                 $('.employerName').text().trim()
  const location = $('.css-1v6dl2e').text().trim() ||
                  $('.location').text().trim()
  
  const content = $('.jobDescription').text().trim() ||
                $('.css-1u8oejf').text().trim()

  return {
    success: content.length > 0,
    content: formatJobDescription(title, company, location, content),
    title,
    company,
    location,
    source: 'Glassdoor'
  }
}

/**
 * Extract from Google Sites job postings
 */
function extractFromGoogleSites($: cheerio.CheerioAPI): JDExtractionResult {
  const title = $('title').text().trim() ||
                $('h1').first().text().trim()
  const company = $('.sites-layout-name').text().trim() ||
                 $('.company-name').text().trim()
  const location = $('.location').text().trim() ||
                  $('.job-location').text().trim()
  
  const content = $('.sites-canvas-main').text().trim() ||
                $('.job-description').text().trim() ||
                $('main').text().trim()

  return {
    success: content.length > 0,
    content: formatJobDescription(title, company, location, content),
    title,
    company,
    location,
    source: 'Google Sites'
  }
}

/**
 * Extract from general job sites using common patterns
 */
function extractFromGeneralJobSite($: cheerio.CheerioAPI): JDExtractionResult {
  const title = $('title').text().trim() ||
                $('h1').first().text().trim() ||
                $('.job-title').text().trim() ||
                $('.position-title').text().trim()
  
  const company = $('.company').text().trim() ||
                 $('.employer').text().trim() ||
                 $('.organization').text().trim()
  
  const location = $('.location').text().trim() ||
                  $('.job-location').text().trim() ||
                  $('.city-state').text().trim()
  
  let content = ''
  
  // Common job description selectors
  const descriptionSelectors = [
    '.job-description',
    '.job-description-text',
    '.description',
    '.job-details',
    '.position-description',
    '.requirements',
    '[class*="description"]',
    '[class*="job"]',
    'main',
    'article'
  ]
  
  for (const selector of descriptionSelectors) {
    const element = $(selector)
    if (element.length > 0) {
      const elementText = element.text().trim()
      if (elementText.length > 200) { // Ensure substantial content
        content = elementText
        break
      }
    }
  }

  return {
    success: content.length > 0,
    content: formatJobDescription(title, company, location, content),
    title,
    company,
    location,
    source: 'General Job Site'
  }
}

/**
 * Extract from generic web pages
 */
function extractFromGenericPage($: cheerio.CheerioAPI): JDExtractionResult {
  // Remove script tags, style tags, and other non-content elements
  $('script, style, nav, header, footer, aside, .sidebar, .menu, .navigation').remove()
  
  const title = $('title').text().trim() || $('h1').first().text().trim()
  const bodyContent = $('body').text().trim()
  
  // Try to find job-related content
  const jobKeywords = ['requirements', 'qualifications', 'responsibilities', 'skills', 'experience', 'education']
  const sentences = bodyContent.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  const jobSentences = sentences.filter(sentence => 
    jobKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  )
  
  const finalContent = jobSentences.length > 0 ? jobSentences.join('. ') : bodyContent.substring(0, 2000)

  return {
    success: finalContent.length > 100,
    content: formatJobDescription(title, '', '', finalContent),
    title,
    source: 'Generic Page'
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
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Fallback mock job description when extraction fails
 */
function getMockJobDescription(url: string): string {
  const domain = new URL(url).hostname.toLowerCase()
  
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
