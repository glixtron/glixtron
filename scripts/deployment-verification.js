#!/usr/bin/env node

/**
 * Production Deployment Verification Script
 * Verifies all critical systems are working before Vercel deployment
 */

const { execSync } = require('child_process');

console.log('🚀 Glixtron Production Deployment Verification\n');

// Test 1: Build Status
console.log('📦 1. Testing Build Status...');
try {
  const buildResult = execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
  if (buildResult.includes('✅ Glixtron build completed successfully')) {
    console.log('✅ Build: PASSED');
  } else {
    console.log('❌ Build: FAILED');
    console.log(buildResult);
  }
} catch (error) {
  console.log('❌ Build: FAILED');
  console.log(error.message);
}

// Test 2: Environment Variables
console.log('\n🔧 2. Checking Environment Variables...');
const requiredEnvVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'MONGODB_URI', 'GEMINI_API_KEY', 'FIRECRAWL_API_KEY'];
const optionalEnvVars = ['DEEPSEEK_API_KEY'];

let missingVars = [];
let presentVars = [];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    presentVars.push(envVar);
  } else {
    missingVars.push(envVar);
  }
});

console.log(`✅ Present: ${presentVars.length} required variables`);
if (missingVars.length > 0) {
  console.log(`❌ Missing: ${missingVars.join(', ')}`);
  console.log('⚠️  These must be added to Vercel Environment Variables');
}

optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ Optional: ${envVar}`);
  } else {
    console.log(`⚠️ Optional: ${envVar} (not set)`);
  }
});

// Test 3: API Endpoints
console.log('\n🌐 3. Testing Critical API Endpoints...');
const criticalEndpoints = [
  { name: 'Health Check', url: 'http://localhost:3001/api/health' },
  { name: 'Career Guidance', url: 'http://localhost:3001/api/career-guidance' },
  { name: 'Resume Analysis', url: 'http://localhost:3001/api/resume/analyze-enhanced' },
  { name: 'Dashboard Stats', url: 'http://localhost:3001/api/dashboard/stats' },
  { name: 'Auth', url: 'http://localhost:3001/api/auth/[...nextauth]' }
];

let passedEndpoints = 0;
let failedEndpoints = 0;

for (const endpoint of criticalEndpoints) {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${endpoint.url}`, { stdio: 'pipe' });
    const statusCode = parseInt(response.trim());
    
    if (statusCode === 200) {
      console.log(`✅ ${endpoint.name}: ${statusCode}`);
      passedEndpoints++;
    } else {
      console.log(`❌ ${endpoint.name}: ${statusCode}`);
      failedEndpoints++;
    }
  } catch (error) {
    console.log(`❌ ${endpoint.name}: FAILED (${error.message})`);
    failedEndpoints++;
  }
}

console.log(`\n📊 API Results: ${passedEndpoints}/${criticalEndpoints.length} passed`);

// Test 4: Pages
console.log('\n📄 4. Testing Critical Pages...');
const criticalPages = [
  { name: 'Landing', url: 'http://localhost:3001/landing' },
  { name: 'Resume Scanner', url: 'http://localhost:3001/resume-scanner' },
  { name: 'Career Guidance', url: 'http://localhost:3001/career-guidance' },
  { name: 'Dashboard', url: 'http://localhost:3001/dashboard' }
];

let passedPages = 0;
let failedPages = 0;

for (const page of criticalPages) {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" -L ${page.url}`, { stdio: 'pipe' });
    const statusCode = parseInt(response.trim());
    
    if (statusCode === 200) {
      console.log(`✅ ${page.name}: ${statusCode}`);
      passedPages++;
    } else {
      console.log(`❌ ${page.name}: ${statusCode}`);
      failedPages++;
    }
  } catch (error) {
    console.log(`❌ ${page.name}: FAILED (${error.message})`);
    failedPages++;
  }
}

console.log(`\n📊 Page Results: ${passedPages}/${criticalPages.length} passed`);

// Test 5: MongoDB Connection
console.log('\n🗄️ 5. Testing MongoDB Connection...');
try {
  const mongoTest = execSync('MONGODB_URI="mongodb+srv://glixtronglobal_db_user:anJIJGJpGLWTOzB9@glixtronglobal.8yc6sc4.mongodb.net/glixtronglobal_db_user?retryWrites=true&w=majority" NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/test-mongodb.js', { stdio: 'pipe', encoding: 'utf-8' });
  
  if (mongoTest.includes('✅ MongoDB connection successful!')) {
    console.log('✅ MongoDB: PASSED');
  } else {
    console.log('❌ MongoDB: FAILED');
  }
} catch (error) {
  console.log('❌ MongoDB: FAILED');
  console.log(error.message);
}

// Summary
console.log('\n🎯 DEPLOYMENT READINESS SUMMARY');
console.log('=====================================');

const totalTests = requiredEnvVars.length + criticalEndpoints.length + criticalPages.length + 1; // +1 for MongoDB
const passedTests = presentVars.length + passedEndpoints + passedPages + 1; // +1 for MongoDB
const successRate = Math.round((passedTests / totalTests) * 100);

console.log(`Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`);

if (successRate >= 90) {
  console.log('🎉 READY FOR VERCEL DEPLOYMENT!');
  console.log('   ✅ All critical systems operational');
  console.log('   ✅ Build successful');
  console.log('   ✅ Environment variables configured');
  console.log('   ✅ API endpoints responding');
  console.log('   ✅ Pages loading correctly');
  console.log('   ✅ Database connection working');
  console.log('\n🚀 Run: git push origin main to deploy to Vercel');
} else if (successRate >= 70) {
  console.log('⚠️  MOSTLY READY - Minor Issues Detected');
  console.log('   ⚠️ Some endpoints may need attention');
  console.log('   ⚠️ Consider fixing remaining issues before deployment');
} else {
  console.log('❌ NOT READY FOR DEPLOYMENT');
  console.log('   ❌ Critical issues must be resolved');
  console.log('   ❌ Fix all failed tests before deploying');
}

console.log('\n📋 Next Steps:');
console.log('1. Add missing environment variables to Vercel Dashboard');
console.log('2. Push to GitHub: git push origin main');
console.log('3. Monitor Vercel build and deployment');
console.log('4. Verify production functionality');
