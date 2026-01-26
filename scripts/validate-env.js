#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Runs before build to ensure all required variables are present
 */

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalVars = [
  'NODE_ENV',
  'SUPABASE_URL_BACKUP',
  'SUPABASE_ANON_KEY_BACKUP',
  'SUPABASE_SERVICE_ROLE_KEY_BACKUP'
];

console.log('🔍 Validating environment variables...\n');

const missingVars = [];
const presentVars = [];
const backupVars = [];

// Check required variables
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
  } else {
    presentVars.push(varName);
  }
});

// Check optional variables
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    presentVars.push(varName);
    if (varName.includes('BACKUP')) {
      backupVars.push(varName);
    }
  }
});

// Report results
console.log(`✅ Present variables (${presentVars.length}):`);
presentVars.forEach(varName => {
  const value = process.env[varName];
  const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
    ? '[REDACTED]' 
    : value;
  console.log(`   ${varName}: ${displayValue}`);
});

if (backupVars.length > 0) {
  console.log(`\n🔄 Backup configuration (${backupVars.length}):`);
  backupVars.forEach(varName => {
    console.log(`   ${varName}: [CONFIGURED]`);
  });
  console.log('\n🎉 High availability mode enabled!');
} else {
  console.log('\n⚠️ No backup configured - single server mode');
}

if (missingVars.length > 0) {
  console.log(`\n❌ Missing variables (${missingVars.length}):`);
  missingVars.forEach(varName => {
    console.log(`   ${varName}: NOT SET`);
  });
  
  console.log('\n💡 To fix this:');
  console.log('1. For local development: Add to .env.local');
  console.log('2. For Vercel: Add to Environment Variables in dashboard');
  console.log('3. For Netlify: Add to Environment Variables in dashboard');
  
  process.exit(1);
} else {
  console.log('\n🎉 All required environment variables are present!');
  console.log('✅ Ready for build!');
}
