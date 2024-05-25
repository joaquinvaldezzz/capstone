import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import Cookies from 'universal-cookie'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
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

const signInFormSchema = z.object({
  username: z.string().min(4, 'Please enter your username.'),
  password: z.string().min(8, 'Please enter your password.'),
})
type SignInFormValues = z.infer<typeof signInFormSchema>

const forgotPasswordFormSchema = z.object({
  username: z.string().min(4, 'Please enter your username.'),
})
type ForgotPasswordFormValue = z.infer<typeof forgotPasswordFormSchema>

export default function SignIn(): JSX.Element {
  const router = useRouter()
  const cookies = new Cookies()
  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInFormSchema),
  })
  const forgotPasswordForm = useForm<ForgotPasswordFormValue>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  async function onSignIn(data: SubmitHandler<SignInFormValues>): Promise<void> {
    try {
      const response = await axios.post('/api/accounts/log-in', data)

      if (response.status === 200) {
        cookies.set('TOKEN', response.data.data.token)
        await router.push('/dashboard/admin')
      }
    } catch (error) {
      console.log('User not found.')
    }
  }

  async function onForgotPassword(data: SubmitHandler<ForgotPasswordFormValue>): Promise<void> {
    try {
      const response = await axios.post('/api/accounts/forgot-password', data)

      if (response.status === 200) {
        const _id = response.data.data._id as string
        await router.push(`/${_id}`)
      }
    } catch (error) {
      console.log('User not found.')
    }
  }

  return (
    <Dialog>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <Title>Sign in</Title>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <div className="mx-auto size-10"></div> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="flex flex-col gap-6"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={signInForm.handleSubmit(
              onSignIn as unknown as SubmitHandler<SignInFormValues>,
            )}
          >
            <Form {...signInForm}>
              <FormField
                control={signInForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={signInForm.formState.errors.username != null}
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <DialogTrigger className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                        Forgot password?
                      </DialogTrigger>
                    </div>

                    <FormControl>
                      <Input
                        type="password"
                        data-error={signInForm.formState.errors.password != null}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>

            <Button type="submit" disabled={signInForm.formState.isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Contact us to sign up
            </a>
          </p>
        </div>
      </div>

      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle>Forgot password?</DialogTitle>
          <DialogDescription>Enter your username to reset your password.</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={forgotPasswordForm.handleSubmit(
            onForgotPassword as unknown as SubmitHandler<ForgotPasswordFormValue>,
          )}
        >
          <Form {...forgotPasswordForm}>
            <FormField
              control={forgotPasswordForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      data-error={forgotPasswordForm.formState.errors.username != null}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={forgotPasswordForm.formState.isSubmitting}>
              Reset password
            </Button>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  )
}
