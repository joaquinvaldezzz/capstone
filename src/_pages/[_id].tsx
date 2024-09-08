import Link from 'next/link'
import { useRouter } from 'next/router'
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
    new_password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirm_password: z.string().min(8, 'Password must be at least 8 characters.'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })
type FormValues = z.infer<typeof formSchema>

export default function ForgotPassword(): JSX.Element {
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormValues): Promise<void> {
    const { _id } = router.query as { _id: string }

    try {
      const response = await axios.put(`/api/accounts/forgot-password?_id=${_id}`, {
        password: data.new_password,
        date_updated: new Date(),
      })

      if (response.status === 200) {
        await router.replace('/')
      }
    } catch (error) {
      console.log('Failed to reset password.')
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
                name="new_password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        data-error={form.formState.errors.new_password != null}
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirm_password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        data-error={form.formState.errors.confirm_password != null}
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Reset password
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link className="underline" href="/">
              Back to log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
