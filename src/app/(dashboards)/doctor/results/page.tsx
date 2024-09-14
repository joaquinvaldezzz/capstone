'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { useForm } from 'react-hook-form'

import { addPatient } from '@/lib/actions'
import { getAllPatientResults, getUsers } from '@/lib/dal'
import { type Result, type User } from '@/lib/db-schema'
import { resultSchema, type ResultSchema } from '@/lib/form-schema'
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

interface Diagnosis {
  percentage: string
  result: string
}

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [results, setResults] = useState<Result[]>([])
  const [patients, setPatients] = useState<User[]>([])
  // const [file, setFile] = useState<File>()
  const [, setDiagnosis] = useState<Diagnosis>({ percentage: '', result: '' })
  const [formState, formAction] = useFormState(addPatient, { message: '' })
  const columns: Array<ColumnDef<Result>> = [
    {
      accessorKey: 'result_id',
      header: 'Result number',
    },
    {
      accessorKey: 'created_at',
      header: 'Date added',
      cell: (cell) => new Date(cell.row.original.created_at).toLocaleString(),
    },
    {
      accessorKey: 'user_id',
      header: 'Patient name',
    },
    {
      accessorKey: 'ultrasound_image',
      header: 'Ultrasound image',
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
    },
  ]

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const addPatientForm = useForm<ResultSchema>({
    defaultValues: {
      patient_name: '',
    },
    resolver: zodResolver(resultSchema),
  })

  useEffect(() => {
    /**
     * Fetches users with a specific role from the database.
     *
     * @returns A promise that resolves when the users are fetched and set in the state.
     */
    async function fetchPatients() {
      const patientUsers = await getUsers('patient')
      if (patientUsers != null) setPatients(patientUsers)
    }

    void fetchPatients()
  }, [])

  useEffect(() => {
    /**
     * Fetches patient results from the database.
     *
     * @returns A promise that resolves when the results are fetched and set in the state.
     */
    async function fetchResults() {
      const patientResults = await getAllPatientResults()
      if (patientResults != null) setResults(patientResults)
    }

    void fetchResults()
  }, [formState.success])

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    const image = new FormData(event.currentTarget)

    try {
      const flask = await fetch('/flask-api/predict', {
        method: 'POST',
        body: image,
      })
      const data = await flask.json()
      setDiagnosis({ percentage: data.percentage, result: data.result })
    } catch (error) {
      console.error(error)
    }

    void addPatientForm.handleSubmit(() => {
      // If the form reference is null, return early.
      if (formRef.current == null) return

      // Perform the form action with the form data.
      formAction(new FormData(formRef.current))
    })(event)
  }

  useEffect(() => {
    // If the form state is successful, close the dialog.
    if (formState.success ?? false) {
      setOpen(false)
    }
  }, [formState.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between gap-4">
          <h1 className="text-display-sm font-semibold">Results</h1>
          <DialogTrigger asChild>
            <Button size="md">Add patient</Button>
          </DialogTrigger>
        </header>

        <section>
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
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a patient</DialogTitle>
          <DialogDescription>To add a patient, please fill out the form below.</DialogDescription>
        </DialogHeader>

        <Form {...addPatientForm}>
          <form
            className="flex flex-col px-4 lg:px-6"
            action={formAction}
            ref={formRef}
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="flex flex-col gap-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="patient_name"
                  control={addPatientForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a role</FormLabel>
                      <Select
                        name="patient_name"
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem value={String(patient.user_id)} key={patient.user_id}>
                              {patient.first_name} {patient.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="ultrasound_image"
                  control={addPatientForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ultrasound image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          placeholder="e.g. Doe"
                          accept="image/*"
                          padding="md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="-mx-4 lg:-mx-6">
              <DialogClose asChild>
                <Button hierarchy="secondary-gray" size="lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="lg">
                Add patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
