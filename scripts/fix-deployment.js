#!/usr/bin/env node

/**
 * Deployment Fix Script - Diagnoses and fixes common deployment issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Glixtron Deployment Fix Script');
console.log('================================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Run this script from the project root directory');
  process.exit(1);
}

// Read current environment configuration
console.log('\n📋 Checking Environment Configuration...');

const envExample = fs.readFileSync('.env.example', 'utf8');
const envLocalExists = fs.existsSync('.env.local');

console.log(`✅ .env.example exists: ${envExample.length} bytes`);
console.log(`📁 .env.local exists: ${envLocalExists}`);

if (envLocalExists) {
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const envLines = envLocal.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n🔑 Current Environment Variables:');
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    console.log(`   ${key}: ${value ? 'SET' : 'MISSING'}`);
  });
}

// Check NextAuth configuration
console.log('\n🔐 Checking NextAuth Configuration...');
try {
  const authConfig = fs.readFileSync('lib/auth-config.ts', 'utf8');
  const hasNextAuthSecret = authConfig.includes('NEXTAUTH_SECRET');
  const hasProviders = authConfig.includes('CredentialsProvider');
  
  console.log(`✅ NextAuth config exists: ${authConfig.length} bytes`);
  console.log(`✅ Has NEXTAUTH_SECRET: ${hasNextAuthSecret}`);
  console.log(`✅ Has CredentialsProvider: ${hasProviders}`);
} catch (error) {
  console.log('❌ Error reading auth-config.ts:', error.message);
}

// Check database configuration
console.log('\n💾 Checking Database Configuration...');
try {
  const dbConfig = fs.readFileSync('lib/database-persistent.ts', 'utf8');
  const hasMockDb = dbConfig.includes('MockDatabase');
  const hasSupabase = dbConfig.includes('supabase');
  
  console.log(`✅ Database config exists: ${dbConfig.length} bytes`);
  console.log(`✅ Has Mock Database: ${hasMockDb}`);
  console.log(`✅ Has Supabase: ${hasSupabase}`);
} catch (error) {
  console.log('❌ Error reading database-persistent.ts:', error.message);
}

// Generate Vercel environment variables
console.log('\n🚀 Generating Vercel Environment Variables...');

const vercelEnvVars = [
  '# Required for NextAuth',
  'NEXTAUTH_SECRET=/6513Og8RktelkSL0bnbNnBN10llN154pTmovLtv0gI=',
  'NEXTAUTH_URL=https://glixtron.vercel.app',
  '',
  '# Optional - for Supabase integration (if you want to use real database)',
  '# SUPABASE_URL=your-supabase-project-url',
  '# SUPABASE_ANON_KEY=your-supabase-anon-key', 
  '# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key',
  '',
  '# App Configuration',
  'NODE_ENV=production'
];

console.log('\n📝 Copy these environment variables to your Vercel Dashboard:');
console.log('==========================================================');
vercelEnvVars.forEach(line => {
  console.log(line);
});

// Check if vercel.json exists and is properly configured
console.log('\n📦 Checking Vercel Configuration...');
try {
  const vercelConfig = fs.existsSync('vercel.json') ? JSON.parse(fs.readFileSync('vercel.json', 'utf8')) : null;
  
  if (vercelConfig) {
    console.log('✅ vercel.json exists');
    console.log(`✅ Build command: ${vercelConfig.build?.command || 'npm run build'}`);
    console.log(`✅ Output directory: ${vercelConfig.build?.outputs || '.next'}`);
  } else {
    console.log('⚠️ vercel.json not found - Using default Vercel settings');
  }
} catch (error) {
  console.log('❌ Error reading vercel.json:', error.message);
}

// Generate deployment checklist
console.log('\n✅ Deployment Checklist:');
console.log('========================');
console.log('1. 🌐 Go to Vercel Dashboard > Settings > Environment Variables');
console.log('2. 🔑 Add the environment variables listed above');
console.log('3. ✅ Make sure they are enabled for Production, Preview, and Development');
console.log('4. 🚀 Redeploy your application');
console.log('5. 🧪 Test the deployment at: https://glixtron.vercel.app');
console.log('6. 🔍 Debug with: https://glixtron.vercel.app/api/debug/deployment-check');

console.log('\n🎯 Quick Fix Steps:');
console.log('==================');
console.log('If you want the app to work immediately without Supabase:');
console.log('1. Just add NEXTAUTH_SECRET and NEXTAUTH_URL to Vercel');
console.log('2. The app will use the mock database automatically');
console.log('3. Users can register and login normally');
console.log('4. Later you can add Supabase for persistent data');

console.log('\n🔗 Useful URLs:');
console.log('===============');
console.log('📊 Local Test: http://localhost:3000/api/debug/deployment-check');
console.log('🌐 Production Test: https://glixtron.vercel.app/api/debug/deployment-check');
console.log('🔧 Local Login: http://localhost:3000/login');
console.log('🌐 Production Login: https://glixtron.vercel.app/login');

console.log('\n✨ Done! Your deployment should work after adding the environment variables.');
