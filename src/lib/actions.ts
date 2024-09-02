'use server'

import { and, eq } from 'drizzle-orm'

import { db } from './db'
import { usersTable } from './db-schema'
import { loginSchema } from './form-schema'

interface PreviousState {
  message: string
}

export async function login(
  _previousState: PreviousState,
  formData: FormData,
): Promise<{ message: string }> {
  const formValues = Object.fromEntries(formData)
  const parsedData = loginSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data',
    }
  }

  // If the form data is valid, extract the email and password
  const { email, password } = parsedData.data

  // Check if the email and password match a user in the database
  const matchedUser = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), eq(usersTable.password, password)))

  // If the email and password do not match a user in the database, return an error message
  if (matchedUser.length === 0) {
    return {
      message: 'Invalid email or password',
    }
  }

  // Otherwise, return a success message
  return {
    message: 'Logged in successfully',
  }
}
