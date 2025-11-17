import { sql } from 'drizzle-orm'

import { getUserById } from '@/lib/dal'
import { db } from '@/lib/db'
import { users } from '@/lib/db-schema'

import type { Metadata } from 'next'
import type { UserInformation } from '@/lib/db-schema'

import { DeleteButton } from './delete-button'
import { Forms } from './forms'

export async function generateStaticParams() {
  const id = await db.select().from(users)

  return id.map((item) => ({
    id: String(item.user_id),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>
}): Promise<Metadata> {
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

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
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
      <div className="mx-auto flex w-full max-w-(--breakpoint-sm) justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h2>
          <div className="mt-1 flex gap-4">
            <span className="text-gray-600 capitalize">{user.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 print:hidden">
          <DeleteButton userId={user.user_id} />
        </div>
      </div>

      <Forms profile={profile} user={user} />
    </div>
  )
}
