'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const inputVariants = cva(
  'flex w-full rounded-lg bg-white text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 file:mr-2 file:border-0 file:bg-transparent file:p-0 file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 aria-invalid:ring-error-500 aria-invalid:placeholder:text-error-500',
  {
    variants: {
      padding: {
        sm: 'h-10 px-3 py-2',
        md: 'h-11 px-3.5 py-2.5',
      },
    },
    defaultVariants: {},
  },
)

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, padding, ...props }, ref) => {
    return <input className={cn(inputVariants({ padding }), className)} ref={ref} {...props} />
  },
)

Input.displayName = 'Input'
