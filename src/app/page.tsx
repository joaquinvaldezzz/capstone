import { type Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your account',
}

export default function Page() {
  return (
    <div className="min-h-svh py-12 lg:pt-24">
      <div className="mx-auto flex max-w-96 flex-col gap-y-8 px-4 md:px-0">
        <header className="text-center">
          <div className="h-8"></div>
          <h1 className="mt-8 text-display-xs font-semibold lg:mt-16 lg:text-display-sm">
            Log in to your account
          </h1>
          <p className="mt-2 text-gray-600 lg:mt-3">Welcome back! Please enter your details.</p>
        </header>

        <form className="flex flex-col gap-y-6">
          <div></div>
          <Button size="lg" type="submit">
            Sign in
          </Button>
        </form>

        <footer className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Button hierarchy="link-color" asChild>
              <Link href="">Sign up</Link>
            </Button>
          </p>
          <p className="mt-3">
            <Button hierarchy="link-color" asChild>
              <Link href="">Forgot password</Link>
            </Button>
          </p>
        </footer>
      </div>
    </div>
  )
}
