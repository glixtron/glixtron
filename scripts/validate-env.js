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
  'GITHUB_CLIENT_SECRET'
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
  
  // In development or CI, allow build to proceed with warning
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('\n⚠️ Development/CI mode: Build will proceed with missing variables');
    console.log('   Some features may not work correctly');
  } else {
    console.log('\n❌ Production mode: Build failed due to missing required variables');
    process.exit(1);
  }
} else {
  console.log('\n🎉 All required variables are present!');
}
