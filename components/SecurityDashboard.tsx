/**
 * Security Dashboard Component
 * Real-time monitoring and management
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Activity, Lock, Eye, Ban, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface SecurityStatus {
  status: string
  layers: {
    network: string
    application: string
    authentication: string
    data: string
  }
  protection: {
    waf: string
    ddos: string
    csrf: string
    xss: string
    sqlInjection: string
    rateLimiting: string
    ipFiltering: string
    inputSanitization: string
  }
  statistics: {
    blockedIPs: number
    suspiciousIPs: number
    recentLogs: number
    rateLimitStore: number
  }
  config: {
    maxRequestsPerMinute: number
    maxRequestsPerHour: number
    enableLogging: boolean
    enableAlerts: boolean
  }
  timestamp: string
}

export default function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newIP, setNewIP] = useState('')
  const [blockReason, setBlockReason] = useState('')

  useEffect(() => {
    fetchSecurityStatus()
    const interval = setInterval(fetchSecurityStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch('/api/security')
      const data = await response.json()
      if (data.success) {
        setSecurityStatus(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch security status')
      }
    } catch (err) {
      setError('Network error fetching security status')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockIP = async () => {
    if (!newIP.trim()) {
      setError('IP address is required')
      return
    }

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block_ip',
          ip: newIP.trim(),
          reason: blockReason || 'Manual block'
        })
      })

      const data = await response.json()
      if (data.success) {
        setNewIP('')
        setBlockReason('')
        fetchSecurityStatus()
      } else {
        setError(data.error || 'Failed to block IP')
      }
    } catch (err) {
      setError('Network error blocking IP')
    }
  }

  const handleUnblockIP = async (ip: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock_ip',
          ip
        })
      })

      const data = await response.json()
      if (data.success) {
        fetchSecurityStatus()
      } else {
        setError(data.error || 'Failed to unblock IP')
      }
    } catch (err) {
      setError('Network error unblocking IP')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Security Error</h2>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={fetchSecurityStatus}
            className="mt-4 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!securityStatus) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-violet-500" />
              <h1 className="text-3xl font-bold">Security Dashboard</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">{securityStatus.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Last updated: {new Date(securityStatus.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Security Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Network Security</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm">{securityStatus.layers.network}</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Application Security</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm">{securityStatus.layers.application}</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Authentication</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm">{securityStatus.layers.authentication}</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Data Security</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm">{securityStatus.layers.data}</p>
          </div>
        </div>

        {/* Protection Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(securityStatus.protection).map(([key, value]) => (
            <div key={key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Blocked IPs</p>
                <p className="text-2xl font-bold text-red-400">{securityStatus.statistics.blockedIPs}</p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Suspicious IPs</p>
                <p className="text-2xl font-bold text-yellow-400">{securityStatus.statistics.suspiciousIPs}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Security Logs</p>
                <p className="text-2xl font-bold text-blue-400">{securityStatus.statistics.recentLogs}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rate Limit Store</p>
                <p className="text-2xl font-bold text-green-400">{securityStatus.statistics.rateLimitStore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* IP Management */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            IP Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Block IP Address</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for blocking (optional)"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleBlockIP}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Block IP
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Requests/Minute:</span>
                  <span className="text-white">{securityStatus.config.maxRequestsPerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Requests/Hour:</span>
                  <span className="text-white">{securityStatus.config.maxRequestsPerHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Logging:</span>
                  <span className={securityStatus.config.enableLogging ? 'text-green-400' : 'text-red-400'}>
                    {securityStatus.config.enableLogging ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alerts:</span>
                  <span className={securityStatus.config.enableAlerts ? 'text-green-400' : 'text-red-400'}>
                    {securityStatus.config.enableAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Security Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Web Application Firewall (WAF) is actively blocking malicious requests</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Rate limiting prevents abuse and DDoS attacks</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Input sanitization prevents SQL injection and XSS attacks</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">CORS policies protect against cross-origin attacks</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Security headers prevent clickjacking and code injection</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Real-time monitoring detects suspicious activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
