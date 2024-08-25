'use client'

import { forwardRef } from 'react'
import { Root } from '@radix-ui/react-label'
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'

import { cn } from '@/lib/utils'

export const labelVariants = cva('text-sm font-medium text-gray-700')

export const Label = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root className={cn(labelVariants(), className)} ref={ref} {...props} />
))

Label.displayName = Root.displayName
