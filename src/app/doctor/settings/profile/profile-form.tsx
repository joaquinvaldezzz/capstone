'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { format } from 'date-fns'
import { Loader2, User } from 'lucide-react'
import { DateField, DateInput, DateSegment, Label } from 'react-aria-components'
import { useForm } from 'react-hook-form'

import { updateProfile } from '@/lib/actions'
import { type UserInformation } from '@/lib/db-schema'
import { updateProfileFormSchema, type UpdateProfileFormSchema } from '@/lib/form-schema'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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

export function ProfileForm({ data }: { data: UserInformation }) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formState, formAction, isSubmitting] = useActionState(updateProfile, { message: '' })
  const form = useForm<UpdateProfileFormSchema>({
    defaultValues: {
      // profile_picture: data.profile_picture ?? '',
      age: data.age.toString(),
      birth_date: data.birth_date,
      address: data.address,
      gender: data.gender,
    },
    resolver: zodResolver(updateProfileFormSchema),
  })
  const { toast } = useToast()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

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
            name="profile_picture"
            control={form.control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Profile picture</FormLabel>
                <Avatar className="size-32 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage
                    src={
                      avatarPreview ??
                      `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/profile-pictures/${String(data.profile_picture)}`
                    }
                    alt="Avatar preview"
                  />
                  <AvatarFallback>
                    <User className="size-16 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <FormControl>
                  <Input
                    {...field}
                    className="w-auto"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file != null) {
                        onChange(file)
                        setAvatarPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                              className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
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
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select name="gender" defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
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
        </div>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Updating profile...' : 'Update profile'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
