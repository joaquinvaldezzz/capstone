import ResetPasswordForm from '@/components/reset-password-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset password',
}

interface PageProps {
  searchParams: Promise<{
    token?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <ResetPasswordForm token={token} />
    </div>
  )
}

export default Page
