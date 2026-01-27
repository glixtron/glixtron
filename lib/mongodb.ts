import { MongoClient } from 'mongodb'

// Validate environment variable (runtime check only)
const mongodbUri = process.env.MONGODB_URI

// Global variable to cache the database connection
declare global {
  // eslint-disable-next-line no-var
  var mongo: { conn: MongoClient | null; promise: Promise<MongoClient> | null } | undefined
}

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (!mongodbUri) {
    console.warn('⚠️ MONGODB_URI environment variable not set - Database features will be disabled')
    throw new Error('MONGODB_URI not configured at runtime')
  }

  if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
    }

    cached.promise = MongoClient.connect(mongodbUri, opts)
      .then((client) => {
        return client
      })
      .catch(error => {
        console.error('❌ MongoDB connection error:', error)
        if (cached) cached.promise = null // Reset promise on error
        throw new Error('Failed to connect to MongoDB Atlas')
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    if (cached) cached.promise = null // Reset promise on error
    throw error
  }
}
export default connectToDatabase()
