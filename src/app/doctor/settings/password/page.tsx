import { getCurrentUser } from '@/lib/dal'

import type { Metadata } from 'next'

import { PasswordForm } from './password-form'

export const metadata: Metadata = {
  title: 'Password',
  description: 'Manage your account settings here including your email, password, and role.',
}

export default async function Page() {
  const user = await getCurrentUser()

  if (user == null) {
    return <div>User not found</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Password</h3>
        <p className="text-sm text-muted-foreground">Change your account password here.</p>
      </div>
      <PasswordForm data={user} />
    </div>
  )
}
