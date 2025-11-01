'use client'

import { LogOut } from 'lucide-react'

import { logout } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export const LogOutButton = () => (
  <Button
    type="button"
    hierarchy="tertiary-gray"
    icon="sm"
    size="sm"
    onClick={() => {
      void logout()
    }}
  >
    <span className="sr-only">Log out</span>
    <LogOut className="size-5" size={20} />
  </Button>
)
