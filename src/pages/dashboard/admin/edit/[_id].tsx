import { type GetServerSidePropsResult } from 'next'
import { usePathname } from 'next/navigation'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts, { type Account } from '~/models/Account'
import AdminLayout from '~/components/layout/admin'

interface AccountTypes {
  accounts: Account[]
}

export default function Edit({ accounts }: AccountTypes): JSX.Element {
  const pathname = usePathname()
  const id = pathname.match(/\/dashboard\/admin\/edit\/(.*)/)?.[1] ?? ''
  const account = accounts.find((data) => data._id === id)

  return (
    <AdminLayout>
      <main className="px-4 pt-4">
        <h1>Edit</h1>
        {/* {account.map((data, index) => (
          <div key={index}>
            <h2>{data.full_name}</h2>
            <p>{data.first_name}</p>
            <p>{data.last_name}</p>
          </div>
        ))} */}

        {account != null ? (
          <div>
            <h2>{account.full_name}</h2>
            <p>{account.first_name}</p>
            <p>{account.last_name}</p>
          </div>
        ) : (
          <p>Account not found</p>
        )}
      </main>
    </AdminLayout>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Account>> {
  await connectToDatabase()

  const all = await Accounts.find({})
  const accounts = all.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { accounts },
  } as unknown as GetServerSidePropsResult<Account>
}
