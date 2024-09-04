'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { LogOut } from 'lucide-react'

import { logout } from '@/lib/actions'
import { getCurrentUser } from '@/lib/dal'
import { type User } from '@/lib/db-schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function Layout({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>()

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }

    void fetchCurrentUser()
  }, [])

  function getUserInitials(user: typeof currentUser) {
    return `${String(user?.first_name?.[0])}${String(user?.last_name?.[0])}`
  }

  return (
    <div className="ml-80 flex">
      <aside className="fixed inset-y-0 left-0 flex h-svh w-full max-w-80 flex-col justify-between border-r border-r-gray-200">
        <nav></nav>

        <footer className="px-4 pb-8">
          <div className="flex items-center justify-between border-t border-t-gray-200 pl-2 pt-6">
            <div className="flex flex-1 items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{getUserInitials(currentUser)}</AvatarFallback>
              </Avatar>
              <div className="max-w-40">
                <div className="truncate text-sm font-semibold text-gray-700">
                  {currentUser?.first_name} {currentUser?.last_name}
                </div>
                <div className="truncate text-sm text-gray-600">
                  javaldez1642qc@student.fatima.edu.ph
                </div>
              </div>
            </div>
            <Button
              className="size-9 shrink-0"
              type="button"
              onClick={() => {
                void logout()
              }}
              hierarchy="tertiary-gray"
              size="sm"
            >
              <span className="sr-only">Log out</span>
              <LogOut className="size-5 shrink-0" size={20} />
            </Button>
          </div>
        </footer>
      </aside>
      {children}
    </div>
  )
}
