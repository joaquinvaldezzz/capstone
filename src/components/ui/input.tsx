import { forwardRef, type InputHTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const inputVariants = cva(
  'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring data-focus-within:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-disabled:opacity-50 data-focus-within:ring-2 data-focus-within:ring-offset-2 data-focus-within:outline-hidden',
)

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input className={cn(inputVariants(), className)} type={type} ref={ref} {...props} />
})
Input.displayName = 'Input'

export { Input }
