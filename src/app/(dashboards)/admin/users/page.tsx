import { type Metadata } from 'next'

import { getUsers } from '@/lib/dal'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function Page() {
  const admins = await getUsers('admin')
  const doctors = await getUsers('doctor')
  const patients = await getUsers('patient')

  if (admins == null || doctors == null || patients == null) {
    return <div>Failed to fetch accounts</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="border-b border-b-gray-200 pb-5">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-semibold">Users</h1>
            <p className="mt-1 text-gray-600">Manage users and their account permissions here.</p>
          </div>
          <div className="shrink-0">
            {/* <DialogTrigger asChild>
              <Button type="button" hierarchy="secondary-gray" size="md">
                <Plus className="size-5" />
                <span className="px-0.5">Add team member</span>
              </Button>
            </DialogTrigger> */}
          </div>
        </div>
      </header>

      <section className="flex gap-8">
        <div className="max-w-72 shrink-0">
          <h2 className="text-sm font-semibold text-gray-700">Admin users</h2>
          <p className="text-sm text-gray-600">
            Admins can add and remove users and manage organization-level settings.
          </p>
        </div>

        <DataTable columns={columns} data={admins} />
      </section>

      <hr className="border-t-gray-200" />

      <section className="flex gap-8">
        <div className="max-w-72 shrink-0">
          <h2 className="text-sm font-semibold text-gray-700">Doctors</h2>
          <p className="text-sm text-gray-600">
            Doctors can view patient results and schedule appointments with patients.
          </p>
        </div>

        <DataTable columns={columns} data={doctors} />
      </section>

      <hr className="border-t-gray-200" />

      <section className="flex gap-8">
        <div className="max-w-72 shrink-0">
          <h2 className="text-sm font-semibold text-gray-700">Patients</h2>
          <p className="text-sm text-gray-600">
            Patients can view their results and schedule appointments with doctors.
          </p>
        </div>

        <DataTable columns={columns} data={patients} />
      </section>
    </div>
  )
}
