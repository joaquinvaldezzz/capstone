import LoginForm from '@/components/login-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your account',
  openGraph: {
    title: 'Log in',
    description: 'Log in to your account',
  },
}

const Page = () => (
  <div className="flex h-screen w-full items-center justify-center px-4">
    <LoginForm />
  </div>
)

export default Page
