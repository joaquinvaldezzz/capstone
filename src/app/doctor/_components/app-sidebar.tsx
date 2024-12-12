'use client'

import { type ComponentProps } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, LayoutDashboard } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { NavMain, type NavMainProps } from './nav-main'
import { NavUser, type NavUserProps } from './nav-user'

import HospitalLogo from '@/public/images/hospital-logo.jpg'

interface AppSidebarProps extends ComponentProps<typeof Sidebar>, NavUserProps {}

const links: NavMainProps = {
  items: [
    {
      icon: LayoutDashboard,
      url: '/doctor',
      title: 'Dashboard',
    },
    {
      icon: FileText,
      url: '/doctor/results',
      title: 'Results',
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
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center overflow-hidden rounded-full">
                  <Image src={HospitalLogo} alt="National Children's Hospital" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">National Children&apos;s Hospital</span>
                  <span className="truncate text-xs capitalize">{user.role}</span>
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
