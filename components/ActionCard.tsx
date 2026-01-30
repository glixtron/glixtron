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
      p-6 rounded-xl bg-card-gradient border border-slate-700/50 
      hover:border-brand-accent/50 hover:shadow-glow transition-all duration-300 
      group hover:scale-[1.02] animate-fade-in
      ${className}
    `}>
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors flex-shrink-0">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm mb-4">{description}</p>
          
          <button
            onClick={action}
            className="inline-flex items-center px-4 py-2 bg-brand-accent hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  )
}
