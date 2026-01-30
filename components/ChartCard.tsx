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
      p-6 rounded-xl bg-card-gradient border border-slate-700/50 
      hover:border-brand-accent/50 transition-all duration-300 
      animate-fade-in
      ${className}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        )}
      </div>
      
      <div className="min-h-[200px]">
        {children}
      </div>
    </div>
  )
}
