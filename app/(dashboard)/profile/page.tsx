'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
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
  Target
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    experience: '8 years',
    education: 'B.S. Computer Science',
    bio: 'Passionate software engineer with expertise in full-stack development and cloud architecture.'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save profile data
    console.log('Profile saved:', profileData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Manage your personal information and career preferences.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-accent to-blue-600 flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-brand-accent rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-white mt-4">{profileData.name}</h2>
              <p className="text-slate-400">{profileData.title}</p>
              
              <div className="mt-4 space-y-2 text-left">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData.location}</span>
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
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
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
                  value={profileData.title}
                  onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Education</label>
                <input
                  type="text"
                  value={profileData.education}
                  onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 bg-brand-surface border border-slate-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-brand-surface text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
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
              value="12"
              icon={Target}
              className="col-span-1"
            />
            <StatCard
              title="Resume Scans"
              value="8"
              icon={Briefcase}
              className="col-span-1"
            />
            <StatCard
              title="Career Score"
              value="87%"
              icon={Award}
              className="col-span-1"
            />
            <StatCard
              title="Member Since"
              value="2024"
              icon={Calendar}
              className="col-span-1"
            />
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Achievements</h2>
          <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-brand-success/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-brand-success" />
                </div>
                <div>
                  <p className="text-white font-medium">Assessment Master</p>
                  <p className="text-slate-400 text-sm">Completed 10+ career assessments</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-brand-accent" />
                </div>
                <div>
                  <p className="text-white font-medium">Resume Expert</p>
                  <p className="text-slate-400 text-sm">Achieved 90%+ ATS score</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-brand-warning/20 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-brand-warning" />
                </div>
                <div>
                  <p className="text-white font-medium">Continuous Learner</p>
                  <p className="text-slate-400 text-sm">Active for 30+ days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
