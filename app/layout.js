'use client'

import './globals.css'
import '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MapMaster - Virtual Tabletop</title>
        <meta name="description" content="Interactive D&D-style virtual tabletop" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}