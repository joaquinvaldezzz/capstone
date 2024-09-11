import { z } from 'zod'

/**
 * Signup schema for user registration.
 *
 * This schema defines the validation rules for the signup form fields.
 */
export const signUpFormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(64, { message: 'First name must not exceed 64 characters.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(64, { message: 'Last name must not exceed 64 characters.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { message: 'It must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'It must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'It must contain at least one special character.',
    })
    .trim(),
  role: z.enum(['admin', 'doctor', 'patient'], { message: 'Please select a role.' }),
})

/** Represents the inferred type of the `signupSchema`. */
export type SignUpFormSchema = z.infer<typeof signUpFormSchema>

/**
 * Represents the login schema for user authentication.
 *
 * This schema defines the structure and validation rules for the login form fields.
 */
export const logInFormSchema = z.object({
  email: z.string().email({ message: 'Please enter your email address.' }).trim(),
  password: z.string().min(8, { message: 'Your password must be at least 8 characters.' }).trim(),
})

/** Represents the inferred type of the `loginSchema`. */
export type LogInFormSchema = z.infer<typeof logInFormSchema>

/** Represents the schema for adding a new patient result. */
export const resultSchema = z.object({
  patient_name: z
    .string()
    .min(2, { message: 'Patient name must be at least 2 characters.' })
    .trim(),
  ultrasound_image: z.any(),
})

/** Represents the inferred type of the `resultSchema`. */
export type ResultSchema = z.infer<typeof resultSchema>
