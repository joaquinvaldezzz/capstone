import { type GetServerSidePropsResult } from 'next'
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
import { Input } from '~/components/ui/input'
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
      result: account?.result ?? 'pending',
      status: account?.status ?? 'pending',
    },
    resolver: zodResolver(formSchema),
  })

  /* function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files
    const url = URL.createObjectURL(files?.[0])

    if (files != null) {
      setFile(url)
      console.log(file)
    }
  } */

  async function onSubmit(data: FormValues): Promise<void> {
    try {
      const response = await axios.put(`/api/accounts/${id}`, {
        result: data.result,
        status: data.status,
      })

      if (response.status === 200) {
        console.log('Hello')
        await router.replace('/dashboard/doctor')
      }
    } catch (error) {
      console.log('Patient not found.')
    }
  }

  return (
    <div className="container py-8">
      <Title>Examine</Title>

      <form
        className="mx-auto grid max-w-screen-sm gap-4"
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
                      readOnly
                      {...field}
                    />
                  </FormControl>
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
                      readOnly
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Ultrasound image
            </p>
            <div className="aspect-h-9 aspect-w-16 rounded-md bg-muted">
              {/* <div className="rounded-md bg-muted"></div> */}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={account?.result}>
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
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={account?.status}>
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
            />
          </div>

          <Button type="submit">Confirm</Button>
        </Form>
      </form>
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
