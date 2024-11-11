import { type Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <ForgotPasswordForm />
    </div>
  )
}
