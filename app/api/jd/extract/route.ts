/**
 * JD Extractor API Endpoint
 * Enhanced with AI optimization and advanced cleaning
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractJDFromURL, analyzeJobDescription } from '@/lib/jd-extractor-server'

// Enhanced platform detection and extraction
function detectJobPlatform(url: string): string {
  const urlLower = url.toLowerCase()
  
  if (urlLower.includes('linkedin.com/jobs')) return 'linkedin'
  if (urlLower.includes('indeed.com')) return 'indeed'
  if (urlLower.includes('glassdoor.com')) return 'glassdoor'
  if (urlLower.includes('monster.com')) return 'monster'
  if (urlLower.includes('careerbuilder.com')) return 'careerbuilder'
  if (urlLower.includes('ziprecruiter.com')) return 'ziprecruiter'
  if (urlLower.includes('angel.co')) return 'angel'
  if (urlLower.includes('wellfound.com') || urlLower.includes('angel.co')) return 'wellfound'
  if (urlLower.includes('hired.com')) return 'hired'
  if (urlLower.includes('stackoverflow.com/jobs')) return 'stackoverflow'
  if (urlLower.includes('dice.com')) return 'dice'
  if (urlLower.includes('roberthalf.com')) return 'roberthalf'
  if (urlLower.includes('kellyservices.com')) return 'kelly'
  if (urlLower.includes('teachforamerica.org')) return 'teachforamerica'
  if (urlLower.includes('simplyhired.com')) return 'simplyhired'
  if (urlLower.includes('snagajob.com')) return 'snagajob'
  if (urlLower.includes('ziprecruiter.com')) return 'ziprecruiter'
  if (urlLower.includes('job.com')) return 'job'
  if (urlLower.includes('jobs.net')) return 'jobs.net'
  if (urlLower.includes('careerjet.com')) return 'careerjet'
  if (urlLower.includes('adzuna.com')) return 'adzuna'
  if (urlLower.includes('jobing.com')) return 'jobing'
  if (urlLower.includes('beyond.com')) return 'beyond'
  if (urlLower.includes('recruiter.com')) return 'recruiter'
  
  return 'unknown'
}

// Platform-specific extraction strategies
async function extractFromPlatform(url: string, platform: string): Promise<string> {
  try {
    console.log(`🔍 Extracting from ${platform} platform...`)
    
    switch (platform) {
      case 'linkedin':
        return await extractFromLinkedIn(url)
      case 'indeed':
        return await extractFromIndeed(url)
      case 'glassdoor':
        return await extractFromGlassdoor(url)
      case 'monster':
        return await extractFromMonster(url)
      case 'careerbuilder':
        return await extractFromCareerBuilder(url)
      case 'ziprecruiter':
        return await extractFromZipRecruiter(url)
      case 'angel':
      case 'wellfound':
        return await extractFromAngel(url)
      case 'hired':
        return await extractFromHired(url)
      case 'stackoverflow':
        return await extractFromStackOverflow(url)
      case 'dice':
        return await extractFromDice(url)
      default:
        return await extractGeneric(url)
    }
  } catch (error) {
    console.warn(`⚠️ Platform extraction failed for ${platform}:`, error)
    return await extractGeneric(url)
  }
}

// LinkedIn extraction
async function extractFromLinkedIn(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    return await extractJDFromURL(url)
  } catch (error) {
    console.warn('LinkedIn extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Indeed extraction
async function extractFromIndeed(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Indeed-specific cleaning
    let cleaned = rawText
    
    // Remove Indeed-specific elements
    cleaned = cleaned.replace(/job description/gi, '')
    cleaned = cleaned.replace(/posted by/gi, '')
    cleaned = cleaned.replace(/indeed.*?jobs/gi, '')
    cleaned = cleaned.replace(/save job/gi, '')
    cleaned = cleaned.replace(/report job/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Indeed extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Glassdoor extraction
async function extractFromGlassdoor(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Glassdoor-specific cleaning
    let cleaned = rawText
    
    // Remove Glassdoor-specific elements
    cleaned = cleaned.replace(/glassdoor.*?jobs/gi, '')
    cleaned = cleaned.replace(/company reviews/gi, '')
    cleaned = cleaned.replace(/salary estimate/gi, '')
    cleaned = cleaned.replace(/add review/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Glassdoor extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Monster extraction
async function extractFromMonster(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Monster-specific cleaning
    let cleaned = rawText
    
    // Remove Monster-specific elements
    cleaned = cleaned.replace(/monster.*?jobs/gi, '')
    cleaned = cleaned.replace(/apply now/gi, '')
    cleaned = cleaned.replace(/save job/gi, '')
    cleaned = cleaned.replace(/share job/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Monster extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// CareerBuilder extraction
async function extractFromCareerBuilder(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // CareerBuilder-specific cleaning
    let cleaned = rawText
    
    // Remove CareerBuilder-specific elements
    cleaned = cleaned.replace(/careerbuilder/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/save.*?job/gi, '')
    cleaned = cleaned.replace(/similar.*?jobs/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('CareerBuilder extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// ZipRecruiter extraction
async function extractFromZipRecruiter(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // ZipRecruiter-specific cleaning
    let cleaned = rawText
    
    // Remove ZipRecruiter-specific elements
    cleaned = cleaned.replace(/ziprecruiter/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/easy.*?apply/gi, '')
    cleaned = cleaned.replace(/get.*?updates/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('ZipRecruiter extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Angel/Welfound extraction
async function extractFromAngel(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Angel-specific cleaning
    let cleaned = rawText
    
    // Remove Angel-specific elements
    cleaned = cleaned.replace(/angel.*?list/gi, '')
    cleaned = cleaned.replace(/wellfound/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/save.*?job/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Angel extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Hired extraction
async function extractFromHired(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Hired-specific cleaning
    let cleaned = rawText
    
    // Remove Hired-specific elements
    cleaned = cleaned.replace(/hired\.com/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/save.*?job/gi, '')
    cleaned = cleaned.replace(/get.*$hired/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Hired extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Stack Overflow Jobs extraction
async function extractFromStackOverflow(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Stack Overflow-specific cleaning
    let cleaned = rawText
    
    // Remove Stack Overflow-specific elements
    cleaned = cleaned.replace(/stack overflow.*?jobs/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/save.*?job/gi, '')
    cleaned = cleaned.replace(/developer.*?story/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Stack Overflow extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Dice extraction
async function extractFromDice(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    const rawText = await extractJDFromURL(url)
    
    // Dice-specific cleaning
    let cleaned = rawText
    
    // Remove Dice-specific elements
    cleaned = cleaned.replace(/dice\.com/gi, '')
    cleaned = cleaned.replace(/apply.*?now/gi, '')
    cleaned = cleaned.replace(/save.*?job/gi, '')
    cleaned = cleaned.replace(/get.*$dice/gi, '')
    
    return cleaned
  } catch (error) {
    console.warn('Dice extraction failed, falling back to generic')
    return await extractGeneric(url)
  }
}

// Generic extraction fallback
async function extractGeneric(url: string): Promise<string> {
  try {
    const { extractJDFromURL } = await import('@/lib/jd-extractor-server')
    return await extractJDFromURL(url)
  } catch (error) {
    console.warn('Generic extraction failed')
    throw new Error('Failed to extract job description from URL')
  }
}

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
    const uniqueLines = Array.from(new Set(lines.filter((line: string) => line.trim().length > 0)))
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, jdText, analyze = false } = body

    // Handle manual JD text input
    if (jdText && jdText.trim().length > 50) {
      console.log('📝 Processing manual JD text input...')
      
      // Clean and optimize the manual JD text
      const cleanedJD = cleanAndOptimizeJD(jdText)
      const optimizedJD = await optimizeJDWithAI(cleanedJD)
      
      console.log(`✅ Manual JD processed: ${optimizedJD.length} characters`)
      
      let analysis = null
      if (analyze) {
        // Perform AI analysis on optimized JD
        analysis = await analyzeJobDescription(optimizedJD)
      }
      
      return NextResponse.json({
        success: true,
        data: {
          jobDescription: optimizedJD,
          originalLength: jdText.length,
          cleanedLength: cleanedJD.length,
          optimizedLength: optimizedJD.length,
          analysis,
          source: 'manual',
          extractedAt: new Date().toISOString(),
          mode: 'manual-optimized',
          optimizationApplied: true
        },
        message: 'Manual job description processed and optimized successfully with AI analysis'
      })
    }

    // Handle URL extraction
    if (!url) {
      return NextResponse.json(
        { 
          success: false,
          error: 'URL is required when not providing manual JD text',
          message: 'Please provide either a URL or manual JD text'
        },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid URL format',
          message: 'Please provide a valid URL (e.g., https://example.com/job-posting)'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Starting JD extraction for:', url)
    
    // Detect platform and extract JD
    const platform = detectJobPlatform(url)
    console.log(`🎯 Detected platform: ${platform}`)
    
    // Extract JD from platform
    const extractedJdText = await extractFromPlatform(url, platform)
    
    if (!extractedJdText || extractedJdText.trim().length < 50) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to extract job description from URL',
          message: 'Please check the URL and try again'
        },
        { status: 400 }
      )
    }
    
    console.log(`📄 Raw JD extracted: ${extractedJdText.length} characters`)
    
    // Clean and optimize the JD
    const cleanedJD = cleanAndOptimizeJD(extractedJdText)
    const optimizedJD = await optimizeJDWithAI(cleanedJD)
    
    console.log(`✅ JD optimized: ${optimizedJD.length} characters`)
    
    let analysis = null
    if (analyze) {
      // Perform AI analysis on optimized JD
      analysis = await analyzeJobDescription(optimizedJD)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        url,
        jobDescription: optimizedJD,
        originalLength: extractedJdText.length,
        cleanedLength: cleanedJD.length,
        optimizedLength: optimizedJD.length,
        analysis,
        platform,
        extractedAt: new Date().toISOString(),
        mode: 'platform-optimized-extraction',
        optimizationApplied: true
      },
      message: `Job description extracted and optimized successfully from ${platform} with AI analysis`
    })
    
  } catch (error: any) {
    console.error('❌ JD extraction error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to extract job description',
        message: error.message || 'An error occurred while extracting the job description',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// GET handler for usage information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({
        success: true,
        message: 'Enhanced JD Extractor API - Multi-Platform Support',
        mode: 'multi-platform',
        data: {
          usage: {
            post: {
              url: 'string (optional) - Job posting URL',
              jdText: 'string (optional) - Manual JD text input',
              analyze: 'boolean (optional) - Perform AI analysis (default: false)'
            }
          },
          features: {
            multiPlatformExtraction: true,
            manualTextProcessing: true,
            aiOptimization: true,
            textCleaning: true,
            specialCharacterRemoval: true,
            structureOptimization: true,
            fallbackAnalysis: true,
            platformDetection: true
          },
          supportedPlatforms: [
            {
              name: 'LinkedIn',
              domains: ['linkedin.com/jobs'],
              features: ['Full extraction', 'AI optimization', 'Platform-specific cleaning']
            },
            {
              name: 'Indeed',
              domains: ['indeed.com'],
              features: ['Full extraction', 'AI optimization', 'Indeed-specific cleaning']
            },
            {
              name: 'Glassdoor',
              domains: ['glassdoor.com'],
              features: ['Full extraction', 'AI optimization', 'Glassdoor-specific cleaning']
            },
            {
              name: 'Monster',
              domains: ['monster.com'],
              features: ['Full extraction', 'AI optimization', 'Monster-specific cleaning']
            },
            {
              name: 'CareerBuilder',
              domains: ['careerbuilder.com'],
              features: ['Full extraction', 'AI optimization', 'CareerBuilder-specific cleaning']
            },
            {
              name: 'ZipRecruiter',
              domains: ['ziprecruiter.com'],
              features: ['Full extraction', 'AI optimization', 'ZipRecruiter-specific cleaning']
            },
            {
              name: 'Angel/Welfound',
              domains: ['angel.co', 'wellfound.com'],
              features: ['Full extraction', 'AI optimization', 'Angel-specific cleaning']
            },
            {
              name: 'Hired',
              domains: ['hired.com'],
              features: ['Full extraction', 'AI optimization', 'Hired-specific cleaning']
            },
            {
              name: 'Stack Overflow Jobs',
              domains: ['stackoverflow.com/jobs'],
              features: ['Full extraction', 'AI optimization', 'Stack Overflow-specific cleaning']
            },
            {
              name: 'Dice',
              domains: ['dice.com'],
              features: ['Full extraction', 'AI optimization', 'Dice-specific cleaning']
            },
            {
              name: 'Generic',
              domains: ['any other job site'],
              features: ['Fallback extraction', 'AI optimization', 'Generic cleaning']
            }
          ],
          inputMethods: [
            {
              method: 'URL Extraction',
              description: 'Extract JD from job posting URL',
              supported: '20+ job platforms'
            },
            {
              method: 'Manual Text',
              description: 'Paste JD text directly',
              supported: 'Any text input'
            }
          ],
          totalPlatforms: 20,
          aiProviders: ['DeepSeek', 'Gemini']
        }
      })
    }

    // If URL is provided, show platform detection
    const platform = detectJobPlatform(url)
    
    return NextResponse.json({
      success: true,
      data: {
        url,
        detectedPlatform: platform,
        supported: platform !== 'unknown',
        features: platform === 'unknown' ? 
          ['Generic extraction', 'AI optimization'] : 
          ['Platform-specific extraction', 'AI optimization', 'Platform-specific cleaning']
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
