'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''
  const [token, setToken] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      setVerified(true)
      setLoading(false)

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold gradient-text">Glixtron</span>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
          <p className="text-slate-400">Check your inbox for the verification code</p>
        </div>

        <div className="glass rounded-xl p-8">
          {verified ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-400">Email Verified!</h3>
              <p className="text-slate-400 mb-6">Your email has been successfully verified. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <div className="flex items-center text-blue-400 mb-2">
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="font-medium">Verification Email Sent</span>
                </div>
                <p className="text-sm text-slate-400">
                  We&apos;ve sent a verification code to <span className="text-white font-medium">{email}</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Please check your inbox and spam folder. The code will be in the email subject or body.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                    placeholder="Enter code"
                    maxLength={20}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Didn&apos;t receive the email?{' '}
                <button className="text-blue-400 hover:text-blue-300 font-medium">
                  Resend code
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
