'use client'

import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full text-center font-medium ring-1 ring-inset',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
      },
      type: {
        '': '',
      },
      color: {
        gray: 'bg-gray-50 text-gray-700 ring-gray-200',
        brand: 'bg-brand-50 text-brand-700 ring-brand-200',
        error: 'bg-error-50 text-error-700 ring-error-200',
        warning: 'bg-warning-50 text-warning-700 ring-warning-200',
        success: 'bg-success-50 text-success-700 ring-success-200',
        'gray-blue': 'bg-gray-blue-50 text-gray-blue-700 ring-gray-blue-200',
        'blue-light': 'bg-blue-light-50 text-blue-light-700 ring-blue-light-200',
        blue: 'bg-blue-50 text-blue-700 ring-blue-200',
        indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
        purple: 'bg-purple-50 text-purple-700 ring-purple-200',
        pink: 'bg-pink-50 text-pink-700 ring-pink-200',
        orange: 'bg-orange-50 text-orange-700 ring-orange-200',
      },
    },
    defaultVariants: {
      size: 'sm',
      color: 'gray',
    },
  },
)

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, size, type, color, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ size, type, color }), className)} {...props}>
      {children}
    </div>
  )
}
