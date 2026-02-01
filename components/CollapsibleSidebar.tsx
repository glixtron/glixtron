'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  FileText, 
  TrendingUp,
  Briefcase,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Menu,
  X,
  BarChart3
} from 'lucide-react'
import { brandConfig } from '@/lib/brand-config'
import { apiService } from '@/lib/api-service'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Resume Scanner', href: '/resume-scanner', icon: Briefcase },
  { name: 'Career Guidance', href: '/career-guidance', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Subscription & Payments', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
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

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}
      `}>
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700/50">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {isExpanded && (
              <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {brandConfig.appName}
              </span>
            )}
          </Link>
          
          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/50"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative
                ${isActive(item.href)
                  ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400 shadow-glow' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-blue'
                }
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {isExpanded && (
                <span className="ml-3 group-hover:translate-x-1 transition-transform">
                  {item.name}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer - Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="relative">
            {/* Profile trigger */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center space-x-3 px-3 py-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-glow relative flex-shrink-0">
                {userProfile?.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <Settings className="h-4 w-4 text-white" />
                )}
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {userProfile?.name || 'John Doe'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {userProfile?.email || 'john@example.com'}
                  </p>
                </div>
              )}
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-glow-lg animate-scale-in" data-profile-dropdown>
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
                        <Settings className="h-5 w-5 text-white" />
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
                    <Settings className="mr-3 h-4 w-4" />
                    View Profile
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

      {/* Clean Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-glow">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Mobile menu toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Right side - Only Settings */}
          <div className="flex items-center space-x-4">
            <Link
              href="/settings"
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
