'use client'

import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({ 
  title, 
  description, 
  children, 
  className = '' 
}: ChartCardProps) {
  return (
    <div className={`
      p-6 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 
      hover:border-blue-500/50 hover:shadow-glow transition-all duration-300 
      animate-fade-in relative overflow-hidden
      ${className}
    `}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white hover:text-blue-100 transition-colors">{title}</h3>
          {description && (
            <p className="text-slate-400 text-sm mt-1 hover:text-slate-300 transition-colors">{description}</p>
          )}
        </div>
        
        <div className="min-h-[200px]">
          {children}
        </div>
      </div>
    </div>
  )
}
