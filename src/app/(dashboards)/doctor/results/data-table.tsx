'use client'

import Image from 'next/image'
import Link from 'next/link'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { type Result } from '@/lib/dal'
import { determineBadgeColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// TODO: Make this table reusable

export function DataTable({ data }: { data: Result[] }) {
  const columns: Array<ColumnDef<Result>> = [
    {
      accessorKey: 'result_id',
      header: 'Result number',
    },
    {
      accessorKey: 'created_at',
      header: 'Date added',
      cell: (cell) => format(cell.row.original.created_at, 'MMMM dd, yyyy'),
    },
    {
      accessorKey: 'first_name',
      header: 'Patient name',
      cell: (cell) => (
        <span className="font-medium text-gray-900">
          {String(cell.row.original.first_name) + ' ' + String(cell.row.original.last_name)}
        </span>
      ),
    },
    {
      accessorKey: 'ultrasound_image',
      header: 'Ultrasound image',
      cell: (cell) => {
        return (
          <div className="flex items-center gap-3">
            <Image
              className="size-10 rounded-full object-cover"
              src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${cell.row.original.ultrasound_image}`}
              alt={cell.row.original.ultrasound_image}
              height={40}
              width={40}
              priority
            />
            <span>{cell.row.original.ultrasound_image}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
      cell: (cell) => {
        const result = cell.row.original.diagnosis
        return <Badge color={determineBadgeColor(result)}>{result}</Badge>
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows?.length !== 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <Link
                    className="absolute inset-0"
                    href={`/doctor/results/${cell.row.original.result_id}`}
                  ></Link>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="h-24 text-center" colSpan={columns.length}>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
