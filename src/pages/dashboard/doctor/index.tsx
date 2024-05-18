import Link from 'next/link'
import { Home, LogOut, Menu, Package2, Settings, Users } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import Title from '~/components/Title'

export default function Dashboard(): JSX.Element {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Title>Dashboard</Title>

      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="">
              <Package2 className="size-6" />
              <span className=""></span>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                href=""
              >
                <Home className="size-4" />
                Dashboard
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href=""
              >
                <Users className="size-4" />
                Patients
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href=""
              >
                <Settings className="size-4" />
                Settings
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-4">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
              href=""
            >
              <LogOut className="size-4" />
              Log out
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:justify-end lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <span className="sr-only">Toggle navigation menu</span>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <span className="sr-only">Acme Inc</span>
                  <Package2 className="h-6 w-6" />
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="size-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Users className="size-5" />
                  Patients
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>

          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">You have no patients</h3>
              <p className="text-sm text-muted-foreground">
                You can start working as soon as you have patients.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
