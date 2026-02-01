/**
 * JD Extractor API Endpoint
 * Enhanced with AI optimization and advanced cleaning
 */

import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, analyze = false } = body

    if (!url) {
      return NextResponse.json(
        { 
          success: false,
          error: 'URL is required',
          message: 'Please provide a valid URL to extract job description from'
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
    
    // Extract job description
    const jdText = await extractJDFromURL(url)
    
    if (!jdText || jdText.trim().length < 50) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to extract job description from URL',
          message: 'Please check the URL and try again'
        },
        { status: 400 }
      )
    }
    
    console.log(`📄 Raw JD extracted: ${jdText.length} characters`)
    
    // Clean and optimize the JD
    const cleanedJD = cleanAndOptimizeJD(jdText)
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
        originalLength: jdText.length,
        cleanedLength: cleanedJD.length,
        optimizedLength: optimizedJD.length,
        analysis,
        extractedAt: new Date().toISOString(),
        mode: 'ai-optimized-extraction',
        optimizationApplied: true
      },
      message: 'Job description extracted and optimized successfully with AI analysis'
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
        message: 'JD Extractor API (Server-Safe Mode)',
        mode: 'server-safe',
        usage: {
          post: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              url: 'https://example.com/job-posting (required)'
            }
          }
        },
        examples: [
          {
            url: 'https://www.linkedin.com/jobs/view/123456789',
            description: 'LinkedIn job posting (mock data)'
          },
          {
            url: 'https://www.indeed.com/jobs?q=software+engineer',
            description: 'Indeed job search (mock data)'
          },
          {
            url: 'https://www.glassdoor.com/Job/software-engineer-123456.htm',
            description: 'Glassdoor job posting (mock data)'
          }
        ]
      })
    }

    // If URL is provided, extract JD from it
    if (url) {
      try {
        new URL(url)
        const jobDescription = await extractJDFromURL(url)
        
        return NextResponse.json({
          success: true,
          data: {
            url,
            jobDescription,
            extractedAt: new Date().toISOString(),
            length: jobDescription.length,
            mode: 'server-safe'
          },
          message: 'Job description extracted successfully (server-safe mode)'
        })
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Failed to extract job description',
          message: error.message || 'An error occurred while extracting the job description'
        }, { status: 500 })
      }
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 })
  }
}
