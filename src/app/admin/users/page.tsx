import { Fragment } from 'react'
import { type Metadata } from 'next'

import { getUsers } from '@/lib/dal'
import { DataTable } from '@/components/ui/data-table'

import { columns } from './columns'

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
      <DataTable columns={columns} data={users} />
    </Fragment>
  )
}
