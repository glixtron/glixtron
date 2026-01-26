import { NextRequest, NextResponse } from 'next/server'
import { ENV_CONFIG } from '@/lib/env-config'
import { supabase } from '@/lib/supabase-real'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const health = {
      environment: {
        node_env: process.env.NODE_ENV || 'unknown',
        is_production: ENV_CONFIG.IS_PRODUCTION,
        is_development: ENV_CONFIG.IS_DEVELOPMENT,
        is_vercel: ENV_CONFIG.IS_VERCEL,
        server_url: ENV_CONFIG.SERVER_URL,
        api_base: ENV_CONFIG.API_BASE
      },
      supabase: {
        url_configured: !!ENV_CONFIG.SUPABASE_URL,
        anon_key_configured: !!ENV_CONFIG.SUPABASE_ANON_KEY,
        service_key_configured: !!ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY,
        url_preview: ENV_CONFIG.SUPABASE_URL ? `${ENV_CONFIG.SUPABASE_URL.substring(0, 30)}...` : 'Not configured',
        anon_key_preview: ENV_CONFIG.SUPABASE_ANON_KEY ? `${ENV_CONFIG.SUPABASE_ANON_KEY.substring(0, 20)}...` : 'Not configured'
      },
      authentication: {
        nextauth_secret: !!ENV_CONFIG.NEXTAUTH_SECRET,
        nextauth_url: !!ENV_CONFIG.NEXTAUTH_URL,
        session_loaded: false, // Will be updated on client side
        user_authenticated: false // Will be updated on client side
      },
      database: {
        connection_test: false,
        tables_exist: false,
        error: undefined as string | undefined
      }
    }

    // Test database connection
    try {
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        health.database.error = error.message
        if (error.code === 'PGRST116') {
          health.database.error = 'Tables do not exist. Run the SQL setup script.'
        }
      } else {
        health.database.connection_test = true
        health.database.tables_exist = true
      }
    } catch (error: any) {
      health.database.error = error.message || 'Connection failed'
    }

    return NextResponse.json(health)
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
