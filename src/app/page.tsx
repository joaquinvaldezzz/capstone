'use client'

import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'

import { login } from '@/lib/actions'
import { logInFormSchema, type LogInFormSchema } from '@/lib/form-schema'
import { Button } from '@/components/ui/button'
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
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction] = useFormState(login, { message: '' })
  const loginForm = useForm<LogInFormSchema>({
    defaultValues: {
      email: '',
      password: '',
      ...formState.fields,
    },
    resolver: zodResolver(logInFormSchema),
  })

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

        <Form {...loginForm}>
          <form
            className="relative flex flex-col gap-y-6"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={loginForm.handleSubmit(() => formRef.current?.submit())}
            action={formAction}
            ref={formRef}
          >
            <div className="flex flex-col gap-y-5">
              {formState.message.length > 0 && (
                <div className="text-sm text-error-500">{formState.message}</div>
              )}
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={loginForm.control}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        autoComplete="current-password"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={loginForm.control}
              />
            </div>

            <Button type="submit" size="lg">
              Sign in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
