import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

import { getPatientResult } from '@/lib/dal'

import { PrintButton } from './print-button'

/**
 * Generates static parameters for the doctor results page.
 *
 * This function fetches patient results and maps them to an array of objects containing the
 * `result_id` as a string. If no results are found, it returns an empty array.
 */
export async function generateStaticParams() {
  const results = await getPatientResult()

  // If no results are found, return an empty array
  if (results == null) {
    return []
  }

  // Map the results to an array of objects containing the `result_id` as a string
  return results.map((post) => ({
    result_id: post.result_id.toString(),
  }))
}

/** Generates metadata for a specific patient result based on the result ID. */
export async function generateMetadata({ params }: { params: { result_id: string } }) {
  const results = await getPatientResult().then((response) =>
    response?.find((result) => result.result_id === Number(params.result_id)),
  )

  // If no results are found, return
  if (results == null) {
    return
  }

  // Generate metadata for the patient result
  const metadata: Metadata = {
    title: `Result #${results.result_id} - ${results.first_name} ${results.last_name}`,
    description: '',
    openGraph: {
      title: `Result #${results.result_id} - ${results.first_name} ${results.last_name}`,
      description: '',
    },
  }

  // Return the metadata
  return metadata
}

export default async function Page({ params }: { params: { result_id: string } }) {
  /** Fetches the patient result based on the provided result ID from the URL parameters. */
  const request = await getPatientResult().then((response) =>
    response?.find((result) => result.result_id === Number(params.result_id)),
  )

  // If no results are found, return a message
  if (request == null) {
    return <div>Result not found</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <Link className="inline-flex w-max items-center gap-2 print:hidden" href="/doctor/results">
          <ChevronLeftIcon className="size-4 text-gray-300" />
          <span className="text-sm font-medium text-gray-600">Results</span>
        </Link>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-display-sm font-semibold">Result #{request.result_id}</h2>
            <div className="mt-1 flex gap-4">
              <span className="text-gray-600">{format(request.created_at, 'MMMM dd, yyyy')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 print:hidden">
            <PrintButton />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Patient name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {request.first_name} {request.last_name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Email address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {request.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Diagnosis</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {request.diagnosis}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Percentage</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {request.percentage}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Attachment</dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <Image
                  className="w-64 rounded-lg object-cover"
                  src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${request.ultrasound_image}`}
                  alt={request.ultrasound_image}
                  height={256}
                  width={256}
                  priority
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
