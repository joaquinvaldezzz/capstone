import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { TextareaHTMLAttributes } from 'react'

import { inputVariants } from './input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(inputVariants(), 'min-h-32 px-3.5 py-3', className)}
      ref={ref}
      {...props}
    />
  ),
)

Textarea.displayName = 'Textarea'
