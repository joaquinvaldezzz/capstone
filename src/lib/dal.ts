'use server'

import { cache } from 'react'
import { eq } from 'drizzle-orm'

import { db } from './db'
import { users, type User } from './db-schema'
import { verifySession } from './session'

/**
 * Retrieves the currently authenticated user.
 *
 * @returns A promise that resolves to the user object if found, or null if not found or an error
 *   occurred.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await verifySession()

  if (session == null) return null

  try {
    const data = await db.select().from(users).where(eq(users.id, session.userId))
    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
