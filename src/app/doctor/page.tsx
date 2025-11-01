import { Fragment } from 'react'

import { Activity, ShieldAlert, Users } from 'lucide-react'

import {
  getPatientResults,
  getTotalNumberOfHealthyPatients,
  getTotalNumberOfInfectedPatients,
  getTotalNumberOfPatients,
} from '@/lib/dal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'
import type { Result } from '@/lib/dal'

import { DataTable } from './_components/data-table'
import { columns } from './columns'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Page() {
  const totalNumberOfPatients = await getTotalNumberOfPatients()
  const totalNumberOfInfectedPatients = await getTotalNumberOfInfectedPatients()
  const totalNumberOfHealthyPatients = await getTotalNumberOfHealthyPatients()
  const recentResults = (await getPatientResults()) as Result[]

  if (
    totalNumberOfPatients == null ||
    totalNumberOfInfectedPatients == null ||
    totalNumberOfHealthyPatients == null ||
    recentResults == null
  ) {
    return <div>Failed to fetch data</div>
  }

  return (
    <Fragment>
      <section className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total patients</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNumberOfPatients[0].count}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Infected patients</CardTitle>
              <ShieldAlert className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNumberOfInfectedPatients[0].count}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy patients</CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNumberOfHealthyPatients[0].count}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">Recent results</h3>
        <DataTable columns={columns} data={recentResults} withFacetedFilters withViewOptions />
      </section>
    </Fragment>
  )
}
