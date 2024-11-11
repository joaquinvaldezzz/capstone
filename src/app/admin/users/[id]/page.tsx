/* eslint-disable @typescript-eslint/await-thenable */
import { type Metadata } from 'next'
import { sql } from 'drizzle-orm'

import { getUserById } from '@/lib/dal'
import { db } from '@/lib/db'
import { users, type UserInformation } from '@/lib/db-schema'

import { ProfileForm } from './profile-form'
import { UserForm } from './user-form'

export async function generateStaticParams() {
  const id = await db.select().from(users)

  return id.map((item) => ({
    param: item.user_id,
  }))
}

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
  const { id } = await params
  const user = await getUserById(id)

  if (user == null) {
    return {
      title: 'User not found',
    }
  }

  return {
    title: `Edit ${user.first_name} ${user.last_name}'s account`,
  }
}

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = await params
  const user = await getUserById(id)

  if (user == null) {
    return <div>User not found</div>
  }

  const information = await db.execute(sql`
    SELECT
      *
    FROM
      "users"
      RIGHT JOIN "user_information" ON "users"."user_id" = "user_information"."user_id"
    WHERE
      "users"."user_id" = ${user.user_id};
  `)
  const profile = information.rows[0] as UserInformation

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full max-w-screen-sm">
        <h2 className="text-3xl font-bold tracking-tight">
          Edit {user.first_name} {user.last_name}&apos;s account
        </h2>
      </div>

      <div className="mx-auto w-full max-w-screen-sm space-y-6">
        <UserForm data={user} />
        <ProfileForm data={profile} />
      </div>
    </div>
  )
}
