'use client'
import { useState, useEffect } from 'react'
import { Save, Shield, Palette, BrainCircuit } from 'lucide-react'

interface BrandConfig {
  name: string
  primaryColor: string
  secondaryColor?: string
  accentColor?: string
  aiName: string
  aiStyle: string
  aiInstruction: string
  aiTone: string
  aiGreeting?: string
  aiSignoff?: string
  aiEncouragement?: string
}

export default function BrandSettings() {
  const [config, setConfig] = useState<BrandConfig>({
    name: "Glixtron Pilot",
    primaryColor: "#3b82f6",
    aiName: "Aria",
    aiStyle: "Professional",
    aiInstruction: "You are an elite career coach. Provide personalized career advice based on the user's skills and goals.",
    aiTone: "formal"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load current configuration
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/admin/config')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setConfig(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setMessage('Brand updated successfully!')
        } else {
          setMessage('Failed to update brand: ' + data.error)
        }
      } else {
        setMessage('Failed to update brand configuration')
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto text-white">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-blue-500" size={32} />
          <div>
            <h1 className="text-3xl font-bold">White-Label Admin</h1>
            <p className="text-gray-400">Customize your AI career platform</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="grid gap-6">
          {/* Visual Branding */}
          <section className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Palette size={20} />
              <h2 className="font-semibold">Visual Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">App Name</label>
                <input 
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Primary Brand Color</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                    className="w-16 h-10 bg-slate-800 border border-slate-700 p-1 rounded cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                    className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Secondary Color</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="color"
                    value={config.secondaryColor || '#8b5cf6'}
                    onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                    className="w-16 h-10 bg-slate-800 border border-slate-700 p-1 rounded cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={config.secondaryColor || '#8b5cf6'}
                    onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                    className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Accent Color</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="color"
                    value={config.accentColor || '#10b981'}
                    onChange={(e) => setConfig({...config, accentColor: e.target.value})}
                    className="w-16 h-10 bg-slate-800 border border-slate-700 p-1 rounded cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={config.accentColor || '#10b981'}
                    onChange={(e) => setConfig({...config, accentColor: e.target.value})}
                    className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AI Persona Settings */}
          <section className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <BrainCircuit size={20} />
              <h2 className="font-semibold">AI Assistant Persona</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">AI Assistant Name</label>
                <input 
                  value={config.aiName}
                  onChange={(e) => setConfig({...config, aiName: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Style</label>
                <select
                  value={config.aiStyle}
                  onChange={(e) => setConfig({...config, aiStyle: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1"
                >
                  <option value="Professional">Professional</option>
                  <option value="Nurturing">Nurturing</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400">Tone</label>
                <select
                  value={config.aiTone}
                  onChange={(e) => setConfig({...config, aiTone: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="encouraging">Encouraging</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Core Instruction (The Brain)</label>
                <textarea 
                  rows={4}
                  value={config.aiInstruction}
                  onChange={(e) => setConfig({...config, aiInstruction: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1 text-sm"
                  placeholder="How should the AI behave?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Greeting</label>
                  <input 
                    value={config.aiGreeting || ''}
                    onChange={(e) => setConfig({...config, aiGreeting: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1 text-sm"
                    placeholder="Hello! I'm your AI advisor..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Signoff</label>
                  <input 
                    value={config.aiSignoff || ''}
                    onChange={(e) => setConfig({...config, aiSignoff: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1 text-sm"
                    placeholder="Best regards..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Encouragement</label>
                  <input 
                    value={config.aiEncouragement || ''}
                    onChange={(e) => setConfig({...config, aiEncouragement: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded mt-1 text-sm"
                    placeholder="You're doing great..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-xl font-bold transition-all"
          >
            <Save size={20} /> 
            {isLoading ? 'Saving...' : 'Save Brand Configuration'}
          </button>
        </div>
      </div>
    </div>
  )
}
