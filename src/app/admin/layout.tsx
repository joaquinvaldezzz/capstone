import { type ReactNode } from 'react'
import { type Metadata } from 'next'

import { getCurrentUser } from '@/lib/dal'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { type NavUserProps } from '@/components/nav-user'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Layout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser()

  if (currentUser == null) {
    return null
  }

  const user: NavUserProps = {
    user: {
      avatar: '',
      initials: currentUser.first_name.charAt(0).concat(currentUser.last_name.charAt(0)),
      name: currentUser.first_name.concat(' ', currentUser.last_name),
      role: currentUser.role,
      email: currentUser.email,
    },
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user.user} />
      <SidebarInset>
        <header className="flex h-16 items-center">
          <div className="flex flex-1 items-center justify-between gap-4 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="px-4 pb-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
