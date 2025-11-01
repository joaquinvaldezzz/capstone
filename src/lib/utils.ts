import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { badgeVariants } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function determineBadgeColor(tag: string): VariantProps<typeof badgeVariants>['variant'] {
  switch (tag) {
    case 'Infected':
      return 'destructive'
    case 'Healthy':
      return 'default'
    default:
      return 'outline'
  }
}
