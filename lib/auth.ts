/**
 * Authentication utilities
 * Mock implementation for MVP - replace with real database in production
 */

export interface User {
  id: string
  email: string
  name: string
  password?: string
  emailVerified: boolean
  createdAt: Date
  provider?: 'credentials' | 'google'
  image?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
    behance?: string
    dribbble?: string
  }
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    emailUpdates?: boolean
  }
}

// Mock database (in production, use real database)
export const users: Map<string, User> = new Map()
const emailVerificationTokens: Map<string, string> = new Map()

export async function createUser(data: {
  email: string
  name: string
  password: string
}): Promise<User> {
  // Check if user exists
  if (users.has(data.email)) {
    throw new Error('User already exists')
  }
  
  // In production, hash password with bcrypt
  const user: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.name,
    password: data.password, // In production, hash this
    emailVerified: false,
    createdAt: new Date(),
    provider: 'credentials'
  }
  
  users.set(data.email, user)
  
  // Auto-verify email for seamless experience (no email service set up)
  // In production, generate token and send verification email
  user.emailVerified = true
  
  return user
}

export async function verifyUser(email: string, token: string): Promise<boolean> {
  const storedToken = emailVerificationTokens.get(email)
  if (storedToken === token) {
    const user = users.get(email)
    if (user) {
      user.emailVerified = true
      users.set(email, user)
      emailVerificationTokens.delete(email)
      return true
    }
  }
  return false
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return users.get(email) || null
}

export async function findUserById(id: string): Promise<User | null> {
  for (const user of Array.from(users.values())) {
    if (user.id === id) {
      return user
    }
  }
  return null
}

export async function validatePassword(email: string, password: string): Promise<boolean> {
  console.log('Auth: validatePassword called for:', email)
  const user = await findUserByEmail(email)
  console.log('Auth: User found in validatePassword:', user ? `Yes (${user.email})` : 'No')
  
  if (!user || !user.password) {
    console.log('Auth: User or password missing')
    return false
  }
  
  // In production, use bcrypt.compare
  const isValid = user.password === password
  console.log('Auth: Password comparison result:', isValid)
  return isValid
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const user = await findUserById(id)
  if (!user) {
    return null
  }
  
  // Update user data
  Object.assign(user, data)
  users.set(user.email, user)
  
  return user
}

// Google OAuth functions removed - will be added later
