'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { type User } from '@/lib/db-schema'

import { DataTableColumnHeader } from './data-table-column-header'

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'user_id',
    header: ({ column }) => <DataTableColumnHeader title="User ID" column={column} />,
    cell: (cell) => cell.row.original.user_id,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return <DataTableColumnHeader title="Name" column={column} />
    },
    cell: (cell) => (
      <span className="font-medium text-gray-900">
        {cell.row.original.first_name} {cell.row.original.last_name}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader title="Email" column={column} />,
    cell: (cell) => (
      <div className="flex flex-1">
        <span className="truncate">{cell.row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader title="Role" column={column} />,
    cell: (cell) => <span className="capitalize">{cell.row.original.role}</span>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader title="Date created" column={column} />,
    cell: (cell) => format(cell.row.original.creation_date, 'MMMM dd, yyyy h:mm a'),
  },
  {
    accessorKey: 'date_modified',
    header: ({ column }) => <DataTableColumnHeader title="Date modified" column={column} />,
    cell: (cell) => format(cell.row.original.date_modified, 'MMMM dd, yyyy h:mm a'),
  },
]
