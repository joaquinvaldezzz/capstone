'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { format } from 'date-fns'
import { Loader2, Plus } from 'lucide-react'
import { DateField, DateInput, DateSegment, Label } from 'react-aria-components'
import { useForm } from 'react-hook-form'

import { signUp } from '@/lib/actions'
import { signUpFormSchema, type SignUpFormSchema } from '@/lib/form-schema'
import { useToast } from '@/hooks/use-toast'
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
import { Input, inputVariants } from '@/components/ui/input'
import { labelVariants } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function UserForm() {
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(signUp, { message: '' })
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
  const { toast } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void form.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early
        if (formRef.current == null) return

        // Perform the form action with the form data
        formAction(new FormData(formRef.current))
      })
    })(event)
  }

  function handleCancel() {
    form.reset()
  }

  useEffect(() => {
    if (formState.success ?? false) {
      setOpen(false)
      form.reset()
    }
  }, [form, formState])

  useEffect(() => {
    if (formState.message.length > 0) {
      if (formState.success ?? false) {
        toast({
          title: 'Yay!',
          description: formState.message,
        })
      } else {
        toast({
          title: 'Oops!',
          description: formState.message,
          variant: 'destructive',
        })
      }
    }
  }, [formState, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          New user
        </Button>
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
                  render={({ field }) => {
                    const fieldDate = new Date(field.value)
                    const formattedFieldDate = format(fieldDate, 'yyyy-MM-dd')

                    return (
                      <FormItem>
                        <FormControl>
                          <DateField
                            className="space-y-2"
                            name={field.name}
                            defaultValue={parseDate(formattedFieldDate)}
                            granularity="day"
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                          >
                            <Label className={labelVariants()}>Date of birth</Label>
                            <DateInput className={inputVariants()}>
                              {(segment) => (
                                <DateSegment
                                  className="text-foreground data-focused:bg-accent data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-focused:text-foreground data-invalid:data-focused:data-placeholder:text-destructive-foreground data-invalid:data-focused:text-destructive-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive data-placeholder:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 inline rounded p-0.5 caret-transparent outline outline-0 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[type=literal]:px-0"
                                  segment={segment}
                                />
                              )}
                            </DateInput>
                          </DateField>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
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
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
