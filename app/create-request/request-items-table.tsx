"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Trash2, Plus } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export interface RequestItem {
  id: string
  type: string
  no: string
  description: string
  quantity: number
  unitOfMeasure: string
}

const columns: ColumnDef<RequestItem>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-slate-700">
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "no",
    header: "No.",
    cell: ({ row }) => (
      <div className="text-xs font-semibold text-blue-600">
        {row.getValue("no")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Qty</div>,
    cell: ({ row }) => (
      <div className="text-right text-xs font-medium tabular-nums">
        {row.getValue("quantity")}
      </div>
    ),
  },
  {
    accessorKey: "unitOfMeasure",
    header: () => <div className="text-center">UOM</div>,
    cell: ({ row }) => (
      <div className="text-center text-xs text-slate-700">
        {row.getValue("unitOfMeasure")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <button
          onClick={() => console.log("Delete item:", row.original.id)}
          className="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    ),
  },
]

const defaultData: RequestItem[] = [
  {
    id: "1",
    type: "Item",
    no: "EQM-8838",
    description: "(GEARSE CUP HEAD SC120-20)",
    quantity: 20,
    unitOfMeasure: "PCS",
  },
  {
    id: "2",
    type: "Item",
    no: "EQM-8841",
    description: "(TURBO GP-CAT 10R2622)",
    quantity: 15,
    unitOfMeasure: "PCS",
  },
  {
    id: "3",
    type: "Item",
    no: "EQM-8848",
    description: "(FI PUMP 3973900)",
    quantity: 30,
    unitOfMeasure: "PCS",
  },
  {
    id: "4",
    type: "Item",
    no: "EQR-8522",
    description: "(FMC 305 KEY 50 X 12 X 8 (ITEM#21))",
    quantity: 45,
    unitOfMeasure: "PCS",
  },
  {
    id: "5",
    type: "Item",
    no: "EQR-8523",
    description: "(P/N 1101419 Valve Ball)",
    quantity: 50,
    unitOfMeasure: "PCS",
  },
  {
    id: "5",
    type: "Item",
    no: "EQR-8524",
    description: "(FMC 305 BEARING RETAINER (ITEM#10))",
    quantity: 8,
    unitOfMeasure: "PCS",
  },
]

export function RequestItemsTable() {
  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Request Items
          </h3>
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          New Line
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
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
                    className="h-9 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
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
                  className="border-b border-slate-100 hover:bg-slate-50/70"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2 align-middle"
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
                  className="h-20 text-center text-sm text-slate-500"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}