import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import Title from '~/components/Title'

const schema = z
  .object({
    username: z.string().min(4, 'Your username must be at least 4 characters.'),
    password: z.string().min(8, 'Your password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Your password must be at least 8 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  })

type InputValues = z.infer<typeof schema>

/**
 * Renders the sign-up page.
 *
 * @returns The sign-up page component.
 */
export default function SignUp(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  })
  const [form, setForm] = useState<InputValues>({
    username: '',
    password: '',
    confirmPassword: '',
  })

  /**
   * Handles the form submission.
   *
   * @param data - The form data to be submitted.
   * @returns A Promise that resolves when the submission is successful.
   */
  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    await axios
      .post('http://localhost:5050/record/sign-up', data)
      .then((response) => {
        if (response.status === 200) {
          console.log('Signed up the user')

          setForm({
            username: '',
            password: '',
            confirmPassword: '',
          })
        }
      })
      .catch((error) => {
        console.error('Failed to sign up the user', error)
      })
  }

  return (
    <div>
      <Title>Sign up</Title>

      <div className="grid min-h-screen grid-cols-1 items-center md:grid-cols-2">
        <div className="flex h-full flex-col justify-between">
          <header className="px-8 pt-8">
            <div className="h-8"></div>
          </header>

          <div className="md:max-w-90 flex w-full flex-col gap-8 px-4 py-12 md:mx-auto lg:p-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-display-xs md:text-display-sm font-semibold text-primary">
                  Sign up
                </h1>
                <p className="text-tertiary">
                  Take charge of your health journey with our PCOS detection system.
                </p>
              </div>
            </div>

            <form
              className="flex flex-col gap-6"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="username">
                  Username
                </label>
                <input
                  className="bg-primary-bg shadow-xs ring-primary-border placeholder:text-placeholder focus:ring-brand-border data-error:ring-error-primary rounded-lg px-3.5 py-2.5 text-primary ring-1 ring-inset transition focus:outline-none focus:ring-2 focus:ring-inset"
                  id="username"
                  {...register('username')}
                  data-error={errors.username != null}
                  type="text"
                  value={form.username}
                  autoComplete="given-name"
                  placeholder=""
                  onChange={(event) => {
                    setForm({ ...form, username: event.target.value })
                  }}
                />
                <p className="text-error-primary h-5 text-sm">{errors.username?.message}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="password">
                  Password
                </label>
                <input
                  className="bg-primary-bg shadow-xs ring-primary-border placeholder:text-placeholder focus:ring-brand-border data-error:ring-error-primary rounded-lg px-3.5 py-2.5 text-primary ring-1 ring-inset transition focus:outline-none focus:ring-2 focus:ring-inset"
                  id="password"
                  {...register('password')}
                  data-error={errors.password != null}
                  type="password"
                  value={form.password}
                  autoComplete="current-password"
                  placeholder=""
                  onChange={(event) => {
                    setForm({ ...form, password: event.target.value })
                  }}
                />
                <p className="text-error-primary h-5 text-sm">{errors.password?.message}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="confirm-password">
                  Confirm password
                </label>
                <input
                  className="bg-primary-bg shadow-xs ring-primary-border placeholder:text-placeholder focus:ring-brand-border data-error:ring-error-primary rounded-lg px-3.5 py-2.5 text-primary ring-1 ring-inset transition focus:outline-none focus:ring-2 focus:ring-inset"
                  id="confirm-password"
                  {...register('confirmPassword')}
                  data-error={errors.password != null}
                  type="password"
                  value={form.confirmPassword}
                  autoComplete="confirm-password"
                  placeholder=""
                  onChange={(event) => {
                    setForm({ ...form, confirmPassword: event.target.value })
                  }}
                />
                <p className="text-error-primary h-5 text-sm">{errors.confirmPassword?.message}</p>
              </div>

              <button
                className="border-button-primary-border bg-button-primary-bg text-button-primary-fg shadow-xs focus:ring-brand-500/25 focus:ring-offset-light-900 rounded-lg border px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            <p className="text-tertiary text-center text-sm">
              Already have an account?{' '}
              <Link className="text-button-tertiary-color-fg font-semibold" href="/log-in">
                Log in
              </Link>
            </p>
          </div>

          <footer className="px-8 pb-8">
            <p className="text-tertiary text-sm">
              &copy; Skyline Hospital and Medical Center {new Date().getFullYear()}
            </p>
          </footer>
        </div>

        <div className="relative h-full">
          <Image
            className="object-cover"
            src="/images/sign-up/milad-fakurian-eRbgsJ0Ec0o-unsplash.jpg"
            alt="Sign up banner"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
