'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, User, AlertCircle, Loader2, CheckCircle, XCircle, Play } from 'lucide-react'

interface TestResult {
  test: string
  status: 'success' | 'error'
  message: string
  details?: any
  timestamp: string
}

interface TestUser {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function TestAuthPage() {
  const router = useRouter()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [testUser, setTestUser] = useState<TestUser | null>(null)

  const addResult = (test: string, status: 'success' | 'error', message: string, details?: any) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const runTest = async (testName: string, testFunction: () => Promise<void>) => {
    setLoading(true)
    try {
      await testFunction()
    } catch (error: unknown) {
      addResult(testName, 'error', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testAppStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      
      if (data.success) {
        addResult('App Status', 'success', 'App is healthy', data.message)
      } else {
        addResult('App Status', 'error', 'App is unhealthy', data)
      }
    } catch (error: unknown) {
      addResult('App Status', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const createTestUser = async () => {
    try {
      const testUserData = {
        name: 'Auth Test User',
        email: `auth-test-${Date.now()}@glixtron.com`,
        password: 'AuthTest123!'
      }

      const response = await fetch('/api/test/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserData)
      })

      const data = await response.json()
      
      if (data.success) {
        setTestUser(data.user)
        addResult('Create Test User', 'success', 'Test user created', {
          email: data.user.email,
          id: data.user.id
        })
      } else {
        addResult('Create Test User', 'error', data.error, data)
      }
    } catch (error: unknown) {
      addResult('Create Test User', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const testRegistration = async () => {
    if (!testUser) {
      addResult('Test Registration', 'error', 'Please create a test user first')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Test',
          email: testUser.email,
          password: 'AuthTest123!'
        })
      })

      const data = await response.json()
      
      if (response.status === 409) {
        addResult('Test Registration', 'success', 'Duplicate check working', data.error)
      } else {
        addResult('Test Registration', 'error', 'Unexpected response', data)
      }
    } catch (error: unknown) {
      addResult('Test Registration', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const testLogin = async () => {
    if (!testUser) {
      addResult('Test Login', 'error', 'Please create a test user first')
      return
    }

    try {
      const response = await fetch('/api/test/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: testUser.email,
          password: 'AuthTest123!'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        addResult('Test Login', 'success', 'Login successful', {
          userName: data.user.name,
          userId: data.user.id
        })
      } else {
        addResult('Test Login', 'error', 'Login failed', data)
      }
    } catch (error: unknown) {
      addResult('Test Login', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const runAllTests = async () => {
    setResults([])
    await testAppStatus()
    await createTestUser()
    await testRegistration()
    await testLogin()
  }

  useEffect(() => {
    runAllTests()
  }, [])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold gradient-text">Glixtron</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Authentication Test Suite</h1>
          <p className="text-slate-400">Test the complete authentication pipeline</p>
        </div>

        <div className="glass rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Test Results</h2>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}
              >
                <div className="flex items-start">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white">{result.test}</h3>
                      <span className="text-xs text-slate-400">{result.timestamp}</span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      result.status === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <pre className="mt-2 text-xs text-slate-400 bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {testUser && (
          <div className="glass rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Test User Credentials</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Email:</label>
                <p className="text-white font-mono">{testUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Password:</label>
                <p className="text-white font-mono">AuthTest123!</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">User ID:</label>
                <p className="text-white font-mono text-sm">{testUser.id}</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold transition-all"
              >
                Test Login Page
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-all"
              >
                Test Register Page
              </Link>
            </div>
          </div>
        )}

        <div className="glass rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Manual Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => runTest('App Status', testAppStatus)}
              disabled={loading}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-all"
            >
              <h3 className="font-semibold text-white">Test App Status</h3>
              <p className="text-sm text-slate-400">Check if the app is healthy</p>
            </button>
            
            <button
              onClick={() => runTest('Create Test User', createTestUser)}
              disabled={loading}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-all"
            >
              <h3 className="font-semibold text-white">Create Test User</h3>
              <p className="text-sm text-slate-400">Generate a new test user</p>
            </button>
            
            <button
              onClick={() => runTest('Test Registration', testRegistration)}
              disabled={loading}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-all"
            >
              <h3 className="font-semibold text-white">Test Registration</h3>
              <p className="text-sm text-slate-400">Test duplicate user prevention</p>
            </button>
            
            <button
              onClick={() => runTest('Test Login', testLogin)}
              disabled={loading}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-all"
            >
              <h3 className="font-semibold text-white">Test Login</h3>
              <p className="text-sm text-slate-400">Test user authentication</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
