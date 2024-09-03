'use client'

import { useRef, useState } from 'react'
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'
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

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [formState, formAction] = useFormState(signUp, { message: '' })
  const signUpForm = useForm<SignUpFormSchema>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'admin',
    },
    resolver: zodResolver(signUpFormSchema),
  })

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <div className="flex flex-col">
        <header>
          <div className="flex h-16 items-center justify-between py-3 pl-4 pr-2">
            <div></div>

            <button
              className="flex size-10 items-center justify-center rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400/15"
              type="button"
            >
              <Bars3CenterLeftIcon className="size-6 stroke-gray-700" />
            </button>
          </div>
        </header>

        <section className="pb-12 pt-8">
          <div className="container">
            <h2 className="text-display-xs font-semibold">Team members</h2>
            <p className="mt-1 text-gray-600">
              Manage your team members and their account permissions here.
            </p>
            <div className="mt-4">
              <DialogTrigger asChild>
                <Button type="button" hierarchy="secondary-gray" size="md">
                  <Plus className="size-5" />
                  <span className="px-0.5">Add team member</span>
                </Button>
              </DialogTrigger>
            </div>
            <hr className="mt-5 border-t-gray-200" />
          </div>
        </section>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add experience</DialogTitle>
          <DialogDescription>Share where you&apos;ve worked on your profile.</DialogDescription>
        </DialogHeader>

        <Form {...signUpForm}>
          <form
            className="flex flex-col px-4 lg:px-6"
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-misused-promises
            onSubmit={signUpForm.handleSubmit((values) => formAction(values))}
            // action={formAction}
            // ref={formRef}
          >
            <div className="flex flex-col gap-y-5">
              <FormField
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        autoComplete="name"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={signUpForm.control}
              />
              <FormField
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        autoComplete="family-name"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={signUpForm.control}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder=""
                        autoComplete="email"
                        padding="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={signUpForm.control}
              />
              <FormField
                name="password"
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
                control={signUpForm.control}
              />
              <FormField
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a role</FormLabel>
                    <Select name="role" onValueChange={field.onChange} defaultValue={field.value}>
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
                control={signUpForm.control}
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
