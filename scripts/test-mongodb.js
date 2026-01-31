#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Tests MongoDB Atlas connection and provides debugging info
 */

const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');
  
  // Get MongoDB URI from environment
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('\n💡 Fix: Add MONGODB_URI to your .env.local file');
    process.exit(1);
  }
  
  console.log(`📡 Connecting to: ${uri.replace(/\/\/.*@/, '//***@')}`);
  
  const client = new MongoClient(uri, {
    // SSL options for MongoDB Atlas
    ssl: true,
    tlsAllowInvalidCertificates: true, // Only for local development
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    // Test database access
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📁 Collections: ${collections.length} found`);
    
    if (collections.length > 0) {
      console.log('   • ' + collections.map(c => c.name).join('\n   • '));
    }
    
    // Test a simple operation
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test from Glixtron'
    };
    
    await db.collection('connection_tests').insertOne(testDoc);
    console.log('✅ Database write test successful');
    
    const count = await db.collection('connection_tests').countDocuments();
    console.log(`📈 Test documents in collection: ${count}`);
    
    console.log('\n🎉 MongoDB Atlas is working perfectly!');
    console.log('   • Connection: ✅');
    console.log('   • Database: ✅');
    console.log('   • Operations: ✅');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('certificate')) {
      console.log('\n🔐 SSL Certificate Issue Detected');
      console.log('   This is common in corporate networks or certain OS setups.');
      console.log('\n🔧 Solutions:');
      console.log('   1. For local development only:');
      console.log('      export NODE_TLS_REJECT_UNAUTHORIZED=0');
      console.log('   2. For production (Vercel):');
      console.log('      - Add proper SSL certificate to MongoDB Atlas');
      console.log('      - Ensure Vercel can reach MongoDB Atlas');
      console.log('   3. Alternative: Use MongoDB Atlas IP Whitelist');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ENOTFOUND')) {
      console.log('\n🔐 Network Issue Detected');
      console.log('   Check if MongoDB Atlas is accessible from your network');
    } else if (error.message.includes('authentication')) {
      console.log('\n🔐 Authentication Issue');
      console.log('   Verify username/password in MongoDB URI');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the test
testMongoConnection().catch(console.error);
