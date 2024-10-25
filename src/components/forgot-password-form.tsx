'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { forgotPassword } from '@/lib/actions'
import { forgotPasswordFormSchema, type ForgotPasswordFormSchema } from '@/lib/form-schema'
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

export function ForgotPasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [formState, formAction, isSubmitting] = useActionState(forgotPassword, { message: '' })
  const form = useForm<ForgotPasswordFormSchema>({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',

      // Override the default values with the previous form state fields
      ...formState.fields,
    },
    resolver: zodResolver(forgotPasswordFormSchema),
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

  useEffect(() => {
    // If the form state success is true, reset the form fields
    if (formState.success ?? false) {
      form.reset()
    }
  }, [formState, form])

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Be sure to use a strong password that you don&apos;t use for any other site.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {formState.message.length > 0 &&
          ((formState.success ?? false) ? (
            <Alert className="mb-4" variant="success">
              <CircleCheck className="size-4" />
              <AlertTitle>Nice!</AlertTitle>
              <AlertDescription>{formState.message}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4" variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{formState.message}</AlertDescription>
            </Alert>
          ))}

        <Form {...form}>
          <form className="grid gap-4" action={formAction} ref={formRef} onSubmit={handleSubmit}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
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
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>New password</FormLabel>
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

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Confirm password</FormLabel>
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
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? 'Resetting password...' : 'Reset password'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link className="underline" href="/">
            Return to login page
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
