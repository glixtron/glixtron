/**
 * Supabase Failover Client
 * High Availability with automatic failover to backup server
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Primary Supabase configuration
const PRIMARY_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const PRIMARY_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const PRIMARY_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

// Backup Supabase configuration
const BACKUP_URL = process.env.SUPABASE_URL_BACKUP || process.env.NEXT_PUBLIC_SUPABASE_URL_BACKUP
const BACKUP_KEY = process.env.SUPABASE_ANON_KEY_BACKUP || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BACKUP
const BACKUP_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY_BACKUP || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_BACKUP

// Health check status
let primaryHealthy = true
let lastHealthCheck = 0
const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds

// Create clients
let primaryClient: SupabaseClient | null = null
let backupClient: SupabaseClient | null = null
let primaryAdminClient: SupabaseClient | null = null
let backupAdminClient: SupabaseClient | null = null

// Initialize clients
if (PRIMARY_URL && PRIMARY_KEY) {
  primaryClient = createClient(PRIMARY_URL, PRIMARY_KEY)
  console.log('✅ Primary Supabase client initialized')
} else {
  console.warn('⚠️ Primary Supabase configuration missing')
}

if (BACKUP_URL && BACKUP_KEY) {
  backupClient = createClient(BACKUP_URL, BACKUP_KEY)
  console.log('✅ Backup Supabase client initialized')
} else {
  console.warn('⚠️ Backup Supabase configuration missing')
}

if (PRIMARY_URL && PRIMARY_SERVICE_KEY) {
  primaryAdminClient = createClient(PRIMARY_URL, PRIMARY_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

if (BACKUP_URL && BACKUP_SERVICE_KEY) {
  backupAdminClient = createClient(BACKUP_URL, BACKUP_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Health check function
async function checkPrimaryHealth(): Promise<boolean> {
  if (!primaryClient) return false
  
  try {
    const { data, error } = await primaryClient
      .from('users')
      .select('count')
      .limit(1)
      .single()
    
    return !error
  } catch (error) {
    console.warn('Primary health check failed:', error)
    return false
  }
}

// Update health status
async function updateHealthStatus() {
  const now = Date.now()
  if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    primaryHealthy = await checkPrimaryHealth()
    lastHealthCheck = now
    
    if (!primaryHealthy && backupClient) {
      console.warn('⚠️ Primary server unhealthy, using backup')
    } else if (primaryHealthy) {
      console.log('✅ Primary server healthy')
    }
  }
}

// Create failover proxy
function createFailoverProxy(
  primary: SupabaseClient | null,
  backup: SupabaseClient | null,
  clientType: 'public' | 'admin'
): SupabaseClient {
  if (!primary && !backup) {
    throw new Error('No Supabase clients available')
  }
  
  const target = primary || backup!
  
  return new Proxy(target, {
    get(targetObj, prop: string) {
      const originalMethod = (targetObj as any)[prop]
      
      if (typeof originalMethod === 'function') {
        return async (...args: any[]) => {
          await updateHealthStatus()
          
          // Try primary first if it's healthy
          if (primaryHealthy && primary) {
            try {
              const result = await originalMethod.apply(primary, args)
              
              // If this was a write operation and we have a backup, we might want to sync
              if (clientType === 'admin' && backup && shouldSyncOperation(prop)) {
                // Note: In production, you'd want to implement proper async sync
                console.log('Sync operation to backup (not implemented)')
              }
              
              return result
            } catch (error: any) {
              console.warn(`Primary ${prop} failed, trying backup:`, error.message)
              primaryHealthy = false
              
              if (backup) {
                return (backup as any)[prop](...args)
              }
              throw error
            }
          }
          
          // Use backup if primary is unhealthy
          if (backup) {
            return (backup as any)[prop](...args)
          }
          
          // Fallback to primary even if marked unhealthy
          if (primary) {
            return originalMethod.apply(primary, args)
          }
          
          throw new Error('No Supabase client available')
        }
      }
      
      return originalMethod
    }
  })
}

// Determine if operation should be synced to backup
function shouldSyncOperation(operation: string): boolean {
  const syncOperations = ['insert', 'update', 'upsert', 'delete']
  return syncOperations.some(op => operation.toLowerCase().includes(op))
}

// Export failover clients
export const supabase = createFailoverProxy(primaryClient, backupClient, 'public')
export const supabaseAdmin = createFailoverProxy(primaryAdminClient, backupAdminClient, 'admin')

// Export health status for monitoring
export const getHealthStatus = () => ({
  primaryHealthy,
  primaryAvailable: !!primaryClient,
  backupAvailable: !!backupClient,
  lastHealthCheck
})

// Export manual failover function
export const switchToBackup = () => {
  primaryHealthy = false
  console.warn('🔄 Manually switched to backup server')
}

// Export manual recovery function
export const switchToPrimary = async () => {
  const isHealthy = await checkPrimaryHealth()
  if (isHealthy) {
    primaryHealthy = true
    console.log('✅ Manually switched back to primary server')
  } else {
    console.warn('⚠️ Primary server still unhealthy')
  }
}

// Export configuration info
export const getConfig = () => ({
  primaryUrl: PRIMARY_URL ? '[CONFIGURED]' : '[MISSING]',
  backupUrl: BACKUP_URL ? '[CONFIGURED]' : '[MISSING]',
  mode: backupClient ? 'FAILOVER_ENABLED' : 'PRIMARY_ONLY'
})
