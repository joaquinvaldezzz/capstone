import { type Metadata } from 'next'

import { getAllPatientResults } from '@/lib/dal'
import { AddPatientForm } from '@/components/add-patient-form'
import { ConfusionMatrixButton } from '@/components/confusion-matrix-button'

import { DataTable } from './data-table'

export const metadata: Metadata = {
  title: 'Results',
}

export default async function Page() {
  const results = await getAllPatientResults()

  if (results == null) {
    return <div>No data has been found.</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between gap-4">
        <h1 className="text-display-sm font-semibold">Results</h1>
        <div className="flex gap-2">
          <ConfusionMatrixButton />
          <AddPatientForm />
        </div>
      </header>

      <DataTable data={results} />
    </div>
  )
}
