import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { clientPromise } from '@/lib/mongodb-adapter'

// MongoDB-based user functions for NextAuth
export async function findUserByEmail(email: string) {
  try {
    await clientPromise
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    return user
  } catch (error) {
    console.error('Error finding user by email:', error)
    return null
  }
}

export async function validatePassword(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return false
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    return isValid
  } catch (error) {
    console.error('Error validating password:', error)
    return false
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  avatar_url?: string
}) {
  try {
    await clientPromise
    
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const user = new User({
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      avatar_url: userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=random`
    })
    
    await user.save()
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
