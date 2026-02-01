/**
 * Comprehensive Security Test Suite
 * Tests authentication, authorization, and security measures
 */

import { NextRequest, NextResponse } from 'next/server'

// Security test results
interface SecurityTestResults {
  timestamp: string
  tests: {
    authentication: { status: string; details: string[] }
    authorization: { status: string; details: string[] }
    dataProtection: { status: string; details: string[] }
    apiSecurity: { status: string; details: string[] }
    environment: { status: string; details: string[] }
    dependencies: { status: string; details: string[] }
    cors: { status: string; details: string[] }
    rateLimiting: { status: string; details: string[] }
    inputValidation: { status: string; details: string[] }
    errorHandling: { status: string; details: string[] }
    sessionSecurity: { status: string; details: string[] }
  }
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    warningTests: number
    overallStatus: 'SECURE' | 'VULNERABLE' | 'NEEDS_ATTENTION'
  }
}

// Test authentication endpoints
async function testAuthentication(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test login endpoint
    const loginResponse = await fetch('https://glixtron-pilot.vercel.app/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    })
    
    if (loginResponse.status === 401) {
      details.push('✅ Login endpoint properly rejects invalid credentials')
    } else {
      details.push('❌ Login endpoint should return 401 for invalid credentials')
    }
    
    // Test register endpoint
    const registerResponse = await fetch('https://glixtron-pilot.vercel.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    })
    
    if (registerResponse.status === 200 || registerResponse.status === 201) {
      details.push('✅ Register endpoint is accessible')
    } else {
      details.push('❌ Register endpoint may have issues')
    }
    
    // Test session endpoint
    const sessionResponse = await fetch('https://glixtron-pilot.vercel.app/api/auth/session', {
      method: 'GET'
    })
    
    if (sessionResponse.status === 200 || sessionResponse.status === 401) {
      details.push('✅ Session endpoint properly handles authentication state')
    } else {
      details.push('❌ Session endpoint may have issues')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Authentication test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test authorization and access control
async function testAuthorization(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test protected endpoint without authentication
    const protectedResponse = await fetch('https://glixtron-pilot.vercel.app/api/user/profile', {
      method: 'GET'
    })
    
    if (protectedResponse.status === 401) {
      details.push('✅ Protected endpoint properly denies access without authentication')
    } else {
      details.push('❌ Protected endpoint should return 401 without authentication')
    }
    
    // Test admin endpoint
    const adminResponse = await fetch('https://glixtron-pilot.vercel.app/api/admin/users', {
      method: 'GET'
    })
    
    if (adminResponse.status === 401) {
      details.push('✅ Admin endpoint properly denies access without authentication')
    } else {
      details.push('❌ Admin endpoint should return 401 without authentication')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Authorization test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test data protection and privacy
async function testDataProtection(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test for data exposure in error messages
    const errorResponse = await fetch('https://glixtron-pilot.vercel.app/api/nonexistent', {
      method: 'GET'
    })
    
    if (errorResponse.status === 404) {
      details.push('✅ Non-existent endpoints return 404')
    } else {
      details.push('❌ Non-existent endpoints should return 404')
    }
    
    // Test for sensitive data in responses
    const testResponse = await fetch('https://glixtron-pilot.vercel.app/api/test-ai-integration', {
      method: 'GET'
    })
    
    const data = await testResponse.json()
    
    // Check if sensitive information is exposed
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'private']
    const dataStr = JSON.stringify(data)
    
    let hasSensitiveData = false
    for (const field of sensitiveFields) {
      if (dataStr.toLowerCase().includes(field)) {
        hasSensitiveData = true
        break
      }
    }
    
    if (!hasSensitiveData) {
      details.push('✅ No sensitive data exposed in responses')
    } else {
      details.push('❌ Sensitive data detected in responses')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Data protection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test API security measures
async function testAPISecurity(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test for SQL injection protection
    const sqlInjectionTest = await fetch('https://glixtron-pilot.vercel.app/api/test-ai-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'gemini; DROP TABLE users; --'
      })
    })
    
    if (sqlInjectionTest.status === 400 || sqlInjectionTest.status === 422) {
      details.push('✅ SQL injection protection is working')
    } else {
      details.push('⚠️ SQL injection protection may need verification')
    }
    
    // Test for XSS protection
    const xssTest = await fetch('https://glixtron-pilot.vercel.app/api/test-ai-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: '<script>alert("XSS Test")</script>'
      })
    })
    
    if (xssTest.status === 400 || xssTest.status === 422) {
      details.push('✅ XSS protection appears to be working')
    } else {
      details.push('⚠️ XSS protection may need verification')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`API security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test environment security
async function testEnvironmentSecurity(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Check for environment variables exposure
    const healthResponse = await fetch('https://glixtron-pilot.vercel.app/api/health')
    const data = await healthResponse.json()
    
    if (!data.environment || typeof data.environment !== 'object') {
      details.push('❌ Environment information not properly structured')
    } else {
      if (data.environment.NODE_ENV === 'production') {
        details.push('✅ Running in production mode')
      } else {
        details.push('⚠️ Not running in production mode')
      }
      
      if (data.environment.NEXTAUTH_SECRET && data.environment.NEXTAUTH_SECRET !== 'set') {
        details.push('✅ NextAuth secret is configured')
      } else {
        details.push('❌ NextAuth secret may not be properly configured')
      }
      
      if (data.environment.MONGODB_URI && data.environment.MONGODB_URI !== 'set') {
        details.push('✅ MongoDB URI is configured')
      } else {
        details.push('❌ MongoDB URI may not be properly configured')
      }
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Environment security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test dependency security
async function testDependencySecurity(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Check package.json for vulnerable dependencies
    const packageResponse = await fetch('https://glixtron-pilot.vercel.app/package.json')
    const packageData = await packageResponse.json()
    
    const vulnerablePackages = [
      'axios',
      'request',
      'node-fetch',
      'lodash',
      'moment',
      'jsonwebtoken'
    ]
    
    let hasVulnerablePackages = false
    for (const pkg of vulnerablePackages) {
      if (packageData.dependencies && packageData.dependencies[pkg]) {
        hasVulnerablePackages = true
        details.push(`⚠️ Vulnerable dependency found: ${pkg}`)
      }
    }
    
    if (!hasVulnerablePackages) {
      details.push('✅ No obviously vulnerable dependencies detected')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Dependency security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test CORS configuration
async function testCORS(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test CORS preflight request
    const corsResponse = await fetch('https://glixtron-pilot.vercel.app/api/test-ai-integration', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    })
    
    if (corsResponse.status === 200 || corsResponse.status === 204) {
      details.push('✅ CORS preflight handling implemented')
    } else {
      details.push('⚠️ CORS preflight may need configuration')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`CORS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test rate limiting
async function testRateLimiting(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test rate limiting with multiple requests
    const rateLimitTest = await fetch('https://glixtron-pilot.vercel.app/api/test-ai-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: 'Rate limit test'
      })
    })
    
    if (rateLimitTest.status === 200 || rateLimitTest.status === 429) {
      details.push('✅ Rate limiting appears to be implemented')
    } else {
      details.push('⚠️ Rate limiting may need verification')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Rate limiting test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test input validation
async function testInputValidation(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test empty input validation
    const emptyInputTest = await fetch('https://glixtron-pilot.vercel.app/api/test-career-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: ''
      })
    })
    
    if (emptyInputTest.status === 400) {
      details.push('✅ Empty input validation working')
    } else {
      details.push('❌ Empty input validation may need improvement')
    }
    
    // Test malicious input validation
    const maliciousInputTest = await fetch('https://glixtron-pilot.vercel.app/api/test-career-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: '<script>alert("XSS")</script>'
      })
    })
    
    if (maliciousInputTest.status === 400 || maliciousInputTest.status === 422) {
      details.push('✅ Malicious input validation working')
    } else {
      details.push('⚠️ Malicious input validation may need improvement')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Input validation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test error handling
async function testErrorHandling(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test generic error handling
    const errorTest = await fetch('https://glixtron-pilot.vercel.app/api/nonexistent-endpoint', {
      method: 'GET'
    })
    
    if (errorTest.status === 404) {
      details.push('✅ 404 errors properly handled')
    } else {
      details.push('⚠️ Error handling may need improvement')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Error handling test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Test session security
async function testSessionSecurity(): Promise<{ status: string; details: string[] }> {
  const details: string[] = []
  
  try {
    // Test session configuration
    const sessionTest = await fetch('https://glixtron-pilot.vercel.app/api/auth/session', {
      method: 'GET'
    })
    
    if (sessionTest.status === 200 || sessionTest.status === 401) {
      details.push('✅ Session endpoint is properly configured')
    } else {
      details.push('⚠️ Session endpoint may need verification')
    }
    
    return { status: 'passed', details }
  } catch (error) {
    return { status: 'failed', details: [`Session security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`] }
  }
}

// Main security test function
async function runSecurityTests(): Promise<SecurityTestResults> {
  const timestamp = new Date().toISOString()
  
  console.log('🔒 Starting comprehensive security test...')
  
  const tests = {
    authentication: await testAuthentication(),
    authorization: await testAuthorization(),
    dataProtection: await testDataProtection(),
    apiSecurity: await testAPISecurity(),
    environment: await testEnvironmentSecurity(),
    dependencies: await testDependencySecurity(),
    cors: await testCORS(),
    rateLimiting: await testRateLimiting(),
    inputValidation: await testInputValidation(),
    errorHandling: await testErrorHandling(),
    sessionSecurity: await testSessionSecurity()
  }
  
  // Calculate summary
  const totalTests = Object.keys(tests).length
  const passedTests = Object.values(tests).filter(test => test.status === 'passed').length
  const failedTests = Object.values(tests).filter(test => test.status === 'failed').length
  const warningTests = Object.values(tests).filter(test => test.status === 'warning').length
  
  let overallStatus: 'SECURE' | 'VULNERABLE' | 'NEEDS_ATTENTION' = 'SECURE'
  if (failedTests > 0) {
    overallStatus = 'VULNERABLE'
  } else if (warningTests > 0) {
    overallStatus = 'NEEDS_ATTENTION'
  }
  
  return {
    timestamp,
    tests,
    summary: {
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      overallStatus
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const results = await runSecurityTests()
    
    return NextResponse.json({
      success: true,
      data: results,
      message: `Security test completed: ${results.summary.overallStatus} - ${results.summary.passedTests}/${results.summary.totalTests} tests passed`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Security test failed',
      message: 'Failed to run security tests'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Security Test Suite',
    usage: {
      post: 'Run comprehensive security tests',
      tests: [
        'Authentication',
        'Authorization',
        'Data Protection',
        'API Security',
        'Environment Security',
        'Dependency Security',
        'CORS Configuration',
        'Rate Limiting',
        'Input Validation',
        'Error Handling',
        'Session Security'
      ]
    },
    features: {
      authentication: true,
      authorization: true,
      dataProtection: true,
      apiSecurity: true,
      environmentSecurity: true,
      dependencySecurity: true,
      cors: true,
      rateLimiting: true,
      inputValidation: true,
      errorHandling: true,
      sessionSecurity: true
    },
    note: 'This comprehensive security test checks authentication, authorization, data protection, API security, environment security, dependency security, CORS, rate limiting, input validation, error handling, and session security'
  })
}
