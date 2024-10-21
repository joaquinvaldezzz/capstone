import { type ReactNode } from 'react'
import { Users } from 'lucide-react'

import { type NavItem } from '@/types/nav'
import { getCurrentUser } from '@/lib/dal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { LogOutButton } from '@/components/log-out-button'
import { SideNav } from '@/components/side-nav'

export default async function Layout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser()

  const links: NavItem[] = [
    {
      icon: <Users className="size-6 stroke-gray-500" />,
      href: '/admin/users',
      text: 'Users',
    },
  ]

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
    <div className="ml-72 flex">
      <aside className="fixed inset-y-0 left-0 flex h-svh w-full max-w-72 flex-col justify-between border-r border-r-gray-200">
        <div className="flex flex-col gap-6 pt-8">
          <div className="h-8 px-4"></div>
          <SideNav links={links} />
        </div>

        <footer className="px-4 pb-8">
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-t-gray-200 pl-2 pt-6">
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
                      {currentUser.first_name} {currentUser.last_name}
                    </div>
                    <div className="truncate text-sm text-gray-600">{currentUser?.email}</div>
                  </div>
                </>
              )}
            </div>
            <LogOutButton />
          </div>
        </footer>
      </aside>

      <main className="flex-1 px-8 pb-12 pt-8">{children}</main>
    </div>
  )
}
