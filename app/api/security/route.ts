/**
 * Security API Endpoint
 * Multi-layer protection with onion architecture
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityLayer } from '@/lib/security-layer'

export async function GET(request: NextRequest) {
  try {
    const securityStatus = securityLayer.getSecurityStatus()
    
    return NextResponse.json({
      success: true,
      message: 'Security system operational',
      data: {
        status: 'ACTIVE',
        layers: {
          network: '✅ Network Security (IP filtering, rate limiting)',
          application: '✅ Application Security (input validation, sanitization)',
          authentication: '✅ Authentication Security (JWT validation)',
          data: '✅ Data Security (SQL injection, XSS prevention)'
        },
        protection: {
          waf: 'Web Application Firewall',
          ddos: 'DDoS Protection',
          csrf: 'CSRF Protection',
          xss: 'XSS Protection',
          sqlInjection: 'SQL Injection Prevention',
          rateLimiting: 'Rate Limiting',
          ipFiltering: 'IP Filtering',
          inputSanitization: 'Input Sanitization'
        },
        statistics: {
          blockedIPs: securityStatus.blockedIPs.length,
          suspiciousIPs: securityStatus.suspiciousIPs.length,
          recentLogs: securityStatus.recentLogs.length,
          rateLimitStore: Object.keys(securityStatus.rateLimitStore).length
        },
        config: {
          maxRequestsPerMinute: securityStatus.config.waf.maxRequestsPerMinute,
          maxRequestsPerHour: securityStatus.config.waf.maxRequestsPerHour,
          enableLogging: securityStatus.config.monitoring.enableLogging,
          enableAlerts: securityStatus.config.monitoring.enableAlerts
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('Security status error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get security status',
        message: error.message
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ip, reason } = body

    switch (action) {
      case 'block_ip':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        securityLayer.blockIP(ip)
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been blocked`,
          reason: reason || 'Manual block'
        })

      case 'unblock_ip':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        securityLayer.unblockIP(ip)
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been unblocked`
        })

      case 'add_whitelist':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        securityLayer.addToWhitelist(ip)
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been added to whitelist`
        })

      case 'add_blacklist':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        securityLayer.addToBlacklist(ip)
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been added to blacklist`
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Security action error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to perform security action',
        message: error.message
      },
      { status: 500 }
    )
  }
}
