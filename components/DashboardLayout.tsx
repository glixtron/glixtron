'use client'

import { useState, useEffect } from 'react'
import { 
  Home, 
  User, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  X,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { brandConfig } from '@/lib/brand-config'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
  { name: 'Assessment', href: '/assessment', icon: FileText, current: false },
  { name: 'Resume Scanner', href: '/resume-scanner', icon: Briefcase, current: false },
  { name: 'Career Guidance', href: '/career-guidance', icon: TrendingUp, current: false },
  { name: 'Profile', href: '/profile', icon: User, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
]

const secondaryNavigation = [
  { name: 'Admin', href: '/admin', icon: Shield, current: false },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-notifications-dropdown]')) {
        setNotificationsOpen(false)
      }
      if (!target.closest('[data-profile-dropdown]')) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="flex min-h-screen bg-brand-dark">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col bg-brand-surface border-r border-slate-800">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-accent to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white font-semibold">{brandConfig.appName}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${item.current 
                    ? 'bg-brand-accent/20 text-brand-accent border-l-2 border-brand-accent' 
                    : 'text-slate-300 hover:bg-brand-glass hover:text-white'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-800">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-brand-glass hover:text-white transition-all duration-200"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-accent to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-slate-400 truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-slate-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left side - Mobile menu toggle and search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Right side - Notifications and profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" data-notifications-dropdown>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-brand-glass"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-brand-danger rounded-full"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-brand-surface border border-slate-700 rounded-lg shadow-lg animate-scale-in">
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-brand-glass transition-colors cursor-pointer">
                        <p className="text-sm text-white">Your assessment is ready</p>
                        <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                      </div>
                      <div className="p-4 hover:bg-brand-glass transition-colors cursor-pointer">
                        <p className="text-sm text-white">New career path recommendations</p>
                        <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative" data-profile-dropdown>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-brand-glass"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-accent to-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-brand-surface border border-slate-700 rounded-lg shadow-lg animate-scale-in">
                    <div className="p-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-slate-400">john@example.com</p>
                    </div>
                    <div className="py-2">
                      <a href="/profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-brand-glass hover:text-white transition-colors">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </a>
                      <a href="/settings" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-brand-glass hover:text-white transition-colors">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </a>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-brand-glass hover:text-white transition-colors">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-brand-dark to-brand-surface">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
