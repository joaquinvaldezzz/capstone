'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { updatePassword } from '@/lib/actions'
import { type User } from '@/lib/db-schema'
import { updatePasswordFormSchema } from '@/lib/form-schema'
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

import type { UpdatePasswordFormSchema } from '@/lib/form-schema'
import type { FormEvent } from 'react'

export function PasswordForm({ data }: { data: User }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(updatePassword, { message: '' })
  const form = useForm<UpdatePasswordFormSchema>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(updatePasswordFormSchema),
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
    // If the form state message is not empty, set the submitting state to false
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
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        action={formAction}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <input name="id" type="text" value={data.user_id} hidden readOnly />
        <div className="flex flex-col gap-8">
          <FormField
            name="oldPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Updating password...' : 'Update password'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
