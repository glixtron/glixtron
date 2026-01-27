import { MongoClient } from 'mongodb'

// Validate environment variable
const mongodbUri = process.env.MONGODB_URI
if (!mongodbUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Global variable to cache the database connection
declare global {
  // eslint-disable-next-line no-var
  var mongo: { conn: MongoClient | null; promise: Promise<MongoClient> | null } | undefined
}

let cached = global.mongo

if (!cached) {
  global.mongo = { conn: null, promise: null }
  cached = global.mongo
}

async function connectToDatabase() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority' as const
    }

    if (cached) {
      cached.promise = MongoClient.connect(mongodbUri!, opts)
        .then(client => {
          console.log('✅ Connected to MongoDB Atlas')
          return client
        })
        .catch(error => {
          console.error('❌ MongoDB connection error:', error)
          if (cached) cached.promise = null // Reset promise on error
          throw new Error('Failed to connect to MongoDB Atlas')
        })
    }
  }

  try {
    if (cached) {
      cached.conn = await cached.promise
      return cached.conn
    }
    throw new Error('Cache not initialized')
  } catch (error) {
    if (cached) cached.promise = null // Reset promise on error
    throw error
  }
}

export default connectToDatabase()
