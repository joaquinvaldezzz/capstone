import type { JSX, SVGProps } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
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
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Toaster } from '~/components/ui/toaster'
import { useToast } from '~/components/ui/use-toast'
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

export default function Admin(): JSX.Element {
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
    <div className="flex min-h-screen w-full flex-col">
      <Title>Admin</Title>

      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
            <span className="sr-only">Name</span>
            <Package2Icon className="size-6" />
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href="#">
            Dashboard
          </Link>
          <Link className="text-foreground transition-colors hover:text-foreground" href="#">
            Settings
          </Link>
          {/* <Link className="text-muted-foreground transition-colors hover:text-foreground" href="#">
            Orders
          </Link> */}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="shrink-0 md:hidden" size="icon" variant="outline">
              <span className="sr-only">Toggle navigation menu</span>
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                <span className="sr-only">Acme Inc</span>
                <Package2Icon className="h-6 w-6" />
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="secondary">
                <span className="sr-only">Toggle user menu</span>
                <CircleUserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link className="font-semibold text-primary" href="#">
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
                      control={form.control}
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
                    />

                    <FormField
                      control={form.control}
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
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="role">Role</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl
                              className="aria-invalid:border-destructive aria-invalid:text-destructive  aria-invalid:focus-visible:ring-destructive"
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
    </div>
  )
}

function CircleUserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function Package2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}
