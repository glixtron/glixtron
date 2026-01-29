import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

let client: MongoClient
let db: Db
let usersCollection: Collection

// Initialize MongoDB connection
const connectDB = async () => {
  try {
    console.log('🔗 User Model: Connecting to MongoDB...')
    const clientPromise = await import('@/lib/mongodb')
    client = await clientPromise.default
    
    // Use the correct database name
    db = client.db('glixtron')
    usersCollection = db.collection('users')
    
    console.log('✅ User Model: MongoDB connected successfully')
    console.log('📊 User Model: Database:', db.databaseName)
    console.log('📋 User Model: Collection:', usersCollection.collectionName)
    
    return { client, db, usersCollection }
  } catch (error: any) {
    console.error('❌ User Model: MongoDB connection failed:', {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    })
    throw error
  }
}

// User interface
export interface User {
  _id?: string | ObjectId
  name: string
  email: string
  password: string
  avatar_url?: string
  emailVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// User operations class
export class UserOperations {
  static async create(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { usersCollection } = await connectDB()
    const now = new Date()
    const userToInsert = {
      ...userData,
      createdAt: now,
      updatedAt: now
    }
    
    const result = await usersCollection.insertOne(userToInsert)
    return {
      _id: result.insertedId,
      ...userToInsert
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { usersCollection } = await connectDB()
    const user = await usersCollection.findOne({ email })
    return user as User | null
  }

  static async findById(id: string): Promise<User | null> {
    const { usersCollection } = await connectDB()
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })
    return user as User | null
  }

  static async updateById(id: string, updateData: Partial<User>): Promise<User | null> {
    const { usersCollection } = await connectDB()
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    )
    
    if (result.matchedCount === 0) return null
    return await this.findById(id)
  }
}

// Export for backward compatibility
export const User = UserOperations
export default User
export { connectDB }
