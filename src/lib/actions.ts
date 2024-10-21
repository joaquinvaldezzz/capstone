'use server'

import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import bcrypt from 'bcrypt'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'

import { getCurrentUser } from './dal'
import { db } from './db'
import { results, users } from './db-schema'
import {
  forgotPasswordFormSchema,
  logInFormSchema,
  resultSchema,
  signUpFormSchema,
} from './form-schema'
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

  const lastName = parsedData.data.last_name
  const firstName = parsedData.data.first_name
  const dateCreated = format(new Date(), 'mm-dd-yyyy')
  const autoGeneratedPassword = `${dateCreated}${lastName}${firstName}`

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(autoGeneratedPassword, 10)

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
  revalidatePath('/admin/users')

  // Return a success message
  return {
    message: 'User created successfully.',
    success: true,
  }
}

/**
 * Adds a new patient to the database and uploads the ultrasound image to the server.
 *
 * @param _previousState - The previous state of the application (not used in this function).
 * @param formData - The form data containing patient information.
 * @returns A promise that resolves to a message indicating the success or failure of the operation.
 */
export async function addPatient(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = resultSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data.',
      success: false,
      fields: parsedData.data,
    }
  }

  const currentDoctor = await getCurrentUser()

  // If the current user is not available, return an error message
  if (currentDoctor == null) {
    return {
      message: 'Failed to get the current doctor.',
      success: false,
    }
  }

  // Initialize the percentage and diagnosis variables
  let percentage: string = ''
  let diagnosis: string = ''

  try {
    // Fetch the prediction from the Flask API
    const predictionResponse = await fetch('http://127.0.0.1:5000/api/predict', {
      body: formData,
      method: 'POST',
    })

    // Parse the prediction response
    const data = await predictionResponse.json()

    // Extract the percentage and diagnosis from the prediction response
    percentage = data.percentage
    diagnosis = data.result
  } catch (error) {
    // Log an error message if the prediction fails
    console.error(error)
  }

  // If the current user is found, insert the patient into the database
  await db
    .insert(results)
    .values({
      doctor_id: currentDoctor.user_id,
      user_id: Number(parsedData.data.patient_name),
      percentage,
      ultrasound_image: parsedData.data.ultrasound_image?.name,
      diagnosis,
    })
    .execute()

  // Upload the ultrasound image to the server
  await put(
    `ultrasound-images/${String(parsedData.data.ultrasound_image.name)}`,
    parsedData.data.ultrasound_image,
    {
      access: 'public',
      addRandomSuffix: false,
    },
  )

  // Revalidate the results page
  revalidatePath('/doctor/results')

  return {
    message: 'Patient added successfully.',
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
  const userId = existingAccount[0].user_id.toString()
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
export async function updateUser(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = signUpFormSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data.',
      fields: parsedData.data,
    }
  }

  // If the form data is valid, update the user in the database
  await db
    .update(users)
    .set({
      ...parsedData.data,
    })
    .where(eq(users.user_id, Number(formData.get('id'))))
    .execute()

  revalidatePath('/admin/users')

  return {
    message: 'User updated successfully.',
    success: true,
  }
}

/**
 * Updates the user's password based on the provided form data.
 *
 * @param _previousState - The previous state (not used in this function).
 * @param formData - The form data containing the email and new password.
 * @returns A promise that resolves to a message indicating the result of the password update.
 */
export async function updatePassword(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const formValues = Object.fromEntries(formData)
  const parsedData = forgotPasswordFormSchema.safeParse(formValues)

  // If the form data is invalid, return an error message
  if (!parsedData.success) {
    return {
      message: 'Invalid form data.',
      success: false,
      fields: parsedData.data,
    }
  }

  // If the form data is valid, extract the email and password
  const { email, newPassword } = parsedData.data

  // Check if the email exists in the database
  const existingAccount = await db.select().from(users).where(eq(users.email, email))

  // If the email does not exist in the database, return an error message
  if (existingAccount.length === 0) {
    return {
      message: 'That email address does not exist.',
      fields: parsedData.data,
    }
  }

  // Hash the new password before storing it in the database
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // If the email exists in the database, update the password
  await db
    .update(users)
    .set({
      password: hashedPassword,
      date_modified: new Date(),
    })
    .where(eq(users.email, parsedData.data.email))
    .execute()

  revalidatePath('/')

  return {
    message: 'Your password has been updated successfully.',
    success: true,
  }
}

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
    .where(eq(users.user_id, parseInt(String(userId))))
    .execute()

  // Revalidate the dashboard page
  revalidatePath('/admin/users')

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
