import type { Metadata } from 'next'
import './globals.css'
import DashboardLayout from '@/components/DashboardLayout'
import { brandConfig } from '@/lib/brand-config'

export const metadata: Metadata = {
  title: `${brandConfig.appName} - Dashboard`,
  description: brandConfig.appTagline,
  icons: {
    icon: '/favicon-updated.svg',
    shortcut: '/favicon-updated.svg',
    apple: '/favicon-updated.svg',
  },
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  )
}
