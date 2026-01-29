import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

let client: MongoClient
let db: Db
let usersCollection: Collection

// Initialize MongoDB connection
const connectDB = async () => {
  try {
    const clientPromise = await import('@/lib/mongodb')
    client = await clientPromise.default
    db = client.db('glixtronglobal_db_user')
    usersCollection = db.collection('users')
    console.log('✅ MongoDB connected for User model')
    return { client, db, usersCollection }
  } catch (error) {
    console.error('❌ MongoDB connection failed for User model:', error)
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
