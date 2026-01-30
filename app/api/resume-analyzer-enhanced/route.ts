/**
 * Enhanced Resume Analyzer API
 * NLP-based text extraction with real file processing and AI analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { resumeTextExtractor } from '@/lib/resume-text-extractor'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const action = formData.get('action') as string

    let result

    switch (action) {
      case 'extract-resume':
        const resumeFile = formData.get('resumeFile') as File
        if (!resumeFile) {
          return NextResponse.json({
            success: false,
            error: 'Resume file is required'
          }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/html',
          'application/msword'
        ]

        const fileExtension = resumeFile.name.split('.').pop()?.toLowerCase()
        const allowedExtensions = ['pdf', 'docx', 'doc', 'txt', 'html', 'htm']

        if (!allowedTypes.includes(resumeFile.type) && !allowedExtensions.includes(fileExtension || '')) {
          return NextResponse.json({
            success: false,
            error: 'Invalid file type. Supported formats: PDF, DOCX, DOC, TXT, HTML'
          }, { status: 400 })
        }

        // Validate file size (max 10MB)
        if (resumeFile.size > 10 * 1024 * 1024) {
          return NextResponse.json({
            success: false,
            error: 'File size too large. Maximum size is 10MB'
          }, { status: 400 })
        }

        result = await resumeTextExtractor.extractResumeText(resumeFile)
        
        if (result.success) {
          // Add AI analysis
          const analysisResult = await analyzeResume(result.content, result.metadata?.sections || [])
          result.analysis = analysisResult
        }
        break

      case 'analyze-text':
        const resumeText = formData.get('resumeText') as string
        if (!resumeText || resumeText.trim().length < 100) {
          return NextResponse.json({
            success: false,
            error: 'Resume text is required and must be at least 100 characters'
          }, { status: 400 })
        }

        // Analyze the resume text
        const analysisResult = await analyzeResume(resumeText)
        
        result = {
          success: true,
          content: resumeText,
          source: 'text-input',
          metadata: {
            extractedAt: new Date().toISOString(),
            wordCount: resumeText.split(/\s+/).length,
            readingTime: Math.ceil(resumeText.split(/\s+/).length / 200)
          },
          analysis: analysisResult
        }
        break

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['extract-resume', 'analyze-text']
        }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Enhanced resume analyzer error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process resume',
      message: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'health':
        return NextResponse.json({
          success: true,
          message: 'Enhanced resume analyzer API is running',
          features: [
            'PDF extraction',
            'DOCX extraction',
            'Text file processing',
            'HTML file processing',
            'NLP-based section identification',
            'AI-powered analysis'
          ]
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['health']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Enhanced resume analyzer GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Analyze resume with AI and NLP
 */
async function analyzeResume(content: string, sections: any[] = []) {
  try {
    // Import ATS analyzer dynamically
    const { atsAnalyzer } = await import('@/lib/ats-analyzer-fallback')
    
    // Generate comprehensive analysis
    const analysis = {
      sections: sections.length > 0 ? sections : identifySections(content),
      skills: extractSkills(content),
      experience: extractExperience(content),
      education: extractEducation(content),
      contactInfo: extractContactInfo(content),
      atsScore: calculateATSScore(content),
      recommendations: generateResumeRecommendations(content),
      strengthScore: calculateStrengthScore(content),
      completeness: calculateCompleteness(content, sections),
      formatting: analyzeFormatting(content),
      keywords: extractKeywords(content)
    }

    return {
      success: true,
      analysis,
      processedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('Resume analysis error:', error)
    return {
      success: false,
      error: 'Resume analysis failed',
      fallback: generateBasicAnalysis(content)
    }
  }
}

/**
 * Identify resume sections from content
 */
function identifySections(content: string) {
  const lines = content.split('\n')
  const sections = []
  
  const sectionPatterns = {
    contact: ['contact', 'email', 'phone', 'address', 'linkedin', 'github'],
    summary: ['summary', 'objective', 'profile', 'about'],
    experience: ['experience', 'work', 'employment', 'career'],
    education: ['education', 'academic', 'qualification', 'degree'],
    skills: ['skills', 'technical', 'competencies', 'abilities'],
    projects: ['projects', 'portfolio', 'work samples'],
    certifications: ['certifications', 'certificates', 'licenses']
  }

  let currentSection = null
  let sectionContent = []

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim()
    
    // Check if this line is a section header
    for (const [sectionType, patterns] of Object.entries(sectionPatterns)) {
      for (const pattern of patterns) {
        if (lowerLine.includes(pattern) && line.length < 50) {
          if (currentSection) {
            currentSection.content = sectionContent.join('\n')
            sections.push(currentSection)
          }
          
          currentSection = {
            type: sectionType,
            title: line.trim(),
            content: ''
          }
          sectionContent = []
          break
        }
      }
    }

    if (currentSection && line.trim()) {
      sectionContent.push(line.trim())
    }
  }

  // Add last section
  if (currentSection) {
    currentSection.content = sectionContent.join('\n')
    sections.push(currentSection)
  }

  return sections
}

/**
 * Extract skills from resume content
 */
function extractSkills(content: string): string[] {
  const skills = []
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'ci/cd',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql',
    'machine learning', 'ai', 'data science', 'analytics', 'tensorflow',
    'html', 'css', 'typescript', 'webpack', 'babel', 'jest'
  ]

  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'project management', 'analytical', 'critical thinking', 'creativity',
    'adaptability', 'time management', 'collaboration', 'negotiation'
  ]

  const lowerContent = content.toLowerCase()
  
  // Extract technical skills
  for (const skill of technicalSkills) {
    if (lowerContent.includes(skill)) {
      skills.push({ name: skill, type: 'technical' })
    }
  }
  
  // Extract soft skills
  for (const skill of softSkills) {
    if (lowerContent.includes(skill)) {
      skills.push({ name: skill, type: 'soft' })
    }
  }
  
  return skills.map(s => s.name)
}

/**
 * Extract experience information
 */
function extractExperience(content: string) {
  const experiencePattern = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|work)/i
  const match = content.match(experiencePattern)
  
  const companies = []
  const companyPattern = /(?:worked at|employed by|company|)\s*([A-Z][a-zA-Z\s&]+)(?:,|\n|\.)/g
  let companyMatch
  
  while ((companyMatch = companyPattern.exec(content)) !== null) {
    const company = companyMatch[1].trim()
    if (company.length > 2 && company.length < 50 && !companies.includes(company)) {
      companies.push(company)
    }
  }
  
  return {
    totalYears: match ? match[1] : 'Not specified',
    companies: companies.slice(0, 10),
    hasExperience: match !== null || companies.length > 0
  }
}

/**
 * Extract education information
 */
function extractEducation(content: string) {
  const education = []
  
  const degreePatterns = [
    /bachelor'?s? in ([a-z\s]+)/gi,
    /master'?s? in ([a-z\s]+)/gi,
    /phd in ([a-z\s]+)/gi,
    /b\.?a\.? in ([a-z\s]+)/gi,
    /m\.?a\.? in ([a-z\s]+)/gi,
    /b\.?s\.? in ([a-z\s]+)/gi,
    /m\.?s\.? in ([a-z\s]+)/gi
  ]
  
  for (const pattern of degreePatterns) {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        education.push(match.trim())
      })
    }
  }
  
  const universityPattern = /(?:university|college|institute)\s+([A-Z][a-zA-Z\s]+)/gi
  const universityMatches = content.match(universityPattern)
  
  if (universityMatches) {
    universityMatches.forEach(match => {
      education.push(match.trim())
    })
  }
  
  return {
    degrees: [...new Set(education)].slice(0, 5),
    hasEducation: education.length > 0
  }
}

/**
 * Extract contact information
 */
function extractContactInfo(content: string) {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const phonePattern = /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g
  const linkedinPattern = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi
  const githubPattern = /github\.com\/([a-zA-Z0-9-]+)/gi
  
  const emails = content.match(emailPattern) || []
  const phones = content.match(phonePattern) || []
  const linkedins = content.match(linkedinPattern) || []
  const githubs = content.match(githubPattern) || []
  
  return {
    email: emails[0] || null,
    phone: phones[0] || null,
    linkedin: linkedins[0] || null,
    github: githubs[0] || null,
    hasContactInfo: emails.length > 0 || phones.length > 0
  }
}

/**
 * Calculate ATS score
 */
function calculateATSScore(content: string): number {
  let score = 50 // Base score
  
  // Check for sections
  if (content.toLowerCase().includes('experience')) score += 10
  if (content.toLowerCase().includes('education')) score += 10
  if (content.toLowerCase().includes('skills')) score += 10
  
  // Check for contact info
  if (content.includes('@')) score += 5
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)) score += 5
  
  // Check for action verbs
  const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'led', 'achieved']
  const lowerContent = content.toLowerCase()
  const foundVerbs = actionVerbs.filter(verb => lowerContent.includes(verb))
  score += Math.min(foundVerbs.length * 2, 10)
  
  return Math.min(score, 100)
}

/**
 * Generate resume recommendations
 */
function generateResumeRecommendations(content: string): string[] {
  const recommendations = []
  
  if (!content.toLowerCase().includes('summary')) {
    recommendations.push('Add a professional summary at the top of your resume')
  }
  
  if (!content.includes('@')) {
    recommendations.push('Include your email address for contact')
  }
  
  if (!/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)) {
    recommendations.push('Add your phone number for better contact options')
  }
  
  if (!content.toLowerCase().includes('skills')) {
    recommendations.push('Create a dedicated skills section')
  }
  
  const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'led', 'achieved']
  const lowerContent = content.toLowerCase()
  const foundVerbs = actionVerbs.filter(verb => lowerContent.includes(verb))
  
  if (foundVerbs.length < 3) {
    recommendations.push('Use more action verbs to describe your experience')
  }
  
  if (!/\d+[%$]|\d+\s*(years?|months?|projects?|clients?)/.test(content)) {
    recommendations.push('Add quantifiable achievements and metrics')
  }
  
  return recommendations
}

/**
 * Calculate strength score
 */
function calculateStrengthScore(content: string): number {
  let score = 0
  
  // Content length
  if (content.length > 500) score += 10
  if (content.length > 1000) score += 10
  
  // Sections
  if (content.toLowerCase().includes('experience')) score += 15
  if (content.toLowerCase().includes('education')) score += 15
  if (content.toLowerCase().includes('skills')) score += 10
  
  // Contact info
  if (content.includes('@')) score += 10
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)) score += 10
  
  // Professional elements
  if (content.toLowerCase().includes('linkedin')) score += 10
  if (content.toLowerCase().includes('github')) score += 10
  
  return Math.min(score, 100)
}

/**
 * Calculate completeness score
 */
function calculateCompleteness(content: string, sections: any[]): number {
  const requiredSections = ['contact', 'summary', 'experience', 'education', 'skills']
  const presentSections = sections.map(s => s.type)
  
  let score = 0
  requiredSections.forEach(section => {
    if (presentSections.includes(section)) {
      score += 20
    }
  })
  
  return Math.min(score, 100)
}

/**
 * Analyze formatting
 */
function analyzeFormatting(content: string) {
  const lines = content.split('\n')
  const hasBulletPoints = lines.some(line => /^[-•*]\s/.test(line))
  const hasConsistentSpacing = !lines.some(line => line.length === 0 && lines.indexOf(line) > 0 && lines.indexOf(line) < lines.length - 1)
  const hasProperCapitalization = lines.some(line => /^[A-Z]/.test(line.trim()))
  
  return {
    hasBulletPoints,
    hasConsistentSpacing,
    hasProperCapitalization,
    formattingScore: (hasBulletPoints ? 30 : 0) + (hasConsistentSpacing ? 40 : 0) + (hasProperCapitalization ? 30 : 0)
  }
}

/**
 * Extract keywords
 */
function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']
  
  const keywords = words
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .reduce((acc: any, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
  
  return Object.entries(keywords)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 20)
    .map(([word]) => word)
}

/**
 * Generate basic analysis fallback
 */
function generateBasicAnalysis(content: string) {
  return {
    sections: identifySections(content),
    skills: extractSkills(content),
    experience: extractExperience(content),
    education: extractEducation(content),
    contactInfo: extractContactInfo(content),
    atsScore: calculateATSScore(content),
    recommendations: generateResumeRecommendations(content),
    strengthScore: calculateStrengthScore(content),
    completeness: calculateCompleteness(content, identifySections(content)),
    formatting: analyzeFormatting(content),
    keywords: extractKeywords(content)
  }
}
