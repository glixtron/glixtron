/**
 * Advanced Security API Endpoint
 * Multi-layer protection with onion architecture and blockchain security
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityManager, securityMiddleware } from '@/lib/security/onion-security'

export async function GET(request: NextRequest) {
  try {
    // Apply security middleware
    const validation = securityManager.validateRequest(request)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Access denied',
          reason: validation.reason 
        },
        { status: 403 }
      )
    }

    const securityStatus = securityManager.getSecurityStatus()
    const blockchain = securityManager['blockchain']
    
    return NextResponse.json({
      success: true,
      message: 'Advanced security system operational',
      data: {
        status: 'ACTIVE',
        architecture: 'ONION + BLOCKCHAIN',
        layers: {
          network: '✅ Network Security (IP filtering, rate limiting)',
          application: '✅ Application Security (input validation, sanitization)',
          authentication: '✅ Authentication Security (JWT validation)',
          data: '✅ Data Security (SQL injection, XSS prevention)',
          encryption: '✅ Onion Encryption (5-layer encryption)',
          blockchain: '✅ Blockchain Security (immutable audit trail)'
        },
        protection: {
          waf: 'Web Application Firewall',
          ddos: 'DDoS Protection',
          csrf: 'CSRF Protection',
          xss: 'XSS Protection',
          sqlInjection: 'SQL Injection Prevention',
          rateLimiting: 'Rate Limiting',
          ipFiltering: 'IP Filtering',
          inputSanitization: 'Input Sanitization',
          onionEncryption: 'Multi-Layer Onion Encryption',
          blockchain: 'Blockchain Audit Trail',
          proofOfWork: 'Proof-of-Work Validation'
        },
        statistics: {
          blockedIPs: securityStatus.blockedIPs,
          rateLimitedIPs: securityStatus.rateLimitedIPs,
          recentEvents: securityStatus.recentEvents,
          onionLayers: securityStatus.onionLayers,
          blockchainValid: securityStatus.blockchainValid,
          blockchainLength: blockchain.getChain().length,
          latestBlockHash: blockchain.getLatestBlock().hash.substring(0, 16) + '...'
        },
        config: {
          onionLayers: 5,
          blockchainDifficulty: 4,
          maxRequestsPerWindow: 100,
          windowMs: 15 * 60 * 1000,
          blockDuration: 30 * 60 * 1000
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
    // Apply security middleware
    const validation = securityManager.validateRequest(request)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Access denied',
          reason: validation.reason 
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, ip, reason, data } = body

    switch (action) {
      case 'block_ip':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        securityManager.blockIP(ip)
        
        // Log to blockchain
        securityManager.logSecurityEvent('MANUAL_IP_BLOCK', { ip, reason }, 'high')
        
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been blocked`,
          reason: reason || 'Manual block',
          blockchainRecord: securityManager['blockchain'].getLatestBlock().index
        })

      case 'unblock_ip':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          )
        }
        
        // Remove from blocked IPs
        securityManager['blockedIPs'].delete(ip)
        
        // Log to blockchain
        securityManager.logSecurityEvent('MANUAL_IP_UNBLOCK', { ip }, 'medium')
        
        return NextResponse.json({
          success: true,
          message: `IP ${ip} has been unblocked`,
          blockchainRecord: securityManager['blockchain'].getLatestBlock().index
        })

      case 'encrypt_data':
        if (!data) {
          return NextResponse.json(
            { error: 'Data required for encryption' },
            { status: 400 }
          )
        }
        
        const encrypted = securityManager.encryptSensitiveData(data)
        return NextResponse.json({
          success: true,
          message: 'Data encrypted with onion security',
          encrypted,
          layers: 5
        })

      case 'decrypt_data':
        if (!data) {
          return NextResponse.json(
            { error: 'Encrypted data required' },
            { status: 400 }
          )
        }
        
        try {
          const decrypted = securityManager.decryptSensitiveData(data)
          return NextResponse.json({
            success: true,
            message: 'Data decrypted successfully',
            decrypted
          })
        } catch (decryptError) {
          return NextResponse.json(
            { error: 'Failed to decrypt data - invalid format or key' },
            { status: 400 }
          )
        }

      case 'log_security_event':
        if (!data || !data.event) {
          return NextResponse.json(
            { error: 'Event data required' },
            { status: 400 }
          )
        }
        
        const block = securityManager.logSecurityEvent(
          data.event, 
          data.data || {}, 
          data.severity || 'medium'
        )
        
        return NextResponse.json({
          success: true,
          message: 'Security event logged to blockchain',
          blockIndex: block.index,
          blockHash: block.hash
        })

      case 'validate_blockchain':
        const isValid = securityManager['blockchain'].isChainValid()
        const chain = securityManager['blockchain'].getChain()
        
        return NextResponse.json({
          success: true,
          message: 'Blockchain validation completed',
          valid: isValid,
          blockCount: chain.length,
          latestBlock: chain[chain.length - 1]
        })

      case 'cleanup':
        const cleaned = securityManager.cleanup()
        return NextResponse.json({
          success: true,
          message: 'Security cleanup completed',
          cleaned
        })

      default:
        return NextResponse.json(
          { 
            error: 'Invalid action',
            availableActions: [
              'block_ip',
              'unblock_ip', 
              'encrypt_data',
              'decrypt_data',
              'log_security_event',
              'validate_blockchain',
              'cleanup'
            ]
          },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Security action error:', error)
    
    // Log security error to blockchain
    try {
      securityManager.logSecurityEvent('SECURITY_API_ERROR', {
        error: error.message,
        stack: error.stack
      }, 'critical')
    } catch (logError) {
      console.error('Failed to log security error:', logError)
    }
    
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
