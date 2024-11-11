'use client'

import { PrinterIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        window.print()
      }}
    >
      <PrinterIcon className="size-5" />
      <span>Print</span>
    </Button>
  )
}
