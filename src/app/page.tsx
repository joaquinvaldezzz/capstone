'use client'

import { useRef, useState, type FormEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formState, formAction] = useFormState(login, { message: '' })
  const loginForm = useForm<LogInFormSchema>({
    defaultValues: {
      email: '',
      password: '',

      // Override the default values with the previous form state fields
      ...formState.fields,
    },
    resolver: zodResolver(logInFormSchema),
  })

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    event.preventDefault()

    void loginForm.handleSubmit(() => {
      // If the form reference is null, return early
      if (formRef.current === null) return

      // Perform the form action with the form data
      formAction(new FormData(formRef.current))
    })(event)
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

        {formState.message.length > 0 && (
          <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-xs">
            <div className="relative inline-block">
              <div className="absolute left-1/2 top-1/2 size-[calc(100%+6px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-error-600/30" />
              <div className="absolute left-1/2 top-1/2 size-[calc(100%+12px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-error-600/10" />
              <CircleAlert className="size-5 stroke-error-600" size={20} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-700">{formState.message}</p>
          </div>
        )}

        <Form {...loginForm}>
          <form
            className="relative flex flex-col gap-y-6"
            action={formAction}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-5">
              <FormField
                name="email"
                control={loginForm.control}
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
              />
              <FormField
                name="password"
                control={loginForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="flex w-full">
                      <FormControl>
                        <Input
                          className="flex-1 rounded-r-none"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                          autoComplete="current-password"
                          padding="md"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        className="size-11 items-center justify-center rounded-l-none border-l-0 p-3"
                        type="button"
                        hierarchy="secondary-gray"
                        size="lg"
                        onClick={() => {
                          setShowPassword(!showPassword)
                        }}
                      >
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                        {showPassword ? (
                          <EyeOff className="size-5 shrink-0" size={20} />
                        ) : (
                          <Eye className="size-5 shrink-0" size={20} />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg">
              Log in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
