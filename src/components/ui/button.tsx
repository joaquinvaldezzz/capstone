'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-lg border font-semibold shadow-xs focus:outline-none focus:ring-4 disabled:text-gray-400',
  {
    variants: {
      size: {
        sm: 'h-9 gap-1 px-3 py-2 text-sm',
        md: 'h-10 gap-1 px-3.5 py-2.5 text-sm',
        lg: 'h-11 gap-1.5 px-4 py-2.5',
        xl: 'h-12 gap-1.5 px-4.5 py-3',
        '2xl': 'h-15 gap-2.5 px-5.5 py-4 text-lg',
      },
      hierarchy: {
        primary:
          'border-brand-600 bg-brand-600 text-white hover:border-brand-700 hover:bg-brand-700 focus:ring-brand-500/25 disabled:border-gray-200 disabled:bg-gray-100',
        'secondary-gray':
          'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400/15 disabled:border-gray-200',
        'secondary-color':
          'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 focus:ring-brand-500/25 disabled:border-brand-200 disabled:bg-white',
        'tertiary-gray': 'border-transparent text-gray-600 shadow-transparent hover:bg-gray-50',
        'tertiary-color':
          'border-transparent text-brand-700 shadow-transparent hover:bg-brand-50 hover:text-brand-800',
        'link-gray':
          'h-auto rounded border-transparent p-0 text-gray-600 shadow-transparent hover:text-gray-700 focus:ring-2',
        'link-color':
          'h-auto rounded border-transparent p-0 text-gray-700 shadow-transparent hover:text-brand-800 focus:ring-2',
        button: 'border-transparent shadow-transparent hover:bg-gray-50 focus:ring-gray-400/15',
      },
    },
    defaultVariants: {
      size: 'sm',
      hierarchy: 'primary',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, hierarchy, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        className={cn(buttonVariants({ size, hierarchy }), className)}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
