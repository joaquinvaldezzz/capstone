'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type SVGProps } from 'react'
import { Indicator, Root } from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof Root> {
  size?: 'sm' | 'md'
}

function CheckIcon({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 3 4.5 8.5 2 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
    </svg>
  )
}

export const Checkbox = forwardRef<ElementRef<typeof Root>, CheckboxProps>(
  ({ className, size, ...props }, ref) => (
    <Root
      className={cn(
        'peer shrink-0 cursor-pointer rounded border border-gray-300 bg-white focus:outline-none focus:ring-4 focus:ring-gray-400/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 aria-invalid:border-error-300 aria-invalid:ring-error-500/25 data-checked:border-brand-600 data-checked:bg-brand-600 data-checked:text-white',
        size === 'sm' ? 'size-4 rounded' : 'size-5 rounded-md',
        className,
      )}
      ref={ref}
      {...props}
    >
      <Indicator className={cn('flex items-center justify-center text-current')}>
        <CheckIcon className={cn(size === 'sm' ? 'size-3' : 'size-3.5')} />
      </Indicator>
    </Root>
  ),
)

Checkbox.displayName = Root.displayName
