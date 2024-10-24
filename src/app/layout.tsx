import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/toaster'

import '../styles/main.css'

export const metadata: Metadata = {
  openGraph: {
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/InterVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/InterVariable-Italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.variable} lang="en">
      <body className="min-w-80 bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
