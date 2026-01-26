#!/usr/bin/env node

/**
 * Test Frontend Registration Flow - Simulates browser registration
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://glixtron.vercel.app' 
  : 'http://localhost:3000';

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

async function testFrontendRegistration() {
  console.log('🧪 Testing Frontend Registration Flow');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  const testUser = {
    name: 'Frontend Test User',
    email: `frontend-test-${Date.now()}@glixtron.com`,
    password: 'Frontend123!'
  };

  console.log(`📧 Test Email: ${testUser.email}`);
  console.log(`🔑 Test Password: ${testUser.password}`);

  try {
    // Test the exact same API call that the frontend makes
    console.log('\n🔄 Simulating frontend registration API call...');
    
    const response = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test Script)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Referer': `${BASE_URL}/register`,
        'Origin': BASE_URL
      },
      body: JSON.stringify({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password
      })
    });

    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response Data:`, JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.success) {
      console.log('✅ Frontend registration API working!');
      
      // Test login immediately after registration
      console.log('\n🔐 Testing login after registration...');
      
      const loginResponse = await makeRequest(`${BASE_URL}/api/test/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.status === 200 && loginResponse.data.success) {
        console.log('✅ Login after registration successful!');
        console.log('\n🎉 Complete registration flow working!');
        console.log('\n🔑 Test Credentials Ready:');
        console.log(`📧 Email: ${testUser.email}`);
        console.log(`🔑 Password: ${testUser.password}`);
        console.log(`🌐 Login URL: ${BASE_URL}/login`);
        console.log(`🌐 Register URL: ${BASE_URL}/register`);
      } else {
        console.log('❌ Login after registration failed:', loginResponse.data);
      }
    } else {
      console.log('❌ Frontend registration failed:', response.data);
    }
  } catch (error) {
    console.error('❌ Error testing frontend registration:', error.message);
  }
}

testFrontendRegistration();
