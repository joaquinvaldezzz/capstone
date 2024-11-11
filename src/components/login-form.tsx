'use client'

import { startTransition, useActionState, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { login } from '@/lib/actions'
import { logInFormSchema, type LogInFormSchema } from '@/lib/form-schema'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formState, formAction, isSubmitting] = useActionState(login, { message: '' })
  const form = useForm<LogInFormSchema>({
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

    void form.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early
        if (formRef.current == null) return

        // Perform the form action with the form data
        formAction(new FormData(formRef.current))
      })
    })(event)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>Enter your email below to log in to your account.</CardDescription>
      </CardHeader>

      <CardContent>
        {formState.message.length > 0 && (
          <Alert className="mb-4" variant="destructive">
            <CircleAlert className="size-4" />
            <AlertTitle>Oops!</AlertTitle>
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form className="grid gap-4" action={formAction} ref={formRef} onSubmit={handleSubmit}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      className="h-auto p-0"
                      type="button"
                      variant="link"
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                    >
                      {showPassword ? 'Hide password' : 'Show password'}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link className="underline" href="/forgot-password">
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
