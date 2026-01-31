// A quick script to verify your core logic
async function verifySystem() {
  console.log("🔍 Checking System Health...");
  
  const tests = [
    { name: "Auth Secret", check: process.env.NEXTAUTH_SECRET },
    { name: "MongoDB URI", check: process.env.MONGODB_URI },
    { name: "Gemini API", check: process.env.GEMINI_API_KEY },
    { name: "DeepSeek API", check: process.env.DEEPSEEK_API_KEY },
    { name: "Firecrawl API", check: process.env.FIRECRAWL_API_KEY },
  ];

  tests.forEach(t => {
    console.log(`${t.check ? '✅' : '❌'} ${t.name} is ${t.check ? 'Ready' : 'Missing'}`);
  });

  if (tests.every(t => t.check)) {
    console.log("\n🚀 Logic ready for GitHub deployment.");
  } else {
    console.log("\n⚠️ Fix missing variables before pushing!");
  }
}

// Additional checks for critical files
async function verifyFiles() {
  console.log("\n📁 Checking Critical Files...");
  
  const fs = require('fs').promises;
  const path = require('path');
  
  const criticalFiles = [
    'app/resume-scanner/page.tsx',
    'app/api/resume/analyze/route.ts',
    'app/api/career-guidance/route.ts',
    'app/api/user/roadmap/route.ts',
    'app/admin/brand/page.tsx',
    'app/api/admin/config/route.ts',
    'hooks/useBrandConfig.ts',
    'components/RoadmapWidget.tsx',
    'components/CareerCertificateGenerator.tsx'
  ];

  for (const file of criticalFiles) {
    try {
      await fs.access(path.join(process.cwd(), file));
      console.log(`✅ ${file} exists`);
    } catch (error) {
      console.log(`❌ ${file} missing`);
    }
  }
}

// Check for hardcoded API keys
async function checkForHardcodedKeys() {
  console.log("\n🔒 Checking for hardcoded API keys...");
  
  const fs = require('fs').promises;
  const path = require('path');
  
  const suspiciousPatterns = [
    /sk-[a-zA-Z0-9]{20,}/g,
    /mongodb\+srv:\/\/[^\s"']+/g,
    /AIza[a-zA-Z0-9_-]{35,}/g,
    /xoxb-[a-zA-Z0-9_-]{40,}/g
  ];

  const filesToCheck = [
    'app/api/**/*.ts',
    'lib/**/*.ts',
    'components/**/*.tsx',
    'config/**/*.ts'
  ];

  let foundIssues = 0;

  for (const pattern of filesToCheck) {
    try {
      const { execSync } = require('child_process');
      const files = execSync(`find . -name "${pattern}"`, { encoding: 'utf8' }).split('\n').filter(Boolean);
      
      for (const file of files) {
        if (file) {
          const content = await fs.readFile(file, 'utf8');
          
          for (const suspiciousPattern of suspiciousPatterns) {
            const matches = content.match(suspiciousPattern);
            if (matches) {
              console.log(`⚠️  Found suspicious pattern in ${file}: ${matches[0].substring(0, 20)}...`);
              foundIssues++;
            }
          }
        }
      }
    } catch (error) {
      // Ignore file not found errors
    }
  }

  if (foundIssues === 0) {
    console.log('✅ No hardcoded API keys found');
  } else {
    console.log(`❌ Found ${foundIssues} potential hardcoded keys`);
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log("\n🌐 Testing API Endpoints...");
  
  const endpoints = [
    '/api/health',
    '/api/admin/config',
    '/api/user/roadmap'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint} - ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Connection failed`);
    }
  }
}

// Main verification
async function runFullVerification() {
  console.log("🚀 Starting Full System Verification...\n");
  
  verifySystem();
  await verifyFiles();
  await checkForHardcodedKeys();
  await testAPIEndpoints();
  
  console.log("\n🎯 Verification Complete!");
  console.log("📋 Next Steps:");
  console.log("1. Fix any ❌ issues above");
  console.log("2. Run 'npm run build' to test production build");
  console.log("3. Commit and push to GitHub");
  console.log("4. Deploy to Vercel");
}

runFullVerification().catch(console.error);
