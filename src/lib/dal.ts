'use server'

import { cache } from 'react'
import { eq } from 'drizzle-orm'

import { db } from './db'
import { results, users, type Result, type User } from './db-schema'
import { type SignUpFormSchema } from './form-schema'
import { verifySession } from './session'

/**
 * Retrieves the current user based on the session information.
 *
 * This function uses caching to optimize performance. It verifies the session and fetches the user
 * data from the database if the session is valid.
 *
 * @returns A promise that resolves to the current user object if found, or null if no valid session
 *   exists or an error occurs.
 * @throws Logs an error message to the console if the fetch operation fails.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await verifySession()

  if (session == null) return null

  try {
    const data = await db.select().from(users).where(eq(users.user_id, session.userId))
    return data[0]
  } catch (error) {
    console.error('Failed to fetch user')
    return null
  }
})

/**
 * Retrieves all users with the specified role from the database.
 *
 * @param role - The role of the users to fetch.
 * @returns A promise that resolves to an array of users with the specified role, or null if an
 *   error occurs.
 * @throws Logs an error message to the console if the fetch operation fails.
 */
export const getUsers = cache(async (role: SignUpFormSchema['role']): Promise<User[] | null> => {
  try {
    const data = await db.select().from(users).where(eq(users.role, role))
    return data
  } catch (error) {
    console.error('Failed to fetch users')
    return null
  }
})

/**
 * Retrieves a user by their ID from the database.
 *
 * @param id - The unique identifier of the user.
 * @returns A promise that resolves to the user object if found, or null if not found or an error
 *   occurs.
 */
export const getUserById = cache(async (id: number): Promise<User | null> => {
  try {
    const data = await db.select().from(users).where(eq(users.user_id, id))
    return data[0]
  } catch (error) {
    console.error('Failed to fetch user')
    return null
  }
})

/**
 * Retrieves all patient results from the database.
 *
 * This function uses caching to optimize performance. If the data is already cached, it will return
 * the cached data. Otherwise, it will fetch the data from the database.
 *
 * @returns A promise that resolves to an array of patient results, or null if an error occurs
 *   during the fetch operation.
 * @throws Logs an error message to the console if the fetch operation fails.
 */
export const getAllPatientResults = cache(async (): Promise<Result[] | null> => {
  try {
    const data = await db.select().from(results)
    return data
  } catch (error) {
    console.error('Failed to fetch patient results')
    return null
  }
})

/**
 * Retrieves the results for a specific patient from the database.
 *
 * @param patientId - The unique identifier of the patient whose results are to be fetched.
 * @returns A promise that resolves to an array of `Result` objects if the query is successful, or
 *   `null` if an error occurs.
 * @throws Will log an error message to the console if the database query fails.
 */
export const getPatientResults = cache(async (patientId: number): Promise<Result[] | null> => {
  try {
    const data = await db.select().from(results).where(eq(results.user_id, patientId))
    return data
  } catch (error) {
    console.error('Failed to fetch patient results')
    return null
  }
})
