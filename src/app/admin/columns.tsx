'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { type CustomUser } from '@/lib/dal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'

export const columns: Array<ColumnDef<CustomUser>> = [
  {
    accessorKey: 'user_id',
    header: ({ column }) => <DataTableColumnHeader title="User ID" column={column} />,
    cell: (cell) => cell.row.original.user_id,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader title="Name" column={column} />
    },
    cell: (cell) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${cell.row.original.profile_picture}`}
            alt={cell.row.original.name}
          />
          <AvatarFallback>
            {cell.row.original.first_name[0]}
            {cell.row.original.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-900">{cell.row.original.name}</span>
      </div>
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
]
