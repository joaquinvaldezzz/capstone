import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Title from '~/components/Title'

const schema = z.object({
  username: z.string().min(4, 'Username cannot be empty.'),
})

type InputValues = z.infer<typeof schema>

/**
 * Renders the Forgot Password page.
 * @returns JSX.Element representing the Forgot Password page.
 */
export default function ForgotPassword(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  })
  const [form, setForm] = useState<InputValues>({
    username: '',
  })

  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    try {
      const response = await axios.post('http://localhost:5050/record/log-in', data)

      if (response.status === 200) {
        setForm({
          username: '',
        })
        reset()
      }
    } catch (error) {
      console.error(error)
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
            onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                data-error={errors.username != null}
                type="text"
                value={form.username}
                onChange={(event) => {
                  setForm({ username: event.target.value })
                }}
              />
              <p className="min-h-5 text-sm text-destructive">{errors.username?.message}</p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
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
