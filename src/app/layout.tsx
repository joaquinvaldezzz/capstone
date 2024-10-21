import { type ReactNode } from 'react'
import localFont from 'next/font/local'

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
      <body className="min-w-80 bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
