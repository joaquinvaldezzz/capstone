import Link from 'next/link'
import { Bell, Calendar, Inbox, LogOut, Menu, Package2, Settings } from 'lucide-react'

import type { NavItem } from '~/types/nav'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import Title from '~/components/Title'

const links: NavItem[] = [
  {
    id: 1,
    href: '',
    icon: <Inbox className="size-5 md:size-4" />,
    text: 'Inbox',
  },
  {
    id: 2,
    href: '',
    icon: <Calendar className="size-5 md:size-4" />,
    text: 'Appointments',
  },
  {
    id: 3,
    href: '',
    icon: <Settings className="size-5 md:size-4" />,
    text: 'Settings',
  },
]

export default function PatientDashboard(): JSX.Element {
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

            <Button className="ml-auto size-8" variant="outline" size="icon">
              <span className="sr-only">Toggle notifications</span>
              <Bell className="size-4" />
            </Button>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* active: flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary */}
              {links.map((link) => (
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  href={link.href}
                  key={link.id}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}
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
                  <Package2 className="size-6" />
                </Link>

                {/* active: mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground */}
                {links.map((link) => (
                  <Link
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    href={link.href}
                    key={link.id}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto text-lg font-medium">
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  href=""
                >
                  <LogOut className="size-5 md:size-4" />
                  Log out
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
        </main>
      </div>
    </div>
  )
}
