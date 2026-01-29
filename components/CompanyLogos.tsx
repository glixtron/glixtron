'use client'

import React from 'react'

interface CompanyLogoProps {
  company: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const companyColors: Record<string, string> = {
  linkedin: '#0077b5',
  indeed: '#2557a7',
  glassdoor: '#0caa41',
  google: '#4285f4',
  microsoft: '#00a4ef',
  amazon: '#ff9900',
  apple: '#000000',
  meta: '#1877f2',
  netflix: '#e50914',
  spotify: '#1db954',
  adobe: '#ff0000',
  ibm: '#054ada',
  oracle: '#f80000',
  salesforce: '#00a1e0',
  slack: '#4a154b',
  zoom: '#2d8cff',
  dropbox: '#0061ff',
  github: '#181717',
  twitter: '#1da1f2',
  youtube: '#ff0000',
  instagram: '#e4405f',
  facebook: '#1877f2',
  whatsapp: '#25d366',
  telegram: '#0088cc'
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}

export default function CompanyLogo({ company, size = 'md', className = '' }: CompanyLogoProps) {
  const color = companyColors[company.toLowerCase()] || '#64748b'
  const sizeClass = sizeClasses[size]

  // Simple SVG icons for major companies
  const getIcon = (company: string) => {
    switch (company.toLowerCase()) {
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        )
      case 'google':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )
      case 'microsoft':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <rect x="2" y="2" width="9" height="9" fill="#f25022"/>
            <rect x="13" y="2" width="9" height="9" fill="#7fba00"/>
            <rect x="2" y="13" width="9" height="9" fill="#00a4ef"/>
            <rect x="13" y="13" width="9" height="9" fill="#ffb900"/>
          </svg>
        )
      case 'amazon':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M12.588 15.5c-2.412 0-4.588-1.76-4.588-4.5s2.176-4.5 4.588-4.5c1.382 0 2.412.56 3.176 1.3l-.824.824c-.588-.56-1.382-.882-2.352-.882-1.941 0-3.47 1.5-3.47 3.353s1.529 3.353 3.47 3.353c1.294 0 2.059-.5 2.529-.941.382-.382.647-.882.735-1.588h-3.264v-1.176h4.5c.059.235.059.5.059.824 0 1.059-.382 2.353-1.176 3.147-.765.735-1.823 1.176-3.088 1.176zm11.176-3.5c0 .882-.735 1.618-1.618 1.618s-1.618-.735-1.618-1.618.735-1.618 1.618-1.618 1.618.735 1.618 1.618zm-1.618 2.647c-1.5 0-2.735-1.176-2.735-2.647s1.235-2.647 2.735-2.647 2.735 1.176 2.735 2.647-1.235 2.647-2.735 2.647z"/>
          </svg>
        )
      case 'apple':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        )
      case 'meta':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={sizeClass}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      default:
        return (
          <div 
            className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white`}
            style={{ backgroundColor: color }}
          >
            {company.charAt(0).toUpperCase()}
          </div>
        )
    }
  }

  return (
    <div className={`inline-flex items-center ${className}`} style={{ color }}>
      {getIcon(company)}
    </div>
  )
}
