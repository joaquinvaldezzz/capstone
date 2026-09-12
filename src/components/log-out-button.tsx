'use client'

import { LogOut } from 'lucide-react'

import { logout } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export const LogOutButton = () => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => {
      void logout()
    }}
  >
    <span className="sr-only">Log out</span>
    <LogOut className="size-5" size={20} />
  </Button>
)
