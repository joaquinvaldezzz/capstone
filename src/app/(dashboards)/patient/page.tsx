import { getCurrentUser, getPatientResults } from '@/lib/dal'

export default async function Page() {
  const currentUser = await getCurrentUser()

  if (currentUser == null) return null

  const results = await getPatientResults(currentUser.user_id)

  console.log(results)

  return (
    <div className="flex min-h-screen w-full max-w-[22.5rem] flex-col border-r border-gray-200">
      <div className="px-6 py-5">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <ul className="flex flex-col divide-y divide-gray-200">
        {results?.length === 0
          ? 'No results found'
          : results?.map((result, index) => (
              <li className="cursor-pointer p-4 hover:bg-gray-25" key={index}>
                <div className="flex flex-col gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="my-auto size-2 shrink-0 rounded-full bg-brand-600"></div>
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="size-10 shrink-0 rounded-full bg-gray-300"></div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">John Joaquin Valdez</h3>
                        <p className="truncate text-sm text-gray-600">
                          javaldez1642qc@student.fatima.edu.ph
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(result.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="pl-5">
                    <p className="line-clamp-2 text-sm text-gray-600">{result.diagnosis}</p>
                  </div>
                </div>
              </li>
            ))}
      </ul>
    </div>
  )
}
