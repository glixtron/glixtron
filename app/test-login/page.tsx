'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

export default function TestLogin() {
  const [status, setStatus] = useState('initializing')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const autoLogin = async () => {
      setStatus('logging-in')
      
      try {
        const result = await signIn('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: false
        })

        if (result?.error) {
          // Try the other test user
          const result2 = await signIn('credentials', {
            email: 'arrow4162549hemant@gmail.com',
            password: 'password123',
            redirect: false
          })

          if (result2?.error) {
            setError('Test users not found. Please register a new user first.')
            setStatus('error')
            return
          }
        }

        setStatus('success')
        setTimeout(() => {
          router.push('/profile')
        }, 1500)
      } catch (error) {
        setError('Auto-login failed. Please try manual login.')
        setStatus('error')
      }
    }

    autoLogin()
  }, [router])

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Login Successful!</h2>
          <p className="text-slate-400 mb-6">Redirecting to your profile...</p>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Auto-Login Failed</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition-colors"
              >
                Register New User
              </Link>
              <Link
                href="/login"
                className="block w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-semibold transition-colors"
              >
                Manual Login
              </Link>
              <Link
                href="/admin/users"
                className="block w-full py-3 bg-violet-500 hover:bg-violet-600 rounded-xl text-white font-semibold transition-colors"
              >
                User Management
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src="/logo-updated.svg" alt="Glixtron" className="h-12 w-12" />
            <span className="text-3xl font-bold gradient-text">Glixtron</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-white">Auto-Login Test</h1>
          <p className="text-slate-400">
            Logging in with test user credentials...
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="space-y-6">
            {/* Test User Info */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <User className="h-5 w-5 text-blue-400" />
                <span className="text-blue-300 font-semibold">Test User Credentials</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">test@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">password123</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">
                {status === 'initializing' ? 'Initializing...' : 'Logging in...'}
              </p>
            </div>

            {/* Manual Options */}
            <div className="border-t border-slate-700 pt-6">
              <p className="text-slate-400 text-sm mb-4 text-center">
                Or choose another option:
              </p>
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="flex items-center justify-center w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition-colors"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Register New User
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-semibold transition-colors"
                >
                  Manual Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center justify-center w-full py-3 bg-violet-500 hover:bg-violet-600 rounded-xl text-white font-semibold transition-colors"
                >
                  User Management
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
