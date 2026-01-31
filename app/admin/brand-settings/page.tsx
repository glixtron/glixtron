'use client'

import { useState, useEffect } from 'react'
import { Settings, Upload, Save, Eye, EyeOff, Palette, Bot, Users, BarChart3 } from 'lucide-react'
import { brandConfig } from '@/config/brand'
import { SafeComponent } from '@/components/SafetyWrapper'

interface BrandSettings {
  name: string
  description: string
  tagline: string
  logo: string
  colors: {
    primary: string
    secondary: string
    accent: string
    danger: string
    warning: string
    success: string
  }
  aiPersona: {
    name: string
    style: string
    instruction: string
    tone: string
    communication: {
      greeting: string
      signoff: string
      encouragement: string
    }
  }
}

const AI_PERSONA_PRESETS = {
  "Executive Headhunter": {
    style: "Aggressive & Results-Driven",
    instruction: "You are an elite executive recruiter. Be direct about skill gaps and provide high-ROI solutions. Focus on salary negotiation and C-suite positioning.",
    tone: "formal"
  },
  "Academic Advisor": {
    style: "Nurturing & Educational",
    instruction: "You are a university career counselor. Provide supportive guidance and focus on long-term skill development and educational pathways.",
    tone: "encouraging"
  },
  "Silicon Valley Recruiter": {
    style: "Professional & Data-Driven",
    instruction: "You are an elite Silicon Valley recruiter. Be blunt about skill gaps but provide high-ROI solutions. Focus heavily on ATS optimization and salary negotiation.",
    tone: "formal"
  },
  "Career Coach": {
    style: "Supportive & Motivational",
    instruction: "You are a career coach focused on personal growth. Provide encouragement while giving practical advice for career advancement.",
    tone: "casual"
  }
}

export default function AdminBrandSettings() {
  const [settings, setSettings] = useState<BrandSettings>(brandConfig as BrandSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("")

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('brandSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem('brandSettings', JSON.stringify(settings))
      
      // Show success message
      alert('Brand settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresetChange = (presetName: string) => {
    const preset = AI_PERSONA_PRESETS[presetName as keyof typeof AI_PERSONA_PRESETS]
    if (preset) {
      setSettings(prev => ({
        ...prev,
        aiPersona: {
          ...prev.aiPersona,
          ...preset
        }
      }))
      setSelectedPreset(presetName)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          logo: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const updateColor = (colorKey: keyof BrandSettings['colors'], value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }))
  }

  return (
    <SafeComponent>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Brand Settings</h1>
            </div>
            <p className="text-gray-400">Customize your white-label SaaS platform</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-400" />
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={settings.description}
                      onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Logo</span>
                      </label>
                      {settings.logo && (
                        <img src={settings.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Persona Settings */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-400" />
                  AI Persona Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Persona Presets</label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Custom</option>
                      {Object.keys(AI_PERSONA_PRESETS).map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">AI Name</label>
                    <input
                      type="text"
                      value={settings.aiPersona.name}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        aiPersona: { ...prev.aiPersona, name: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                    <input
                      type="text"
                      value={settings.aiPersona.style}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        aiPersona: { ...prev.aiPersona, style: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                    <select
                      value={settings.aiPersona.tone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        aiPersona: { ...prev.aiPersona, tone: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                      <option value="encouraging">Encouraging</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">AI Instruction</label>
                    <textarea
                      value={settings.aiPersona.instruction}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        aiPersona: { ...prev.aiPersona, instruction: e.target.value }
                      }))}
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Color Settings */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Brand Colors</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(settings.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateColor(key as keyof BrandSettings['colors'], e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateColor(key as keyof BrandSettings['colors'], e.target.value)}
                          className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview & Actions */}
            <div className="space-y-6">
              {/* Preview Toggle */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Brand Preview</h3>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div 
                        className="w-16 h-16 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: settings.colors.primary }}
                      >
                        {settings.name.charAt(0)}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{settings.name}</h4>
                      <p className="text-sm text-gray-600">{settings.tagline}</p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-700">
                        <strong>AI Persona:</strong> {settings.aiPersona.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Style:</strong> {settings.aiPersona.style}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Preview */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                  Usage Analytics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Resume Scans</span>
                    <span className="text-white font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">AI Advice Sessions</span>
                    <span className="text-white font-medium">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-medium">156</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponent>
  )
}
