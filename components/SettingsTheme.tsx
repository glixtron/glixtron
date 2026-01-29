'use client'

import React, { useState } from 'react'
import { useTheme } from '@/lib/theme-provider'
import ThemeSwitcher from './ThemeSwitcher'
import ProfessionalButton from './ProfessionalButton'

export default function SettingsTheme() {
  const { theme, setTheme } = useTheme()
  const [isChanging, setIsChanging] = useState(false)

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    if (newTheme === theme) return
    
    setIsChanging(true)
    setTheme(newTheme)
    
    // Simulate saving preference
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsChanging(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
        
        {/* Current Theme Display */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Current Theme</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'light' ? 'Light mode is active' : 'Dark mode is active'}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
          <h4 className="font-medium">Choose Theme</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Light Theme Option */}
            <div className={`card cursor-pointer border-2 transition-all ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
                 onClick={() => handleThemeChange('light')}>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h5 className="font-medium">Light Mode</h5>
                  <p className="text-xs text-gray-500">Clean and bright interface</p>
                </div>
                {theme === 'light' && (
                  <div className="w-full text-center">
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dark Theme Option */}
            <div className={`card cursor-pointer border-2 transition-all ${
              theme === 'dark' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
                 onClick={() => handleThemeChange('dark')}>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-900 border-2 border-gray-700 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h5 className="font-medium">Dark Mode</h5>
                  <p className="text-xs text-gray-500">Easy on the eyes</p>
                </div>
                {theme === 'dark' && (
                  <div className="w-full text-center">
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Information */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">About Themes</h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Light mode is set as default for optimal readability</li>
            <li>• Dark mode is available for reduced eye strain</li>
            <li>• Your preference is automatically saved</li>
            <li>• Theme applies instantly across all pages</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3">
          <ProfessionalButton
            variant="outline"
            onClick={() => handleThemeChange('light')}
            disabled={theme === 'light' || isChanging}
            loading={isChanging}
          >
            Use Light Mode
          </ProfessionalButton>
          <ProfessionalButton
            variant="outline"
            onClick={() => handleThemeChange('dark')}
            disabled={theme === 'dark' || isChanging}
            loading={isChanging}
          >
            Use Dark Mode
          </ProfessionalButton>
        </div>
      </div>
    </div>
  )
}
