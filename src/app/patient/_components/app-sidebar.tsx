'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { formatDistanceToNow } from 'date-fns'
import { Inbox } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import type { ComponentProps } from 'react'
import type { NavUserProps } from '@/components/nav-user'
import type { PatientResult } from '@/lib/dal'

import { NavUser } from './nav-user'

import HospitalLogo from '@/public/images/hospital-logo.jpg'

// This is sample data
const data = {
  navMain: [
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
      isActive: true,
    },
  ],
}

interface AppSidebarProps extends ComponentProps<typeof Sidebar>, NavUserProps {
  messages: PatientResult[]
}

export const AppSidebar = ({ messages, user, ...props }: AppSidebarProps) => {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = useState(data.navMain[0])

  const pathname = usePathname()
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      collapsible="icon"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r" collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="md:h-8 md:p-0" size="lg" asChild>
                <Link href="">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image src={HospitalLogo} alt="National Children's Hospital" />
                  </div>
                  {/* <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      National Children&apos;s Hospital
                    </span>
                    <span className="truncate text-xs capitalize">{user.role}</span>
                  </div> */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="px-2.5 md:px-2"
                      isActive={activeItem.title === item.title}
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar className="hidden flex-1 md:flex" collapsible="none">
        <SidebarHeader className="min-h-15.25 gap-3.5 border-b p-4">
          <div className="flex size-full items-center justify-between">
            <div className="text-base font-medium text-foreground">{activeItem.title}</div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {messages.map((message) => (
                <Link
                  className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                  data-active={pathname === `/patient/result/${message.result_id}`}
                  href={`/patient/result/${message.result_id}`}
                  key={message.result_id}
                >
                  <div className="flex w-full items-center gap-2">
                    <span>
                      {message.doctor_first_name} {message.doctor_last_name}
                    </span>
                    <span className="ml-auto text-xs">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="font-medium">Your ultrasound result is here!</div>
                  <div className="line-clamp-2 text-xs whitespace-break-spaces">
                    Based on the ultrasound image, the diagnosis is{' '}
                    {message.diagnosis.toLowerCase()}.
                  </div>
                </Link>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
