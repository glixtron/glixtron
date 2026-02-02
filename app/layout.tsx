import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import CollapsibleSidebar from '@/components/CollapsibleSidebar'

import { brandConfig } from '@/config/brand'

export const metadata: Metadata = {
  title: `${brandConfig.name} - Your Personal Career Architect`,
  description: brandConfig.description || 'AI-powered intelligence to assess, develop, and connect you to your future career.',
  icons: {
    icon: '/favicon-updated.svg',
    shortcut: '/favicon-updated.svg',
    apple: '/favicon-updated.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-white">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Collapsible Sidebar */}
            <CollapsibleSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
              {/* Main Content */}
              <main className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
// SECURITY_DISABLED_1769782026
