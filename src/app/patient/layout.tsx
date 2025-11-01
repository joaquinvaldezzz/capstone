import { type ReactNode } from 'react'

import { sql } from 'drizzle-orm'

import { getCurrentUser, getPatientResult } from '@/lib/dal'
import { db } from '@/lib/db'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { type NavUserProps } from '@/components/nav-user'

import { AppSidebar } from './_components/app-sidebar'

export default async function Layout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser()

  if (currentUser == null) {
    return null
  }

  const results = await getPatientResult().then((data) =>
    data?.filter((item) => item.user_id === currentUser.user_id),
  )

  if (results == null) {
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
    <SidebarProvider
      style={{
        // @ts-expect-error Object literal may only specify known properties, and ''--sidebar-width'' does not exist in type 'Properties<string | number, string & {}>'.
        '--sidebar-width': '350px',
      }}
    >
      <AppSidebar messages={results} user={user.user} />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
