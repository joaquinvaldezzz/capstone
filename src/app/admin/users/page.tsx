import { Fragment } from 'react'
import { type Metadata } from 'next'

import { getUsers } from '@/lib/dal'

import { columns } from './columns'
import { DataTable } from './data-table'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function Page() {
  const users = await getUsers()

  if (users == null) {
    return null
  }

  return (
    <Fragment>
      <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      <DataTable columns={columns} data={users} />
    </Fragment>
  )
}
