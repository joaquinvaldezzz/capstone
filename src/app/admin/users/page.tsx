import { Fragment } from 'react'
import { type Metadata } from 'next'

import { getUsers } from '@/lib/dal'
import { DataTable } from '@/components/ui/data-table'

import { columns } from './columns'
import { UserForm } from './user-form'

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
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Users</h2>
      <DataTable
        columns={columns}
        data={users}
        formAction={<UserForm />}
        withFacetedFilters
        withPagination
        withViewOptions
      />
    </Fragment>
  )
}
