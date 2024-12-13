'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { Root } from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const labelVariants = cva(
  'inline-block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root className={cn(labelVariants(), className)} ref={ref} {...props} />
))
Label.displayName = Root.displayName

export { Label }
