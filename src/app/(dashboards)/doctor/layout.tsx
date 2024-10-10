'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, House, LogOut } from 'lucide-react'

import { type NavItem } from '@/types/nav'
import { logout } from '@/lib/actions'
import { getCurrentUser } from '@/lib/dal'
import { type User } from '@/lib/db-schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>()
  const pathname = usePathname()

  const links: NavItem[] = [
    {
      icon: <House className="size-6 stroke-gray-500" />,
      href: '/doctor',
      text: 'Home',
    },
    {
      icon: <ClipboardList className="size-6 stroke-gray-500" />,
      href: '/doctor/results',
      text: 'Results',
    },
  ]

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }

    void fetchCurrentUser()
  }, [])

  /**
   * Returns the initials of a user.
   *
   * @param user - The user object.
   * @returns The initials of the user.
   */
  function getUserInitials(user: typeof currentUser) {
    // If the user is not available, return an empty string.
    if (user == null) return ''

    // If the user has a first name and a last name, return the initials of both.
    return `${String(user?.first_name?.[0])}${String(user?.last_name?.[0])}`
  }

  return (
    <div className="ml-72 flex print:ml-0">
      <aside className="fixed inset-y-0 left-0 flex h-svh w-full max-w-72 flex-col justify-between border-r border-r-gray-200 print:hidden">
        <div className="flex flex-col gap-6 pt-8">
          <div className="h-8" />

          <nav className="px-4">
            <ul className="flex flex-col gap-1">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400/15 data-active:bg-gray-50"
                    data-state={pathname === link.href ? 'active' : 'inactive'}
                    href={link.href}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span className="font-semibold text-gray-700 group-hover:text-gray-800">
                        {link.text}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <footer className="px-4 pb-8">
          <div className="flex items-center justify-between gap-3 border-t border-t-gray-200 pl-2 pt-6">
            <div className="flex min-w-0 items-center gap-3">
              {currentUser == null ? (
                <>
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-24 rounded-full" />
                    <Skeleton className="mt-1 h-3 w-20 rounded-full" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getUserInitials(currentUser)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-700">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    <div className="truncate text-sm text-gray-600">{currentUser?.email}</div>
                  </div>
                </>
              )}
            </div>
            <Button
              type="button"
              hierarchy="tertiary-gray"
              icon="sm"
              size="sm"
              onClick={() => {
                void logout()
              }}
            >
              <span className="sr-only">Log out</span>
              <LogOut className="size-5" size={20} />
            </Button>
          </div>
        </footer>
      </aside>

      <main className="flex-1 px-8 pb-12 pt-8">{children}</main>
    </div>
  )
}
