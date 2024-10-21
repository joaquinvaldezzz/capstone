'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'

import { type User } from '@/lib/db-schema'
import { Button } from '@/components/ui/button'

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: (cell) => cell.row.original.user_id,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: (cell) => (
      <span className="font-medium text-gray-900">
        {cell.row.original.first_name} {cell.row.original.last_name}
      </span>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Role
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: (cell) => <span className="capitalize">{cell.row.original.role}</span>,
  },
  {
    accessorKey: 'created_at',
    header: 'Date created',
    cell: (cell) => format(cell.row.original.creation_date, 'MMMM dd, yyyy h:mm a'),
  },
]
