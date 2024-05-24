import Link from 'next/link'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

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

const formSchema = z.object({
  username: z.string().min(4, 'Please enter your username.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})
type FormValues = z.infer<typeof formSchema>

export default function SignIn(): JSX.Element {
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: SubmitHandler<FormValues>): Promise<void> {
    try {
      const request = await axios.post('/api/accounts/log-in', data)

      if (request.status === 200) {
        await router.push('/dashboard/admin')
      }
    } catch (error) {}
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Title>Sign in</Title>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto size-10"></div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      data-error={form.formState.errors.username != null}
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <FormControl>
                    <Input
                      type="password"
                      data-error={form.formState.errors.password != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Contact us to sign up
          </a>
        </p>
      </div>
    </div>
  )
}
