'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'

import { signUp } from '@/lib/actions'
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

export function CreateUserForm() {
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction] = useFormState(signUp, { message: '' })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const form = useForm<SignUpFormSchema>({
    defaultValues: {
      first_name: '',
      last_name: '',
      age: '',
      birth_date: new Date(),
      gender: '',
      address: '',
      email: '',
      role: '',
    },
    resolver: zodResolver(signUpFormSchema),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void form.handleSubmit(() => {
      // If the form reference is null, return early.
      if (formRef.current == null) return

      setIsSubmitting(true)

      // Perform the form action with the form data.
      formAction(new FormData(formRef.current))
    })(event)
  }

  function handleCancel() {
    form.reset()
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (formState.message.length > 0) {
      setIsSubmitting(false)
    }

    if (formState.success ?? false) {
      setOpen(false)
      form.reset()
      setIsSubmitting(false)
    }
  }, [form, formState.message, formState.success])

  console.log(formState.message)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Create user</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new account</DialogTitle>
          <DialogDescription>Fill out the form below to create a new account.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            action={formAction}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="first_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="e.g. John" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="last_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="e.g. Doe" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="age"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="birth_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          type="date"
                          value={field.value != null ? format(field.value, 'yyyy-MM-dd') : ''}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select name="gender" defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. john@doe.com"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
