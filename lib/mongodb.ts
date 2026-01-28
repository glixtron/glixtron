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

// Global singleton pattern for Vercel serverless
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (!mongodbUri) {
  console.error('❌ MONGODB_URI environment variable not set - Database features will be disabled')
  clientPromise = Promise.reject(new Error('MONGODB_URI not configured at runtime'))
} else {
  // Use global singleton to prevent connection leaks in serverless
  if (!global._mongoClientPromise) {
    const client = new MongoClient(mongodbUri, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 1,  // Maintain at least 1 connection
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      serverSelectionTimeoutMS: 10000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      connectTimeoutMS: 10000, // How long a connection can take to be established
      retryWrites: true, // Retry writes if they fail
      retryReads: true, // Retry reads if they fail
    })
    
    global._mongoClientPromise = client.connect()
      .then((client) => {
        console.log('✅ MongoDB Connected Successfully (Singleton)')
        return client
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error)
        // Reset the promise on error so it can be retried
        global._mongoClientPromise = undefined
        throw new Error('Failed to connect to MongoDB Atlas')
      })
  }
  
  clientPromise = global._mongoClientPromise
}

export async function connectToDatabase() {
  if (!mongodbUri) {
    throw new Error('MONGODB_URI not configured at runtime')
  }

  try {
    const client = await clientPromise
    return client
  } catch (error) {
    console.error('❌ Database connection error:', error)
    throw error
  }
}

export default clientPromise
