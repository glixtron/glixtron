/**
 * Resume Assessment API
 * Real resume data extraction and personalized career guidance
 */

import { NextRequest, NextResponse } from 'next/server'
import { resumeTextExtractor } from '@/lib/resume-text-extractor'
import { aiCareerGuidance, CareerGuidanceRequest } from '@/lib/ai-career-guidance'
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

    switch (action) {
      case 'upload-resume':
        return await handleResumeUpload(formData)

      case 'analyze-resume':
        return await handleResumeAnalysis(formData)

      case 'generate-questions':
        return await handleGenerateQuestions(formData)

      case 'submit-answers':
        return await handleSubmitAnswers(formData)

      case 'generate-guidance':
        return await handleGenerateGuidance(formData)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['upload-resume', 'analyze-resume', 'generate-questions', 'submit-answers', 'generate-guidance']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Resume assessment API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle resume upload and extraction
 */
async function handleResumeUpload(formData: FormData) {
  try {
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

    // Extract resume data
    const extractionResult = await resumeTextExtractor.extractResumeText(resumeFile)
    
    if (!extractionResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to extract resume data',
        details: extractionResult.error
      }, { status: 500 })
    }

    // Analyze the extracted data
    const analysisResult = await analyzeResumeData(extractionResult.content, extractionResult.metadata?.sections || [])

    return NextResponse.json({
      success: true,
      action: 'upload-resume',
      data: {
        extraction: extractionResult,
        analysis: analysisResult,
        nextStep: 'field-identification'
      }
    })

  } catch (error: any) {
    console.error('Resume upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process resume upload',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle resume analysis
 */
async function handleResumeAnalysis(formData: FormData) {
  try {
    const resumeContent = formData.get('resumeContent') as string
    const identifiedField = formData.get('identifiedField') as string

    if (!resumeContent) {
      return NextResponse.json({
        success: false,
        error: 'Resume content is required'
      }, { status: 400 })
    }

    const analysisResult = await analyzeResumeData(resumeContent)
    
    return NextResponse.json({
      success: true,
      action: 'analyze-resume',
      data: {
        analysis: analysisResult,
        identifiedField: identifiedField || analysisResult.likelyField,
        nextStep: 'generate-questions'
      }
    })

  } catch (error: any) {
    console.error('Resume analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze resume',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle personalized question generation
 */
async function handleGenerateQuestions(formData: FormData) {
  try {
    const resumeContent = formData.get('resumeContent') as string
    const identifiedField = formData.get('identifiedField') as string
    const resumeAnalysis = JSON.parse(formData.get('resumeAnalysis') as string)

    if (!resumeContent || !identifiedField) {
      return NextResponse.json({
        success: false,
        error: 'Resume content and identified field are required'
      }, { status: 400 })
    }

    const questions = await generatePersonalizedQuestions(resumeContent, identifiedField, resumeAnalysis)
    
    return NextResponse.json({
      success: true,
      action: 'generate-questions',
      data: {
        questions,
        field: identifiedField,
        totalQuestions: questions.length,
        nextStep: 'submit-answers'
      }
    })

  } catch (error: any) {
    console.error('Question generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate questions',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle answer submission and generate guidance
 */
async function handleSubmitAnswers(formData: FormData) {
  try {
    const answers = JSON.parse(formData.get('answers') as string)
    const resumeContent = formData.get('resumeContent') as string
    const identifiedField = formData.get('identifiedField') as string
    const resumeAnalysis = JSON.parse(formData.get('resumeAnalysis') as string)

    // Process answers and generate comprehensive guidance
    const guidanceResult = await processAnswersAndGenerateGuidance(
      answers,
      resumeContent,
      identifiedField,
      resumeAnalysis
    )
    
    return NextResponse.json({
      success: true,
      action: 'submit-answers',
      data: guidanceResult
    })

  } catch (error: any) {
    console.error('Answer submission error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process answers',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle final guidance generation
 */
async function handleGenerateGuidance(formData: FormData) {
  try {
    const guidanceRequest: CareerGuidanceRequest = JSON.parse(formData.get('guidanceRequest') as string)
    
    const result = await aiCareerGuidance.generateCareerGuidance(guidanceRequest)
    
    return NextResponse.json({
      success: true,
      action: 'generate-guidance',
      data: result
    })

  } catch (error: any) {
    console.error('Guidance generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate guidance',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Analyze resume data and extract key information
 */
async function analyzeResumeData(content: string, sections: any[] = []) {
  const analysis = {
    personalInfo: extractPersonalInfo(content),
    education: extractEducationInfo(content),
    experience: extractExperienceInfo(content),
    skills: extractSkillsInfo(content),
    projects: extractProjectsInfo(content),
    certifications: extractCertificationsInfo(content),
    likelyField: identifyLikelyField(content, sections),
    experienceLevel: determineExperienceLevel(content),
    careerProgression: analyzeCareerProgression(content),
    strengths: identifyStrengths(content),
    areasForImprovement: identifyAreasForImprovement(content)
  }

  return analysis
}

/**
 * Extract personal information
 */
function extractPersonalInfo(content: string) {
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
 * Extract education information
 */
function extractEducationInfo(content: string) {
  const educationPatterns = [
    /bachelor'?s? in ([a-z\s]+)/gi,
    /master'?s? in ([a-z\s]+)/gi,
    /phd in ([a-z\s]+)/gi,
    /b\.?a\.? in ([a-z\s]+)/gi,
    /m\.?a\.? in ([a-z\s]+)/gi,
    /b\.?s\.? in ([a-z\s]+)/gi,
    /m\.?s\.? in ([a-z\s]+)/gi
  ]

  const degrees = []
  const universities = []

  for (const pattern of educationPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        degrees.push(match.trim())
      })
    }
  }

  const universityPattern = /(?:university|college|institute)\s+([A-Z][a-zA-Z\s]+)/gi
  const universityMatches = content.match(universityPattern)
  
  if (universityMatches) {
    universityMatches.forEach(match => {
      universities.push(match.trim())
    })
  }

  return {
    degrees: [...new Set(degrees)],
    universities: [...new Set(universities)],
    highestDegree: determineHighestDegree(degrees),
    hasEducation: degrees.length > 0
  }
}

/**
 * Extract experience information
 */
function extractExperienceInfo(content: string) {
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
    companies: [...new Set(companies)].slice(0, 10),
    hasExperience: match !== null || companies.length > 0
  }
}

/**
 * Extract skills information
 */
function extractSkillsInfo(content: string) {
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'ci/cd',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql',
    'machine learning', 'ai', 'data science', 'analytics', 'tensorflow',
    'html', 'css', 'typescript', 'webpack', 'babel', 'jest',
    'physics', 'chemistry', 'biology', 'mathematics', 'statistics',
    'lab techniques', 'research methods', 'data analysis', 'experimental design'
  ]

  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'project management', 'analytical', 'critical thinking', 'creativity',
    'adaptability', 'time management', 'collaboration', 'negotiation'
  ]

  const lowerContent = content.toLowerCase()
  
  const foundTechnical = technicalSkills.filter(skill => lowerContent.includes(skill))
  const foundSoft = softSkills.filter(skill => lowerContent.includes(skill))

  return {
    technical: foundTechnical,
    soft: foundSoft,
    all: [...foundTechnical, ...foundSoft],
    totalSkills: foundTechnical.length + foundSoft.length
  }
}

/**
 * Extract projects information
 */
function extractProjectsInfo(content: string) {
  const projectPatterns = [
    /project:\s*([A-Z][a-zA-Z0-9\s]+)/gi,
    /developed\s+([a-zA-Z0-9\s]+)/gi,
    /created\s+([a-zA-Z0-9\s]+)/gi,
    /built\s+([a-zA-Z0-9\s]+)/gi
  ]

  const projects = []
  
  projectPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const project = match.split(':')[1]?.trim() || match.split(' ')[1]?.trim()
        if (project && project.length > 5 && project.length < 100) {
          projects.push(project)
        }
      })
    }
  })

  return {
    projects: [...new Set(projects)].slice(0, 10),
    hasProjects: projects.length > 0
  }
}

/**
 * Extract certifications information
 */
function extractCertificationsInfo(content: string) {
  const certificationPatterns = [
    /certified\s+([a-zA-Z0-9\s]+)/gi,
    /certificate:\s*([A-Z][a-zA-Z0-9\s]+)/gi,
    /([A-Z][a-zA-Z\s]+)\s+certification/gi
  ]

  const certifications = []
  
  certificationPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const cert = match.split(':')[1]?.trim() || match.split(' ')[0]?.trim()
        if (cert && cert.length > 5 && cert.length < 100) {
          certifications.push(cert)
        }
      })
    }
  })

  return {
    certifications: [...new Set(certifications)].slice(0, 10),
    hasCertifications: certifications.length > 0
  }
}

/**
 * Identify likely field based on content
 */
function identifyLikelyField(content: string, sections: any[]) {
  const fieldKeywords = {
    'physics': ['physics', 'quantum', 'mechanics', 'thermodynamics', 'optics', 'electromagnetism'],
    'chemistry': ['chemistry', 'chemical', 'organic', 'inorganic', 'analytical', 'biochemistry'],
    'biology': ['biology', 'biological', 'genetics', 'molecular', 'cellular', 'biotechnology'],
    'mathematics': ['mathematics', 'math', 'statistics', 'calculus', 'algebra', 'geometry'],
    'computer-science': ['computer', 'software', 'programming', 'development', 'coding', 'algorithm'],
    'environmental-science': ['environmental', 'climate', 'sustainability', 'ecology', 'conservation']
  }

  const lowerContent = content.toLowerCase()
  const scores = {}

  for (const [field, keywords] of Object.entries(fieldKeywords)) {
    scores[field] = keywords.filter(keyword => lowerContent.includes(keyword)).length
  }

  const likelyField = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0]

  return likelyField
}

/**
 * Determine experience level
 */
function determineExperienceLevel(content: string) {
  const experiencePattern = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|work)/i
  const match = content.match(experiencePattern)
  
  if (!match) return 'Entry-level'
  
  const years = parseInt(match[1])
  
  if (years < 2) return 'Entry-level'
  if (years < 5) return 'Mid-level'
  if (years < 10) return 'Senior-level'
  return 'Executive-level'
}

/**
 * Analyze career progression
 */
function analyzeCareerProgression(content: string) {
  const progressionIndicators = [
    'promoted', 'lead', 'senior', 'manager', 'director', 'head', 'chief',
    'advanced', 'principal', 'expert', 'specialist', 'consultant'
  ]

  const lowerContent = content.toLowerCase()
  const foundIndicators = progressionIndicators.filter(indicator => 
    lowerContent.includes(indicator)
  )

  return {
    hasProgression: foundIndicators.length > 0,
    indicators: foundIndicators,
    progressionScore: Math.min(foundIndicators.length * 10, 50)
  }
}

/**
 * Identify strengths from resume
 */
function identifyStrengths(content: string) {
  const strengthIndicators = [
    'achieved', 'improved', 'increased', 'reduced', 'optimized', 'developed',
    'led', 'managed', 'created', 'implemented', 'launched', 'completed',
    'awarded', 'recognized', 'published', 'patented', 'invented'
  ]

  const lowerContent = content.toLowerCase()
  const foundStrengths = strengthIndicators.filter(indicator => 
    lowerContent.includes(indicator)
  )

  return {
    indicators: foundStrengths,
    strengthScore: Math.min(foundStrengths.length * 5, 25),
    keyStrengths: foundStrengths.slice(0, 10)
  }
}

/**
 * Identify areas for improvement
 */
function identifyAreasForImprovement(content: string) {
  const improvementAreas = []
  
  if (!content.includes('project')) {
    improvementAreas.push('Add specific projects with measurable outcomes')
  }
  
  if (!content.includes('achieved') && !content.includes('improved')) {
    improvementAreas.push('Include quantifiable achievements and metrics')
  }
  
  if (!content.includes('skill') || !content.includes('skills')) {
    improvementAreas.push('Add a dedicated skills section')
  }
  
  if (!content.includes('education') && !content.includes('degree')) {
    improvementAreas.push('Include educational background')
  }

  return {
    areas: improvementAreas,
    improvementNeeded: improvementAreas.length > 0
  }
}

/**
 * Generate personalized questions based on resume data
 */
async function generatePersonalizedQuestions(resumeContent: string, field: string, resumeAnalysis: any) {
  // Import field questions dynamically
  const { getFieldQuestions } = await import('@/lib/field-questions')
  
  const fieldSpecificQuestions = getFieldQuestions(field)
  
  // Add some personalized questions based on resume analysis
  const personalizedQuestions = [
    {
      id: 'career_goals',
      question: `Based on your background in ${field.replace('-', ' ')}, what are your long-term career goals?`,
      type: 'text' as const,
      category: 'goals' as const
    },
    {
      id: 'current_skills',
      question: 'What specific skills do you want to develop further based on your current experience?',
      type: 'text' as const,
      category: 'skills' as const
    }
  ]

  return [...fieldSpecificQuestions, ...personalizedQuestions]
}

/**
 * Process answers and generate guidance
 */
async function processAnswersAndGenerateGuidance(
  answers: any,
  resumeContent: string,
  identifiedField: string,
  resumeAnalysis: any
) {
  // Process answers and create comprehensive guidance request
  const guidanceRequest: CareerGuidanceRequest = {
    studentProfile: {
      name: 'Student',
      education: resumeAnalysis.education.degrees.join(', ') || 'Not specified',
      scienceStream: identifiedField,
      interests: answers.interests || [],
      skills: resumeAnalysis.skills.all,
      experience: resumeAnalysis.experience.totalYears + ' years',
      careerGoals: answers.career_goals || 'Not specified'
    },
    assessmentResults: {
      personalityType: 'Analytical',
      aptitudeScores: {
        technical: resumeAnalysis.skills.technical.length * 10,
        analytical: resumeAnalysis.strengths.strengthScore,
        communication: resumeAnalysis.skills.soft.length * 8
      },
      interests: answers.interests || []
    }
  }

  const result = await aiCareerGuidance.generateCareerGuidance(guidanceRequest)
  
  return {
    answers,
    resumeAnalysis,
    guidance: result,
    personalizedRoadmap: generatePersonalizedRoadmap(answers, identifiedField, resumeAnalysis)
  }
}

/**
 * Generate personalized roadmap
 */
function generatePersonalizedRoadmap(answers: any, field: string, resumeAnalysis: any) {
  return {
    immediate: [
      {
        title: 'Skill Enhancement',
        description: 'Focus on developing key skills in your field',
        timeline: '1-3 months',
        priority: 'high'
      }
    ],
    shortTerm: [
      {
        title: 'Project Building',
        description: 'Create portfolio projects to demonstrate expertise',
        timeline: '3-6 months',
        priority: 'medium'
      }
    ],
    longTerm: [
      {
        title: 'Career Advancement',
        description: 'Pursue advanced roles or specialized positions',
        timeline: '1-2 years',
        priority: 'medium'
      }
    ]
  }
}

/**
 * Helper functions
 */
function determineHighestDegree(degrees: string[]): string {
  if (degrees.some(d => d.toLowerCase().includes('phd'))) return 'PhD'
  if (degrees.some(d => d.toLowerCase().includes('master'))) return 'Master\'s'
  if (degrees.some(d => d.toLowerCase().includes('bachelor'))) return 'Bachelor\'s'
  return 'Not specified'
}
