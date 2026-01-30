'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService } from '@/lib/api-service'
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Award,
  Briefcase,
  GraduationCap,
  Target,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getUserProfile()
      if (response.success) {
        setProfileData(response.data)
        setOriginalData(response.data)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setSaveMessage({ type: 'error', message: 'Failed to load profile data' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setSaveMessage(null)
      
      const response = await apiService.updateProfile(profileData)
      if (response.success) {
        setOriginalData(profileData)
        setIsEditing(false)
        setSaveMessage({ type: 'success', message: 'Profile updated successfully!' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', message: 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      setSaveMessage({ type: 'error', message: 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
    setSaveMessage(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingPicture(true)
      const response = await apiService.uploadProfilePicture(file)
      if (response.success) {
        await loadProfile() // Reload to get new picture
        setSaveMessage({ type: 'success', message: 'Profile picture updated!' })
        setTimeout(() => setSaveMessage(null), 3000)
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
      setSaveMessage({ type: 'error', message: 'Failed to upload profile picture' })
    } finally {
      setUploadingPicture(false)
    }
  }

  const getSkillIcon = (skillName: string) => {
    const icons: Record<string, any> = {
      'JavaScript': BarChart3,
      'React': Sparkles,
      'Node.js': Target,
      'Python': TrendingUp,
      'AWS': Award
    }
    return icons[skillName] || Target
  }

  if (isLoading && !profileData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-white text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-slate-400">Manage your personal information and career preferences.</p>
        </div>
        <div className="flex space-x-3">
          {saveMessage && (
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              saveMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {saveMessage.message}
            </div>
          )}
          
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto shadow-glow">
                  {profileData?.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors cursor-pointer">
                    {uploadingPicture ? (
                      <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      disabled={uploadingPicture}
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-white mt-4">{profileData?.name || 'John Doe'}</h2>
              <p className="text-slate-400">{profileData?.title || 'Senior Software Engineer'}</p>
              
              <div className="mt-4 space-y-2 text-left">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profileData?.email || 'john@example.com'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{profileData?.phone || '+1 (555) 123-4567'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData?.location || 'San Francisco, CA'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <ChartCard title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData?.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </ChartCard>

          {/* Professional Information */}
          <ChartCard title="Professional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Job Title</label>
                <input
                  type="text"
                  value={profileData?.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={profileData?.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Education</label>
                <input
                  type="text"
                  value={profileData?.education || ''}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                <textarea
                  value={profileData?.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Stats & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Career Stats */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Career Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Assessments Completed"
              value={profileData?.stats?.assessmentsCompleted || 12}
              icon={Target}
              className="col-span-1"
            />
            <StatCard
              title="Resume Scans"
              value={profileData?.stats?.resumeScans || 8}
              icon={Briefcase}
              className="col-span-1"
            />
            <StatCard
              title="Career Score"
              value={`${profileData?.stats?.careerScore || 87}%`}
              icon={Award}
              className="col-span-1"
            />
            <StatCard
              title="Member Since"
              value={profileData?.stats?.memberSince || '2024'}
              icon={Calendar}
              className="col-span-1"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div className="space-y-4">
              {profileData?.skills?.map((skill: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 flex items-center">
                      {React.createElement(getSkillIcon(skill.name), { className: "h-4 w-4 mr-2 text-blue-400" })}
                      {skill.name}
                    </span>
                    <span className="text-white">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Achievements</h2>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileData?.achievements?.map((achievement: any) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {React.createElement(getSkillIcon(achievement.icon), { className: "h-6 w-6 text-blue-400" })}
                </div>
                <div>
                  <p className="text-white font-medium">{achievement.title}</p>
                  <p className="text-slate-400 text-sm">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
