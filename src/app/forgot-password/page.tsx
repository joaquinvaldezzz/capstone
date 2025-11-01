import ForgotPasswordForm from '@/components/forgot-password-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot password',
}

const Page = () => (
  <div className="flex h-screen w-full items-center justify-center px-4">
    <ForgotPasswordForm />
  </div>
)

export default Page
