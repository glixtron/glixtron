import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()
    
    // Test AI provider status
    const startTime = Date.now()
    let configured = false
    let testPassed = false
    let error = null
    
    switch (provider) {
      case 'gemini':
        configured = !!process.env.GEMINI_API_KEY
        if (configured) {
          // Test Gemini API
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Test' }] }]
            })
          })
          testPassed = response.ok
          if (!testPassed) {
            error = `HTTP ${response.status}`
          }
        }
        break
        
      case 'deepseek':
        configured = !!process.env.DEEPSEEK_API_KEY
        if (configured) {
          // Test DeepSeek API
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: 'Test' }],
              max_tokens: 10
            })
          })
          testPassed = response.ok
          if (!testPassed) {
            error = `HTTP ${response.status}`
          }
        }
        break
        
      case 'firecrawl':
        configured = !!process.env.FIRECRAWL_API_KEY
        if (configured) {
          // Test Firecrawl API
          const response = await fetch('https://api.firecrawl.dev/v1/status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            }
          })
          testPassed = response.ok
          if (!testPassed) {
            error = `HTTP ${response.status}`
          }
        }
        break
        
      default:
        error = 'Unknown provider'
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      configured,
      testPassed,
      responseTime,
      error,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      configured: false,
      testPassed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: 0
    }, { status: 500 })
  }
}
