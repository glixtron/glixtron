#!/usr/bin/env node

/**
 * Glixtron System Health Check Script
 * Verifies all critical endpoints and integrations after deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ENDPOINTS = [
  // Core Pages
  { path: '/', type: 'page', name: 'Home' },
  { path: '/career-guidance', type: 'page', name: 'Career Guidance' },
  { path: '/job-extractor', type: 'page', name: 'Job Extractor' },
  { path: '/job-matching', type: 'page', name: 'Job Matching' },
  { path: '/resume-scanner', type: 'page', name: 'Resume Scanner' },
  { path: '/assessment', type: 'page', name: 'Assessment' },
  { path: '/dashboard', type: 'page', name: 'Dashboard' },
  
  // API Endpoints
  { path: '/api/health', type: 'api', name: 'Health Check' },
  { path: '/api/career-guidance', type: 'api', name: 'Career Guidance API' },
  { path: '/api/career-guidance?action=health', type: 'api', name: 'Career Guidance Health' },
  { path: '/api/dashboard/stats', type: 'api', name: 'Dashboard Stats' },
  { path: '/api/resume/saved', type: 'api', name: 'Resume Saved' },
  { path: '/api/assessment', type: 'api', name: 'Assessment API' },
  { path: '/api/extract-jd', type: 'api', method: 'POST', body: '{"url":"https://example.com"}', name: 'JD Extractor API' },
  
  // AI Integration Tests
  { path: '/api/career-guidance?action=health', type: 'ai', name: 'AI Career Guidance Health' },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => reject(error));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function checkEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  const options = {
    method: endpoint.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Glixtron-Health-Check/1.0'
    }
  };
  
  if (endpoint.body) {
    options.body = endpoint.body;
  }

  try {
    const startTime = Date.now();
    const response = await makeRequest(url, options);
    const responseTime = Date.now() - startTime;
    
    if (response.status === 200) {
      colorLog('green', `✅ ${endpoint.name} - ${response.status} (${responseTime}ms)`);
      
      // Additional checks for API endpoints
      if (endpoint.type === 'api' && response.data) {
        try {
          const data = JSON.parse(response.data);
          if (data.success !== undefined) {
            colorLog('cyan', `   └─ API Response: success=${data.success}`);
          }
          if (data.data) {
            colorLog('cyan', `   └─ Data keys: ${Object.keys(data.data).join(', ')}`);
          }
        } catch (e) {
          // Not JSON, that's okay for pages
        }
      }
      
      return { success: true, status: response.status, responseTime };
    } else {
      colorLog('red', `❌ ${endpoint.name} - ${response.status} (${responseTime}ms)`);
      return { success: false, status: response.status, responseTime };
    }
  } catch (error) {
    colorLog('red', `❌ ${endpoint.name} - Connection Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function checkEnvironmentVariables() {
  colorLog('blue', '\n🔍 Checking Environment Variables...');
  
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET', 
    'MONGODB_URI',
    'GEMINI_API_KEY',
    'FIRECRAWL_API_KEY'
  ];
  
  const optionalVars = [
    'OPENAI_API_KEY',
    'DEEPSEEK_API_KEY'
  ];
  
  let missingRequired = [];
  let missingOptional = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingRequired.push(varName);
    }
  });
  
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      missingOptional.push(varName);
    }
  });
  
  if (missingRequired.length === 0) {
    colorLog('green', '✅ All required environment variables are set');
  } else {
    colorLog('red', `❌ Missing required variables: ${missingRequired.join(', ')}`);
  }
  
  if (missingOptional.length > 0) {
    colorLog('yellow', `⚠️  Missing optional variables: ${missingOptional.join(', ')}`);
  }
  
  return missingRequired.length === 0;
}

async function checkIntegrations() {
  colorLog('blue', '\n🔗 Checking Integrations...');
  
  // Test AI Career Guidance Health
  try {
    const response = await makeRequest(`${BASE_URL}/api/career-guidance?action=health`);
    const data = JSON.parse(response.data);
    
    if (data.success) {
      colorLog('green', '✅ Career Guidance API Health');
      colorLog('cyan', `   └─ AI Providers: ${JSON.stringify(data.aiProviders)}`);
      
      // Check AI provider availability
      const providers = data.aiProviders || {};
      const activeProviders = Object.keys(providers).filter(key => providers[key]);
      colorLog('cyan', `   └─ Active AI Providers: ${activeProviders.length} (${activeProviders.join(', ')})`);
    }
  } catch (error) {
    colorLog('red', `❌ Career Guidance Health Check Failed: ${error.message}`);
  }
  
  // Test JD Extractor
  try {
    const response = await makeRequest(`${BASE_URL}/api/extract-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"url":"https://example.com"}'
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      colorLog('green', '✅ JD Extractor API');
      colorLog('cyan', `   └─ Response: success=${data.success}, aiEnhanced=${data.data?.aiEnhanced}`);
    }
  } catch (error) {
    colorLog('red', `❌ JD Extractor Test Failed: ${error.message}`);
  }
}

async function generateReport(results) {
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = total - successful;
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.responseTime).length;
  
  colorLog('blue', '\n📊 System Health Report');
  colorLog('blue', '=' .repeat(50));
  colorLog('cyan', `Total Endpoints: ${total}`);
  colorLog('green', `Successful: ${successful}`);
  colorLog('red', `Failed: ${failed}`);
  colorLog('cyan', `Success Rate: ${((successful / total) * 100).toFixed(1)}%`);
  colorLog('cyan', `Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  
  if (failed === 0) {
    colorLog('green', '\n🎉 All systems operational! Ready for production.');
  } else {
    colorLog('yellow', `\n⚠️  ${failed} endpoints need attention before production.`);
  }
  
  return { total, successful, failed, avgResponseTime };
}

async function main() {
  colorLog('blue', '🚀 Glixtron System Health Check');
  colorLog('blue', `Testing: ${BASE_URL}`);
  colorLog('blue', '=' .repeat(50));
  
  // Check environment variables
  const envOk = await checkEnvironmentVariables();
  
  // Check all endpoints
  colorLog('blue', '\n🌐 Checking Endpoints...');
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Check integrations
  await checkIntegrations();
  
  // Generate final report
  const report = await generateReport(results);
  
  // Exit with appropriate code
  process.exit(report.failed === 0 && envOk ? 0 : 1);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  colorLog('red', `💥 Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  colorLog('red', `💥 Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// Run the health check
if (require.main === module) {
  main();
}

module.exports = { checkEndpoint, checkEnvironmentVariables, checkIntegrations, generateReport };
