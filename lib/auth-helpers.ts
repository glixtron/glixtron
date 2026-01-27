import User, { connectDB } from '@/models/User'
import bcrypt from 'bcryptjs'
import { clientPromise } from '@/lib/mongodb-adapter'

// MongoDB-based user functions for NextAuth
export async function findUserByEmail(email: string) {
  try {
    // Ensure connection is established
    await connectDB()
    await clientPromise
    
    console.log('🔍 Searching for user:', email.toLowerCase().trim())
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    console.log('👤 User found:', !!user)
    return user
  } catch (error) {
    console.error('❌ Error finding user by email:', error)
    throw error
  }
}

export async function validatePassword(email: string, password: string) {
  try {
    // Ensure connection is established
    await connectDB()
    await clientPromise
    
    console.log('🔐 Validating password for:', email.toLowerCase().trim())
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    
    if (!user) {
      console.log('❌ User not found for password validation')
      return false
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    console.log('🔐 Password validation result:', isValid)
    return isValid
  } catch (error) {
    console.error('❌ Error validating password:', error)
    throw error
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  avatar_url?: string
}) {
  try {
    // Ensure connection is established
    await connectDB()
    await clientPromise
    
    console.log('👤 Creating user:', userData.email)
    
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const user = new User({
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      avatar_url: userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=random`
    })
    
    await user.save()
    console.log('✅ User created successfully:', user._id)
    return user
  } catch (error) {
    console.error('❌ Error creating user:', error)
    throw error
  }
}
