#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all API endpoints with server failover
 */

const { execSync } = require('child_process')

const SERVERS = [
  'https://glixtron.vercel.app',
  'https://glixtron-git-main-glixtron.vercel.app',
  'http://localhost:3000'
]

const ENDPOINTS = [
  '/api/health',
  '/api/test/auth-status',
  '/api/test/users',
  '/api/auth/[...nextauth]'
]

async function testEndpoint(server, endpoint) {
  try {
    const url = `${server}${endpoint}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    const status = response.status
    const responseTime = response.headers.get('x-response-time') || 'N/A'
    
    return {
      server,
      endpoint,
      status,
      success: status === 200,
      responseTime
    }
  } catch (error) {
    return {
      server,
      endpoint,
      status: 'ERROR',
      success: false,
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🧪 API Testing Started...\n')
  
  const results = []
  
  for (const server of SERVERS) {
    console.log(`📡 Testing server: ${server}`)
    
    for (const endpoint of ENDPOINTS) {
      const result = await testEndpoint(server, endpoint)
      results.push(result)
      
      const status = result.success ? '✅' : '❌'
      console.log(`  ${status} ${endpoint} - ${result.status} (${result.responseTime})`)
      
      if (result.error) {
        console.log(`    Error: ${result.error}`)
      }
    }
    console.log('')
  }
  
  // Summary
  const totalTests = results.length
  const passedTests = results.filter(r => r.success).length
  const failedTests = totalTests - passedTests
  
  console.log('📊 Test Results Summary:')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} ✅`)
  console.log(`Failed: ${failedTests} ❌`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:')
    results.filter(r => !r.success).forEach(result => {
      console.log(`  ${result.server}${result.endpoint} - ${result.status}`)
    })
    process.exit(1)
  } else {
    console.log('\n🎉 All tests passed!')
    process.exit(0)
  }
}

// Test authentication endpoints
async function testAuth() {
  console.log('🔐 Testing Authentication...\n')
  
  const authTests = [
    {
      name: 'Registration',
      url: '/api/auth/register',
      method: 'POST',
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
      }
    },
    {
      name: 'Login',
      url: '/api/auth/signin',
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    }
  ]
  
  for (const test of authTests) {
    try {
      const response = await fetch(`${SERVERS[0]}${test.url}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.data)
      })
      
      const data = await response.json()
      const status = response.status === 200 ? '✅' : '❌'
      
      console.log(`${status} ${test.name}: ${response.status}`)
      if (data.error) {
        console.log(`  Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`)
    }
  }
}

// Main execution
async function main() {
  try {
    await runTests()
    await testAuth()
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
