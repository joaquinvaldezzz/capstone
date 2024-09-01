import { type GetServerSidePropsResult } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { Home, LogOut, Menu, Package2, Settings } from 'lucide-react'
import Cookies from 'universal-cookie'

import { type NavItem } from '~/types/nav'
import connectToDatabase from '~/lib/connectToDatabase'
import Accounts, { type Account } from '~/models/Account'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Toaster } from '~/components/ui/toaster'
import { DataTable } from '~/components/DataTable'
import Title from '~/components/Title'

const links: NavItem[] = [
  {
    id: 1,
    href: '',
    icon: <Home className="size-5 md:size-4" />,
    text: 'Dashboard',
  },
  {
    id: 2,
    href: '',
    icon: <Settings className="size-5 md:size-4" />,
    text: 'Settings',
  },
]

interface AccountTypes {
  allAccounts: Account[]
  healthyAccounts: Account[]
  infectedAccounts: Account[]
}

export default function Dashboard({
  allAccounts,
  healthyAccounts,
  infectedAccounts,
}: AccountTypes): JSX.Element {
  const router = useRouter()
  const cookies = new Cookies()

  async function onExamine(_id: string): Promise<void> {
    try {
      const response = await axios.get(`/api/accounts/${_id}`)

      if (response.status === 200) {
        await router.push(`/dashboard/doctor/examine/${_id}`)
      }
    } catch (error) {}
  }

  async function onEdit(_id: string): Promise<void> {
    try {
      const response = await axios.get(`/api/accounts/${_id}`)

      if (response.status === 200) {
        await router.push(`/dashboard/doctor/edit/${_id}`)
      }
    } catch (error) {}
  }

  const columns: Array<ColumnDef<Account>> = [
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('full_name')}</span>,
    },
    // {
    //   accessorKey: 'ultrasound_image',
    //   header: 'Ultrasound image',
    //   cell: ({ row }) => row.getValue('full_name'),
    // },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: ({ row }) => {
        const result = row.getValue('result')
        const variant =
          result === 'pending' ? 'secondary' : result === 'healthy' ? 'success' : 'destructive'

        return (
          <Badge className="capitalize" variant={variant}>
            {row.getValue('result') ?? 'Pending'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className="capitalize" variant="outline">
          {row.getValue('status') ?? 'Pending'}
        </Badge>
      ),
    },
    // {
    //   accessorKey: 'date_uploaded',
    //   header: 'Date uploaded',
    //   cell: ({ row }) => row.getValue('date_uploaded'),
    // },
    {
      accessorKey: '_id',
      header: 'Examine',
      cell: ({ row }) => (
        <Button
          onClick={() => {
            void onExamine(row.getValue('_id'))
          }}
          size="sm"
          variant="outline"
        >
          Examine
        </Button>
      ),
    },
    {
      id: 'edit',
      accessorKey: '_id',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          onClick={() => {
            void onEdit(row.getValue('_id'))
          }}
          size="sm"
          variant="outline"
        >
          Edit
        </Button>
      ),
    },
  ]

  return (
    <div className="grid min-h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Title>Dashboard</Title>

      <div className="bg-muted/40 hidden h-full border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="">
              <Package2 className="size-6" />
              <span className=""></span>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* active: flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary */}
              {links.map((link) => (
                <Link
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                  href={link.href}
                  key={link.id}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <button
              className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
              type="button"
              onClick={() => {
                cookies.remove('TOKEN')
                console.log('Logged out')
                // router.push('/')
              }}
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 md:justify-end lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="shrink-0 md:hidden" size="icon" variant="outline">
                <span className="sr-only">Toggle navigation menu</span>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col" side="left">
              <nav className="grid gap-2 text-lg font-medium">
                <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                  <span className="sr-only">Acme Inc</span>
                  <Package2 className="size-6" />
                </Link>

                {/* active: mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground */}
                {links.map((link) => (
                  <Link
                    className="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
                    href={link.href}
                    key={link.id}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto text-lg font-medium">
                <button
                  className="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
                  type="button"
                >
                  <LogOut className="size-5 md:size-4" />
                  Log out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="md:text-2xl text-lg font-semibold">Dashboard</h1>

          <Tabs className="flex flex-1 flex-col gap-4 lg:gap-6" defaultValue="all">
            <div className="flex justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="healthy">Healthy</TabsTrigger>
                <TabsTrigger value="infected">Infected</TabsTrigger>
              </TabsList>
            </div>

            {allAccounts.length > 0 ? (
              <>
                <TabsContent value="all">
                  <DataTable columns={columns} data={allAccounts} toFilter="full_name" />
                </TabsContent>

                <TabsContent value="healthy">
                  <DataTable columns={columns} data={healthyAccounts} toFilter="full_name" />
                </TabsContent>

                <TabsContent value="infected">
                  <DataTable columns={columns} data={infectedAccounts} toFilter="full_name" />
                </TabsContent>
              </>
            ) : (
              <div className="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no patients</h3>
                  <p className="text-muted-foreground text-sm">
                    You can start working as soon as you have patients.
                  </p>
                </div>
              </div>
            )}
          </Tabs>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Account>> {
  await connectToDatabase()

  const allPatients = await Accounts.find({ role: 'patient' })
  const healthyPatients = await Accounts.find({ role: 'patient', result: 'healthy' })
  const infectedPatients = await Accounts.find({ role: 'patient', result: 'infected' })

  const allAccounts = allPatients.map((data) => JSON.parse(JSON.stringify(data)))
  const healthyAccounts = healthyPatients.map((data) => JSON.parse(JSON.stringify(data)))
  const infectedAccounts = infectedPatients.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { allAccounts, healthyAccounts, infectedAccounts },
  } as unknown as GetServerSidePropsResult<Account>
}
