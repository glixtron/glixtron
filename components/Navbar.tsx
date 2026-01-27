'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Sparkles, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="glass border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/logo-updated.svg" alt="Glixtron" className="h-8 w-8" />
            <span className="text-xl font-bold gradient-text">Glixtron</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              href="/assessment" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Assessment
            </Link>
            <Link 
              href="/resume-scanner" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Resume Scanner
            </Link>
            <Link 
              href="/dashboard" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  {session?.user?.avatar_url ? (
                    <img src={session.user.avatar_url} alt={session.user.name || ''} className="w-8 h-8 rounded-full border-2 border-blue-500/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center border-2 border-blue-500/30">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/assessment"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg hover:from-blue-600 hover:to-violet-600 transition-all text-white font-medium"
                >
                  Start Free Assessment
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
