/**
 * MongoDB URI Diagnostic Tool
 * Helps identify and fix MongoDB connection issues
 */

import { MongoClient } from 'mongodb'

export function diagnoseMongoURI(uri: string): {
  isValid: boolean
  issues: string[]
  suggestions: string[]
  parsed: {
    protocol?: string
    username?: string
    host?: string
    cluster?: string
    database?: string
    options?: string
  }
} {
  const issues: string[] = []
  const suggestions: string[] = []
  const parsed: any = {}

  try {
    // Basic format check
    if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
      issues.push('URI must start with mongodb+srv:// or mongodb://')
      suggestions.push('Use mongodb+srv:// for Atlas clusters')
    }

    // Parse URI components
    const url = new URL(uri)
    parsed.protocol = url.protocol
    parsed.username = url.username
    parsed.host = url.hostname
    parsed.database = url.pathname.substring(1) // Remove leading slash
    parsed.options = url.search

    // Check hostname format
    if (url.hostname.includes('_mongodb._tcp.cluster.mongodb.net')) {
      issues.push('Cluster name is missing from hostname')
      suggestions.push('Hostname should be like: cluster-name.mongodb.net')
      suggestions.push('Current hostname: ' + url.hostname)
    }

    // Check for proper Atlas hostname
    if (url.hostname.includes('.mongodb.net')) {
      const clusterMatch = url.hostname.match(/^([^.]+)\.mongodb\.net$/)
      if (clusterMatch) {
        parsed.cluster = clusterMatch[1]
      } else {
        issues.push('Invalid MongoDB Atlas hostname format')
        suggestions.push('Expected format: cluster-name.mongodb.net')
      }
    }

    // Check for database name
    if (!parsed.database) {
      issues.push('No database name specified in URI')
      suggestions.push('Add /database-name to the end of URI')
    }

    // Check for connection options
    if (!parsed.options) {
      suggestions.push('Add connection options: ?retryWrites=true&w=majority&maxPoolSize=100')
    }

    // Check for special characters in password
    if (url.password && /[!@#$%^&*(),.?":{}|<>]/.test(url.password)) {
      suggestions.push('Password contains special characters - ensure proper URL encoding')
      suggestions.push('Use encodeURIComponent() for password if needed')
    }

  } catch (error) {
    issues.push('Failed to parse URI: ' + error.message)
    suggestions.push('Check URI format and special characters')
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
    parsed
  }
}

export function generateCorrectURI(clusterName: string, username: string, password: string, database: string = 'careerpath-pro'): string {
  // Encode password for special characters
  const encodedPassword = encodeURIComponent(password)
  
  return `mongodb+srv://${username}:${encodedPassword}@${clusterName}.mongodb.net/${database}?retryWrites=true&w=majority&maxPoolSize=100`
}

export function testMongoConnection(uri: string): Promise<{
  success: boolean
  error?: string
  databases?: string[]
}> {
  return new Promise(async (resolve) => {
    try {
      console.log('🔗 Testing MongoDB connection...')
      console.log('📊 URI:', uri.replace(/:([^:@]+)@/, ':***@')) // Hide password
      
      const client = new MongoClient(uri, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      })

      await client.connect()
      console.log('✅ Connected to MongoDB')

      // List databases to verify access
      const admin = client.db().admin()
      const result = await admin.listDatabases()
      const databases = result.databases.map(db => db.name)

      await client.close()
      console.log('✅ Connection test successful')

      resolve({
        success: true,
        databases
      })
    } catch (error: any) {
      console.error('❌ Connection test failed:', error.message)
      resolve({
        success: false,
        error: error.message
      })
    }
  })
}

// Export diagnostic function for API usage
export async function runMongoDiagnostic() {
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    return {
      error: 'MONGODB_URI environment variable is missing',
      diagnostic: null
    }
  }

  const diagnostic = diagnoseMongoURI(uri)
  
  // If URI looks valid, test connection
  if (diagnostic.isValid) {
    const connectionTest = await testMongoConnection(uri)
    return {
      diagnostic,
      connectionTest
    }
  }

  return {
    diagnostic,
    connectionTest: null
  }
}
