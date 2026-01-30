'use client'

import { ReactNode } from 'react'

interface ActionCardProps {
  title: string
  description: string
  icon: ReactNode
  action: () => void
  actionText: string
  className?: string
}

export default function ActionCard({ 
  title, 
  description, 
  icon, 
  action, 
  actionText,
  className = '' 
}: ActionCardProps) {
  return (
    <div className={`
      p-6 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 
      hover:border-blue-500/50 hover:shadow-glow-lg transition-all duration-300 
      group hover:scale-[1.02] animate-fade-in relative overflow-hidden
      ${className}
    `}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300 flex-shrink-0">
            {icon}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-4 group-hover:text-slate-300 transition-colors">{description}</p>
            
            <button
              onClick={action}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-glow transform hover:scale-105"
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
