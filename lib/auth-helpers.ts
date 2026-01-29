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
    const user = await User.findByEmail(email.toLowerCase().trim())
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
    const user = await User.findByEmail(email.toLowerCase().trim())
    
    if (!user) {
      console.log('❌ User not found for password validation')
      return false
    }
    
    if (!user.password) {
      console.log('❌ User has no password field')
      return false
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    console.log('🔐 Password validation result:', isValid)
    console.log('🔍 User password hash exists:', !!user.password)
    console.log('🔍 Provided password length:', password.length)
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
    
    console.log('👤 Creating new user:', userData.email.toLowerCase().trim())
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Create user with MongoDB driver
    const newUser = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      avatar_url: userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff`,
      emailVerified: false
    })
    
    console.log('✅ User created successfully:', { id: newUser._id, email: newUser.email })
    return newUser
  } catch (error) {
    console.error('❌ Error creating user:', error)
    throw error
  }
}
