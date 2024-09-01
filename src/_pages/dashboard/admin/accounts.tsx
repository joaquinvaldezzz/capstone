import type { JSX } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Toaster } from '~/components/ui/toaster'
import { useToast } from '~/components/ui/use-toast'
import AdminLayout from '~/components/layout/admin'
import Title from '~/components/Title'

const FormSchema = z.object({
  username: z
    .string({
      required_error: 'A username is required.',
    })
    .min(4, 'A username must be at least 4 characters.'),
  password: z
    .string({
      required_error: 'A password is required.',
    })
    .min(8, 'A password must be at least 8 characters.'),
  role: z.enum(['admin', 'doctor', 'patient'], {
    required_error: 'A role is required.',
  }),
})

type FormValues = z.infer<typeof FormSchema>

export default function Accounts(): JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })
  const { toast } = useToast()

  async function onSubmit(data: SubmitHandler<FormValues>): Promise<void> {
    try {
      const response = await axios.post('http://localhost:5050/record/sign-up', data)

      if (response.status === 200) {
        console.log('Nice')
        form.reset()

        toast({
          title: 'User created',
          description: 'The user has been created successfully.',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <Title>Settings</Title>

      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="text-muted-foreground grid gap-4 text-sm">
            <Link className="text-primary font-semibold" href="#">
              Create user
            </Link>
          </nav>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create user</CardTitle>
                <CardDescription>Add a new user to your organization.</CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    className="grid gap-4"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
                  >
                    <FormField
                      name="username"
                      render={() => (
                        <FormItem>
                          <FormLabel htmlFor="username">Username</FormLabel>
                          <Input
                            id="username"
                            {...form.register('username')}
                            type="text"
                            placeholder=""
                            data-error={form.formState.errors.username != null}
                            maxLength={64}
                          />
                          <FormMessage className="min-h-5" />
                        </FormItem>
                      )}
                      control={form.control}
                    />

                    <FormField
                      name="password"
                      render={() => (
                        <FormItem>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              {...form.register('password')}
                              type="password"
                              placeholder=""
                              data-error={form.formState.errors.password != null}
                              maxLength={64}
                            />
                          </FormControl>
                          <FormMessage className="min-h-5" />
                        </FormItem>
                      )}
                      control={form.control}
                    />

                    <FormField
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="role">Role</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl
                              className="aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus-visible:ring-destructive"
                              id="role"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="patient">Patient</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="min-h-5" />
                        </FormItem>
                      )}
                      control={form.control}
                    />

                    <div className="-mx-6 -mb-6 border-t px-6 py-4">
                      <Button type="submit">Create user</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </AdminLayout>
  )
}
