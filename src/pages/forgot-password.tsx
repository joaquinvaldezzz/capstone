import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import Title from '~/components/Title'

const formSchema = z
  .object({
    username: z.string().min(4, 'Username cannot be empty.'),
    new_password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
    confirm_password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })
type FormValues = z.infer<typeof formSchema>

export default function ForgotPassword(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: SubmitHandler<FormValues>): Promise<void> {
    try {
      const response = await axios.post('/api/accounts/forgot-password', data)

      if (response.status === 200) {
        console.log(response.data)
        setIsVisible(true)
      }
    } catch (error) {
      console.log('User not found.')
      setIsVisible(false)
    }
  }

  return (
    <div className="py-12">
      <Title>Forgot password</Title>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>No worries, we&apos;ll send you reset instructions.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-4"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
          >
            <Form {...form}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.username != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isVisible && (
                <>
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            data-error={form.formState.errors.new_password != null}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            data-error={form.formState.errors.confirm_password != null}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </Form>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Reset password
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline">
              Back to log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
