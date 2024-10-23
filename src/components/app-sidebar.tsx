'use client'

import { type ComponentProps } from 'react'
import Link from 'next/link'
import { Command, LayoutDashboard, Users } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain, type NavMainProps } from '@/components/nav-main'
import { NavUser, type NavUserProps } from '@/components/nav-user'

interface AppSidebarProps extends ComponentProps<typeof Sidebar>, NavUserProps {}

const links: NavMainProps = {
  items: [
    {
      icon: LayoutDashboard,
      url: '/admin',
      title: 'Dashboard',
    },
    {
      icon: Users,
      url: '/admin/users',
      title: 'Users',
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={links.items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
