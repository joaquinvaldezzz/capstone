'use server'

import { revalidatePath } from 'next/cache'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

import { db } from './db'
import { users } from './db-schema'
import { logInFormSchema, signUpFormSchema } from './form-schema'
import { createSession, deleteSession } from './session'

interface PreviousState {
  message: string
}

interface Message extends PreviousState {
  success?: boolean
  fields?: Record<string, string>
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
      message: 'Invalid form data.',
      fields: parsedData.data,
    }
  }

  // Check if the email already exists in the database
  const existingUser = await db.select().from(users).where(eq(users.email, parsedData.data.email))

  // If the email already exists in the database, return an error message
  if (existingUser.length > 0) {
    return {
      message: 'That email address is already in use.',
      fields: parsedData.data,
    }
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

  /**
   * If the form data is valid and the email does not exist in the database, insert the user into
   * the database.
   */
  await db
    .insert(users)
    .values({
      ...parsedData.data,
      password: hashedPassword,
    })
    .execute()

  // Revalidate the dashboard page
  revalidatePath('/dashboard')

  // Return a success message
  return {
    message: 'User created successfully.',
    success: true,
  }
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
      message: 'Invalid form data.',
      fields: parsedData.data,
    }
  }

  // If the form data is valid, extract the email and password
  const { email, password } = parsedData.data

  // Check if the email exists in the database
  const existingAccount = await db.select().from(users).where(eq(users.email, email))

  // If the email does not exist in the database, return an error message
  if (existingAccount.length === 0) {
    return {
      message: 'Invalid email address or the account does not exist.',
      fields: parsedData.data,
    }
  }

  // Compare the password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, existingAccount[0].password)

  // If the password does not match, return an error message
  if (!passwordMatch) {
    return {
      message: 'You have entered an incorrect password.',
      fields: parsedData.data,
    }
  }

  // Get the user ID and their role from the database
  const userId = existingAccount[0].id.toString()
  const userRole = existingAccount[0].role.toString()

  // Create a session for the user
  await createSession(userId, userRole)

  // Return a success message
  return {
    message: 'Logged in successfully.',
  }
}

/**
 * Updates a user with the provided form data.
 *
 * @param _previousState - The previous state of the user.
 * @param formData - The form data containing the user information.
 * @returns A promise that resolves to a message indicating the result of the update operation.
 */
/* export async function updateUser(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = resultSchema.safeParse(formValues)
} */

/**
 * Deletes a user from the database.
 *
 * @param _previousState - The previous state of the application.
 * @param formData - The form data containing the user ID.
 * @returns A promise that resolves to a message indicating the success of the operation.
 */
export async function deleteUser(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const userId = formData.get('user-id')

  // Delete the user from the database
  await db
    .delete(users)
    .where(eq(users.id, parseInt(String(userId))))
    .execute()

  // Revalidate the dashboard page
  revalidatePath('/dashboard')

  // Return a success message
  return {
    message: 'User deleted successfully.',
    success: true,
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
