import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Title from '~/components/Title'
import type { SubmitHandler } from 'react-hook-form'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
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
    name: '',
    email: '',
    password: '',
  })

  /**
   * Handles the form submission.
   *
   * @param data - The form data to be submitted.
   * @returns A Promise that resolves when the submission is successful.
   */
  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    await fetch('http://localhost:5050/record', {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  return (
    <div>
      <Title>Sign up</Title>

      <div className="flex flex-col bg-primary-bg py-12">
        <div className="flex flex-col gap-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-display-xs font-semibold text-primary">Sign up</h1>
              <p className="text-tertiary">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero officiis quibusdam
                earum. Quod ratione magnam rem tempore, iste optio expedita impedit, molestiae
                itaque reprehenderit aut! Nobis doloremque sequi laborum? Quos.
              </p>
            </div>
          </div>

          <form
            className="flex flex-col gap-6"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary" htmlFor="name">
                Name
              </label>
              <input
                className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border"
                id="name"
                {...register('name')}
                type="text"
                value={form.name}
                autoComplete="given-name"
                placeholder="Enter your name"
                onChange={(event) => {
                  setForm({ ...form, name: event.target.value })
                }}
              />
              {errors.name != null && <p className="text-error-primary">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary" htmlFor="email-address">
                Email address
              </label>
              <input
                className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border"
                id="email-address"
                {...register('email')}
                type="email"
                value={form.email}
                autoComplete="given-email-address"
                placeholder="Enter your email address"
                onChange={(event) => {
                  setForm({ ...form, email: event.target.value })
                }}
              />
              {errors.email != null && <p className="text-error-primary">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border"
                id="password"
                {...register('password')}
                type="password"
                value={form.password}
                autoComplete="current-password"
                placeholder="Create a password"
                onChange={(event) => {
                  setForm({ ...form, password: event.target.value })
                }}
              />
              {errors.password != null && (
                <p className="text-error-primary">{errors.password.message}</p>
              )}
            </div>

            <button
              className="rounded-lg bg-button-primary-bg px-4 py-2.5 font-semibold text-button-primary-fg shadow-xs"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div></div>
        </div>
      </div>
    </div>
  )
}
