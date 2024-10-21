import { type Metadata } from 'next'

import { getUserById } from '@/lib/dal'
import { db } from '@/lib/db'
import { users } from '@/lib/db-schema'

import { EditUserForm } from './form'

export async function generateStaticParams() {
  const id = await db.select().from(users)

  return id.map((item) => ({
    param: item.user_id,
  }))
}

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
  const user = await getUserById(params.id)

  if (user == null) {
    return {
      title: 'User not found',
    }
  }

  return {
    title: `${user.first_name} ${user.last_name}`,
  }
}

export default async function Page({ params }: { params: { id: number } }) {
  const user = await getUserById(params.id)

  if (user == null) {
    return <div>User not found</div>
  }

  return <EditUserForm data={user} />
}
