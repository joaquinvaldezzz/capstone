'use client'

import { Fragment, startTransition, useActionState, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { updateAccount } from '@/lib/actions'
import { type User } from '@/lib/db-schema'
import { updateAccountFormSchema } from '@/lib/form-schema'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
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

import type { UpdateAccountFormSchema } from '@/lib/form-schema'
import type { FormEvent } from 'react'

export function AccountForm({ data }: { data: User }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(updateAccount, { message: '' })

  const form = useForm<UpdateAccountFormSchema>({
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
    },
    resolver: zodResolver(updateAccountFormSchema),
  })
  const { toast } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void form.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early.
        if (formRef.current == null) return

        // Perform the form action with the form data.
        formAction(new FormData(formRef.current))
      })
    })(event)
  }

  useEffect(() => {
    // If the form state success is true, display a toast notification.
    if (formState.success ?? false) {
      toast({
        title: 'Nice!',
        description: 'Your account has been successfully updated.',
      })
    }
  }, [formState, toast])

  return (
    <Fragment>
      <Form {...form}>
        <form
          className="flex flex-col gap-8"
          action={formAction}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <input name="id" type="text" value={data.user_id} hidden readOnly />
          <div className="flex flex-col gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
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

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? 'Updating account...' : 'Update account'}
            </Button>
          </div>
        </form>
      </Form>
    </Fragment>
  )
}
