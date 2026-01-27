import { MongoClient } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI

// Create a conditional client promise - NO LOCAL FALLBACK
let clientPromise: Promise<MongoClient>

if (!mongodbUri) {
  console.error('❌ MONGODB_URI environment variable not set - MongoDB adapter will fail')
  clientPromise = Promise.reject(new Error('MONGODB_URI not configured - No local database fallback'))
} else {
  // Apply URL encoding for special characters
  let processedUri = mongodbUri
  try {
    const url = new URL(mongodbUri)
    if (url.password) {
      const encodedPassword = encodeURIComponent(url.password)
      const userInfo = url.username ? `${url.username}:${encodedPassword}` : encodedPassword
      processedUri = mongodbUri.replace(`${url.username}:${url.password}`, userInfo)
      console.log('🔗 MongoDB URI password encoded for special characters')
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse MongoDB URI for password encoding:', error)
  }

  const client = new MongoClient(processedUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    retryWrites: true
  })
  
  clientPromise = client.connect()
}

export { clientPromise }
