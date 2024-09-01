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
import { Form, FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Title from '~/components/Title'

interface AccountTypes {
  accounts: Account[]
}

const formSchema = z.object({
  first_name: z.string().min(1, 'Please enter your first name.'),
  last_name: z.string().min(1, 'Please enter your last name.'),
  ultrasound_image: z.string().min(1, 'Please upload an ultrasound image.'),
  result: z.enum(['pending', 'healthy', 'infected']),
  status: z.enum(['pending', 'to examine', 'confirmed', 'treated', 'recovered', 'deceased']),
  // ultrasound_image: z.instanceof(File).refine((value) => value.size < 5000000, {
  //   message: 'File size must be less than 5MB.',
  // }),
})
type FormValues = z.infer<typeof formSchema>

export default function Edit({ accounts }: AccountTypes): JSX.Element {
  // const [file, setFile] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const id = pathname.match(/\/dashboard\/doctor\/examine\/(.*)/)?.[1] ?? ''
  const account = accounts.find((data) => data._id === id)

  const form = useForm<FormValues>({
    defaultValues: {
      first_name: account?.first_name,
      last_name: account?.last_name,
      ultrasound_image: account?.ultrasound_image,
      result: account?.result ?? 'pending',
      status: account?.status ?? 'pending',
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormValues): Promise<void> {
    try {
      const response = await axios.put(`/api/accounts/${id}`, {
        result: data.result,
        status: data.status,
      })

      if (response.status === 201) {
        await router.push('/dashboard/doctor')
      }
    } catch (error) {
      console.log('Patient not found.')
    }
  }

  return (
    <div className="container py-8">
      <Title>Examine</Title>

      <div className="mx-auto max-w-screen-sm">
        <h2 className="text-3xl font-semibold tracking-tight">
          {account?.first_name}&apos;s diagnosis
        </h2>

        <form
          className="mt-6 grid gap-6"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit as unknown as SubmitHandler<FormValues>)}
        >
          <Form {...form}>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ultrasound image
              </p>
              <div className="aspect-h-9 aspect-w-16 bg-muted rounded-md">
                {account?.ultrasound_image !== undefined ? (
                  <Image
                    className="object-contain"
                    src={account.ultrasound_image}
                    alt="Ultrasound image"
                    fill
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-sm font-medium">No ultrasound image uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <FormField
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result</FormLabel>
                    <FormControl>
                      <Select defaultValue={account?.result} onValueChange={field.onChange}>
                        <FormControl className="aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus-visible:ring-destructive">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="infected">Infected</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
                control={form.control}
              />

              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select defaultValue={account?.status} onValueChange={field.onChange}>
                        <FormControl className="aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus-visible:ring-destructive">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="to examine">To examine</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
                control={form.control}
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <Button type="submit">Confirm</Button>
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
