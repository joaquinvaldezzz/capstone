import { Fragment } from 'react'
import { type Metadata } from 'next'

import { sql } from 'drizzle-orm'

import { getPatientResults } from '@/lib/dal'
import { db } from '@/lib/db'

import type { CustomUser } from '@/lib/dal'

import { DataTable } from '../_components/data-table'
import { columns } from '../columns'
import { PatientForm } from './patient-form'

export const metadata: Metadata = {
  title: 'Results',
}

export default async function Page() {
  const results = await getPatientResults()
  const patients = (await db.execute(sql`
    SELECT
      CONCAT("first_name", ' ', "last_name") AS "name",
      *
    FROM
      "users"
    WHERE
      "role" = 'patient';
  `)) as unknown as { rows: CustomUser[] }

  if (results == null) {
    return <div>Failed to fetch data</div>
  }

  if (patients == null) {
    return <div>Failed to fetch patients</div>
  }

  return (
    <Fragment>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Results</h2>
      <DataTable
        columns={columns}
        data={results}
        formAction={<PatientForm patients={patients.rows} />}
        withFacetedFilters
        withPagination
        withViewOptions
      />
    </Fragment>
  )
}
