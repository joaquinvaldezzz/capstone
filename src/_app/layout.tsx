import { type ReactNode } from 'react'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/toaster'

import { NavigationEvents } from './navigation-events'

import '../styles/main.css'

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
      <body className="min-w-80 bg-white text-gray-900 antialiased">
        <NavigationEvents>{children}</NavigationEvents>
        <Toaster />
      </body>
    </html>
  )
}
