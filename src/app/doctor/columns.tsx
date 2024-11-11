'use client'

import Image from 'next/image'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { type Result } from '@/lib/dal'
import { determineBadgeColor } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'

export const columns: Array<ColumnDef<Result>> = [
  {
    accessorKey: 'result_id',
    header: ({ column }) => <DataTableColumnHeader title="Result" column={column} />,
    cell: (cell) => cell.row.original.result_id,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader title="Date" column={column} />,
    cell: (cell) => format(cell.row.original.created_at, 'MMMM dd, yyyy h:mm a'),
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
    accessorKey: 'ultrasound_image',
    header: ({ column }) => <DataTableColumnHeader title="Ultrasound" column={column} />,
    cell: (cell) => (
      <div className="flex items-center gap-2">
        <Image
          className="size-10 shrink-0 rounded-full"
          src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${cell.row.original.ultrasound_image}`}
          alt={cell.row.original.ultrasound_image}
          height={40}
          width={40}
        />

        <span>{cell.row.original.ultrasound_image}</span>
      </div>
    ),
  },
  {
    accessorKey: 'percentage',
    header: ({ column }) => <DataTableColumnHeader title="Percent" column={column} />,
    cell: (cell) => <span className="capitalize">{cell.row.original.percentage}</span>,
  },
  {
    accessorKey: 'diagnosis',
    header: ({ column }) => <DataTableColumnHeader title="Diagnosis" column={column} />,
    cell: (cell) => {
      const result = cell.row.original.diagnosis
      return <Badge variant={determineBadgeColor(result)}>{result}</Badge>
    },
  },
]
