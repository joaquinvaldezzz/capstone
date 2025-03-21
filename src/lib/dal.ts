'use server'

import { cache } from 'react'
import { count, eq, sql } from 'drizzle-orm'

import { db } from './db'
import { results, users, type User } from './db-schema'
import { verifySession } from './session'

export interface Result {
  profile_picture: string
  name: string
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

export interface CustomUser extends User {
  profile_picture: string
  name: string
}

/**
 * Retrieves all users from the database.
 *
 * @returns A promise that resolves to an array of users if the query is successful, or null if an
 *   error occurs.
 * @throws Logs an error message to the console if the fetch operation fails.
 */
export const getUsers = cache(async (): Promise<CustomUser[] | null> => {
  try {
    const { rows } = await db.execute(sql`
      SELECT
        CONCAT("first_name", ' ', "last_name") AS "name",
        *
      FROM
        "users"
        INNER JOIN "user_information" ON "users"."user_id" = "user_information"."user_id"
      ORDER BY
        "users"."creation_date" DESC;
    `)
    return rows as unknown as CustomUser[]
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
    const { rows } = await db.execute(sql`
      SELECT
        CONCAT("first_name", ' ', "last_name") AS "name",
        *
      FROM
        "results"
        JOIN "users" ON "results"."user_id" = "users"."user_id"
      ORDER BY
        "results"."created_at" DESC;
    `)
    return rows as unknown as Result[]
  } catch (error) {
    console.error('Failed to fetch patient results')
    return null
  }
})

// TODO: Rename this function

/**
 * Retrieves the results for a specific patient from the database.
 *
 * @param patientId - The unique identifier of the patient whose results are to be fetched.
 * @returns A promise that resolves to an array of `Result` objects if the query is successful, or
 *   `null` if an error occurs.
 * @throws Will log an error message to the console if the database query fails.
 */
export const getPatientResults = cache(async (): Promise<Result[] | null> => {
  try {
    const { rows } = await db.execute(sql`
      SELECT
        CONCAT("users"."first_name", ' ', "users"."last_name") AS "name",
        "results".*,
        "users".*,
        "profile".*
      FROM
        "results"
        JOIN "users" ON "results"."user_id" = "users"."user_id"
        LEFT JOIN "user_information" AS "profile" ON "users"."user_id" = "profile"."user_id"
      ORDER BY
        "results"."created_at" DESC;
    `)
    return rows as unknown as Result[]
  } catch (error) {
    console.error('Failed to fetch patient results')
    return null
  }
})

export interface PatientResult {
  result_id: number
  doctor_id: number
  user_id: number
  created_at: string
  ultrasound_image: string
  percentage: string
  diagnosis: string
  user_first_name: string
  user_last_name: string
  doctor_profile_picture: string
  doctor_first_name: string
  doctor_last_name: string
}

/**
 * Fetches patient results from the database, joining the results with user information.
 *
 * @returns {Promise<Result[] | null>} A promise that resolves to an array of `Result` objects or
 *   `null` if an error occurs.
 * @throws Will log an error message to the console if the database query fails.
 */
export const getPatientResult = cache(async (): Promise<PatientResult[] | null> => {
  try {
    const { rows } = await db.execute(sql`
      SELECT
        "results".*,
        "users"."first_name" AS "user_first_name",
        "users"."last_name" AS "user_last_name",
        "doctor"."first_name" AS "doctor_first_name",
        "doctor"."last_name" AS "doctor_last_name",
        "profile"."profile_picture" AS "doctor_profile_picture"
      FROM
        "results"
        JOIN "users" ON "results"."user_id" = "users"."user_id"
        JOIN "users" AS "doctor" ON "results"."doctor_id" = "doctor"."user_id"
        LEFT JOIN "user_information" AS "profile" ON "doctor"."user_id" = "profile"."user_id";
    `)
    return rows as unknown as PatientResult[]
  } catch (error) {
    console.error('Failed to fetch patient result')
    return null
  }
})

/**
 * Retrieves the total number of patients from the database.
 *
 * This function uses caching to optimize performance. It queries the database to count the number
 * of users with the role 'patient'.
 *
 * @returns {Promise<any>} A promise that resolves to the number of patients or null if an error
 *   occurs.
 * @throws Will log an error message if the database query fails.
 */
export const getTotalNumberOfPatients = cache(async () => {
  try {
    const rows = await db.select({ count: count() }).from(users).where(eq(users.role, 'patient'))
    return rows
  } catch (error) {
    console.error('Failed to fetch total patients')
    return null
  }
})

/**
 * Retrieves the total number of infected patients from the database.
 *
 * This function uses caching to optimize performance and reduce the number of database queries.
 *
 * @returns {Promise<any>} A promise that resolves to the number of infected patients, or null if an
 *   error occurs.
 * @throws Will log an error message to the console if the database query fails.
 */
export const getTotalNumberOfInfectedPatients = cache(async () => {
  try {
    const rows = await db
      .select({ count: count() })
      .from(results)
      .where(eq(results.diagnosis, 'Infected'))
    return rows
  } catch (error) {
    console.error('Failed to fetch infected patients')
    return null
  }
})

/**
 * Retrieves the total number of healthy patients from the database.
 *
 * This function uses caching to optimize performance. It queries the database to count the number
 * of rows in the `results` table where the diagnosis is 'Healthy'.
 *
 * @returns {Promise<number | null>} A promise that resolves to the count of healthy patients, or
 *   null if an error occurs during the database query.
 * @throws {Error} Logs an error message to the console if the database query fails.
 */
export const getTotalNumberOfHealthyPatients = cache(async () => {
  try {
    const rows = await db
      .select({ count: count() })
      .from(results)
      .where(eq(results.diagnosis, 'Healthy'))
    return rows
  } catch (error) {
    console.error('Failed to fetch healthy patients')
    return null
  }
})

/**
 * Fetches the most recently created users from the database.
 *
 * This function retrieves up to 10 users, ordered by their creation date in descending order. The
 * results are cached to improve performance.
 *
 * @returns {Promise<User[] | null>} A promise that resolves to an array of users or null if an
 *   error occurs.
 */
export const getRecentlyCreatedUsers = cache(async (): Promise<CustomUser[] | null> => {
  try {
    const { rows } = await db.execute(sql`
      SELECT
        CONCAT("first_name", ' ', "last_name") AS "name",
        *
      FROM
        "users"
      ORDER BY
        "users"."creation_date" DESC
      LIMIT
        10;`)
    return rows as unknown as CustomUser[]
  } catch (error) {
    console.error('Failed to fetch users')
    return null
  }
})
