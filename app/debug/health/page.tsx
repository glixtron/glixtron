'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface HealthStatus {
  environment: {
    node_env: string
    is_production: boolean
    is_development: boolean
    is_vercel: boolean
    server_url: string
    api_base: string
  }
  supabase: {
    url_configured: boolean
    anon_key_configured: boolean
    service_key_configured: boolean
    url_preview: string
    anon_key_preview: string
  }
  authentication: {
    nextauth_secret: boolean
    nextauth_url: boolean
    session_loaded: boolean
    user_authenticated: boolean
  }
  database: {
    connection_test: boolean
    tables_exist: boolean
    error?: string
  }
}

export default function HealthCheckPage() {
  const { data: session, status } = useSession()
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch('/api/debug/health')
        const data = await response.json()
        setHealth(data)
      } catch (error) {
        console.error('Health check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Running health checks...</p>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">❌ Failed to load health status</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Glixtron Health Check</h1>
          <p className="text-gray-600">Complete system diagnostic for authentication and database</p>
        </div>

        {/* Environment Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🌐 Environment Configuration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className={`font-medium ${health.environment.is_production ? 'text-green-600' : 'text-blue-600'}`}>
                {health.environment.node_env}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Server URL:</span>
              <span className="font-mono text-sm">{health.environment.server_url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Base:</span>
              <span className="font-mono text-sm">{health.environment.api_base}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">
                {health.environment.is_vercel ? 'Vercel' : 'Local Development'}
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🗄️ Supabase Configuration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">URL Configured:</span>
              <span className={health.supabase.url_configured ? 'text-green-600' : 'text-red-600'}>
                {health.supabase.url_configured ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Anon Key Configured:</span>
              <span className={health.supabase.anon_key_configured ? 'text-green-600' : 'text-red-600'}>
                {health.supabase.anon_key_configured ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Key Configured:</span>
              <span className={health.supabase.service_key_configured ? 'text-green-600' : 'text-red-600'}>
                {health.supabase.service_key_configured ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">URL Preview:</p>
              <p className="font-mono text-xs">{health.supabase.url_preview}</p>
              <p className="text-sm text-gray-600 mb-1 mt-2">Anon Key Preview:</p>
              <p className="font-mono text-xs">{health.supabase.anon_key_preview}</p>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Authentication Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">NextAuth Secret:</span>
              <span className={health.authentication.nextauth_secret ? 'text-green-600' : 'text-red-600'}>
                {health.authentication.nextauth_secret ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NextAuth URL:</span>
              <span className={health.authentication.nextauth_url ? 'text-green-600' : 'text-red-600'}>
                {health.authentication.nextauth_url ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session Status:</span>
              <span className={`font-medium ${
                status === 'authenticated' ? 'text-green-600' : 
                status === 'loading' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {status === 'authenticated' ? '✅ Authenticated' : 
                 status === 'loading' ? '⏳ Loading...' : 
                 '🔓 Not Authenticated'}
              </span>
            </div>
            {session && (
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-gray-600 mb-1">Logged in as:</p>
                <p className="font-medium">{session.user?.email}</p>
                <p className="text-sm text-gray-500">ID: {session.user?.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🗃️ Database Connection</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Connection Test:</span>
              <span className={health.database.connection_test ? 'text-green-600' : 'text-red-600'}>
                {health.database.connection_test ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tables Exist:</span>
              <span className={health.database.tables_exist ? 'text-green-600' : 'text-red-600'}>
                {health.database.tables_exist ? '✅ Yes' : '❌ Missing'}
              </span>
            </div>
            {health.database.error && (
              <div className="mt-4 p-3 bg-red-50 rounded">
                <p className="text-sm text-red-600 font-medium">Error Details:</p>
                <p className="text-sm text-red-600">{health.database.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/register'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Test Registration
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Test Login
            </button>
            <button
              onClick={() => window.location.href = '/api/test/supabase-setup'}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Database Setup Check
            </button>
            <button
              onClick={() => window.location.href = '/api/debug/deployment-check'}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
            >
              Full System Check
            </button>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Troubleshooting Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• If Supabase keys show &quot;❌ No&quot;, check your environment variables</li>
            <li>• If database connection fails, run the SQL setup script in Supabase dashboard</li>
            <li>• If tables don&apos;t exist, copy the SQL from COPY_THIS_SQL.sql and run it</li>
            <li>• For Vercel deployment, ensure environment variables are set in dashboard</li>
            <li>• Check browser console for additional error details</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
