'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { deleteResult } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

import type { FormEvent } from 'react'

export function DeleteButton({ resultId }: { resultId: number }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(deleteResult, { message: '' })
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

    router.push('/doctor/results')
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
      <input name="result-id" type="text" value={resultId} hidden readOnly />
      <Button type="submit" disabled={isSubmitting} variant="destructive">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? 'Deleting...' : 'Delete'}
      </Button>
    </form>
  )
}
