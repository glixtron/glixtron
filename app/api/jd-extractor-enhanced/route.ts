/**
 * Enhanced Job Description Extractor API
 * Real URL fetching with HTML file upload support and AI-powered analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractJDFromURL } from '@/lib/jd-extractor-server'
import { htmlJDParser } from '@/lib/html-jd-parser-fallback'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { userTierSystem } from '@/lib/user-tier-system'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const action = formData.get('action') as string
    const userId = session.user.email

    // Check user limits before processing
    const usageCheck = await userTierSystem.checkUsageLimit(userId, 'job_analysis')
    if (!usageCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: usageCheck.error,
        usage: usageCheck.usage
      }, { status: 429 })
    }

    let result

    switch (action) {
      case 'extract-url':
        const url = formData.get('url') as string
        if (!url) {
          return NextResponse.json({
            success: false,
            error: 'URL is required'
          }, { status: 400 })
        }

        result = await extractJDFromURL(url)
        
        if (result.success) {
          // Record usage
          await userTierSystem.recordUsage(userId, 'job_analysis')
          
          // Add AI analysis
          const analysisResult = await analyzeJobDescription(result.content)
          result.analysis = analysisResult
        }
        break

      case 'extract-html':
        const htmlFile = formData.get('htmlFile') as File
        if (!htmlFile) {
          return NextResponse.json({
            success: false,
            error: 'HTML file is required'
          }, { status: 400 })
        }

        // Validate file type
        if (!htmlFile.type.includes('html') && !htmlFile.name.endsWith('.html') && !htmlFile.name.endsWith('.htm')) {
          return NextResponse.json({
            success: false,
            error: 'Invalid file type. Please upload an HTML file'
          }, { status: 400 })
        }

        // Validate file size (max 10MB)
        if (htmlFile.size > 10 * 1024 * 1024) {
          return NextResponse.json({
            success: false,
            error: 'File size too large. Maximum size is 10MB'
          }, { status: 400 })
        }

        const htmlContent = await htmlFile.text()
        
        // Validate HTML content
        if (!htmlJDParser.validateHTMLContent(htmlContent)) {
          return NextResponse.json({
            success: false,
            error: 'The uploaded file does not appear to contain a valid job description'
          }, { status: 400 })
        }

        result = await htmlJDParser.parseHTML(htmlContent)
        
        if (result.success) {
          // Record usage
          await userTierSystem.recordUsage(userId, 'job_analysis')
          
          // Add AI analysis
          const analysisResult = await analyzeJobDescription(result.content)
          result.analysis = analysisResult
        }
        break

      case 'analyze-text':
        const jobText = formData.get('jobText') as string
        if (!jobText || jobText.trim().length < 50) {
          return NextResponse.json({
            success: false,
            error: 'Job description text is required and must be at least 50 characters'
          }, { status: 400 })
        }

        // Record usage
        await userTierSystem.recordUsage(userId, 'job_analysis')

        // Analyze the job text
        const analysisResult = await analyzeJobDescription(jobText)
        
        result = {
          success: true,
          content: jobText,
          source: 'text-input',
          metadata: {
            extractedAt: new Date().toISOString(),
            wordCount: jobText.split(/\s+/).length,
            readingTime: Math.ceil(jobText.split(/\s+/).length / 200)
          },
          analysis: analysisResult
        }
        break

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['extract-url', 'extract-html', 'analyze-text']
        }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Enhanced JD extractor error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process job description',
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
          message: 'Enhanced JD extractor API is running',
          features: [
            'URL extraction',
            'HTML file upload',
            'Text input analysis',
            'AI-powered analysis',
            'User tier management'
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
    console.error('Enhanced JD extractor GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Analyze job description with AI
 */
async function analyzeJobDescription(content: string) {
  try {
    // Import AI integration dynamically
    const { atsAnalyzer } = await import('@/lib/ats-analyzer-fallback')
    
    // Extract keywords using ATS analyzer
    const keywords = await atsAnalyzer.extractKeywords(content)
    
    // Generate analysis
    const analysis = {
      keywords,
      summary: generateJobSummary(content),
      requirements: extractRequirements(content),
      skills: extractSkills(content),
      experience: extractExperience(content),
      estimatedSalary: estimateSalary(content),
      difficulty: assessDifficulty(content),
      recommendations: generateRecommendations(content)
    }

    return {
      success: true,
      analysis,
      processedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('AI analysis error:', error)
    return {
      success: false,
      error: 'AI analysis failed',
      fallback: generateBasicAnalysis(content)
    }
  }
}

/**
 * Generate basic job summary
 */
function generateJobSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences.slice(0, 3).join('. ') + '.'
}

/**
 * Extract requirements from content
 */
function extractRequirements(content: string): string[] {
  const requirements = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    if (lowerLine.includes('require') || lowerLine.includes('qualif') || lowerLine.includes('must have')) {
      const requirement = line.trim().replace(/^[-•*]\s*/, '')
      if (requirement.length > 10 && requirement.length < 200) {
        requirements.push(requirement)
      }
    }
  }
  
  return requirements.slice(0, 10)
}

/**
 * Extract skills from content
 */
function extractSkills(content: string): string[] {
  const skills = []
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'aws', 'docker',
    'kubernetes', 'sql', 'mongodb', 'git', 'agile', 'scrum', 'leadership',
    'communication', 'project management', 'analytics', 'machine learning'
  ]
  
  const lowerContent = content.toLowerCase()
  
  for (const skill of commonSkills) {
    if (lowerContent.includes(skill)) {
      skills.push(skill)
    }
  }
  
  return skills
}

/**
 * Extract experience requirements
 */
function extractExperience(content: string): string {
  const experiencePattern = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|work|relevant)/i
  const match = content.match(experiencePattern)
  
  if (match) {
    return match[0]
  }
  
  return 'Not specified'
}

/**
 * Estimate salary range
 */
function estimateSalary(content: string): string {
  const salaryPattern = /\$?(\d{1,3}(,\d{3})*(\.\d+)?)(k|k\s*-\s*\d+k|k\s*-\s*\$\d+k|,\d{3})?\s*(year|yr|annual|per\s*year)?/i
  const match = content.match(salaryPattern)
  
  if (match) {
    return match[0]
  }
  
  return 'Not specified'
}

/**
 * Assess job difficulty
 */
function assessDifficulty(content: string): 'Easy' | 'Medium' | 'Hard' {
  const skillCount = extractSkills(content).length
  const experienceMatch = content.match(/\d+\+?\s*years?/i)
  const requirementsCount = extractRequirements(content).length
  
  if (skillCount > 10 || (experienceMatch && parseInt(experienceMatch[0]) > 5) || requirementsCount > 8) {
    return 'Hard'
  } else if (skillCount > 5 || (experienceMatch && parseInt(experienceMatch[0]) > 2) || requirementsCount > 4) {
    return 'Medium'
  } else {
    return 'Easy'
  }
}

/**
 * Generate recommendations for applicants
 */
function generateRecommendations(content: string): string[] {
  const recommendations = []
  const skills = extractSkills(content)
  const experience = extractExperience(content)
  
  if (skills.length > 0) {
    recommendations.push(`Highlight these key skills: ${skills.slice(0, 5).join(', ')}`)
  }
  
  if (!experience.includes('Not specified')) {
    recommendations.push(`Emphasize your ${experience} of relevant experience`)
  }
  
  recommendations.push('Quantify your achievements with specific metrics')
  recommendations.push('Tailor your resume to match the job requirements')
  recommendations.push('Include relevant keywords from the job description')
  
  return recommendations
}

/**
 * Generate basic analysis fallback
 */
function generateBasicAnalysis(content: string) {
  return {
    keywords: extractSkills(content),
    summary: generateJobSummary(content),
    requirements: extractRequirements(content),
    skills: extractSkills(content),
    experience: extractExperience(content),
    estimatedSalary: estimateSalary(content),
    difficulty: assessDifficulty(content),
    recommendations: generateRecommendations(content)
  }
}
