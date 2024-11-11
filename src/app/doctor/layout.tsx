import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { sql } from 'drizzle-orm'

import { getCurrentUser } from '@/lib/dal'
import { db } from '@/lib/db'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { type NavUserProps } from '@/components/nav-user'

import { AppSidebar } from './_components/app-sidebar'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Layout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser()

  if (currentUser == null) {
    return null
  }

  const avatar = await db.execute(sql`
    SELECT
      "profile_picture"
    FROM
      "user_information"
    WHERE
      "user_id" = ${currentUser.user_id};
  `)

  console.log(avatar.rows)

  const user: NavUserProps = {
    user: {
      avatar: avatar.rows[0].profile_picture as string,
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
