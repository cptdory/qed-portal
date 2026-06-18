"use client"

import * as React from "react"

import Image from "next/image"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  BadgeCheck,
  Clock3,
  Eye,
  FileEdit,
  ImageIcon,
  MoreHorizontal,
  PackageSearch,
  XCircle,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ItemRequestList {
  requestNo: string
  description: string
  itemCategory: string
  picture?: string
  status: string
  requestedBy: string
  dateRequested: string
}

const data: ItemRequestList[] = [
  {
    requestNo: "ITMREQ000001",
    description: "TURBO GP-CAT 10R2622",
    itemCategory: "EQM",
    picture: "/sample-pic/pic1.webp",
    status: "NEW",
    requestedBy: "Francis Lofranco",
    dateRequested: "May 29, 2026",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )

    case "Pending Approval":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50">
          <Clock3 className="mr-1 h-3 w-3" />
          Pending Approval
        </Badge>
      )

    case "Rejected":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )

    default:
      return (
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50"
        >
          <FileEdit className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      )
  }
}

const columns: ColumnDef<ItemRequestList>[] = [
  {
    accessorKey: "requestNo",
    header: "Item Request No.",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-semibold text-blue-600">
          {row.getValue("requestNo")}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-500">
          {row.original.dateRequested}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "picture",
    header: "Image",
    cell: ({ row }) => {
      const picture = row.original.picture

      return (
        <div className="flex items-center justify-center">

          {picture ? (
            <Image
              src={picture}
              alt="Item"
              width={44}
              height={44}
              className="h-11 w-11 rounded-md border object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50">
              <ImageIcon className="h-4 w-4 text-slate-400" />
            </div>
          )}

        </div>
      )
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[360px]">
        <p className="line-clamp-2 text-xs text-slate-700">
          {row.getValue("description")}
        </p>

        <p className="mt-1 text-[11px] text-slate-500">
          Requested by {row.original.requestedBy}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "itemCategory",
    header: "Item Category",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-50 text-blue-700"
      >
        <PackageSearch className="mr-1 h-3 w-3" />
        {row.getValue("itemCategory")}
      </Badge>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return getStatusBadge(status)
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => console.log("view", row.original)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>

      </div>
    ),
  },
]

export function ItemRequestListTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

        <div>
          <p className="text-xs text-slate-500">
            Monitor and manage requested items
          </p>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b bg-slate-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-slate-500"
                >
                  No item requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}