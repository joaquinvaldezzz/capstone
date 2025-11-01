'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { deleteUser } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

import type { FormEvent } from 'react'

export const DeleteButton = ({ userId }: { userId: number }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(deleteUser, { message: '' })
  const router = useRouter()
  const { toast } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    startTransition(() => {
      // If the form reference is null, return early.
      if (formRef.current == null) return

      // Perform the form action with the form data.
      formAction(new FormData(formRef.current))
    })

    router.push('/admin/users')
  }

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
    <form action={formAction} ref={formRef} onSubmit={handleSubmit}>
      <input name="user-id" type="text" value={userId} hidden readOnly />
      <Button type="submit" disabled={isSubmitting} variant="destructive">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? 'Deleting account...' : 'Delete'}
      </Button>
    </form>
  )
}
