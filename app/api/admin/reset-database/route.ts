import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * POST /api/admin/reset-database
 * Reset all user data (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const DB_FILE = join(process.cwd(), 'data', 'users.json')
    
    // Clear the database file
    if (existsSync(DB_FILE)) {
      writeFileSync(DB_FILE, JSON.stringify({}), 'utf-8')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successfully'
    })
  } catch (error: any) {
    console.error('Error resetting database:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reset database' },
      { status: 500 }
    )
  }
}
