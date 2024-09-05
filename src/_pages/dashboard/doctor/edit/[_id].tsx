import { useState } from 'react'
import { type GetServerSidePropsResult } from 'next'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts, { type Account } from '~/models/Account'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Title from '~/components/Title'

interface AccountTypes {
  accounts: Account[]
}

const formSchema = z.object({
  first_name: z.string().min(1, 'Please enter your first name.'),
  last_name: z.string().min(1, 'Please enter your last name.'),
  age: z.number().int().positive('Please enter a valid age.').or(z.string()),
  birthdate: z
    .date()
    .min(new Date(1900, 1, 1), 'Please enter a valid birthdate.')
    .or(z.string()),
  contact_number: z.string().min(11, 'Please enter a valid contact number.'),
  address: z.object({
    street: z.string().min(4, 'Please enter your street.'),
    city: z.string().min(4, 'Please enter your city.'),
    zip_code: z.string().min(4, 'Please enter your zip code.').or(z.number()),
    province: z.string().min(4, 'Please enter your province.'),
  }),
  ultrasound_image: z.string().min(4, 'Please enter an ultrasound image.').or(z.literal('')),
})
type FormValues = z.infer<typeof formSchema>

interface Result {
  percentage: string
  result: string
}

export default function Edit({ accounts }: AccountTypes): JSX.Element {
  const [file, setFile] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const id = pathname.match(/\/dashboard\/doctor\/edit\/(.*)/)?.[1] ?? ''
  const account = accounts.find((data) => data._id === id)

  const form = useForm<FormValues>({
    defaultValues: {
      first_name: account?.first_name ?? '',
      last_name: account?.last_name ?? '',
      age: account?.age ?? 0,
      birthdate: account?.birthdate ?? new Date('1900-01-01').toLocaleDateString(),
      contact_number: account?.contact_number ?? '',
      address: {
        street: account?.address?.street ?? '',
        city: account?.address?.city ?? '',
        zip_code: account?.address?.zip_code ?? '',
        province: account?.address?.province ?? '',
      },
      ultrasound_image: account?.ultrasound_image ?? '',
    },
    resolver: zodResolver(formSchema),
  })

  function encodeImageFileAsURL(event: React.ChangeEvent<HTMLInputElement>): void {
    const image = event.target.files?.[0]
    const reader = new FileReader()

    if (image !== undefined && reader !== null) {
      reader.onloadend = function () {
        setFile(reader?.result as string)

        if (account !== undefined) {
          account.ultrasound_image = reader?.result as string
        }
      }

      reader.readAsDataURL(image)
    }
  }

  const [result, setResult] = useState<Result>({ percentage: '', result: '' })

  async function onSubmit(data: FormValues): Promise<void> {
    try {
      const response = await axios.put(`/api/accounts/${id}`, {
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        ultrasound_image: file,
        result: result.result.toLowerCase(),
        date_updated: new Date(),
      })

      if (response.status === 201) {
        console.log(result.result.toLowerCase())
        console.log('Account updated successfully.')
        await router.push('/dashboard/doctor')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const image = new FormData(event.currentTarget)

    try {
      const flask = await axios.post('/flask-api/predict', image)
      console.log(flask.data)
      setResult(flask.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container py-8">
      <Title>Upload</Title>

      <div className="mx-auto max-w-screen-sm">
        <h2 className="text-3xl font-semibold tracking-tight">Upload ultrasound image</h2>

        <form
          className="mx-auto mt-6 grid gap-4"
          onSubmit={(event) => {
            void handleSubmit(event)
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="picture">Image</Label>
            <Input
              id="picture"
              name="picture"
              type="file"
              onChange={(event) => {
                encodeImageFileAsURL(event)
              }}
              accept="image/*"
            />
          </div>

          <div>
            <Button type="submit">Detect</Button>
          </div>
        </form>

        <p className="mt-4 text-left text-lg font-semibold">
          {result.percentage} {result.result}
        </p>

        <form
          className="mx-auto mt-6 grid gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
        >
          <Form {...form}>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <FormField
                name="first_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        data-error={form.formState.errors.first_name != null}
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        data-error={form.formState.errors.last_name != null}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="age"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      autoComplete="off"
                      data-error={form.formState.errors.age != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="contact_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      data-error={form.formState.errors.contact_number != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.street"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      data-error={form.formState.errors.address?.street != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <FormField
                name="address.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        data-error={form.formState.errors.address?.city != null}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.province"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        data-error={form.formState.errors.address?.province != null}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.zip_code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        data-error={form.formState.errors.address?.zip_code != null}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-md bg-muted">
              {account?.ultrasound_image !== undefined ? (
                <Image
                  className="object-contain"
                  src={account?.ultrasound_image}
                  alt="Ultrasound image"
                  fill
                  priority
                />
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-sm font-medium">No ultrasound image uploaded yet.</p>
                </div>
              )}
            </div> */}

            <div className="flex flex-col justify-end gap-2">
              <Button type="submit">{form.formState.isSubmitting ? 'Saving...' : 'Save'}</Button>
              <Button
                type="button"
                onClick={() => {
                  router.back()
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </form>
      </div>
    </div>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Account>> {
  await connectToDatabase()

  const query = await Accounts.find({})
  const accounts = query.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { accounts },
  } as unknown as GetServerSidePropsResult<Account>
}

// eslint-disable-next-line no-lone-blocks
{
  /* <form
          className="mx-auto mt-6 grid gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
        >
          <Form {...form}>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.first_name != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.last_name != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      data-error={form.formState.errors.age != null}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      data-error={form.formState.errors.contact_number != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      data-error={form.formState.errors.address?.street != null}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.address?.city != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.address?.province != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        data-error={form.formState.errors.address?.zip_code != null}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ultrasound_image"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ultrasound image</FormLabel>
                  <FormControl>

                    <input
                      name="picture"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        encodeImageFileAsURL(event)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-md bg-muted">
              {account?.ultrasound_image !== undefined ? (
                <Image
                  className="object-contain"
                  src={account?.ultrasound_image}
                  alt="Ultrasound image"
                  fill
                  priority
                />
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-sm font-medium">No ultrasound image uploaded yet.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end gap-2">
              <Button type="submit">{form.formState.isSubmitting ? 'Saving...' : 'Save'}</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  router.back()
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </form> */
}
