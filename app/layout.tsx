import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from './providers'

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
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
