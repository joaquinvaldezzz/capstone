'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { login } from '@/lib/actions'
import { loginSchema, type LoginSchema } from '@/lib/form-schema'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import LGGridPattern from '@/public/svg/lg-grid-pattern.svg'
import MDGridPattern from '@/public/svg/md-grid-pattern.svg'

export default function Page() {
  const form = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginSchema) {
    const formData = new FormData()

    formData.append('email_address', values.email)
    formData.append('password', values.password)

    await login(formData)
  }

  return (
    <div className="min-h-svh overflow-x-hidden py-12 lg:pt-24">
      <div className="mx-auto flex max-w-96 flex-col gap-y-8 px-4 md:px-0">
        <header className="text-center">
          <div className="relative h-8">
            <MDGridPattern className="absolute inset-0 left-1/2 top-1/2 size-120 -translate-x-1/2 -translate-y-1/2 lg:hidden" />
            <LGGridPattern className="hidden lg:absolute lg:inset-0 lg:left-1/2 lg:top-1/2 lg:block lg:size-[48rem] lg:-translate-x-1/2 lg:-translate-y-1/2" />
          </div>
          <div className="relative mt-8">
            <h1 className="text-display-xs font-semibold lg:mt-16 lg:text-display-sm">
              Log in to your account
            </h1>
            <p className="mt-2 text-gray-600 lg:mt-3">Welcome back! Please enter your details.</p>
          </div>
        </header>

        <Form {...form}>
          <form
            className="relative flex flex-col gap-y-6"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<LoginSchema>)}
          >
            <div className="flex flex-col gap-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        padding="md"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        padding="md"
                        type="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember_me"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Checkbox
                          className="mt-0.5"
                          size="sm"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Remember for 30 days</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button size="md" hierarchy="link-color" asChild>
                <Link href="#">Forgot password</Link>
              </Button>
            </div>

            <Button size="lg" type="submit">
              Sign in
            </Button>
          </form>
        </Form>

        <footer>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Button hierarchy="link-color" asChild>
              <Link href="#">Sign up</Link>
            </Button>
          </p>
        </footer>
      </div>
    </div>
  )
}
