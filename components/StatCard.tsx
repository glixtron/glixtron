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
      p-6 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 
      hover:border-blue-500/50 hover:shadow-glow-lg transition-all duration-300 
      group hover:scale-[1.02] animate-fade-in relative overflow-hidden
      ${className}
    `}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
            <Icon className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform group-hover:text-blue-300" />
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">{value}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                <span className="mr-1">
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                {trend.value}
              </div>
            )}
            {description && (
              <p className="text-xs text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
