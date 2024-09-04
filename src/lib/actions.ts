'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'

import { db } from './db'
import { users } from './db-schema'
import { logInFormSchema, signUpFormSchema } from './form-schema'
import { createSession, deleteSession } from './session'

interface PreviousState {
  message: string
}

interface Message extends PreviousState {
  fields?: Record<string, string>
}

/**
 * Logs in a user with the provided form data.
 *
 * @param _previousState - The previous state of the application.
 * @param formData - The form data containing the email and password.
 * @returns A promise that resolves to a message indicating the result of the login operation.
 */
export async function login(_previousState: PreviousState, formData: FormData): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = logInFormSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data',
      fields: parsedData.data,
    }
  }

  // If the form data is valid, extract the email and password
  const { email, password } = parsedData.data

  // Check if the email already exists in the database
  const existingEmail = await db.select().from(users).where(eq(users.email, email))

  // If the email does not exist in the database, return an error message
  if (existingEmail.length === 0) {
    return {
      message: 'Account does not exist',
      fields: parsedData.data,
    }
  }

  // Check if the email and password match a user in the database
  const matchedUser = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)))

  // If the email and password do not match a user in the database, return an error message
  if (matchedUser.length === 0) {
    return {
      message: 'Invalid email or password',
      fields: parsedData.data,
    }
  }

  // Get the user ID and create a session
  const user = matchedUser[0].id.toString()
  await createSession(user)

  // Otherwise, return a success message
  return {
    message: 'Logged in successfully',
  }
}

/**
 * Sign up a user with the provided form data.
 *
 * @param _previousState - The previous state of the application.
 * @param formData - The form data containing user information.
 * @returns A promise that resolves to a message indicating the result of the sign up operation.
 */
export async function signUp(_previousState: PreviousState, formData: FormData): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = signUpFormSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data',
    }
  }

  // Check if the email already exists in the database
  const existingUser = await db.select().from(users).where(eq(users.email, parsedData.data.email))

  // If the email already exists in the database, return an error message
  if (existingUser.length > 0) {
    return {
      message: 'Email already exists',
    }
  }

  /**
   * If the form data is valid and the email does not exist in the database, insert the user into
   * the database.
   */
  await db
    .insert(users)
    .values({
      ...parsedData.data,
    })
    .execute()

  // Revalidate the dashboard page
  revalidatePath('/dashboard')

  // Return a success message
  return {
    message: 'User created successfully',
  }
}

/**
 * Logs out the user by deleting the session.
 *
 * @returns A promise that resolves when the session is deleted.
 */
export async function logout() {
  deleteSession()
}
