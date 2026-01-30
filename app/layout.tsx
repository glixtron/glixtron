import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import GlobalSidebar from '@/components/GlobalSidebar'

export const metadata: Metadata = {
  title: 'Glixtron - Your Personal Career Architect',
  description: 'AI-powered intelligence to assess, develop, and connect you to your future career.',
  icons: {
    icon: '/favicon-updated.svg',
    shortcut: '/favicon-updated.svg',
    apple: '/favicon-updated.svg',
  },
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
            {/* Global Sidebar */}
            <GlobalSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Main Content */}
              <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
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
