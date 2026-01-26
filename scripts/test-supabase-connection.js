#!/usr/bin/env node

/**
 * Test Supabase Connection and Tables
 */

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: SUPABASE_URL and SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection');
  console.log('================================');
  console.log(`🌐 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...`);
  console.log('');

  try {
    // Test basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Table "users" does not exist');
        console.log('📝 You need to run the database setup script');
        console.log('');
        console.log('🔧 To fix this:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Click on "SQL Editor" in the sidebar');
        console.log('3. Click "New query"');
        console.log('4. Copy the content of scripts/setup-supabase.sql');
        console.log('5. Paste it and click "Run"');
        console.log('');
        console.log('📄 Or run this command to see the SQL:');
        console.log('cat scripts/setup-supabase.sql');
      } else {
        console.log('❌ Connection error:', error.message);
        console.log('Code:', error.code);
        console.log('Details:', error.details);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Users table exists');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  try {
    // Test if we can create a test user (this will fail if tables don't exist)
    console.log('');
    console.log('2️⃣ Testing user creation...');
    
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'TestPassword123!'
    };

    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name
        }
      }
    });

    if (error) {
      console.log('❌ Auth signup error:', error.message);
    } else {
      console.log('✅ Auth signup successful!');
      console.log('📧 Email:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
    }
  } catch (error) {
    console.log('❌ Auth test error:', error.message);
  }

  try {
    // Test database tables
    console.log('');
    console.log('3️⃣ Checking database tables...');
    
    const tables = ['users', 'user_profiles', 'assessments', 'email_verifications'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ Table "${table}": ${error.message}`);
        } else {
          console.log(`✅ Table "${table}": Exists`);
        }
      } catch (e) {
        console.log(`❌ Table "${table}": Error checking`);
      }
    }
  } catch (error) {
    console.log('❌ Table check error:', error.message);
  }

  console.log('');
  console.log('🎯 Next Steps:');
  console.log('===============');
  console.log('1. If tables don\'t exist, run the setup script in Supabase');
  console.log('2. Check your Supabase project settings');
  console.log('3. Verify environment variables are correct');
  console.log('4. Test registration again after setup');
}

testSupabaseConnection().catch(console.error);
