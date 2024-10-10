'use client'

import { PrinterIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button
      hierarchy="primary"
      size="md"
      onClick={() => {
        window.print()
      }}
    >
      <PrinterIcon className="size-5" />
      Print
    </Button>
  )
}
