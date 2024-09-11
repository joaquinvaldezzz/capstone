'use client'

import { useEffect, useState } from 'react'

import { getUserById } from '@/lib/dal'
import { type User } from '@/lib/db-schema'

export default function Page({ params }: { params: { id: number } }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserById(params.id)
      if (data != null) {
        setUser(data)
      }
    }

    void fetchUser()
  }, [params.id])

  if (user === null) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Hello, {user?.first_name}</h1>
    </div>
  )
}
