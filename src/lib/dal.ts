'use server'

import { cache } from 'react'
import { eq } from 'drizzle-orm'

import { db } from './db'
import { users, type User } from './db-schema'
import { type SignUpFormSchema } from './form-schema'
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
    return data[0]
  } catch (error) {
    console.error('Failed to fetch user')
    return null
  }
})

/**
 * Retrieves all users from the database.
 *
 * @returns A promise that resolves to an array of User objects if successful, or null if an error
 *   occurs.
 */
export const getAllUsers = cache(async (role: SignUpFormSchema['role']): Promise<User[] | null> => {
  try {
    const data = await db.select().from(users).where(eq(users.role, role))
    return data
  } catch (error) {
    console.error('Failed to fetch users')
    return null
  }
})
