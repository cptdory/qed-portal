"use client"

import * as React from "react"

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

export interface RequestList {
  requestType: string
  requestNo: string
  description: string
  status: string
  location: string
  sectionCode: string
  requestedBy: string
  dateRequested: string
}

const data: RequestList[] = [
  {
    requestType: "MAINTENANCE",
    requestNo: "REQ00000002",
    description: "Scheduled Maintenance RIG24",
    status: "Approved",
    location: "DAVAO",
    sectionCode: "WAREHOUSE",
    requestedBy: "John Palma",
    dateRequested: "May 28, 2026",
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

const columns: ColumnDef<RequestList>[] = [
  {
    accessorKey: "requestNo",
    header: "Request No.",
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
    accessorKey: "requestType",
    header: "Request Type",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-medium text-slate-800">
          {row.getValue("requestType")}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {row.original.sectionCode}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[320px]">
        <p className="truncate text-xs text-slate-700">
          {row.getValue("description")}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Requested by {row.original.requestedBy}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border-slate-200 bg-slate-50 text-slate-700"
      >
        {row.getValue("location")}
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
    header: () => <div className="text-right" />,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-600 hover:text-slate-900"
          onClick={() => console.log("view", row.original)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </div>
    ),
  },
]

export function RequestListTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <p className="text-xs text-slate-500">
            View purchase requests
          </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b bg-slate-50 hover:bg-slate-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-11 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${
                      header.column.id === "actions" ? "text-right" : "text-left"
                    }`}
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
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 align-middle"
                    >
                      <div className="flex items-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
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
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

    </div>
  )
}