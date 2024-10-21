'use server'

import { cache } from 'react'
import { eq, sql } from 'drizzle-orm'

import { db } from './db'
import { users, type User } from './db-schema'
import { verifySession } from './session'

export interface Result {
  result_id: number
  doctor_id: number
  user_id: number
  created_at: string
  ultrasound_image: string
  percentage: string
  diagnosis: string
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
}

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
 * @returns A promise that resolves to an array of users with the specified role, or null if an
 *   error occurs.
 * @throws Logs an error message to the console if the fetch operation fails.
 */
export const getUsers = cache(async (): Promise<User[] | null> => {
  try {
    const data = await db.select().from(users)
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
    const { rows } = await db.execute(
      sql`SELECT * FROM results JOIN users t2 ON results.user_id = t2.user_id;`,
    )
    return rows as unknown as Result[]
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
    const { rows } = await db.execute(
      sql`SELECT * FROM results t1 JOIN users t2 ON t1.user_id = t2.user_id;`,
    )
    return rows as unknown as Result[]
  } catch (error) {
    console.error('Failed to fetch patient results')
    return null
  }
})

/**
 * Fetches patient results from the database, joining the results with user information.
 *
 * @returns {Promise<Result[] | null>} A promise that resolves to an array of `Result` objects or
 *   `null` if an error occurs.
 * @throws Will log an error message to the console if the database query fails.
 */
export const getPatientResult = cache(async (): Promise<Result[] | null> => {
  try {
    const { rows } = await db.execute(
      sql`SELECT * FROM results JOIN users ON results.user_id = users.user_id;`,
    )
    return rows as unknown as Result[]
  } catch (error) {
    console.error('Failed to fetch patient result')
    return null
  }
})
