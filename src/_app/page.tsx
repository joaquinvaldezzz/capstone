import { type Metadata } from 'next'

import LogInForm from './log-in'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your account',
}

export default function Page() {
  return <LogInForm />
}
