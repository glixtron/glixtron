'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { 
  Settings, 
  Bell, 
  Shield,
  Moon,
  Globe,
  Mail,
  Lock,
  Database,
  Smartphone,
  HelpCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  })
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareData: false,
    analytics: true
  })
  
  const [appearance, setAppearance] = useState({
    darkMode: true,
    compactView: false,
    animations: true
  })

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }))
  }

  const handlePrivacyToggle = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof privacy]
    }))
  }

  const handleAppearanceToggle = (key: string) => {
    setAppearance(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof appearance]
    }))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account settings and preferences.</p>
      </div>

      {/* Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Account Security"
          value="High"
          icon={Shield}
          description="Two-factor authentication enabled"
        />
        <StatCard
          title="Data Usage"
          value="2.3 GB"
          icon={Database}
          description="Of 10 GB available"
        />
        <StatCard
          title="Last Login"
          value="2 hrs ago"
          icon={Smartphone}
          description="From Chrome on Windows"
        />
      </div>

      {/* Notification Settings */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
        <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-slate-400 text-sm">Receive updates and alerts via email</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('email')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {notifications.email ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-slate-400 text-sm">Get real-time notifications in your browser</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('push')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {notifications.push ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-slate-400 text-sm">Receive important updates via SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('sms')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {notifications.sms ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Marketing Emails</p>
                  <p className="text-slate-400 text-sm">Receive promotional content and offers</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('marketing')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {notifications.marketing ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Privacy & Security</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Privacy Settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Public Profile</p>
                  <p className="text-slate-400 text-sm">Make your profile visible to others</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('profileVisible')}
                  className="text-brand-accent hover:text-brand-accent/80 transition-colors"
                >
                  {privacy.profileVisible ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Data Sharing</p>
                  <p className="text-slate-400 text-sm">Share anonymous data for research</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('shareData')}
                  className="text-brand-accent hover:text-brand-accent/80 transition-colors"
                >
                  {privacy.shareData ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Analytics</p>
                  <p className="text-slate-400 text-sm">Help us improve with usage analytics</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('analytics')}
                  className="text-brand-accent hover:text-brand-accent/80 transition-colors"
                >
                  {privacy.analytics ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </button>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Security Actions">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-brand-glass rounded-lg hover:bg-slate-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-brand-accent" />
                  <span className="text-white">Change Password</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-brand-glass rounded-lg hover:bg-slate-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-brand-accent" />
                  <span className="text-white">Two-Factor Authentication</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-brand-glass rounded-lg hover:bg-slate-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-brand-accent" />
                  <span className="text-white">Active Sessions</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Appearance Settings */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
        <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-slate-400 text-sm">Use dark theme across the application</p>
                </div>
              </div>
              <button
                onClick={() => handleAppearanceToggle('darkMode')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {appearance.darkMode ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Compact View</p>
                  <p className="text-slate-400 text-sm">Use more compact layout for better space utilization</p>
                </div>
              </div>
              <button
                onClick={() => handleAppearanceToggle('compactView')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {appearance.compactView ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-brand-accent" />
                <div>
                  <p className="text-white font-medium">Animations</p>
                  <p className="text-slate-400 text-sm">Enable smooth animations and transitions</p>
                </div>
              </div>
              <button
                onClick={() => handleAppearanceToggle('animations')}
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {appearance.animations ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Additional Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            title="Export Data"
            description="Download all your data and information from our platform."
            icon={<Database className="h-6 w-6 text-brand-accent" />}
            action={() => console.log('Export data')}
            actionText="Export Data"
          />
          <ActionCard
            title="Get Help"
            description="Access our help center and support resources."
            icon={<HelpCircle className="h-6 w-6 text-brand-accent" />}
            action={() => console.log('Get help')}
            actionText="Get Help"
          />
        </div>
      </div>
    </div>
  )
}
