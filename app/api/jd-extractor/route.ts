/**
 * Enhanced Job Description Extractor API
 * Real URL fetching with AI-powered analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractJDFromURL, analyzeJobDescription, type JDExtractionResult, type AIAnalysisResult } from '@/lib/jd-extractor-server'
import { secureApiRoute } from '@/lib/security/middleware'

const secureHandler = secureApiRoute(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'extract'

    try {
      switch (action) {
        case 'extract':
          const url = searchParams.get('url')
          if (!url) {
            return NextResponse.json({
              success: false,
              error: 'URL is required for extraction'
            }, { status: 400 })
          }

          // Validate URL format
          try {
            new URL(url)
          } catch {
            return NextResponse.json({
              success: false,
              error: 'Invalid URL format'
            }, { status: 400 })
          }

          console.log('🔍 Starting JD extraction from:', url)
          const extractionResult = await extractJDFromURL(url)
          
          return NextResponse.json({
            success: true,
            action: 'extract',
            data: extractionResult
          })

        case 'analyze':
          const jdText = searchParams.get('text')
          if (!jdText) {
            return NextResponse.json({
              success: false,
              error: 'Job description text is required for analysis'
            }, { status: 400 })
          }

          console.log('🤖 Starting JD analysis...')
          const analysisResult = await analyzeJobDescription(jdText)
          
          return NextResponse.json({
            success: true,
            action: 'analyze',
            data: analysisResult
          })

        case 'full':
          const fullUrl = searchParams.get('url')
          if (!fullUrl) {
            return NextResponse.json({
              success: false,
              error: 'URL is required for full extraction and analysis'
            }, { status: 400 })
          }

          console.log('🚀 Starting full JD extraction and analysis...')
          
          // Extract JD from URL
          const extraction = await extractJDFromURL(fullUrl)
          
          if (!extraction.success || !extraction.content) {
            return NextResponse.json({
              success: false,
              error: 'Failed to extract job description',
              details: extraction.error
            }, { status: 500 })
          }

          // Analyze the extracted content
          const analysis = await analyzeJobDescription(extraction.content)
          
          return NextResponse.json({
            success: true,
            action: 'full',
            data: {
              extraction,
              analysis,
              summary: {
                title: extraction.title,
                company: extraction.company,
                location: extraction.location,
                salary: extraction.salary,
                jobType: extraction.jobType,
                experience: extraction.experience,
                remote: extraction.remote,
                keySkills: analysis.keySkills,
                experienceLevel: analysis.experienceLevel,
                matchScore: analysis.matchScore
              }
            }
          })

        case 'validate-url':
          const validateUrl = searchParams.get('url')
          if (!validateUrl) {
            return NextResponse.json({
              success: false,
              error: 'URL is required for validation'
            }, { status: 400 })
          }

          try {
            const urlObj = new URL(validateUrl)
            const domain = urlObj.hostname.toLowerCase()
            
            // Check if it's a known job site
            const supportedSites = [
              'linkedin.com',
              'indeed.com',
              'glassdoor.com',
              'ziprecruiter.com',
              'monster.com',
              'careerbuilder.com',
              'dice.com',
              'simplyhired.com',
              'job.com',
              'angel.co'
            ]

            const isSupported = supportedSites.some(site => domain.includes(site))
            
            return NextResponse.json({
              success: true,
              action: 'validate-url',
              data: {
                valid: true,
                domain,
                supported: isSupported,
                recommended: isSupported ? 'This site is supported for extraction' : 'Extraction may be limited on this site'
              }
            })

          } catch (error) {
            return NextResponse.json({
              success: false,
              error: 'Invalid URL format'
            }, { status: 400 })
          }

        case 'supported-sites':
          return NextResponse.json({
            success: true,
            action: 'supported-sites',
            data: {
              sites: [
                { name: 'LinkedIn', domain: 'linkedin.com', confidence: 'high' },
                { name: 'Indeed', domain: 'indeed.com', confidence: 'high' },
                { name: 'Glassdoor', domain: 'glassdoor.com', confidence: 'high' },
                { name: 'ZipRecruiter', domain: 'ziprecruiter.com', confidence: 'medium' },
                { name: 'Monster', domain: 'monster.com', confidence: 'medium' },
                { name: 'CareerBuilder', domain: 'careerbuilder.com', confidence: 'medium' },
                { name: 'Dice', domain: 'dice.com', confidence: 'medium' },
                { name: 'SimplyHired', domain: 'simplyhired.com', confidence: 'low' },
                { name: 'Job.com', domain: 'job.com', confidence: 'low' },
                { name: 'AngelList', domain: 'angel.co', confidence: 'low' }
              ]
            }
          })

        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid action',
            availableActions: ['extract', 'analyze', 'full', 'validate-url', 'supported-sites']
          }, { status: 400 })
      }

    } catch (error: any) {
      console.error('JD Extractor API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to process request',
        message: error.message
      }, { status: 500 })
    }
  },
  {
    rateLimit: { maxRequests: 20, windowMs: 15 * 60 * 1000 }, // 20 requests per 15 minutes
    logOperations: true
  }
)

export const GET = secureHandler

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, url, text } = body

    switch (action) {
      case 'extract':
        if (!url) {
          return NextResponse.json({
            success: false,
            error: 'URL is required for extraction'
          }, { status: 400 })
        }

        const extractionResult = await extractJDFromURL(url)
        
        return NextResponse.json({
          success: true,
          action: 'extract',
          data: extractionResult
        })

      case 'analyze':
        if (!text) {
          return NextResponse.json({
            success: false,
            error: 'Job description text is required for analysis'
          }, { status: 400 })
        }

        const analysisResult = await analyzeJobDescription(text)
        
        return NextResponse.json({
          success: true,
          action: 'analyze',
          data: analysisResult
        })

      case 'full':
        if (!url) {
          return NextResponse.json({
            success: false,
            error: 'URL is required for full extraction and analysis'
          }, { status: 400 })
        }

        const extraction = await extractJDFromURL(url)
        
        if (!extraction.success || !extraction.content) {
          return NextResponse.json({
            success: false,
            error: 'Failed to extract job description',
            details: extraction.error
          }, { status: 500 })
        }

        const analysis = await analyzeJobDescription(extraction.content)
        
        return NextResponse.json({
          success: true,
          action: 'full',
          data: {
            extraction,
            analysis,
            summary: {
              title: extraction.title,
              company: extraction.company,
              location: extraction.location,
              salary: extraction.salary,
              jobType: extraction.jobType,
              experience: extraction.experience,
              remote: extraction.remote,
              keySkills: analysis.keySkills,
              experienceLevel: analysis.experienceLevel,
              matchScore: analysis.matchScore
            }
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['extract', 'analyze', 'full']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('JD Extractor POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}
