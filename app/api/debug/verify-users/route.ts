import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from '@/lib/env-config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(ENV_CONFIG.SUPABASE_URL!, ENV_CONFIG.SUPABASE_ANON_KEY!)

    const results = {
      auth_users: null as any,
      public_users: null as any,
      sync_status: 'unknown' as string,
      latest_user: null as any,
      error: null as string | null
    }

    // Check auth.users
    try {
      let authData = null
      let authError = null
      
      try {
        const result = await supabase.rpc('admin_get_users', { limit: 5 })
        authData = result.data
        authError = result.error
      } catch (rpcError: any) {
        authError = 'RPC not available: ' + rpcError.message
      }

      if (authError) {
        // Fallback to direct query (might not work due to permissions)
        results.auth_users = { error: authError, note: 'Auth table not accessible via anon key' }
      } else {
        results.auth_users = authData
      }
    } catch (error: any) {
      results.auth_users = { error: 'Cannot access auth.users table with anon key' }
    }

    // Check public.users
    try {
      const { data: publicData, error: publicError } = await supabase
        .from('users')
        .select('id, email, name, email_verified, provider, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (publicError) {
        results.public_users = { error: publicError.message }
      } else {
        results.public_users = publicData
        results.latest_user = publicData?.[0] || null
      }
    } catch (error: any) {
      results.public_users = { error: error.message }
    }

    // Check if we can at least verify the latest user
    if (results.latest_user) {
      results.sync_status = '✅ Public users table accessible'
    } else {
      results.sync_status = '❌ No users found in public table'
    }

    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'reload_schema') {
      // This would require admin privileges, so we'll provide instructions
      return NextResponse.json({
        success: false,
        message: 'Schema reload must be done manually in Supabase SQL Editor',
        instructions: [
          '1. Go to Supabase Dashboard',
          '2. Open SQL Editor',
          '3. Run: NOTIFY pgrst, \'reload schema\';'
        ]
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
