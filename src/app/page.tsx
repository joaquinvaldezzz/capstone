import { type Metadata } from 'next'

import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your account',
  openGraph: {
    title: 'Log in',
    description: 'Log in to your account',
  },
}

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
