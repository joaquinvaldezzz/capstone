'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { NavItem } from '@/types/nav'

export const SideNav = ({ links }: { links: NavItem[] }) => {
  const pathname = usePathname()

  return (
    <nav className="px-4">
      <ul className="flex flex-col gap-1">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50 focus:ring-4 focus:ring-gray-400/15 focus:outline-hidden data-active:bg-gray-50"
              data-state={pathname === link.href ? 'active' : 'inactive'}
              href={link.href}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span className="font-semibold text-gray-700 group-hover:text-gray-800">
                  {link.text}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
