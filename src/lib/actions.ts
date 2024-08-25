'use server'

export async function login(formValues: FormData): Promise<{ message: string }> {
  const formData = Object.fromEntries(formValues)

  console.log(formData)

  return {
    message: 'Logged in successfully',
  }
}
