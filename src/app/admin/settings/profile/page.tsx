import { type Metadata } from 'next'

import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings here including your email, password, and other preferences.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
