import Link from 'next/link'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import type { LucideIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

export interface NavSecondaryProps extends ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: {
    icon: LucideIcon
    url: string
    title: string
  }[]
}

export const NavSecondary = ({ items, ...props }: NavSecondaryProps) => (
  <SidebarGroup {...props}>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton size="sm" asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)
