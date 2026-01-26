'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, MapPin, Phone, Globe, Edit2, Settings, 
  Linkedin, Github, Twitter, Briefcase, Palette, Bell,
  Shield, LogOut, Save, X, Calendar, CheckCircle2,
  ExternalLink, UserCircle, Sparkles
} from 'lucide-react'
import { getCurrentUser, handleSupabaseLogout } from '@/components/supabase-auth'
import { createClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from '@/lib/env-config'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  social_links?: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
  }
  preferences?: {
    theme?: string
    notifications?: boolean
    newsletter?: boolean
  }
  created_at: string
  updated_at: string
}

interface UserExtendedProfile {
  resume_url?: string
  skills?: string[]
  experience_years?: number
  education?: any[]
  work_experience?: any[]
  projects?: any[]
  certifications?: any[]
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
}

export default function SupabaseProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [extendedProfile, setExtendedProfile] = useState<UserExtendedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [logoutLoading, setLogoutLoading] = useState(false)

  const supabase = createClient(ENV_CONFIG.SUPABASE_URL!, ENV_CONFIG.SUPABASE_ANON_KEY!)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      // Get current authenticated user
      const authUser = await getCurrentUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      // Fetch user profile from public.users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        // Fallback to auth user data
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || 'User',
          avatar_url: authUser.user_metadata?.avatar_url,
          created_at: authUser.created_at || '',
          updated_at: ''
        })
      } else {
        setUser(profile)
      }

      // Fetch extended profile
      const { data: extended, error: extendedError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (!extendedError && extended) {
        setExtendedProfile(extended)
      }

    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditForm({
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
      website: user?.website || ''
    })
    setEditing(true)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          bio: editForm.bio,
          location: editForm.location,
          phone: editForm.phone,
          website: editForm.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Update error:', error)
        return
      }

      // Refresh profile data
      await fetchUserProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const result = await handleSupabaseLogout()
      if (result.success) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Glixtron Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {logoutLoading ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Header */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {user.bio || 'No bio added yet. Click Edit Profile to add your bio.'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {editing ? (
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="City, Country"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {user.location || 'Location not specified'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        {editing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {user.phone || 'Phone not specified'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        {editing ? (
                          <input
                            type="url"
                            value={editForm.website}
                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="https://yourwebsite.com"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {user.website ? (
                              <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                {user.website}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              'Website not specified'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h4>
                    <div className="space-y-3">
                      {user.social_links?.linkedin && (
                        <a
                          href={user.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                        >
                          <Linkedin className="w-5 h-5" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {user.social_links?.github && (
                        <a
                          href={user.social_links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-700 hover:text-gray-900"
                        >
                          <Github className="w-5 h-5" />
                          GitHub
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {user.social_links?.twitter && (
                        <a
                          href={user.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-400 hover:text-blue-500"
                        >
                          <Twitter className="w-5 h-5" />
                          Twitter
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {!user.social_links?.linkedin && !user.social_links?.github && !user.social_links?.twitter && (
                        <p className="text-gray-500">No social links added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Profile */}
            {extendedProfile && (
              <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Profile</h2>
                
                {extendedProfile.skills && extendedProfile.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {extendedProfile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {extendedProfile.experience_years && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Experience</h4>
                    <p className="text-gray-700">{extendedProfile.experience_years} years</p>
                  </div>
                )}

                {extendedProfile.resume_url && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Resume</h4>
                    <a
                      href={extendedProfile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Basic Info</span>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contact Info</span>
                  {user.location || user.phone || user.website ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social Links</span>
                  {user.social_links ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Professional Info</span>
                  {extendedProfile ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/assessment"
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Take Assessment
                </Link>
                <button className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
