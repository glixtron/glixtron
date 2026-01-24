/**
 * Simple persistent mock database for development
 * In production, replace with Supabase or another real database
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

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

const DB_FILE = join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
import { mkdirSync } from 'fs'
const dataDir = join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

class MockDatabase {
  private users: Map<string, User> = new Map()

  constructor() {
    this.loadFromFile()
  }

  private loadFromFile() {
    try {
      if (existsSync(DB_FILE)) {
        const data = readFileSync(DB_FILE, 'utf-8')
        const usersData = JSON.parse(data)
        
        // Convert plain objects back to User instances with proper Date objects
        Object.entries(usersData).forEach(([email, user]: [string, any]) => {
          this.users.set(email, {
            ...user,
            createdAt: new Date(user.createdAt)
          })
        })
        
        console.log(`Database loaded: ${this.users.size} users`)
      } else {
        console.log('No existing database file found, starting fresh')
      }
    } catch (error) {
      console.error('Error loading database:', error)
    }
  }

  private saveToFile() {
    try {
      const usersData: Record<string, any> = {}
      this.users.forEach((user, email) => {
        usersData[email] = user
      })
      
      writeFileSync(DB_FILE, JSON.stringify(usersData, null, 2))
      console.log(`Database saved: ${this.users.size} users`)
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }

  async createUser(data: {
    email: string
    name: string
    password: string
  }): Promise<User> {
    if (this.users.has(data.email)) {
      throw new Error('User already exists')
    }
    
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      name: data.name,
      password: data.password, // In production, hash this
      emailVerified: true, // Auto-verify for development
      createdAt: new Date(),
      provider: 'credentials'
    }
    
    this.users.set(data.email, user)
    this.saveToFile()
    
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null
  }

  async findUserById(id: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user
      }
    }
    return null
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findUserByEmail(email)
    if (!user || !user.password) {
      return false
    }
    // In production, use bcrypt.compare
    return user.password === password
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.findUserById(id)
    if (!user) {
      return null
    }
    
    // Update user data
    Object.assign(user, data)
    this.users.set(user.email, user)
    this.saveToFile()
    
    return user
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }
}

// Export a singleton instance
export const database = new MockDatabase()

// Export functions that match the original API
export const createUser = database.createUser.bind(database)
export const findUserByEmail = database.findUserByEmail.bind(database)
export const findUserById = database.findUserById.bind(database)
export const validatePassword = database.validatePassword.bind(database)
export const updateUser = database.updateUser.bind(database)
export const getAllUsers = database.getAllUsers.bind(database)
