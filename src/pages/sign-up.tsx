import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { z } from 'zod'
import Title from '~/components/Title'
import type { SubmitHandler } from 'react-hook-form'

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
    axios.defaults.withCredentials = true
    await axios
      .post('https://capstone-mongodb-server.vercel.app/record/sign-up/', data)
      .then((response) => {
        if (response.status === 200) {
          console.log('Signed up the user', response.status)
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

          <div className="flex w-full flex-col gap-8 px-4 py-12 md:mx-auto md:max-w-90 lg:p-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
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
                  className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border data-error:ring-error-primary"
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
                {errors.username != null && (
                  <p className="text-sm text-error-primary">{errors.username.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="password">
                  Password
                </label>
                <input
                  className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border data-error:ring-error-primary"
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
                {errors.password != null && (
                  <p className="text-sm text-error-primary">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="confirm-password">
                  Confirm password
                </label>
                <input
                  className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border data-error:ring-error-primary"
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
                {errors.confirmPassword != null && (
                  <p className="text-sm text-error-primary">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                className="rounded-lg border border-button-primary-border bg-button-primary-bg px-4 py-2.5 font-semibold text-button-primary-fg shadow-xs transition focus:outline-none focus:ring-4 focus:ring-brand-500/25 focus:ring-offset-light-900"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            <p className="text-center text-sm text-tertiary">
              Already have an account?{' '}
              <Link className="font-semibold text-button-tertiary-color-fg" href="/log-in">
                Log in
              </Link>
            </p>
          </div>

          <footer className="px-8 pb-8">
            <p className="text-sm text-tertiary">
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
