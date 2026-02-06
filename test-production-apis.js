const fs = require('fs');

const BASE_URL = 'https://glixtron-pilot.vercel.app';

async function testAPI(name, path, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`🧪 Testing ${name}...`);
    const response = await fetch(`${BASE_URL}${path}`, options);
    const status = response.status;
    
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    
    const success = status >= 200 && status < 300;
    console.log(`${success ? '✅' : '❌'} ${name}: ${status}`);
    
    if (!success) {
      console.log(`   Error: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`);
    }
    
    return { name, path, method, status, success, data };
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
    return { name, path, method, status: 'ERROR', success: false, error: error.message };
  }
}

async function runProductionTests() {
  console.log('🚀 TESTING PRODUCTION APIS\n');
  
  // Test all endpoints
  const tests = [
    // Health checks
    ['Health Check', '/api/health'],
    ['GlixAI Health', '/api/glix/analyze'],
    ['JD Extractor Health', '/api/extract-jd'],
    
    // GlixAI Analysis (POST)
    ['GlixAI Analysis', '/api/glix/analyze', 'POST', {
      resumeText: 'Experienced software developer with 5+ years in React, Node.js, TypeScript, and AWS. Built scalable web applications and led team of 3 developers.',
      streamType: 'pcm'
    }],
    
    // JD Extraction (POST)
    ['JD Extraction', '/api/extract-jd', 'POST', {
      url: 'https://www.linkedin.com/jobs/view/senior-software-engineer-123456789/'
    }],
    
    // PDF Generation (POST)
    ['PDF Generation', '/api/glix/roadmap-pdf', 'POST', {
      resumeText: 'Software developer with React and Node.js experience',
      streamType: 'pcm',
      analysisId: Date.now()
    }],
    
    // Other endpoints
    ['Career Guidance', '/api/career-guidance'],
    ['Resume Analysis', '/api/resume/analyze'],
    ['JD Resume Match', '/api/jd-resume-match'],
    ['Auth Config', '/api/auth/[...nextauth]'],
    ['User Profile', '/api/user/profile'],
    ['User Assessment', '/api/user/assessment']
  ];
  
  const results = [];
  
  for (const [name, path, method = 'GET', body] of tests) {
    const result = await testAPI(name, path, method, body);
    results.push(result);
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY\n');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  console.log(`✅ ${successful}/${total} endpoints working`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed endpoints:');
    failed.forEach(f => {
      console.log(`   - ${f.name}: ${f.status} ${f.error || ''}`);
    });
  }
  
  // Test pages
  console.log('\n📄 Testing Key Pages...\n');
  const pages = [
    'Career Guidance',
    'Job Extractor', 
    'Resume Scanner',
    'JD Resume Match',
    'Job Matching',
    'GlixAI',
    'Dashboard',
    'Login',
    'Register'
  ];
  
  for (const page of pages) {
    const pagePath = page.toLowerCase().replace(' ', '-');
    await testAPI(page, `/${pagePath}`);
  }
  
  // Save results
  const testResults = {
    timestamp: new Date().toISOString(),
    summary: { successful, total },
    results
  };
  
  fs.writeFileSync('production-test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n💾 Results saved to production-test-results.json');
}

runProductionTests().catch(console.error);
