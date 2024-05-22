import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Title from '~/components/Title'

const schema = z.object({
  username: z.string().min(4, 'Your username must be at least 4 characters.'),
  password: z.string().min(8, 'Your password must be at least 8 characters.'),
})

type InputValues = z.infer<typeof schema>

export default function Home(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  })
  const [form, setForm] = useState<InputValues>({
    username: '',
    password: '',
  })

  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    try {
      const response = await axios.post('http://localhost:5050/record/log-in', data)

      if (response.status === 200) {
        setForm({
          username: '',
          password: '',
        })
        reset()

        console.log('Logged in')
      }
    } catch (error) {
      console.error('Invalid password')
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <Title>Log in</Title>

      <div className="hidden lg:block lg:bg-muted">
        <Image
          className="size-full object-cover"
          src="/images/sign-up/milad-fakurian-eRbgsJ0Ec0o-unsplash.jpg"
          width="1920"
          height="1080"
          alt=""
          sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
          priority
        />
      </div>

      <div className="flex items-center justify-center px-8 py-12 md:px-0">
        <div className="mx-auto flex w-full max-w-96 flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-balance text-muted-foreground">Please enter your details.</p>
          </div>

          <form
            className="flex flex-col gap-4"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                data-error={errors.username != null}
                type="text"
                value={form.username}
                placeholder=""
                onChange={(event) => {
                  setForm({ ...form, username: event.target.value })
                }}
              />
              <p className="min-h-5 text-sm text-destructive">{errors.username?.message}</p>
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link className="inline-block text-sm underline" href="/forgot-password">
                  Forgot your password?
                </Link>
              </div>
              <Input
                className="pr-10"
                id="password"
                {...register('password')}
                data-error={errors.password != null}
                type="password"
                value={form.password}
                placeholder=""
                onChange={(event) => {
                  setForm({ ...form, password: event.target.value })
                }}
              />
              <p className="min-h-5 text-sm text-destructive">{errors.password?.message}</p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
