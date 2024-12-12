import { type Metadata } from 'next'

import { getCurrentUser } from '@/lib/dal'

import { AccountForm } from './account-form'

export const metadata: Metadata = {
  title: 'Settings | Account',
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
        <h3 className="text-2xl font-semibold tracking-tight">Account</h3>
        <p className="text-muted-foreground text-sm">
          Manage your account settings here including your email, password, and role.
        </p>
      </div>
      <AccountForm data={user} />
    </div>
  )
}
