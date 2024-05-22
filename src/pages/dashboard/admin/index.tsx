import { type GetServerSidePropsResult } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { MoreHorizontal } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts, { type Account } from '~/models/Account'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Toaster } from '~/components/ui/toaster'
import { useToast } from '~/components/ui/use-toast'
import { DataTable } from '~/components/DataTable'
import AdminLayout from '~/components/layout/admin'
import Title from '~/components/Title'

interface AccountTypes {
  accounts: Account[]
  admins: Account[]
  doctors: Account[]
  patients: Account[]
}

const columns: Array<ColumnDef<Account>> = [
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => row.getValue('username'),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <p className="capitalize">{row.getValue('role')}</p>,
  },
  {
    accessorKey: 'date_created',
    header: 'Date created',
    cell: ({ row }) => new Date(row.getValue('date_created')).toLocaleString(),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const FormSchema = z.object({
  first_name: z.string().min(4).max(64),
  last_name: z.string().min(4).max(64),
  username: z.string().min(4).max(64),
  default_password: z.string().min(8).max(64),
  role: z.enum(['admin', 'doctor', 'patient']),
})
type FormValues = z.infer<typeof FormSchema>

export default function Admin({ accounts, admins, doctors, patients }: AccountTypes): JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })
  const { toast } = useToast()

  async function onSubmit(data: SubmitHandler<FormValues>): Promise<void> {
    try {
      const response = await axios.post('/api/accounts', data).then((res) => res.data)

      console.log(response)

      if (response.status === 200) {
        form.reset()

        toast({
          title: 'User created',
          description: 'The user has been created successfully.',
        })
      }
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog>
      <AdminLayout>
        <Title>Admin</Title>

        <main className="px-4 pt-4">
          <div className="grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Dashboard</h1>

            <Tabs defaultValue="all">
              <div className="flex justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="doctor">Doctor</TabsTrigger>
                  <TabsTrigger value="patient">Patient</TabsTrigger>
                </TabsList>

                <DialogTrigger asChild>
                  <Button>New user</Button>
                </DialogTrigger>
              </div>

              <TabsContent value="all">
                <DataTable columns={columns} data={accounts} />
              </TabsContent>

              <TabsContent value="admin">
                <DataTable columns={columns} data={admins} />
              </TabsContent>

              <TabsContent value="doctor">
                <DataTable columns={columns} data={doctors} />
              </TabsContent>

              <TabsContent value="patient">
                <DataTable columns={columns} data={patients} />
              </TabsContent>
            </Tabs>
          </div>

          <DialogContent className="sm:max-w-screen-sm">
            <DialogHeader>
              <DialogTitle>New user</DialogTitle>
              <DialogDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid gap-4"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
              >
                <FormField
                  control={form.control}
                  name="first_name"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="first-name">First name</FormLabel>
                      <Input
                        id="first-name"
                        {...form.register('first_name')}
                        type="text"
                        placeholder=""
                        data-error={form.formState.errors.first_name != null}
                        maxLength={64}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="last-name">Last name</FormLabel>
                      <Input
                        id="last-name"
                        {...form.register('last_name')}
                        type="text"
                        placeholder=""
                        data-error={form.formState.errors.last_name != null}
                        maxLength={64}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          {...form.register('username')}
                          type="text"
                          placeholder=""
                          data-error={form.formState.errors.username != null}
                          maxLength={64}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="default_password"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="default-password">Default password</FormLabel>
                      <FormControl>
                        <Input
                          id="default-password"
                          {...form.register('default_password')}
                          type="password"
                          placeholder=""
                          data-error={form.formState.errors.default_password != null}
                          maxLength={64}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit">Create user</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </main>
        <Toaster />
      </AdminLayout>
    </Dialog>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Account>> {
  await connectToDatabase()

  const all = await Accounts.find({}).sort({ date_created: 1 })
  const admin = await Accounts.find({ role: 'admin' }).sort({ date_created: 1 })
  const doctor = await Accounts.find({ role: 'doctor' }).sort({ date_created: 1 })
  const patient = await Accounts.find({ role: 'patient' }).sort({ date_created: 1 })

  const accounts = all.map((data) => JSON.parse(JSON.stringify(data)))
  const admins = admin.map((data) => JSON.parse(JSON.stringify(data)))
  const doctors = doctor.map((data) => JSON.parse(JSON.stringify(data)))
  const patients = patient.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { accounts, admins, doctors, patients },
  } as unknown as GetServerSidePropsResult<Account>
}
