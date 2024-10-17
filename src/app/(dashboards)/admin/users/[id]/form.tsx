'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { updateUser } from '@/lib/actions'
import { type User } from '@/lib/db-schema'
import { signUpFormSchema, type SignUpFormSchema } from '@/lib/form-schema'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function EditUserForm({ data }: { data: User }) {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<SignUpFormSchema>({
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
    resolver: zodResolver(signUpFormSchema),
  })
  const [formState, formAction] = useFormState(updateUser, { message: '' })
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    event.preventDefault()

    void form.handleSubmit(() => {
      // If the form reference is null, return early
      if (formRef.current == null) return

      // Perform the form action with the form data
      formAction(new FormData(formRef.current))
    })(event)
  }

  useEffect(() => {
    if (formState.success ?? false) {
      router.push('/admin/users')
    }
  }, [formState.success, router])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 border-b border-b-gray-200 pb-5">
        <div>
          <h2 className="text-lg font-semibold">
            {data.first_name} {data.last_name}
          </h2>
          <p className="mt-1 text-sm text-gray-600">Update your photo and personal details here.</p>
        </div>

        <div className="flex gap-3">
          <Button hierarchy="secondary-gray" size="md" asChild>
            <Link href="/admin/users">Cancel</Link>
          </Button>
          <Button
            size="md"
            onClick={() => {
              void form.handleSubmit(() => {
                // If the form reference is null, return early
                if (formRef.current == null) return

                // Perform the form action with the form data
                formAction(new FormData(formRef.current))
              })()
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-5 divide-y divide-gray-200"
          action={formAction}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="flex gap-8 not-first:pt-5">
            <Label className="w-[280px]" htmlFor="first_name">
              Name
            </Label>
            <div className="flex gap-6 *:w-[244px]">
              <FormField
                name="first_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="First name"
                        autoComplete="off"
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
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last name"
                        autoComplete="off"
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

          <div className="flex gap-6 not-first:pt-5">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-row gap-8">
                  <FormLabel className="w-[280px]">Email address</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[512px]"
                      type="text"
                      placeholder="Email address"
                      autoComplete="off"
                      padding="md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6 not-first:pt-5">
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-row gap-8">
                  <FormLabel className="w-[280px] shrink-0">Role</FormLabel>
                  <FormControl>
                    <Select name="role" defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-[512px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <input name="id" type="text" value={data.user_id} hidden readOnly />
          <input name="password" type="password" value={data.password} hidden readOnly />
        </form>
      </Form>
    </div>
  )
}
