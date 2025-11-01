'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { format } from 'date-fns'
import { Loader2, User as UserIcon } from 'lucide-react'
import { DateField, DateInput, DateSegment, Label } from 'react-aria-components'
import { useForm } from 'react-hook-form'

import { updateAccount, updateProfile } from '@/lib/actions'
import { type User, type UserInformation } from '@/lib/db-schema'
import {
  updateAccountFormSchema,
  updateProfileFormSchema,
  type UpdateAccountFormSchema,
  type UpdateProfileFormSchema,
} from '@/lib/form-schema'
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

export function Forms({ user, profile }: { user: User; profile: UserInformation }) {
  const accountFormRef = useRef<HTMLFormElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const [accountFormState, accountFormAction, isSubmittingAccount] = useActionState(updateAccount, {
    message: '',
  })
  const accountForm = useForm<UpdateAccountFormSchema>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    resolver: zodResolver(updateAccountFormSchema),
  })

  const profileFormRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [profileFormState, profileFormAction, isSubmittingProfile] = useActionState(updateProfile, {
    message: '',
  })
  const profileForm = useForm<UpdateProfileFormSchema>({
    defaultValues: {
      age: profile.age.toString(),
      birth_date: profile.birth_date,
      address: profile.address,
      gender: profile.gender,
    },
    resolver: zodResolver(updateProfileFormSchema),
  })
  const { toast } = useToast()

  function handleAccount(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void accountForm.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early.
        if (accountFormRef.current == null) return

        // Perform the form action with the form data.
        accountFormAction(new FormData(accountFormRef.current))
      })
    })(event)
  }

  function handleProfile(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior.
    event.preventDefault()

    void profileForm.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early.
        if (profileFormRef.current == null) return

        // Perform the form action with the form data.
        profileFormAction(new FormData(profileFormRef.current))
      })
    })(event)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  function handleSave() {
    accountButtonRef.current?.click()
    profileButtonRef.current?.click()
  }

  useEffect(() => {
    if (accountFormState.message.length > 0 || profileFormState.message.length > 0) {
      if ((accountFormState.success ?? false) && (profileFormState.success ?? false)) {
        toast({
          title: 'Yay!',
          description: 'Account has been successfully updated.',
        })
      } else {
        toast({
          title: 'Oops!',
          description: 'Failed to update account.',
          variant: 'destructive',
        })
      }
    }
  }, [accountFormState, profileFormState, toast])

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-sm) space-y-6">
      <Form {...accountForm}>
        <form
          className="flex flex-col gap-8"
          action={accountFormAction}
          ref={accountFormRef}
          onSubmit={handleAccount}
        >
          <input name="id" type="text" value={user.user_id} hidden readOnly />
          <div className="flex flex-col gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <FormField
                name="first_name"
                control={accountForm.control}
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
                control={accountForm.control}
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
              control={accountForm.control}
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
              control={accountForm.control}
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

          <div className="hidden">
            <Button type="submit" disabled={isSubmittingAccount} ref={accountButtonRef}>
              {isSubmittingAccount && <Loader2 className="size-4 animate-spin" />}
              {isSubmittingAccount ? 'Updating account...' : 'Update account'}
            </Button>
          </div>
        </form>
      </Form>

      <Form {...profileForm}>
        <form
          className="flex flex-col gap-8"
          action={profileFormAction}
          ref={profileFormRef}
          onSubmit={handleProfile}
        >
          <input name="id" type="text" value={profile.user_id} hidden readOnly />
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="profile_picture"
                control={profileForm.control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <Avatar className="size-32 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage
                        src={
                          avatarPreview ??
                          `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/profile-pictures/${String(profile.profile_picture)}`
                        }
                        alt="Avatar preview"
                      />
                      <AvatarFallback>
                        <UserIcon className="size-16 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <FormControl>
                      <Input
                        {...field}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="age"
                control={profileForm.control}
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
                control={profileForm.control}
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
                                className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focused:bg-accent data-focused:text-foreground data-invalid:text-destructive data-invalid:data-focused:bg-destructive data-invalid:data-focused:text-destructive-foreground data-placeholder:text-muted-foreground/70 data-focused:data-placeholder:text-foreground data-invalid:data-placeholder:text-destructive data-invalid:data-focused:data-placeholder:text-destructive-foreground data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground/70"
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
              control={profileForm.control}
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
              control={profileForm.control}
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

          <div className="hidden">
            <Button type="submit" disabled={isSubmittingProfile} ref={profileButtonRef}>
              {isSubmittingProfile && <Loader2 className="size-4 animate-spin" />}
              {isSubmittingProfile ? 'Updating profile...' : 'Update profile'}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={isSubmittingAccount || isSubmittingProfile}
          onClick={handleSave}
        >
          {isSubmittingAccount && isSubmittingProfile && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isSubmittingAccount || isSubmittingProfile ? 'Saving changes...' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
