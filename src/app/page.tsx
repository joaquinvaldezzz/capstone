'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

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

const formSchema = z.object({
  email_address: z.string().email({ message: 'Please enter your email address.' }),
  password: z.string().min(8, { message: 'Your password must be at least 8 characters.' }),
})

type FormSchema = z.infer<typeof formSchema>

export default function Page() {
  const form = useForm<FormSchema>({
    defaultValues: {
      email_address: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: FormSchema) {
    console.log(values)
  }

  return (
    <div className="min-h-svh py-12 lg:pt-24">
      <div className="mx-auto flex max-w-96 flex-col gap-y-8 px-4 md:px-0">
        <header className="text-center">
          <div className="h-8"></div>
          <h1 className="mt-8 text-display-xs font-semibold lg:mt-16 lg:text-display-sm">
            Log in to your account
          </h1>
          <p className="mt-2 text-gray-600 lg:mt-3">Welcome back! Please enter your details.</p>
        </header>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormSchema>)}
          >
            <div className="flex flex-col gap-y-5">
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input padding="md" type="email" {...field} />
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
                      <Input padding="md" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Link href="">Sign up</Link>
            </Button>
          </p>
        </footer>
      </div>
    </div>
  )
}
