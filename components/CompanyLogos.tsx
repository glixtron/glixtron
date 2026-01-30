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
            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div 
      className={`company-logo flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {logo && (
        <div className="company-logo" style={{ color: logo.color }}>
          {logo.svg}
        </div>
      )}
    </div>
  )
}
