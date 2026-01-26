import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// Force dynamic rendering to prevent static analysis issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '✅ Supabase connected successfully!',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
