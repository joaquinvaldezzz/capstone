'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { addPatient } from '@/lib/actions'
import { type CustomUser } from '@/lib/dal'
import { resultSchema, type ResultSchema } from '@/lib/form-schema'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PatientForm({ patients }: { patients: CustomUser[] }) {
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction, isSubmitting] = useActionState(addPatient, { message: '' })
  const form = useForm<ResultSchema>({
    defaultValues: {
      patient_name: '',
    },
    resolver: zodResolver(resultSchema),
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
          <span>New</span>
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
            <FormField
              name="ultrasound_image"
              control={form.control}
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Ultrasound image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="patient_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    name={field.name}
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
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? 'Analyzing image...' : 'Analyze'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
