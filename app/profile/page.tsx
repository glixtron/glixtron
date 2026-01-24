'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, MapPin, Phone, Globe, Edit2, Settings, 
  Linkedin, Github, Twitter, Briefcase, Palette, Bell,
  Shield, LogOut, Save, X, Calendar, CheckCircle2,
  ExternalLink, UserCircle
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface UserProfile {
  id: string
  email: string
  name: string
  image?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
    behance?: string
    dribbble?: string
  }
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    emailUpdates?: boolean
  }
  createdAt?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent('/profile'))
      return
    }

    if (session?.user && status === 'authenticated') {
      loadProfile()
    } else if (status === 'loading') {
      // Still loading, do nothing
    } else {
      // No session and not loading
      setLoading(false)
    }
  }, [session, status, router])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.profile) {
          const userProfile: UserProfile = {
            ...data.profile,
            bio: data.profile.bio || 'Career-focused professional passionate about technology and innovation.',
            location: data.profile.location || '',
            phone: data.profile.phone || '',
            website: data.profile.website || '',
            socialLinks: data.profile.socialLinks || {
              linkedin: '',
              github: '',
              twitter: '',
              portfolio: '',
              behance: '',
              dribbble: ''
            },
            preferences: data.profile.preferences || {
              theme: 'dark',
              notifications: true,
              emailUpdates: true
            }
          }
          setProfile(userProfile)
          setEditData(userProfile)
        } else {
          // Fallback to session data
          const userProfile: UserProfile = {
            id: session?.user?.id || '',
            email: session?.user?.email || '',
            name: session?.user?.name || '',
            image: session?.user?.image || undefined,
            bio: '',
            location: '',
            phone: '',
            website: '',
            socialLinks: {
              linkedin: '',
              github: '',
              twitter: '',
              portfolio: '',
              behance: '',
              dribbble: ''
            },
            preferences: {
              theme: 'dark',
              notifications: true,
              emailUpdates: true
            },
            createdAt: new Date().toISOString()
          }
          setProfile(userProfile)
          setEditData(userProfile)
        }
      } else {
        // Fallback to session data
        const userProfile: UserProfile = {
          id: session?.user?.id || '',
          email: session?.user?.email || '',
          name: session?.user?.name || '',
          image: session?.user?.image || undefined,
          bio: '',
          location: '',
          phone: '',
          website: '',
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            portfolio: '',
            behance: '',
            dribbble: ''
          },
          preferences: {
            theme: 'dark',
            notifications: true,
            emailUpdates: true
          },
          createdAt: new Date().toISOString()
        }
        setProfile(userProfile)
        setEditData(userProfile)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      // Fallback to session data
      const userProfile: UserProfile = {
        id: session?.user?.id || '',
        email: session?.user?.email || '',
        name: session?.user?.name || '',
        image: session?.user?.image || undefined,
        bio: '',
        location: '',
        phone: '',
        website: '',
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: '',
          portfolio: '',
          behance: '',
          dribbble: ''
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          emailUpdates: true
        },
        createdAt: new Date().toISOString()
      }
      setProfile(userProfile)
      setEditData(userProfile)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
          phone: editData.phone,
          website: editData.website,
          socialLinks: editData.socialLinks,
          preferences: editData.preferences
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      if (data.success && data.profile) {
        setProfile({ ...profile!, ...data.profile })
        setEditData({ ...editData, ...data.profile })
      } else {
        setProfile({ ...profile!, ...editData })
      }
      
      setIsEditing(false)
      setSaving(false)
      
      // Show success message
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setSaving(false)
      alert(error.message || 'Failed to save profile')
    }
  }

  const handleCancel = () => {
    setEditData(profile || {})
    setIsEditing(false)
  }

  const socialIcons = {
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter,
    portfolio: Briefcase,
    behance: Palette,
    dribbble: Palette
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-32 h-32 rounded-full border-4 border-blue-500/30 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-white" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                <p className="text-slate-400 mb-4">{profile.email}</p>
                {profile.bio && (
                  <p className="text-sm text-slate-300 mb-4">{profile.bio}</p>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Social Links */}
              {profile.socialLinks && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase">Social Links</h3>
                  <div className="space-y-3">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                      if (!url) return null
                      const Icon = socialIcons[platform as keyof typeof socialIcons]
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                        >
                          <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                          <span className="text-sm text-slate-300 capitalize">{platform}</span>
                          <ExternalLink className="h-3 w-3 text-slate-500 ml-auto" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="border-t border-slate-700 pt-6 mt-6">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 text-blue-400 mr-2" />
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 font-medium transition-colors flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={editData.website || ''}
                      onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-semibold transition-colors flex items-center"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                    <User className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-400">Full Name</p>
                      <p className="text-white font-medium">{profile.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-400">Email</p>
                      <p className="text-white font-medium">{profile.email}</p>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                      <User className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-400">Bio</p>
                        <p className="text-white">{profile.bio}</p>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-400">Location</p>
                        <p className="text-white font-medium">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-400">Phone</p>
                        <p className="text-white font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-400">Website</p>
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          {profile.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Briefcase className="h-6 w-6 text-violet-400 mr-2" />
                  Social Media Links
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 rounded-lg text-violet-400 font-medium transition-colors flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {['linkedin', 'github', 'twitter', 'portfolio', 'behance', 'dribbble'].map((platform) => {
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    return (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-slate-300 mb-2 capitalize flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {platform === 'portfolio' ? 'Portfolio Website' : platform}
                        </label>
                        <input
                          type="url"
                          value={editData.socialLinks?.[platform as keyof typeof editData.socialLinks] || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            socialLinks: {
                              ...editData.socialLinks,
                              [platform]: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                          placeholder={`https://${platform === 'linkedin' ? 'linkedin.com/in' : platform === 'github' ? 'github.com' : platform === 'twitter' ? 'twitter.com' : platform}.com/username`}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => {
                    if (!url) return null
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                      >
                        <Icon className="h-5 w-5 text-slate-400 group-hover:text-violet-400" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-400 capitalize">{platform}</p>
                          <p className="text-white text-sm truncate">{url}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-500" />
                      </a>
                    )
                  })}
                  {(!profile.socialLinks || Object.values(profile.socialLinks).every(v => !v)) && (
                    <p className="text-slate-400 text-sm">No social media links added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Settings className="h-6 w-6 text-amber-400 mr-2" />
                  Preferences
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-400 font-medium transition-colors flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
                    <div className="flex gap-4">
                      {['dark', 'light', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setEditData({
                            ...editData,
                            preferences: {
                              ...editData.preferences,
                              theme: theme as 'dark' | 'light' | 'auto'
                            }
                          })}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                            editData.preferences?.theme === theme
                              ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-amber-400" />
                        <div>
                          <p className="text-white font-medium">Notifications</p>
                          <p className="text-sm text-slate-400">Receive browser notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            notifications: !editData.preferences?.notifications
                          }
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editData.preferences?.notifications ? 'bg-amber-500' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          editData.preferences?.notifications ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-amber-400" />
                        <div>
                          <p className="text-white font-medium">Email Updates</p>
                          <p className="text-sm text-slate-400">Receive email notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            emailUpdates: !editData.preferences?.emailUpdates
                          }
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editData.preferences?.emailUpdates ? 'bg-amber-500' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          editData.preferences?.emailUpdates ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">Theme</p>
                        <p className="text-sm text-slate-400 capitalize">{profile.preferences?.theme || 'dark'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">Notifications</p>
                        <p className="text-sm text-slate-400">
                          {profile.preferences?.notifications ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    {profile.preferences?.notifications && (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">Email Updates</p>
                        <p className="text-sm text-slate-400">
                          {profile.preferences?.emailUpdates ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    {profile.preferences?.emailUpdates && (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Security */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="h-6 w-6 text-green-400 mr-2" />
                Account Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Verified</p>
                    <p className="text-sm text-slate-400">Your email address is verified</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-medium transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
