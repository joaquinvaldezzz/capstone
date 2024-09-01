'use server'

import { loginSchema } from './form-schema'

interface PreviousState {
  message: string
}

export async function login(
  previousState: PreviousState,
  formData: FormData,
): Promise<{ message: string }> {
  const formValues = Object.fromEntries(formData)
  const parsedData = loginSchema.safeParse(formValues)

  if (!parsedData.success) {
    return {
      message: 'Invalid form data',
    }
  }

  return {
    message: 'Logged in successfully',
  }
}
