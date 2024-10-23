'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { type User } from '@/lib/db-schema'

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: (cell) => cell.row.original.user_id,
  },
  {
    accessorKey: 'first_name',
    header: 'Name',
    cell: (cell) => (
      <span className="font-medium text-gray-900">
        {cell.row.original.first_name} {cell.row.original.last_name}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email address',
    cell: (cell) => (
      <div className="flex flex-1">
        <span className="truncate">{cell.row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (cell) => <span className="capitalize">{cell.row.original.role}</span>,
  },
  {
    accessorKey: 'created_at',
    header: 'Date created',
    cell: (cell) => format(cell.row.original.creation_date, 'MMMM dd, yyyy h:mm a'),
  },
]
