import Link from 'next/link'

import { Toaster } from '~/components/ui/toaster'
import AdminLayout from '~/components/layout/admin'
import Title from '~/components/Title'

export default function Settings(): JSX.Element {
  return (
    <AdminLayout>
      <Title>Settings</Title>

      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">Settings</h1>
          <p>Manage your account settings.</p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link className="font-semibold text-primary" href="#">
              Account
            </Link>
          </nav>

          <div>
            <h1>Hello</h1>
          </div>
        </div>
      </main>
      <Toaster />
    </AdminLayout>
  )
}
