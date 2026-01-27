import { MongoClient } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI

// Create a conditional client promise
let clientPromise: Promise<MongoClient>

if (!mongodbUri) {
  console.warn('⚠️ MONGODB_URI environment variable not set - MongoDB adapter will be disabled')
  clientPromise = Promise.reject(new Error('MONGODB_URI not configured'))
} else {
  const client = new MongoClient(mongodbUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    retryWrites: true
  })
  
  clientPromise = client.connect()
}

export { clientPromise }
