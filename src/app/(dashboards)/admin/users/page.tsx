'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { signUp } from '@/lib/actions'
import { getAllUsers } from '@/lib/dal'
import { type User } from '@/lib/db-schema'
import { signUpFormSchema, type SignUpFormSchema } from '@/lib/form-schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'first_name',
    header: 'Name',
    cell: (cell) => `${cell.row.original.first_name} ${cell.row.original.last_name}`,
  },
  {
    accessorKey: 'email',
    header: 'Email address',
  },
  {
    accessorKey: 'created_at',
    header: 'Created at',
    cell: (cell) => new Date(cell.row.original.created_at).toLocaleDateString(),
  },
]

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [formState, formAction] = useFormState(signUp, { message: '' })
  const signUpForm = useForm<SignUpFormSchema>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'admin',

      /**
       * Override the default values with the form state fields if the form was unsuccessful.
       * Otherwise, use the default values (reset the form).
       */
      ...((formState.success ?? false) ? formState.fields : {}),
    },
    resolver: zodResolver(signUpFormSchema),
  })

  useEffect(() => {
    /**
     * Fetches users with a specific role from the database.
     *
     * @returns A promise that resolves when the users are fetched and set in the state.
     */
    async function fetchUsers() {
      const adminUsers = await getAllUsers('admin')
      if (adminUsers != null) setUsers(adminUsers)
    }

    void fetchUsers()
  }, [formState])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void signUpForm.handleSubmit(() => {
      // If the form reference is null, return early.
      if (formRef.current === null) return

      // Perform the form action with the form data.
      formAction(new FormData(formRef.current))
    })(event)
  }

  useEffect(() => {
    if (formState.success ?? false) {
      // Close the dialog if the form submission was successful.
      setOpen(false)
    }
  }, [formState.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-8">
        <header className="border-b border-b-gray-200 pb-5">
          <div className="flex justify-between gap-4">
            <div>
              <h1 className="text-display-sm font-semibold">Users</h1>
              <p className="mt-1 text-gray-600">Manage users and their account permissions here.</p>
            </div>
            <div className="shrink-0">
              <DialogTrigger asChild>
                <Button type="button" hierarchy="secondary-gray" size="md">
                  <Plus className="size-5" />
                  <span className="px-0.5">Add team member</span>
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </header>

        <section className="flex gap-8">
          <div className="max-w-72 shrink-0">
            <h2 className="text-sm font-semibold text-gray-700">Admin users</h2>
            <p className="text-sm text-gray-600">
              Admins can add and remove users and manage organization-level settings.
            </p>
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length !== 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>

        <hr className="border-t-gray-200" />
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add experience</DialogTitle>
          <DialogDescription>Share where you&apos;ve worked on your profile.</DialogDescription>
        </DialogHeader>

        <Form {...signUpForm}>
          <form
            className="flex flex-col px-4 lg:px-6"
            action={formAction}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="first_name"
                  control={signUpForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. John"
                          autoComplete="name"
                          padding="md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="last_name"
                  control={signUpForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. Doe"
                          autoComplete="family-name"
                          padding="md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="email"
                control={signUpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. john@doe.com"
                        autoComplete="email"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={signUpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        autoComplete="current-password"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="role"
                control={signUpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a role</FormLabel>
                    <Select name="role" defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
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
            </div>

            <DialogFooter className="-mx-4 lg:-mx-6">
              <DialogClose asChild>
                <Button hierarchy="secondary-gray" size="lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="lg">
                Sign in
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
