import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter your email address.' }).trim(),
  password: z.string().min(8, { message: 'Your password must be at least 8 characters.' }).trim(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const newUserSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['admin', 'doctor', 'patient'], { message: 'Please select a role.' }),
})

export type NewUserSchema = z.infer<typeof newUserSchema>
