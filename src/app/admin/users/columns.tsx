'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Ellipsis } from 'lucide-react'

import { type CustomUser } from '@/lib/dal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
            src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/profile-pictures/${cell.row.original.profile_picture}`}
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
  {
    accessorKey: 'date_modified',
    header: ({ column }) => <DataTableColumnHeader title="Date modified" column={column} />,
    cell: (cell) => format(cell.row.original.date_modified, 'MMMM dd, yyyy h:mm a'),
  },
  {
    id: 'actions',
    cell: function Cell(row) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex size-8 p-0 data-[state=open]:bg-muted" variant="ghost">
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
