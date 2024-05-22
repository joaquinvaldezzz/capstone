import type { JSX } from 'react'
import Link from 'next/link'
import { CircleUserIcon, MenuIcon, Package2Icon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'

export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
            <span className="sr-only">Name</span>
            <Package2Icon className="size-6" />
          </Link>
          {/* active: text-foreground transition-colors hover:text-foreground */}
          <Link
            className="text-foreground transition-colors hover:text-foreground"
            href="/dashboard/admin/"
          >
            Dashboard
          </Link>
          <Link
            className="text-muted-foreground transition-colors hover:text-foreground"
            href="/dashboard/admin/settings"
          >
            Settings
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="shrink-0 md:hidden" size="icon" variant="outline">
              <span className="sr-only">Toggle navigation menu</span>
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                <span className="sr-only">Acme Inc</span>
                <Package2Icon className="size-6" />
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/admin">
                Dashboard
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="/dashboard/admin/settings"
              >
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="secondary">
                <span className="sr-only">Toggle user menu</span>
                <CircleUserIcon className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {children}
    </div>
  )
}
