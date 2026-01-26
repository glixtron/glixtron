#!/usr/bin/env node

/**
 * Test User Pipeline - Creates and tests a test user through the same flow as real users
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://glixtron.vercel.app' 
  : 'http://localhost:3000';

const TEST_USER = {
  name: 'Pipeline Test User',
  email: `pipeline-test-${Date.now()}@glixtron.com`,
  password: 'TestUser123!'
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test functions
async function createTestUser() {
  console.log('🔧 Creating test user...');
  console.log(`📧 Email: ${TEST_USER.email}`);
  console.log(`🔑 Password: ${TEST_USER.password}`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/test/create-test-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Test user created successfully!');
      console.log(`🆔 User ID: ${response.data.user.id}`);
      console.log(`👤 Name: ${response.data.user.name}`);
      return response.data.user;
    } else {
      console.error('❌ Failed to create test user:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    return null;
  }
}

async function testRegistration(user) {
  console.log('\n🧪 Testing registration API...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: TEST_USER.password
      })
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Registration API working!');
      return true;
    } else {
      console.log('⚠️ Registration API response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing registration:', error.message);
    return false;
  }
}

async function testLogin(user) {
  console.log('\n🔐 Testing login API...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/test/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'login',
        email: user.email,
        password: TEST_USER.password
      })
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Login API working!');
      console.log(`👤 Logged in as: ${response.data.user.name}`);
      return true;
    } else {
      console.error('❌ Login failed:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
    return false;
  }
}

async function testAppStatus() {
  console.log('\n🏥 Testing app status...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/status`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ App status healthy!');
      console.log(`📊 Message: ${response.data.message}`);
      return true;
    } else {
      console.error('❌ App status unhealthy:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking app status:', error.message);
    return false;
  }
}

// Main pipeline
async function runPipeline() {
  console.log('🚀 Starting Glixtron Test User Pipeline');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Test app status first
  const statusOk = await testAppStatus();
  if (!statusOk) {
    console.log('\n❌ App is not healthy. Stopping pipeline.');
    process.exit(1);
  }

  // Create test user
  const user = await createTestUser();
  if (!user) {
    console.log('\n❌ Failed to create test user. Stopping pipeline.');
    process.exit(1);
  }

  // Test registration (should fail since user already exists)
  await testRegistration(user);

  // Test login
  const loginOk = await testLogin(user);
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Pipeline Results:');
  console.log(`✅ App Status: ${statusOk ? 'PASS' : 'FAIL'}`);
  console.log(`✅ User Creation: PASS`);
  console.log(`✅ Login Test: ${loginOk ? 'PASS' : 'FAIL'}`);
  
  if (loginOk) {
    console.log('\n🎉 All tests passed! Test user is ready for testing.');
    console.log('\n🔑 Test Credentials:');
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Password: ${TEST_USER.password}`);
    console.log(`🌐 Login URL: ${BASE_URL}/login`);
    console.log(`🌐 Register URL: ${BASE_URL}/register`);
  } else {
    console.log('\n❌ Some tests failed. Please check the logs above.');
    process.exit(1);
  }
}

// Run the pipeline
runPipeline().catch(error => {
  console.error('❌ Pipeline failed:', error);
  process.exit(1);
});
