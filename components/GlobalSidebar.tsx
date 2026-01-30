'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  User, 
  FileText, 
  TrendingUp,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Camera,
  Menu,
  X
} from 'lucide-react'
import { brandConfig } from '@/lib/brand-config'
import { apiService } from '@/lib/api-service'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Assessment', href: '/assessment', icon: FileText },
  { name: 'Resume Scanner', href: '/resume-scanner', icon: Briefcase },
  { name: 'Career Guidance', href: '/career-guidance', icon: TrendingUp },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const secondaryNavigation = [
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function GlobalSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const pathname = usePathname()

  // Load user profile
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile()
      if (response.success) {
        setUserProfile(response.data)
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-profile-dropdown]')) {
        setProfileOpen(false)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingProfilePic(true)
      const response = await apiService.uploadProfilePicture(file)
      if (response.success) {
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
    } finally {
      setUploadingProfilePic(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
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
        <div className="flex h-full flex-col bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700/50">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {brandConfig.appName}
              </span>
            </Link>
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
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActive(item.href)
                    ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400 shadow-glow' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-blue'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-700/50">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
                >
                  <item.icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-3 px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-glow relative">
                {userProfile?.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userProfile?.name || 'John Doe'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {userProfile?.email || 'john@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-glow">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Mobile menu toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Right side - Profile and Signout only */}
          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
            <div className="relative" data-profile-dropdown>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                disabled={isLoading}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-glow relative">
                  {userProfile?.profilePicture ? (
                    <img 
                      src={userProfile.profilePicture} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-glow-lg animate-scale-in">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-glow relative">
                        {userProfile?.profilePicture ? (
                          <img 
                            src={userProfile.profilePicture} 
                            alt="Profile" 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {userProfile?.name || 'John Doe'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {userProfile?.email || 'john@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    {/* Profile Picture Upload */}
                    <div className="px-4 py-2">
                      <label className="flex items-center justify-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors rounded-lg cursor-pointer">
                        <Camera className="mr-2 h-4 w-4" />
                        {uploadingProfilePic ? 'Uploading...' : 'Change Profile Picture'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          disabled={uploadingProfilePic}
                        />
                      </label>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                      <User className="mr-3 h-4 w-4" />
                      View Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-slate-700/50 my-2"></div>
                    
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      {isLoading ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
