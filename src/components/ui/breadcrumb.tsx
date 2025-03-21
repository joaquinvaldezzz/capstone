'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'

const Breadcrumb = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<'nav'> & {
    separator?: ReactNode
  }
>(({ ...props }, ref) => <nav aria-label="breadcrumb" ref={ref} {...props} />)
Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList = forwardRef<HTMLOListElement, ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li className={cn('inline-flex items-center gap-1.5', className)} ref={ref} {...props} />
  ),
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = (asChild ?? false) ? Slot : 'a'

  return (
    <Comp
      className={cn('hover:text-foreground transition-colors', className)}
      ref={ref}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      className={cn('text-foreground font-normal', className)}
      role="link"
      aria-current="page"
      aria-disabled="true"
      ref={ref}
      {...props}
    />
  ),
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({ children, className, ...props }: ComponentProps<'li'>) => (
  <li
    className={cn('[&>svg]:size-3.5', className)}
    role="presentation"
    aria-hidden="true"
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    className={cn('flex size-9 items-center justify-center', className)}
    role="presentation"
    aria-hidden="true"
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
