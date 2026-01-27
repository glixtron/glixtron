import { MongoClient } from 'mongodb'

// Validate and encode environment variable (runtime check only)
let mongodbUri = process.env.MONGODB_URI

if (!mongodbUri) {
  console.warn('⚠️ MONGODB_URI environment variable not set - Database features will be disabled')
}

// URL encode password if it contains special characters
function encodeMongoDBPassword(uri: string): string {
  try {
    const url = new URL(uri)
    // Only encode the password part if it exists
    if (url.password) {
      const encodedPassword = encodeURIComponent(url.password)
      // Reconstruct the URI with encoded password
      const userInfo = url.username ? `${url.username}:${encodedPassword}` : encodedPassword
      return uri.replace(`${url.username}:${url.password}`, userInfo)
    }
    return uri
  } catch (error) {
    console.warn('⚠️ Failed to parse MongoDB URI for password encoding:', error)
    return uri
  }
}

// Apply URL encoding to the connection string
if (mongodbUri) {
  mongodbUri = encodeMongoDBPassword(mongodbUri)
  console.log('🔗 MongoDB URI processed for special characters')
}

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
