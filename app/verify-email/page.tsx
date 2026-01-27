'use client'

import Link from 'next/link'
import { Sparkles, Info, CheckCircle2 } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold gradient-text">Glixtron</span>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Email Verification</h2>
        </div>

        <div className="glass rounded-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Info className="h-8 w-8 text-blue-400" />
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-blue-400">Email Verification Disabled</h3>
            
            <p className="text-slate-400 mb-6">
              Email verification is no longer required for registration. You can now register and use your account immediately without email confirmation.
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/register"
                className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold transition-all text-center"
              >
                Create Account
              </Link>
              
              <Link 
                href="/login"
                className="block w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
