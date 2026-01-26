import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// Force dynamic rendering to prevent static analysis issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test basic Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: error.message,
        code: error.code
      })
    }

    return NextResponse.json({
      success: true,
      message: '✅ Supabase connection successful!',
      data: data,
      timestamp: new Date().toISOString()
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
