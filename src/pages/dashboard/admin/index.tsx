import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'

import AdminLayout from '~/components/layout/admin'
import Title from '~/components/Title'

interface Account {
  _id: string
  username: string
  role: 'admin' | 'doctor' | 'patient'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns: Array<ColumnDef<Account>> = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

async function fetchAccounts(): Promise<Account[] | undefined> {
  try {
    const response = await axios.get('http://localhost:5050/record/')
    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export default function Admin(): JSX.Element {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    fetchAccounts()
      .then((data) => {
        if (data != null) {
          setAccounts(data)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  console.log(accounts)

  return (
    <AdminLayout>
      <Title>Admin</Title>

      <main className="px-4 pt-4">
        <div className="grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>

        {/* <DataTableDemo /> */}
      </main>
    </AdminLayout>
  )
}
