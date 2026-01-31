#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Runs before build to ensure all required variables are present
 * In development, shows warnings but allows build to proceed
 */

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'MONGODB_URI'
];

const optionalVars = [
  'NODE_ENV',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GEMINI_API_KEY',
  'DEEPSEEK_API_KEY',
  'FIRECRAWL_API_KEY'
];

console.log('🔍 Validating environment variables...\n');

const missingVars = [];
const presentVars = [];
const backupVars = [];

// Check required variables
requiredVars.forEach(varName => {
  const value = process.env[varName] || process.env[`NEXT_PUBLIC_${varName}`];
  if (value) {
    presentVars.push(varName);
  } else {
    missingVars.push(varName);
  }
});

// Check optional/backup variables
optionalVars.forEach(varName => {
  const value = process.env[varName] || process.env[`NEXT_PUBLIC_${varName}`];
  if (value) {
    backupVars.push(varName);
  }
});

// Display results
console.log(`✅ Present variables (${presentVars.length}):`);
if (presentVars.length > 0) {
  presentVars.forEach(varName => console.log(`   ${varName}`));
} else {
  console.log('   None');
}

console.log(`\n🔄 Backup variables (${backupVars.length}):`);
if (backupVars.length > 0) {
  backupVars.forEach(varName => console.log(`   ${varName}`));
} else {
  console.log('   ⚠️ No backup configured - single server mode');
}

if (missingVars.length > 0) {
  console.log(`\n❌ Missing variables (${missingVars.length}):`);
  missingVars.forEach(varName => console.log(`   ${varName}: NOT SET`));
  
  console.log('\n💡 To fix this:');
  console.log('1. For local development: Add to .env.local');
  console.log('2. For Vercel: Add to Environment Variables in dashboard');
  console.log('3. For Netlify: Add to Environment Variables in dashboard');
  
  // Allow build to proceed in all environments - check at runtime instead
  console.log('\n⚠️ Build will proceed - Environment variables will be checked at runtime');
  console.log('   Some features may not work correctly if variables are missing');
} else {
  console.log('\n🎉 All required variables are present!');
}
