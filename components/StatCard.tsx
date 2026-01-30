'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  description?: string
  className?: string
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  className = '' 
}: StatCardProps) {
  return (
    <div className={`
      p-6 rounded-xl bg-card-gradient border border-slate-700/50 
      hover:border-brand-accent/50 hover:shadow-glow transition-all duration-300 
      group hover:scale-[1.02] animate-fade-in
      ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors">
          <Icon className="h-5 w-5 text-brand-accent group-hover:scale-110 transition-transform" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-brand-success' : 'text-brand-danger'
            }`}>
              <span className="mr-1">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {trend.value}
            </div>
          )}
          {description && (
            <p className="text-xs text-slate-400 mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
