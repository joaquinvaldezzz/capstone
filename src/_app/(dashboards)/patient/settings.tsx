'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SettingsIcon } from 'lucide-react'

export function Settings() {
  const pathname = usePathname()

  return (
    <nav>
      <ul>
        <li>
          <Link
            className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400/15 data-active:bg-gray-50"
            data-state={pathname === '/patient/settings' ? 'active' : 'inactive'}
            href="/patient/settings"
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="size-6 stroke-gray-500" />
              <span className="font-semibold text-gray-700 group-hover:text-gray-800">
                Settings
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
