'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { updateUser } from '@/lib/actions'
import { getCurrentUser } from '@/lib/dal'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null)
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [formState, formAction] = useFormState(updateUser, { message: '' })
  const updateUserForm = useForm<SignUpFormSchema>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      // @ts-ignore
      password: '',

      /**
       * Override the default values with the form state fields if the form was unsuccessful.
       * Otherwise, use the default values (reset the form).
       */
      ...((formState.success ?? false) ? formState.fields : {}),
    },
    values: currentUser ?? undefined,
    resolver: zodResolver(signUpFormSchema),
  })
  const router = useRouter()

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser()
      if (user != null) {
        setCurrentUser(user)
      }
    }

    void fetchCurrentUser()
  }, [])

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void updateUserForm.handleSubmit(() => {
      // If the form reference is null, return early.
      if (formRef.current == null) return

      // Perform the form action with the form data.
      formAction(new FormData(formRef.current))
    })(event)
  }

  useEffect(() => {
    if (formState.success ?? false) {
      router.back()
    }
  }, [formState.success, router])

  if (currentUser == null) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-600">
              Update your photo and personal details here.
            </p>
          </div>
        </div>

        <hr className="border-t-gray-200" />

        <Form {...updateUserForm}>
          <form className="flex flex-col" action={formAction} ref={formRef} onSubmit={handleSubmit}>
            <input name="id" type="text" value={currentUser.user_id} hidden readOnly />
            <div className="flex flex-col gap-5">
              <div className="flex gap-8">
                <div className="w-full max-w-72 text-sm font-semibold">Name</div>
                <div className="grid w-full max-w-lg grid-cols-2 gap-4">
                  <FormField
                    name="first_name"
                    control={updateUserForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">First name</FormLabel>
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
                    control={updateUserForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Last name</FormLabel>
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
              </div>

              <hr className="border-t-gray-200" />

              <div className="flex gap-8">
                <div className="w-full max-w-72 text-sm font-semibold">Email address</div>
                <div className="w-full max-w-lg">
                  <FormField
                    name="email"
                    control={updateUserForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Email</FormLabel>
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
                </div>
              </div>

              <hr className="border-t-gray-200" />

              <div className="flex gap-8">
                <div className="w-full max-w-72 text-sm font-semibold">Password</div>
                <div className="w-full max-w-lg">
                  <FormField
                    name="password"
                    control={updateUserForm.control}
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
                </div>
              </div>

              <hr className="border-t-gray-200" />

              <div className="flex gap-8">
                <div className="w-full max-w-72 text-sm font-semibold">Role</div>
                <div className="w-full max-w-lg">
                  <FormField
                    name="role"
                    control={updateUserForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a role</FormLabel>
                        <Select
                          name="role"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
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
              </div>

              <hr className="border-t-gray-200" />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  hierarchy="secondary-gray"
                  size="md"
                  onClick={() => {
                    router.back()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Form>
      </section>
    </div>
  )
}
