import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase Direct Connection')
    console.log('=====================================')
    
    // Get environment variables directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    
    console.log('URL:', supabaseUrl)
    console.log('Key exists:', !!supabaseAnonKey)
    console.log('Key preview:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'None')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      })
    }

    // Create client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test connection
    console.log('Testing connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    console.log('Data:', data)
    console.log('Error:', error)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      data: data,
      url: supabaseUrl,
      keyPreview: supabaseAnonKey.substring(0, 20) + '...'
    })
    
  } catch (error: any) {
    console.error('Direct test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
