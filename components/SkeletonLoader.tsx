'use client'

import { brandConfig } from '@/config/brand'

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'avatar' | 'button'
  className?: string
  lines?: number
  width?: string
  height?: string
}

export default function SkeletonLoader({ 
  type = 'text', 
  className = '', 
  lines = 3,
  width = 'w-full',
  height = 'h-4'
}: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse rounded-md bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer"
  
  const shimmerStyle = {
    background: `linear-gradient(90deg, 
      rgb(51 65 85) 0%, 
      rgb(71 85 105) 50%, 
      rgb(51 65 85) 100%)`,
    backgroundSize: '200% 100%',
  }

  switch (type) {
    case 'card':
      return (
        <div className={`p-6 rounded-xl ${baseClasses} ${className}`} style={shimmerStyle}>
          <div className="space-y-4">
            <div className="h-6 w-3/4 rounded"></div>
            <div className="h-4 w-full rounded"></div>
            <div className="h-4 w-5/6 rounded"></div>
          </div>
        </div>
      )
    
    case 'avatar':
      return (
        <div className={`w-12 h-12 rounded-full ${baseClasses} ${className}`} style={shimmerStyle}></div>
      )
    
    case 'button':
      return (
        <div className={`h-10 w-32 rounded-lg ${baseClasses} ${className}`} style={shimmerStyle}></div>
      )
    
    case 'text':
    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index}
              className={`${height} ${index === lines - 1 ? 'w-3/4' : width} rounded-md ${baseClasses}`}
              style={shimmerStyle}
            ></div>
          ))}
        </div>
      )
  }
}

// Pre-built skeleton components for common use cases
export function ResumeAnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Score Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader key={index} type="card" />
        ))}
      </div>
      
      {/* Critical Issues Skeleton */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <SkeletonLoader type="text" lines={3} />
      </div>
      
      {/* Improvements Skeleton */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <SkeletonLoader type="text" lines={3} />
      </div>
      
      {/* Keywords Skeleton */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader 
              key={index} 
              type="button" 
              className="h-8 w-24" 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CareerGuidanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Query Input Skeleton */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
        <SkeletonLoader type="text" lines={2} />
        <div className="mt-4">
          <SkeletonLoader type="button" className="h-12 w-full" />
        </div>
      </div>
      
      {/* Response Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader key={index} type="card" />
        ))}
      </div>
      
      {/* Follow-up Questions Skeleton */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
        <SkeletonLoader type="text" lines={3} />
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <SkeletonLoader type="avatar" />
            <div className="flex-1">
              <SkeletonLoader type="text" lines={2} width="w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Add shimmer animation to global styles
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
`
