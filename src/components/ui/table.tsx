import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'

import { cn } from '@/lib/utils'

const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-xl border border-gray-200 shadow-xs">
      <table className={cn('w-full caption-bottom text-sm', className)} ref={ref} {...props} />
    </div>
  ),
)
Table.displayName = 'Table'

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead className={cn('[&_tr]:border-b', className)} ref={ref} {...props} />
  ),
)
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} ref={ref} {...props} />
  ),
)
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      className={cn('border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0', className)}
      ref={ref}
      {...props}
    />
  ),
)
TableFooter.displayName = 'TableFooter'

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      className={cn(
        'border-b transition-colors even:bg-gray-50 data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-800',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      className={cn(
        'h-11 bg-gray-50 px-6 py-3 text-left align-middle text-xs font-medium text-gray-600',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      className={cn('px-6 py-4 align-middle text-sm first-of-type:font-medium', className)}
      ref={ref}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      className={cn('mt-4 text-sm text-gray-500 dark:text-gray-400', className)}
      ref={ref}
      {...props}
    />
  ),
)
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
