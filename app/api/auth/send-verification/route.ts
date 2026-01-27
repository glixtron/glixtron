import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Email verification has been disabled',
    message: 'Registration no longer requires email verification'
  }, { status: 410 }) // 410 Gone
}

export async function GET() {
  return NextResponse.json({
    message: 'Email verification endpoint has been disabled',
    status: 'Email confirmation is no longer required for registration'
  })
}
