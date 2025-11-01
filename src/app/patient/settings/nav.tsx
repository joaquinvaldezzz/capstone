'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import type { HTMLAttributes } from 'react'

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export const Nav = ({ className, items, ...props }: SidebarNavProps) => {
  const pathname = usePathname()

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
          href={item.href}
          key={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
