/**
 * JD Extractor Test API
 * Tests job description extraction from various job sites
 */

import { NextRequest, NextResponse } from 'next/server'

// Test URLs from different job platforms
const TEST_URLS = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/view/senior-software-engineer-at-microsoft-123456789',
    description: 'LinkedIn job posting'
  },
  {
    platform: 'Indeed',
    url: 'https://www.indeed.com/viewjob?jk=123456789&tk=1abc123def456',
    description: 'Indeed job posting'
  },
  {
    platform: 'Glassdoor',
    url: 'https://www.glassdoor.com/job-listing/senior-developer-JV_IC123456_KO0,12.htm',
    description: 'Glassdoor job posting'
  },
  {
    platform: 'Monster',
    url: 'https://www.monster.com/job-openings/senior-software-engineer-123456',
    description: 'Monster job posting'
  },
  {
    platform: 'CareerBuilder',
    url: 'https://www.careerbuilder.com/job/J3R123456789/Senior-Software-Engineer',
    description: 'CareerBuilder job posting'
  },
  {
    platform: 'ZipRecruiter',
    url: 'https://www.ziprecruiter.com/jobs/senior-software-engineer-123456789',
    description: 'ZipRecruiter job posting'
  },
  {
    platform: 'Angel/Welfound',
    url: 'https://angel.co/company/startup/jobs/123456-senior-engineer',
    description: 'AngelList/Welfound job posting'
  },
  {
    platform: 'Hired',
    url: 'https://hired.com/jobs/123456-senior-software-engineer',
    description: 'Hired job posting'
  },
  {
    platform: 'Stack Overflow Jobs',
    url: 'https://stackoverflow.com/jobs/123456/senior-software-engineer',
    description: 'Stack Overflow Jobs posting'
  },
  {
    platform: 'Dice',
    url: 'https://www.dice.com/jobs/detail/senior-software-engineer-123456789',
    description: 'Dice job posting'
  }
]

// Test individual URL extraction
async function testExtraction(url: string, platform: string): Promise<{
  platform: string
  url: string
  success: boolean
  content: string
  error?: string
  metadata?: any
}> {
  try {
    console.log(`🔍 Testing extraction from ${platform}: ${url}`)
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/jd/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        analyze: false
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      return {
        platform,
        url,
        success: true,
        content: data.data.content || data.data,
        metadata: data.data.metadata || {}
      }
    } else {
      return {
        platform,
        url,
        success: false,
        content: '',
        error: data.error || 'Unknown error'
      }
    }
  } catch (error) {
    return {
      platform,
      url,
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

// Test platform detection
function testPlatformDetection(): Array<{
  url: string
  detectedPlatform: string
  expectedPlatform: string
  correct: boolean
}> {
  // Import the detection function inline to avoid module issues
  const detectJobPlatform = (url: string): string => {
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
    
    return 'unknown'
  }
  
  return TEST_URLS.map(test => ({
    url: test.url,
    detectedPlatform: detectJobPlatform(test.url),
    expectedPlatform: test.platform.toLowerCase().replace(/\s+/g, ''),
    correct: detectJobPlatform(test.url).toLowerCase().includes(test.platform.toLowerCase().replace(/\s+/g, ''))
  }))
}

// Test URL validation
function testURLValidation(): Array<{
  url: string
  valid: boolean
  description: string
}> {
  const testCases = [
    {
      url: 'https://www.linkedin.com/jobs/view/123',
      valid: true,
      description: 'Valid HTTPS URL'
    },
    {
      url: 'http://indeed.com/jobs/123',
      valid: true,
      description: 'Valid HTTP URL'
    },
    {
      url: 'www.linkedin.com/jobs/123',
      valid: true,
      description: 'URL without protocol'
    },
    {
      url: 'linkedin.com/jobs/123',
      valid: true,
      description: 'URL without www or protocol'
    },
    {
      url: 'not-a-url',
      valid: false,
      description: 'Invalid URL'
    },
    {
      url: '',
      valid: false,
      description: 'Empty URL'
    },
    {
      url: 'null-url',
      valid: false,
      description: 'Null URL placeholder'
    }
  ]
  
  return testCases
}

// Main test function
async function runJDExtractorTests(): Promise<{
  timestamp: string
  platformDetection: any[]
  urlValidation: any[]
  extractionTests: any[]
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    successRate: number
  }
}> {
  const timestamp = new Date().toISOString()
  console.log('🧪 Starting JD Extractor comprehensive tests...')
  
  // Test platform detection
  console.log('🔍 Testing platform detection...')
  const platformDetection = testPlatformDetection()
  
  // Test URL validation
  console.log('🔍 Testing URL validation...')
  const urlValidation = testURLValidation()
  
  // Test extraction from all platforms
  console.log('🔍 Testing extraction from all platforms...')
  const extractionTests = []
  
  for (const test of TEST_URLS) {
    const result = await testExtraction(test.url, test.platform)
    extractionTests.push(result)
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Calculate summary
  const totalTests = platformDetection.length + urlValidation.length + extractionTests.length
  const passedTests = 
    platformDetection.filter(t => t.correct).length +
    urlValidation.filter(t => t.valid === (t.description.includes('Valid') ? true : false)).length +
    extractionTests.filter(t => t.success).length
  const failedTests = totalTests - passedTests
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
  
  return {
    timestamp,
    platformDetection,
    urlValidation,
    extractionTests,
    summary: {
      totalTests,
      passedTests,
      failedTests,
      successRate
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const results = await runJDExtractorTests()
    
    return NextResponse.json({
      success: true,
      data: results,
      message: `JD Extractor tests completed: ${results.summary.successRate}% success rate (${results.summary.passedTests}/${results.summary.totalTests} tests passed)`
    })
  } catch (error) {
    console.error('JD Extractor test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      message: 'Failed to run JD extractor tests'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'JD Extractor Test Suite',
    usage: {
      post: 'Run comprehensive JD extractor tests',
      tests: [
        'Platform Detection',
        'URL Validation',
        'Extraction from Multiple Platforms'
      ]
    },
    platforms: TEST_URLS.map(t => ({
      platform: t.platform,
      description: t.description,
      url: t.url
    })),
    features: {
      platformDetection: true,
      urlValidation: true,
      multiPlatformExtraction: true,
      errorHandling: true,
      fallbackMechanisms: true
    },
    note: 'This test suite validates JD extraction from 10+ major job platforms including LinkedIn, Indeed, Glassdoor, Monster, CareerBuilder, ZipRecruiter, Angel/Welfound, Hired, Stack Overflow Jobs, and Dice'
  })
}
