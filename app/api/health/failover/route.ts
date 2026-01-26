import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Import failover utilities
    const { getHealthStatus, getConfig, switchToBackup, switchToPrimary } = await import('@/lib/supabase-failover')
    
    const healthStatus = getHealthStatus()
    const config = getConfig()
    
    return NextResponse.json({
      success: true,
      message: 'Supabase failover health check',
      health: healthStatus,
      configuration: config,
      timestamp: new Date().toISOString(),
      features: {
        automaticFailover: config.mode === 'FAILOVER_ENABLED',
        healthChecks: true,
        manualOverride: true
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failover health check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    // Import failover utilities
    const { switchToBackup, switchToPrimary, getHealthStatus } = await import('@/lib/supabase-failover')
    
    let result = ''
    
    switch (action) {
      case 'switch-to-backup':
        switchToBackup()
        result = 'Switched to backup server'
        break
      case 'switch-to-primary':
        await switchToPrimary()
        result = 'Attempted to switch to primary server'
        break
      case 'force-health-check':
        // This will trigger a health check on next request
        const healthStatus = getHealthStatus()
        result = 'Health check completed'
        return NextResponse.json({
          success: true,
          message: result,
          health: healthStatus,
          timestamp: new Date().toISOString()
        })
      default:
        throw new Error(`Unknown action: ${action}`)
    }
    
    return NextResponse.json({
      success: true,
      message: result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failover action failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
