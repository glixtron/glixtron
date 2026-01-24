#!/usr/bin/env node

/**
 * Health Check Script
 * Monitors server health and automatic failover
 */

const SERVERS = [
  'https://glixtron.vercel.app',
  'https://glixtron-git-main-glixtron.vercel.app',
  'https://glixtron.netlify.app'
]

async function checkServerHealth(server) {
  try {
    const startTime = Date.now()
    
    const response = await fetch(`${server}/api/health`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    const responseTime = Date.now() - startTime
    const data = await response.json()
    
    return {
      server,
      status: response.status,
      responseTime: `${responseTime}ms`,
      healthy: response.status === 200,
      data
    }
  } catch (error) {
    return {
      server,
      status: 'ERROR',
      responseTime: 'N/A',
      healthy: false,
      error: error.message
    }
  }
}

async function runHealthCheck() {
  console.log('🏥 Server Health Check\n')
  
  const results = []
  
  for (const server of SERVERS) {
    const result = await checkServerHealth(server)
    results.push(result)
    
    const status = result.healthy ? '🟢' : '🔴'
    console.log(`${status} ${server}`)
    console.log(`   Status: ${result.status}`)
    console.log(`   Response Time: ${result.responseTime}`)
    
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    } else if (result.data) {
      console.log(`   Database: ${result.data.database?.status || 'Unknown'}`)
      console.log(`   Environment: ${result.data.server?.environment || 'Unknown'}`)
    }
    console.log('')
  }
  
  // Summary
  const healthyServers = results.filter(r => r.healthy)
  const unhealthyServers = results.filter(r => !r.healthy)
  
  console.log('📊 Health Summary:')
  console.log(`Healthy Servers: ${healthyServers.length}/${results.length}`)
  console.log(`Unhealthy Servers: ${unhealthyServers.length}`)
  
  if (unhealthyServers.length > 0) {
    console.log('\n🔴 Unhealthy Servers:')
    unhealthyServers.forEach(server => {
      console.log(`  ${server.server} - ${server.error || server.status}`)
    })
  }
  
  if (healthyServers.length === 0) {
    console.log('\n❌ All servers are down! Immediate attention required.')
    process.exit(1)
  } else if (unhealthyServers.length > 0) {
    console.log('\n⚠️ Some servers are down. Automatic failover should be active.')
  } else {
    console.log('\n✅ All servers are healthy!')
  }
  
  return healthyServers.length > 0
}

// Deep health check
async function deepHealthCheck() {
  console.log('🔍 Deep Health Check\n')
  
  const primaryServer = SERVERS[0]
  
  try {
    const response = await fetch(`${primaryServer}/api/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'deep-check' })
    })
    
    const data = await response.json()
    
    console.log('📋 Deep Check Results:')
    console.log(`Database: ${data.checks?.database || 'Unknown'}`)
    console.log(`Auth System: ${data.checks?.auth || 'Unknown'}`)
    console.log(`External Services: ${data.checks?.external || 'Unknown'}`)
    console.log(`Overall Status: ${data.status || 'Unknown'}`)
    
    return data.status === 'healthy'
  } catch (error) {
    console.log(`❌ Deep check failed: ${error.message}`)
    return false
  }
}

// Performance test
async function performanceTest() {
  console.log('⚡ Performance Test\n')
  
  const server = SERVERS[0]
  const requests = 10
  const results = []
  
  console.log(`Testing ${server} with ${requests} concurrent requests...`)
  
  const startTime = Date.now()
  
  const promises = Array.from({ length: requests }, async (_, i) => {
    try {
      const start = Date.now()
      const response = await fetch(`${server}/api/health`)
      const end = Date.now()
      
      return {
        request: i + 1,
        status: response.status,
        responseTime: end - start,
        success: response.status === 200
      }
    } catch (error) {
      return {
        request: i + 1,
        status: 'ERROR',
        responseTime: 0,
        success: false,
        error: error.message
      }
    }
  })
  
  const testResults = await Promise.all(promises)
  const totalTime = Date.now() - startTime
  
  const successfulRequests = testResults.filter(r => r.success)
  const avgResponseTime = successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length
  
  console.log('📊 Performance Results:')
  console.log(`Total Time: ${totalTime}ms`)
  console.log(`Successful Requests: ${successfulRequests.length}/${requests}`)
  console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`)
  console.log(`Requests/Second: ${(requests / (totalTime / 1000)).toFixed(2)}`)
  
  return successfulRequests.length === requests
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const deep = args.includes('--deep')
  const performance = args.includes('--performance')
  
  try {
    const basicHealthy = await runHealthCheck()
    
    if (deep) {
      await deepHealthCheck()
    }
    
    if (performance) {
      await performanceTest()
    }
    
    if (basicHealthy) {
      console.log('\n🎉 Health check completed successfully!')
      process.exit(0)
    } else {
      console.log('\n❌ Health check failed!')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Health check failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
