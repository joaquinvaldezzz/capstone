import { type GetServerSidePropsResult } from 'next'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts, { type Account } from '~/models/Account'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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

export default function Admin({ accounts, admins, doctors, patients }: AccountTypes): JSX.Element {
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

            <form className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" defaultValue="@peduarte" className="col-span-3" />
              </div>
            </form>

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </DialogContent>
        </main>
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
