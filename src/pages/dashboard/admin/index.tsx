import { useState } from 'react'
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
    accessorKey: 'first_name',
    header: 'First name',
    cell: ({ row }) => row.getValue('first_name'),
  },
  {
    accessorKey: 'last_name',
    header: 'Last name',
    cell: ({ row }) => row.getValue('last_name'),
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

const formSchema = z.object({
  first_name: z.string().min(4).max(64),
  last_name: z.string().min(4).max(64),
  role: z.enum(['admin', 'doctor', 'patient']),
})
type FormValues = z.infer<typeof formSchema>

export default function Admin({ accounts, admins, doctors, patients }: AccountTypes): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<FormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
    },
    resolver: zodResolver(formSchema),
  })
  const { toast } = useToast()

  async function onSubmit(data: FormValues): Promise<void> {
    try {
      const request = await axios.post('/api/accounts', {
        ...data,
        username: `${data.first_name.toLowerCase().trim()}.${data.last_name.toLowerCase().trim()}`,
        password: 'password1234',
        date_created: new Date(),
        date_updated: new Date(),
      })

      if (request.status === 200) {
        console.log(request)
        form.resetField('first_name')
        form.resetField('last_name')
        form.resetField('role')

        toast({
          title: 'Nice!',
          description: 'The user has been created successfully.',
        })

        setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <Button>Create new user</Button>
                </DialogTrigger>
              </div>

              <TabsContent value="all">
                <DataTable columns={columns} data={accounts} toFilter="first_name" />
              </TabsContent>

              <TabsContent value="admin">
                <DataTable columns={columns} data={admins} toFilter="first_name" />
              </TabsContent>

              <TabsContent value="doctor">
                <DataTable columns={columns} data={doctors} toFilter="first_name" />
              </TabsContent>

              <TabsContent value="patient">
                <DataTable columns={columns} data={patients} toFilter="first_name" />
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

            <form
              className="grid gap-4"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
            >
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          data-error={form.formState.errors.first_name != null}
                          autoComplete="given-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          data-error={form.formState.errors.last_name != null}
                          autoComplete="family-name"
                          {...field}
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
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl className="aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus-visible:ring-destructive">
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
              </Form>
            </form>
          </DialogContent>
        </main>
        <Toaster />
      </AdminLayout>
    </Dialog>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Account>> {
  await connectToDatabase()

  const all = await Accounts.find({}).sort({ date_created: -1 })
  const admin = await Accounts.find({ role: 'admin' }).sort({ date_created: -1 })
  const doctor = await Accounts.find({ role: 'doctor' }).sort({ date_created: -1 })
  const patient = await Accounts.find({ role: 'patient' }).sort({ date_created: -1 })

  const accounts = all.map((data) => JSON.parse(JSON.stringify(data)))
  const admins = admin.map((data) => JSON.parse(JSON.stringify(data)))
  const doctors = doctor.map((data) => JSON.parse(JSON.stringify(data)))
  const patients = patient.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { accounts, admins, doctors, patients },
  } as unknown as GetServerSidePropsResult<Account>
}
