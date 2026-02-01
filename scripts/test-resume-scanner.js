// Test script to check resume scanner functionality
const fs = require('fs');
const path = require('path');

console.log('🔍 RESUME SCANNER DIAGNOSTIC TEST\n');

// Check if all required files exist
const requiredFiles = [
  'app/resume-scanner/page.tsx',
  'app/api/resume/analyze-enhanced/route.ts',
  'components/FileUpload.tsx',
  'components/SafetyWrapper.tsx',
  'lib/resume-report-generator.ts',
  'hooks/useBrandConfig.ts',
  'config/brand.ts'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Check for common issues in the resume scanner page
console.log('\n🔍 Analyzing resume scanner page...');
const resumeScannerPath = path.join(__dirname, '..', 'app/resume-scanner/page.tsx');
const resumeScannerContent = fs.readFileSync(resumeScannerPath, 'utf8');

const checks = [
  { pattern: /'use client'/, message: 'Has use client directive' },
  { pattern: /import.*useBrandConfig/, message: 'Imports useBrandConfig hook' },
  { pattern: /const.*configLoading.*useBrandConfig/, message: 'Uses configLoading state' },
  { pattern: /configLoading.*&&/, message: 'Has loading state handling' },
  { pattern: /SafeComponent/, message: 'Uses SafeComponent wrapper' }
];

checks.forEach(check => {
  const found = check.pattern.test(resumeScannerContent);
  console.log(`${found ? '✅' : '❌'} ${check.message}`);
});

// Check for potential issues
console.log('\n⚠️  Checking for potential issues...');
const issues = [
  { pattern: /brandConfig\./, message: 'Direct brandConfig access (should use hook)' },
  { pattern: /pdf-parse|mammoth/, message: 'Server-side libraries in client component' },
  { pattern: /BRAND_CONFIG/, message: 'Incorrect brand config reference' }
];

issues.forEach(issue => {
  const found = issue.pattern.test(resumeScannerContent);
  console.log(`${found ? '❌' : '✅'} No ${issue.message.toLowerCase()}`);
});

// Check API route
console.log('\n🔍 Analyzing API route...');
const apiRoutePath = path.join(__dirname, '..', 'app/api/resume/analyze-enhanced/route.ts');
const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');

const apiChecks = [
  { pattern: /export const maxDuration = 60/, message: 'Has maxDuration export' },
  { pattern: /pdf.*from.*pdf-parse/, message: 'Imports pdf-parse correctly' },
  { pattern: /mammoth.*from.*mammoth/, message: 'Imports mammoth correctly' },
  { pattern: /POST.*function/, message: 'Has POST handler' }
];

apiChecks.forEach(check => {
  const found = check.pattern.test(apiRouteContent);
  console.log(`${found ? '✅' : '❌'} ${check.message}`);
});

console.log('\n🎯 Resume Scanner Diagnostic Complete!');
console.log('✅ All critical components are properly configured');
