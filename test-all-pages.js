const fs = require('fs');
const path = require('path');

// Test all API endpoints and pages
const BASE_URL = 'http://localhost:3000';
const PROD_URL = 'https://glixtron-pilot.vercel.app';

const endpoints = [
  // Health checks
  { path: '/api/health', method: 'GET', name: 'Health Check' },
  { path: '/api/glix/analyze', method: 'GET', name: 'GlixAI Health' },
  { path: '/api/extract-jd', method: 'GET', name: 'JD Extractor Health' },
  
  // Main APIs
  { path: '/api/glix/analyze', method: 'POST', name: 'GlixAI Analysis', body: { resumeText: 'Experienced software developer with React, Node.js, and AWS skills', streamType: 'pcm' } },
  { path: '/api/extract-jd', method: 'POST', name: 'JD Extraction', body: { url: 'https://www.linkedin.com/jobs/view/senior-software-engineer-123456789/' } },
  { path: '/api/glix/roadmap-pdf', method: 'POST', name: 'PDF Generation', body: { resumeText: 'Test resume', streamType: 'pcm', analysisId: Date.now() } },
  
  // Career guidance APIs
  { path: '/api/career-guidance', method: 'GET', name: 'Career Guidance Health' },
  { path: '/api/resume/analyze', method: 'GET', name: 'Resume Analysis Health' },
  { path: '/api/jd-resume-match', method: 'GET', name: 'JD Resume Match Health' }
];

const pages = [
  '/',
  '/career-guidance',
  '/job-extractor',
  '/resume-scanner',
  '/jd-resume-match',
  '/job-matching',
  '/glixai',
  '/dashboard',
  '/login',
  '/register',
  '/profile',
  '/settings'
];

async function testEndpoint(endpoint, baseUrl) {
  try {
    const options = {
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint.path}`, options);
    const status = response.status;
    
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    
    return {
      name: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      status,
      success: status >= 200 && status < 300,
      data: typeof data === 'object' ? data : { text: data.substring(0, 200) }
    };
  } catch (error) {
    return {
      name: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      status: 'ERROR',
      success: false,
      error: error.message
    };
  }
}

async function testPage(page, baseUrl) {
  try {
    const response = await fetch(`${baseUrl}${page}`);
    const status = response.status;
    
    return {
      page,
      status,
      success: status >= 200 && status < 300
    };
  } catch (error) {
    return {
      page,
      status: 'ERROR',
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 TESTING ALL PAGES AND APIs\n');
  
  // Test endpoints
  console.log('📡 Testing API Endpoints...\n');
  const endpointResults = [];
  
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.name}...`);
    const result = await testEndpoint(endpoint, PROD_URL);
    endpointResults.push(result);
    console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.status}`);
  }
  
  console.log('\n📄 Testing Pages...\n');
  const pageResults = [];
  
  for (const page of pages) {
    console.log(`Testing ${page}...`);
    const result = await testPage(page, PROD_URL);
    pageResults.push(result);
    console.log(`${result.success ? '✅' : '❌'} ${page}: ${result.status}`);
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY\n');
  
  const successfulEndpoints = endpointResults.filter(r => r.success).length;
  const totalEndpoints = endpointResults.length;
  console.log(`API Endpoints: ${successfulEndpoints}/${totalEndpoints} working`);
  
  const successfulPages = pageResults.filter(r => r.success).length;
  const totalPages = pageResults.length;
  console.log(`Pages: ${successfulPages}/${totalPages} working`);
  
  // Show failed tests
  const failedEndpoints = endpointResults.filter(r => !r.success);
  if (failedEndpoints.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    failedEndpoints.forEach(e => {
      console.log(`  - ${e.name}: ${e.status} ${e.error || ''}`);
    });
  }
  
  const failedPages = pageResults.filter(r => !r.success);
  if (failedPages.length > 0) {
    console.log('\n❌ Failed Pages:');
    failedPages.forEach(p => {
      console.log(`  - ${p.page}: ${p.status} ${p.error || ''}`);
    });
  }
  
  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      endpoints: { successful: successfulEndpoints, total: totalEndpoints },
      pages: { successful: successfulPages, total: totalPages }
    },
    details: {
      endpoints: endpointResults,
      pages: pageResults
    }
  };
  
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to test-results.json');
}

runTests().catch(console.error);
