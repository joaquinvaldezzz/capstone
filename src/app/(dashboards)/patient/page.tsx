import { Fragment } from 'react'

import { getCurrentUser, getPatientResults } from '@/lib/dal'

import { Mail } from './components/mail'

export default async function Page() {
  const currentUser = await getCurrentUser()

  if (currentUser == null) return null

  const results = await getPatientResults(currentUser.user_id)
  const filteredResults = results?.filter((result) => result.user_id === currentUser.user_id)

  return <Fragment>{results != null && <Mail results={filteredResults} />}</Fragment>
}
