'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Sparkles, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="nav-container sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/logo-updated.svg" alt="Glixtron" className="h-8 w-8 company-logo" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Glixtron</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              href="/assessment" 
              className={`nav-link px-3 py-2 rounded-md font-medium transition-all ${
                isActive('/assessment') ? 'active' : ''
              }`}
            >
              Assessment
            </Link>
            <Link 
              href="/resume-scanner" 
              className={`nav-link px-3 py-2 rounded-md font-medium transition-all ${
                isActive('/resume-scanner') ? 'active' : ''
              }`}
            >
              Resume Scanner
            </Link>
            <Link 
              href="/dashboard" 
              className={`nav-link px-3 py-2 rounded-md font-medium transition-all ${
                isActive('/dashboard') ? 'active' : ''
              }`}
            >
              Dashboard
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 nav-link px-3 py-2 rounded-md font-medium transition-all ${
                    isActive('/profile') ? 'active' : ''
                  }`}
                >
                  {session?.user?.avatar_url ? (
                    <img src={session.user.avatar_url} alt={session.user.name || ''} className="w-8 h-8 rounded-full border-2" style={{ borderColor: 'var(--primary)' }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 nav-icon" style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}>
                      <User className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-primary flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className={`nav-link px-3 py-2 rounded-md font-medium transition-all ${
                    isActive('/login') ? 'active' : ''
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  href="/assessment"
                  className="btn-primary"
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
