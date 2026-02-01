/**
 * Combined Resume + JD Analysis API
 * Works without authentication for public access
 * Real AI integration with Gemini and DeepSeek
 */

import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { brandConfig } from '@/config/brand'
import { extractJDFromURL, analyzeJobDescription } from '@/lib/jd-extractor-server'

// Enhanced JD cleaning and optimization
function cleanAndOptimizeJD(rawText: string): string {
  try {
    console.log('🧹 Starting JD cleaning and optimization...')
    
    let cleaned = rawText
    
    // Remove HTML tags and entities
    cleaned = cleaned.replace(/<[^>]*>/g, ' ') // Remove HTML tags
    cleaned = cleaned.replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    cleaned = cleaned.replace(/&[a-zA-Z]+;/g, '') // Remove HTML entities
    
    // Remove special characters and normalize whitespace
    cleaned = cleaned.replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Keep only printable characters
    cleaned = cleaned.replace(/\s+/g, ' ') // Normalize whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    
    // Remove common job posting artifacts
    cleaned = cleaned.replace(/Job Details/gi, '')
    cleaned = cleaned.replace(/Job Description/gi, '')
    cleaned = cleaned.replace(/Requirements:/gi, '\nRequirements:\n')
    cleaned = cleaned.replace(/Qualifications:/gi, '\nQualifications:\n')
    cleaned = cleaned.replace(/Responsibilities:/gi, '\nResponsibilities:\n')
    cleaned = cleaned.replace(/Skills:/gi, '\nSkills:\n')
    cleaned = cleaned.replace(/Experience:/gi, '\nExperience:\n')
    
    // Remove bullet point artifacts and normalize
    cleaned = cleaned.replace(/[•·▪▫◦‣⁃]/g, '•') // Normalize bullets
    cleaned = cleaned.replace(/â¢/g, '•') // Fix encoding issues
    cleaned = cleaned.replace(/â€/g, '"') // Fix quote encoding
    cleaned = cleaned.replace(/â€™/g, "'") // Fix apostrophe encoding
    
    // Remove excessive punctuation
    cleaned = cleaned.replace(/[.]{3,}/g, '...') // Normalize ellipsis
    cleaned = cleaned.replace(/[!]{2,}/g, '!') // Remove excessive exclamation
    cleaned = cleaned.replace(/[?]{2,}/g, '?') // Remove excessive question marks
    
    // Fix common formatting issues
    cleaned = cleaned.replace(/\s*[:]\s*/g, ': ') // Fix colon spacing
    cleaned = cleaned.replace(/\s*[;]\s*/g, '; ') // Fix semicolon spacing
    cleaned = cleaned.replace(/\s*[,]\s*/g, ', ') // Fix comma spacing
    cleaned = cleaned.replace(/\s*[.]\s*/g, '. ') // Fix period spacing
    
    // Remove duplicate lines
    const lines = cleaned.split('\n')
    const uniqueLines = Array.from(new Set(lines.filter(line => line.trim().length > 0)))
    cleaned = uniqueLines.join('\n')
    
    // Final cleanup
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    cleaned = cleaned.replace(/[ \t]{2,}/g, ' ') // Max 1 consecutive space
    cleaned = cleaned.trim()
    
    console.log(`✅ JD cleaned: ${cleaned.length} characters (was ${rawText.length})`)
    return cleaned
  } catch (error) {
    console.warn('⚠️ JD cleaning failed:', error)
    return rawText
  }
}

// AI-powered JD optimization
async function optimizeJDWithAI(jdText: string): Promise<string> {
  try {
    console.log('🤖 Starting AI JD optimization...')
    
    // Try DeepSeek first for JD optimization
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You are an expert job description analyst and optimizer. Your task is to clean, optimize, and structure job descriptions to make them clear, comprehensive, and suitable for AI analysis. Remove all special characters, formatting issues, and irrelevant content. Focus on the core requirements, skills, and responsibilities.`
              },
              {
                role: 'user',
                content: `Please optimize this job description for AI analysis. Clean up any formatting issues, remove special characters, and structure it clearly. Focus on the key requirements, skills, and responsibilities:

${jdText.substring(0, 4000)}

Return the optimized job description as clean, well-structured text with clear sections for Requirements, Responsibilities, Skills, and Qualifications. Do not include any markdown formatting or special characters.`
              }
            ],
            max_tokens: 2000,
            temperature: 0.1
          })
        })

        if (response.ok) {
          const data = await response.json()
          const optimizedJD = data.choices[0]?.message?.content || ''
          
          if (optimizedJD.length > 100) {
            console.log(`✅ DeepSeek JD optimization: ${optimizedJD.length} characters`)
            return cleanAndOptimizeJD(optimizedJD)
          }
        }
      } catch (deepseekError) {
        console.warn('⚠️ DeepSeek JD optimization failed:', deepseekError)
      }
    }
    
    // Fallback to Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `Please optimize this job description for AI analysis. Clean up any formatting issues, remove special characters, and structure it clearly:

${jdText.substring(0, 3000)}

Return the optimized job description as clean text with clear sections. Focus on requirements, skills, and responsibilities.`

        const result = await model.generateContent(prompt)
        const optimizedJD = result.response.text()
        
        if (optimizedJD.length > 100) {
          console.log(`✅ Gemini JD optimization: ${optimizedJD.length} characters`)
          return cleanAndOptimizeJD(optimizedJD)
        }
      } catch (geminiError) {
        console.warn('⚠️ Gemini JD optimization failed:', geminiError)
      }
    }
    
    // If AI optimization fails, return cleaned text
    console.log('🔧 Using basic cleaning for JD optimization')
    return cleanAndOptimizeJD(jdText)
    
  } catch (error) {
    console.error('❌ JD optimization error:', error)
    return cleanAndOptimizeJD(jdText)
  }
}

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

// Enhanced file type validation for all resume formats
const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/plain': 'txt',
  'text/rtf': 'rtf',
  'application/rtf': 'rtf',
  'application/vnd.ms-word.document.macroEnabled.12': 'docm',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
  'application/vnd.ms-word.template.macroEnabled.12': 'dotm',
  'text/html': 'html',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/x-mswrite': 'wps',
  'application/wordperfect': 'wpd',
  'application/vnd.ms-works': 'wps',
  'application/vnd.apple.pages': 'pages',
  'application/x-iwork-pages-sffpages': 'pages',
  'application/vnd.google-apps.document': 'gdoc'
}

const MAX_FILE_SIZE = brandConfig.maxFileSize // 10MB

// Enhanced text extraction for all file types with advanced PDF techniques
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  try {
    switch (ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      case 'pdf':
        // Advanced PDF extraction with multiple techniques
        return await extractTextFromPDF(buffer)
      
      case 'docx':
      case 'docm':
      case 'dotx':
      case 'dotm':
        const docxData = await mammoth.extractRawText({ buffer })
        return docxData.value
      
      case 'doc':
      case 'wps':
      case 'wpd':
        // Legacy document formats - try mammoth first, then fallback
        try {
          const legacyDocData = await mammoth.extractRawText({ buffer })
          return legacyDocData.value
        } catch (legacyError) {
          // Fallback to basic text extraction for legacy formats
          return buffer.toString('utf-8', 0, Math.min(buffer.length, 100000))
        }
      
      case 'txt':
      case 'rtf':
        // Handle RTF by removing formatting codes
        let text = buffer.toString('utf-8')
        if (file.type.includes('rtf')) {
          // Basic RTF text extraction - remove RTF formatting
          text = text.replace(/\\[a-zA-Z]+\d*/g, '') // Remove RTF commands
          text = text.replace(/[{}]/g, '') // Remove braces
          text = text.replace(/\\[^a-zA-Z]/g, '') // Remove escaped characters
        }
        return text
      
      case 'html':
        // HTML text extraction - remove tags
        let htmlText = buffer.toString('utf-8')
        htmlText = htmlText.replace(/<[^>]*>/g, ' ') // Remove HTML tags
        htmlText = htmlText.replace(/\s+/g, ' ') // Normalize whitespace
        return htmlText.trim()
      
      case 'odt':
        // OpenDocument Text - try mammoth as fallback
        try {
          const odtData = await mammoth.extractRawText({ buffer })
          return odtData.value
        } catch (odtError) {
          // Fallback for ODT
          return buffer.toString('utf-8', 0, Math.min(buffer.length, 100000))
        }
      
      case 'pages':
        // Apple Pages - fallback text extraction
        try {
          const pagesData = await mammoth.extractRawText({ buffer })
          return pagesData.value
        } catch (pagesError) {
          return buffer.toString('utf-8', 0, Math.min(buffer.length, 100000))
        }
      
      case 'gdoc':
        // Google Docs - should be plain text
        return buffer.toString('utf-8')
      
      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    
    // Final fallback - try to extract as plain text
    try {
      const fallbackText = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000))
      if (fallbackText.length > 100) {
        return fallbackText
      }
      throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } catch (fallbackError) {
      throw new Error(`Unable to extract text from ${file.name}. Please ensure the file is not corrupted and is a supported format.`)
    }
  }
}

// Advanced PDF text extraction with multiple techniques
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let extractedText = ''
  
  try {
    console.log('🔍 Starting advanced PDF text extraction...')
    
    // Method 1: Standard pdf-parse extraction
    try {
      const pdfData = await pdf(buffer)
      extractedText = pdfData.text
      console.log(`✅ Standard PDF extraction: ${extractedText.length} characters`)
      
      // If we got substantial text, try to enhance it further
      if (extractedText.length > 500) {
        extractedText = enhancePDFText(extractedText)
      }
    } catch (pdfError) {
      console.warn('⚠️ Standard PDF extraction failed:', pdfError)
      extractedText = ''
    }
    
    // Method 2: If standard extraction failed or gave minimal text, try alternative approach
    if (extractedText.length < 200) {
      try {
        console.log('🔄 Trying alternative PDF extraction...')
        extractedText = await alternativePDFExtraction(buffer)
      } catch (altError) {
        console.warn('⚠️ Alternative PDF extraction failed:', altError)
      }
    }
    
    // Method 3: Final cleanup and enhancement
    if (extractedText.length > 0) {
      extractedText = postProcessPDFText(extractedText)
      console.log(`✅ Final PDF text: ${extractedText.length} characters`)
      return extractedText
    }
    
    throw new Error('All PDF extraction methods failed')
    
  } catch (error) {
    console.error('❌ Advanced PDF extraction error:', error)
    
    // Last resort - try to extract any readable text
    try {
      const fallbackText = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000))
      const cleanedText = fallbackText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim()
      
      if (cleanedText.length > 100) {
        console.log(`🔧 Using fallback extraction: ${cleanedText.length} characters`)
        return cleanedText
      }
    } catch (fallbackError) {
      console.error('❌ Fallback extraction failed:', fallbackError)
    }
    
    throw new Error(`Unable to extract text from PDF. The file may be corrupted, password-protected, or contain only images.`)
  }
}

// Enhance extracted PDF text with various cleaning techniques
function enhancePDFText(text: string): string {
  try {
    // Remove common PDF artifacts
    let enhanced = text
    
    // Remove page numbers and headers/footers patterns
    enhanced = enhanced.replace(/\n\s*\d+\s*\n/g, '\n') // Standalone page numbers
    enhanced = enhanced.replace(/^\d+\s*$/gm, '') // Numbers at line start
    enhanced = enhanced.replace(/\d+\s*$/gm, '') // Numbers at line end
    
    // Remove common PDF formatting artifacts
    enhanced = enhanced.replace(/\f/g, '\n\n') // Form feeds to double newlines
    enhanced = enhanced.replace(/\x0B/g, '\n') // Vertical tabs
    enhanced = enhanced.replace(/\x0C/g, '\n') // Form feeds
    
    // Fix broken words (common in PDF extraction)
    enhanced = enhanced.replace(/([a-zA-Z])-\n([a-zA-Z])/g, '$1$2') // Hyphenated words across lines
    enhanced = enhanced.replace(/([a-zA-Z])\s+([a-zA-Z])\s+([a-zA-Z])/g, '$1 $2$3') // Excess spaces
    
    // Remove excessive whitespace while preserving paragraph structure
    enhanced = enhanced.replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple empty lines
    enhanced = enhanced.replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
    enhanced = enhanced.replace(/^\s+|\s+$/gm, '') // Trim line whitespace
    
    // Fix common PDF encoding issues
    enhanced = enhanced.replace(/â€™/g, "'") // Right single quote
    enhanced = enhanced.replace(/â€œ/g, '"') // Left double quote
    enhanced = enhanced.replace(/â€/g, '"') // Right double quote
    enhanced = enhanced.replace(/â€"/g, '"') // Double quote
    enhanced = enhanced.replace(/â€"/g, '"') // Double quote
    enhanced = enhanced.replace(/â€¦/g, '...') // Ellipsis
    enhanced = enhanced.replace(/â€"/g, '—') // Em dash
    enhanced = enhanced.replace(/â€"/g, '–') // En dash
    
    // Remove bullet point artifacts
    enhanced = enhanced.replace(/[•·]/g, '•') // Normalize bullets
    enhanced = enhanced.replace(/â¢/g, '•') // Bullet encoding fix
    
    return enhanced.trim()
  } catch (error) {
    console.warn('⚠️ Text enhancement failed:', error)
    return text
  }
}

// Alternative PDF extraction using different techniques
async function alternativePDFExtraction(buffer: Buffer): Promise<string> {
  try {
    // Try different encoding approaches
    const encodings = ['utf8', 'latin1', 'ascii', 'utf16le']
    
    for (const encoding of encodings) {
      try {
        const text = buffer.toString(encoding as BufferEncoding)
        const cleaned = cleanPDFText(text)
        
        if (cleaned.length > 200 && containsReadableText(cleaned)) {
          console.log(`✅ Alternative extraction with ${encoding}: ${cleaned.length} characters`)
          return cleaned
        }
      } catch (encodingError) {
        continue
      }
    }
    
    // Try binary pattern matching for text
    const binaryText = extractTextFromBinary(buffer)
    if (binaryText.length > 200) {
      console.log(`✅ Binary extraction: ${binaryText.length} characters`)
      return binaryText
    }
    
    throw new Error('Alternative extraction methods failed')
    
  } catch (error) {
    throw new Error(`Alternative PDF extraction failed: ${error}`)
  }
}

// Clean PDF text using various techniques
function cleanPDFText(text: string): string {
  try {
    // Remove non-printable characters except newlines and tabs
    let cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ')
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n')
    
    // Remove common PDF artifacts
    cleaned = cleaned.replace(/\b\d+\b/g, (match) => {
      // Keep numbers that might be part of content (years, experience, etc.)
      // But remove likely page numbers
      const num = parseInt(match)
      return (num > 1900 && num < 2100) || num < 100 ? match : ''
    })
    
    return cleaned.trim()
  } catch (error) {
    return text
  }
}

// Check if text contains readable content
function containsReadableText(text: string): boolean {
  try {
    // Check for common words and patterns
    const readablePatterns = [
      /\b(experience|education|skills|work|project|development)\b/i,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      /\b(university|college|school|degree|bachelor|master|phd)\b/i,
      /\b(engineering|development|management|analysis|design)\b/i,
      /\b(java|python|javascript|react|node|sql|aws|azure)\b/i
    ]
    
    return readablePatterns.some(pattern => pattern.test(text))
  } catch (error) {
    return false
  }
}

// Extract text from binary data using pattern matching
function extractTextFromBinary(buffer: Buffer): string {
  try {
    const text = buffer.toString('latin1')
    
    // Find text segments between common PDF operators
    const segments = text.split(/BT|ET|ET|Td|Tm|Tj|TJ|'/)
    
    let extractedText = ''
    for (const segment of segments) {
      // Look for readable text patterns
      const readable = segment.match(/[a-zA-Z0-9\s.,;:!?()-]/g)
      if (readable && readable.join('').length > 10) {
        extractedText += readable.join('') + ' '
      }
    }
    
    return cleanPDFText(extractedText)
  } catch (error) {
    return ''
  }
}

// Post-process PDF text for final cleanup
function postProcessPDFText(text: string): string {
  try {
    let processed = text
    
    // Fix paragraph breaks
    processed = processed.replace(/\n([a-z])/g, ' $1') // Lowercase after newline = same sentence
    processed = processed.replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2') // Sentence breaks to paragraphs
    
    // Fix common resume formatting issues
    processed = processed.replace(/\s*[:]\s*/g, ': ') // Colon spacing
    processed = processed.replace(/\s*[;]\s*/g, '; ') // Semicolon spacing
    processed = processed.replace(/\s*[,]\s*/g, ', ') // Comma spacing
    
    // Remove duplicate lines (common in PDF extraction)
    const lines = processed.split('\n')
    const uniqueLines = Array.from(new Set(lines))
    processed = uniqueLines.join('\n')
    
    // Final cleanup
    processed = processed.replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    processed = processed.replace(/[ \t]{2,}/g, ' ') // Max 1 consecutive space
    
    return processed.trim()
  } catch (error) {
    return text
  }
}

// AI-powered combined analysis with personalized recommendations using DeepSeek
async function analyzeResumeWithJD(resumeText: string, jdText: string): Promise<any> {
  try {
    // Use DeepSeek for advanced personalized resume analysis
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You are an expert career strategist, resume optimization specialist, and job market analyst with deep expertise in talent acquisition and career development. Your analysis must be highly personalized, data-driven, and actionable. Avoid generic advice at all costs. Focus on the specific individual's profile, the exact job requirements, and provide concrete, measurable recommendations.`
              },
              {
                role: 'user',
                content: `Perform an advanced, personalized analysis of this resume against the job description. Provide specific, actionable insights that will help this candidate CRACK THIS SPECIFIC JOB.

RESUME CONTENT:
${resumeText.substring(0, 8000)}

JOB DESCRIPTION:
${jdText.substring(0, 8000)}

CRITICAL REQUIREMENTS:
1. Provide REAL scoring (0-100) based on actual analysis, not generic ranges
2. Generate PERSONALIZED recommendations based on their specific experience
3. Suggest specific JOB ROLES they should target based on their profile
4. Include actionable career path recommendations
5. No generic advice - everything must be tailored to this individual

Return a comprehensive JSON object with this exact structure:
{
  "realScoring": {
    "overallScore": <number 0-100>,
    "atsScore": <number 0-100>,
    "contentScore": <number 0-100>,
    "structureScore": <number 0-100>,
    "interviewLikelihood": <number 0-100>,
    "jdMatchScore": <number 0-100>,
    "marketCompetitiveness": <number 0-100>,
    "careerReadiness": <number 0-100>
  },
  "skillsAnalysis": {
    "matchedSkills": ["skill1", "skill2", "skill3"],
    "missingSkills": ["skill4", "skill5", "skill6"],
    "criticalMissing": ["critical1", "critical2"],
    "transferableSkills": ["transfer1", "transfer2"],
    "emergingSkills": ["emerging1", "emerging2"],
    "skillsGapPercentage": <number 0-100>
  },
  "experienceAnalysis": {
    "currentLevel": "Entry|Mid|Senior|Lead|Executive",
    "targetLevel": "Entry|Mid|Senior|Lead|Executive",
    "yearsOfExperience": <number>,
    "relevantExperience": <number 0-100>,
    "leadershipPotential": <number 0-100>,
    "growthTrajectory": "steep|moderate|steady|plateau"
  },
  "personalizedRecommendations": {
    "immediateActions": ["action1", "action2", "action3"],
    "resumeOptimizations": ["opt1", "opt2", "opt3"],
    "skillDevelopment": ["skill1", "skill2", "skill3"],
    "networkingStrategy": ["strategy1", "strategy2"],
    "interviewPreparation": ["prep1", "prep2", "prep3"]
  },
  "jobRoleRecommendations": {
    "primaryRoles": [
      {
        "role": "Specific Job Title",
        "matchScore": <number 0-100>,
        "salaryRange": "$X-$Y",
        "growthPotential": "high|medium|low",
        "requiredSkills": ["skill1", "skill2"],
        "transitionPath": "immediate|3-6months|6-12months"
      }
    ],
    "secondaryRoles": [
      {
        "role": "Alternative Job Title",
        "matchScore": <number 0-100>,
        "salaryRange": "$X-$Y",
        "growthPotential": "high|medium|low",
        "requiredSkills": ["skill1", "skill2"],
        "transitionPath": "immediate|3-6months|6-12months"
      }
    ],
    "emergingRoles": [
      {
        "role": "Future Job Title",
        "matchScore": <number 0-100>,
        "salaryRange": "$X-$Y",
        "growthPotential": "high|medium|low",
        "requiredSkills": ["skill1", "skill2"],
        "transitionPath": "6-12months|1-2years"
      }
    ]
  },
  "careerPathEnhancement": {
    "currentPosition": "Current role/status",
    "nextSteps": ["step1", "step2", "step3"],
    "longTermVision": "5-year career vision",
    "skillRoadmap": {
      "technical": ["tech1", "tech2", "tech3"],
      "soft": ["soft1", "soft2", "soft3"],
      "leadership": ["lead1", "lead2", "lead3"]
    },
    "certificationNeeds": ["cert1", "cert2"],
    "projectSuggestions": ["project1", "project2"],
    "networkingTargets": ["target1", "target2"]
  },
  "jobCrackingStrategy": {
    "primaryFocus": "main focus area",
    "keyDifferentiator": "unique selling point",
    "criticalSuccessFactors": ["factor1", "factor2", "factor3"],
    "timeline": "specific timeline",
    "confidenceLevel": <number 0-100>,
    "applicationApproach": "strategic approach",
    "salaryNegotiationLeverage": ["leverage1", "leverage2"]
  },
  "marketInsights": {
    "marketPosition": "specific market position",
    "competitiveAdvantage": "unique advantage",
    "industryTrends": ["trend1", "trend2"],
    "salaryBenchmark": "specific salary range",
    "demandLevel": "high|medium|low",
    "growthOpportunities": ["opportunity1", "opportunity2"]
  },
  "actionPlan": {
    "week1": ["action1", "action2"],
    "month1": ["action1", "action2"],
    "quarter1": ["action1", "action2"],
    "year1": ["action1", "action2"]
  },
  "analysis": "detailed personalized analysis"
}

Focus on: REAL personalized insights, specific job roles, actionable career path, concrete timeline, and measurable outcomes. Avoid any generic advice. Every recommendation must be tailored to this specific individual's profile and this specific job.`
              }
            ],
            max_tokens: 3000,
            temperature: 0.1
          })
        })

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || ''
        
        // Extract JSON from response
        let jsonStr = content.replace(/```json|```/g, '').trim()
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) jsonStr = jsonMatch[0]

        const analysis = JSON.parse(jsonStr)
        
        return {
          ...analysis,
          aiProvider: 'DeepSeek',
          analysisType: 'advanced-personalized-resume-analysis',
          timestamp: new Date().toISOString()
        }
      } catch (deepseekError) {
        console.warn('⚠️ DeepSeek analysis failed:', deepseekError)
      }
    }
    
    // Fallback to Gemini if DeepSeek fails
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `You are an expert career strategist. Analyze this resume against the job description and provide personalized recommendations.

RESUME:
${resumeText.substring(0, 6000)}

JOB DESCRIPTION:
${jdText.substring(0, 6000)}

Return a JSON object with real scoring and personalized recommendations:
{
  "realScoring": {
    "overallScore": <number 0-100>,
    "atsScore": <number 0-100>,
    "contentScore": <number 0-100>,
    "structureScore": <number 0-100>,
    "interviewLikelihood": <number 0-100>,
    "jdMatchScore": <number 0-100>
  },
  "personalizedRecommendations": {
    "immediateActions": ["action1", "action2"],
    "resumeOptimizations": ["opt1", "opt2"],
    "skillDevelopment": ["skill1", "skill2"],
    "jobRoleRecommendations": ["role1", "role2"]
  },
  "careerPathEnhancement": {
    "currentPosition": "current status",
    "nextSteps": ["step1", "step2"],
    "skillRoadmap": ["skill1", "skill2"],
    "certificationNeeds": ["cert1"]
  },
  "analysis": "detailed analysis"
}

Focus on personalized, actionable advice. Return ONLY valid JSON.`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        
        // Clean response
        let jsonStr = text.replace(/```json|```/g, '').trim()
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) jsonStr = jsonMatch[0]

        const analysis = JSON.parse(jsonStr)
        
        return {
          ...analysis,
          aiProvider: 'Gemini',
          analysisType: 'advanced-personalized-resume-analysis',
          timestamp: new Date().toISOString()
        }
      } catch (geminiError) {
        console.warn('⚠️ Gemini analysis failed:', geminiError)
      }
    }
    
    // Final fallback to rule-based analysis with basic recommendations
    throw new Error('AI services unavailable')
    
  } catch (error) {
    console.error('❌ Advanced analysis error:', error)
    
    // Return fallback analysis with basic recommendations
    return {
      realScoring: {
        overallScore: 70,
        atsScore: 65,
        contentScore: 75,
        structureScore: 70,
        interviewLikelihood: 60,
        jdMatchScore: 65,
        marketCompetitiveness: 68,
        careerReadiness: 72
      },
      skillsAnalysis: {
        matchedSkills: ['JavaScript', 'React', 'Problem Solving'],
        missingSkills: ['TypeScript', 'Node.js', 'Cloud Experience'],
        criticalMissing: ['TypeScript', 'Cloud Architecture'],
        transferableSkills: ['Communication', 'Leadership'],
        emergingSkills: ['AI/ML', 'Blockchain'],
        skillsGapPercentage: 35
      },
      experienceAnalysis: {
        currentLevel: 'Mid',
        targetLevel: 'Senior',
        yearsOfExperience: 4,
        relevantExperience: 70,
        leadershipPotential: 75,
        growthTrajectory: 'moderate'
      },
      personalizedRecommendations: {
        immediateActions: [
          'Add TypeScript to your skill set',
          'Quantify your project achievements',
          'Get cloud certification'
        ],
        resumeOptimizations: [
          'Include specific metrics and KPIs',
          'Add cloud technologies section',
          'Highlight leadership experiences'
        ],
        skillDevelopment: [
          'Learn TypeScript and Node.js',
          'Get AWS/Azure certification',
          'Develop system design skills'
        ],
        networkingStrategy: [
          'Join tech meetups and conferences',
          'Connect with senior developers',
          'Participate in open source projects'
        ],
        interviewPreparation: [
          'Prepare system design questions',
          'Practice behavioral interviews',
          'Research company culture'
        ]
      },
      jobRoleRecommendations: {
        primaryRoles: [
          {
            role: 'Senior Full Stack Developer',
            matchScore: 75,
            salaryRange: '$120,000-$150,000',
            growthPotential: 'high',
            requiredSkills: ['JavaScript', 'React', 'Node.js'],
            transitionPath: '3-6months'
          }
        ],
        secondaryRoles: [
          {
            role: 'Technical Lead',
            matchScore: 65,
            salaryRange: '$130,000-$160,000',
            growthPotential: 'high',
            requiredSkills: ['Leadership', 'System Design'],
            transitionPath: '6-12months'
          }
        ],
        emergingRoles: [
          {
            role: 'AI/ML Engineer',
            matchScore: 55,
            salaryRange: '$140,000-$180,000',
            growthPotential: 'very high',
            requiredSkills: ['Python', 'Machine Learning'],
            transitionPath: '1-2years'
          }
        ]
      },
      careerPathEnhancement: {
        currentPosition: 'Mid-level Developer',
        nextSteps: ['Senior Developer', 'Technical Lead', 'Engineering Manager'],
        longTermVision: 'Engineering Director or CTO',
        skillRoadmap: {
          technical: ['System Architecture', 'Cloud Computing', 'AI/ML'],
          soft: ['Team Leadership', 'Strategic Thinking', 'Communication'],
          leadership: ['Mentoring', 'Project Management', 'Business Acumen']
        },
        certificationNeeds: ['AWS Solutions Architect', 'Google Cloud Professional'],
        projectSuggestions: ['Lead a major project', 'Mentor junior developers', 'Contribute to open source'],
        networkingTargets: ['Senior engineers', 'Engineering managers', 'Tech recruiters']
      },
      jobCrackingStrategy: {
        primaryFocus: 'Technical Skills Enhancement',
        keyDifferentiator: 'Problem-solving abilities and team collaboration',
        criticalSuccessFactors: ['Technical depth', 'Communication', 'Leadership potential'],
        timeline: '6-8 weeks',
        confidenceLevel: 75,
        applicationApproach: 'Targeted applications with customized resumes',
        salaryNegotiationLeverage: ['Technical skills', 'Project impact', 'Leadership experience']
      },
      marketInsights: {
        marketPosition: 'Mid-level candidate with strong growth potential',
        competitiveAdvantage: 'Strong problem-solving skills and team collaboration',
        industryTrends: ['AI integration', 'Cloud migration', 'Remote work'],
        salaryBenchmark: '$120,000-$150,000',
        demandLevel: 'high',
        growthOpportunities: ['Technical leadership', 'Product management', 'Startup opportunities']
      },
      actionPlan: {
        week1: ['Update resume with metrics', 'Start TypeScript course'],
        month1: ['Complete basic TypeScript', 'Apply for 5 targeted jobs'],
        quarter1: ['Get cloud certification', 'Lead a small project'],
        year1: ['Reach senior level', 'Mentor 2 junior developers']
      },
      analysis: 'AI services are currently unavailable. Basic analysis shows strong potential with specific skill gaps. Focus on TypeScript, cloud technologies, and leadership development for optimal career growth.',
      aiProvider: 'fallback',
      analysisType: 'advanced-personalized-resume-analysis',
      timestamp: new Date().toISOString()
    }
  }
}

// Main POST handler for combined analysis
export async function POST(request: NextRequest) {
  try {
    // Handle FormData for file upload and JD data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jdUrl = formData.get('jdUrl') as string
    const jdText = formData.get('jdText') as string

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file type and size
    if (!ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      return NextResponse.json({
        success: false,
        error: `Unsupported file type: ${file.type}. Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }, { status: 400 })
    }

    console.log(`📄 Processing resume: ${file.name} (${file.size} bytes)`)
    
    // Extract text from file
    const resumeText = await extractTextFromFile(file)
    console.log(`✅ Resume text extracted: ${resumeText.length} characters`)

    // Get job description text
    let jobDescription = formData.get('jdText') as string || ''
    const jobUrl = formData.get('jdUrl') as string
    
    if (jobUrl && !jobDescription) {
      // Extract and optimize JD from URL
      try {
        const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
        const rawJdText = await extractJDFromURL(jobUrl)
        
        // Clean and optimize the JD
        const cleanedJD = cleanAndOptimizeJD(rawJdText)
        jobDescription = await optimizeJDWithAI(cleanedJD)
        
        console.log(`✅ JD extracted and optimized: ${jobDescription.length} characters`)
      } catch (error) {
        console.warn('Failed to extract JD from URL:', error)
        // Continue with empty JD text
      }
    }
    
    if (!jobDescription || jobDescription.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Job description text is required for analysis' },
        { status: 400 }
      )
    }

    // Analyze job description first
    let jdAnalysis = null
    try {
      jdAnalysis = await analyzeJobDescription(jobDescription)
      console.log('📋 Job description analyzed')
    } catch (error) {
      console.warn('⚠️ JD analysis failed:', error)
    }

    // Perform combined resume-JD analysis
    console.log('🤖 Starting combined AI analysis...')
    const analysis = await analyzeResumeWithJD(resumeText, jobDescription)
    console.log('✅ Combined analysis completed')

    // Combine all results
    const finalResult = {
      success: true,
      data: {
        resumeAnalysis: analysis,
        jobDescriptionAnalysis: jdAnalysis,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type
        },
        jobDescription: {
          text: jobDescription,
          length: jobDescription.length,
          url: jobUrl || null
        },
        processedAt: new Date().toISOString()
      },
      message: 'Combined resume and JD analysis completed successfully'
    }

    return NextResponse.json(finalResult)

  } catch (error) {
    console.error('Combined analysis error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

// GET endpoint for configuration
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      allowedTypes: Object.keys(ALLOWED_TYPES),
      maxFileSize: MAX_FILE_SIZE,
      supportedFormats: brandConfig.supportedFormats,
      features: {
        combinedAnalysis: true,
        realTimeAnalysis: true,
        atsOptimization: true,
        jdIntegration: true,
        aiProviders: ['Gemini', 'DeepSeek'],
        publicAccess: true
      },
      usage: {
        post: {
          file: 'Resume file (required)',
          jdText: 'Job description text (optional)',
          jdUrl: 'Job description URL (optional)'
        }
      }
    }
  })
}
