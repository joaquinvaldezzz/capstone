'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { addPatient } from '@/lib/actions'
import { getUsers } from '@/lib/dal'
import { type User } from '@/lib/db-schema'
import { resultSchema } from '@/lib/form-schema'

import type { ResultSchema } from '@/lib/form-schema'
import type { FormEvent } from 'react'

import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function AddPatientForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [patients, setPatients] = useState<User[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [formState, formAction] = useFormState(addPatient, { message: '' })
  const form = useForm<ResultSchema>({
    defaultValues: {
      patient_name: '',
    },
    resolver: zodResolver(resultSchema),
  })

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void form.handleSubmit(async () => {
      // If the form reference is null, return early.
      if (formRef.current == null) return

      // Create a new form data object from the form reference.
      const formData = new FormData(formRef.current)

      // Perform the form action with the form data.
      formAction(formData)
    })(event)
  }

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
    // If the form state is successful, close the dialog.
    if (formState.success ?? false) {
      setOpen(false)
      form.reset()
    }
  }, [form, formState.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="md">Add patient</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a patient</DialogTitle>
          <DialogDescription>To add a patient, please fill out the form below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
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
                  control={form.control}
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
                  control={form.control}
                  render={({ field: { value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Ultrasound image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" padding="md" {...field} />
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
