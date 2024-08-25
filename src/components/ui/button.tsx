'use client'

import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-lg border font-semibold shadow-xs focus:outline-none focus:ring-4',
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
          'border-brand-600 bg-brand-600 text-white hover:border-brand-700 hover:bg-brand-700 focus:ring-brand-500/25 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
        'secondary-gray':
          'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400/15 disabled:border-gray-200 disabled:text-gray-400',
        'secondary-color':
          'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 focus:ring-brand-500/25 disabled:border-brand-200 disabled:bg-white disabled:text-gray-400',
        'tertiary-gray':
          'border-transparent text-gray-600 shadow-transparent hover:bg-gray-50 disabled:text-gray-400',
        'tertiary-color':
          'border-transparent text-brand-700 shadow-transparent hover:bg-brand-50 hover:text-brand-800 disabled:text-gray-400',
        'link-gray':
          'h-auto rounded border-transparent p-0 text-gray-600 shadow-transparent hover:text-gray-700 focus:ring-2 disabled:text-gray-400',
        'link-color':
          'h-auto rounded border-transparent p-0 text-gray-700 shadow-transparent hover:text-brand-800 focus:ring-2 disabled:text-gray-400',
        button: 'border-transparent shadow-transparent hover:bg-gray-50 focus:ring-gray-400/15',
      },
    },
    defaultVariants: {
      size: 'sm',
      hierarchy: 'primary',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button component.
 *
 * @component
 * @example
 * ```tsx
 * <Button size="small" hierarchy="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, type ButtonProps }
