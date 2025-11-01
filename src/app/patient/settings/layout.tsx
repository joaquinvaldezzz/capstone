import { Fragment } from 'react'

import { Separator } from '@/components/ui/separator'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Nav } from './nav'

export const metadata: Metadata = {
  title: {
    default: 'Settings',
    template: 'Settings | %s',
  },
}

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/patient/settings',
  },
  {
    title: 'Profile',
    href: '/patient/settings/profile',
  },
  {
    title: 'Password',
    href: '/patient/settings/password',
  },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="mt-0.5 text-muted-foreground">
          Manage your account settings here including your email, password, and other preferences.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-y-8 lg:flex-row lg:gap-x-12 lg:gap-y-0">
        <aside className="lg:w-48">
          <Nav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
