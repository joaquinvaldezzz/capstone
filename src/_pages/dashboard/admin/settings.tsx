import Link from 'next/link'

import { Toaster } from '~/components/ui/toaster'
import AdminLayout from '~/components/layout/admin'
import Title from '~/components/Title'

export default function Settings(): JSX.Element {
  return (
    <AdminLayout>
      <Title>Settings</Title>

      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl scroll-m-20 font-semibold tracking-tight first:mt-0">Settings</h1>
          <p>Manage your account settings.</p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="text-muted-foreground grid gap-4 text-sm">
            <Link className="text-primary font-semibold" href="#">
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
