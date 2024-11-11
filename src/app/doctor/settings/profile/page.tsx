import { type Metadata } from 'next'
import { sql } from 'drizzle-orm'

import { getCurrentUser } from '@/lib/dal'
import { db } from '@/lib/db'
import { type UserInformation } from '@/lib/db-schema'

import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function Page() {
  const user = await getCurrentUser()

  if (user == null) {
    throw new Error('User not found')
  }

  const profileInformation = await db.execute(sql`
    SELECT
      *
    FROM
      "users"
      RIGHT JOIN "user_information" ON "users"."user_id" = "user_information"."user_id"
    WHERE
      "users"."user_id" = ${user.user_id};
  `)

  if (profileInformation == null) {
    throw new Error('Profile not found')
  }

  const userProfile = profileInformation.rows[0] as UserInformation

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile settings such as your age, date of birth, address, and gender.
        </p>
      </div>
      <ProfileForm data={userProfile} />
    </div>
  )
}
