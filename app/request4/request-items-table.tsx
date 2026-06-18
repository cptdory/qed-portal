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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface RequestItem {
  id: string
  type: string
  no: string
  description: string
  quantity: number
  unitOfMeasure: string
}

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
    id: "6",
    type: "Item",
    no: "EQR-8524",
    description: "(FMC 305 BEARING RETAINER (ITEM#10))",
    quantity: 8,
    unitOfMeasure: "PCS",
  },
  
  
]

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
]

export function RequestItemsTable() {
  const [data, setData] = React.useState<RequestItem[]>(defaultData)

  const [open, setOpen] = React.useState(false)

  const [form, setForm] = React.useState({
    type: "Item",
    no: "",
    description: "",
    quantity: 1,
    unitOfMeasure: "PCS",
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleAdd = () => {
    if (!form.no) return

    const newItem: RequestItem = {
      id: crypto.randomUUID(),
      type: form.type,
      no: form.no,
      description: form.description,
      quantity: Number(form.quantity),
      unitOfMeasure: form.unitOfMeasure,
    }

    setData((prev) => [...prev, newItem])

    setForm({
      type: "Item",
      no: "",
      description: "",
      quantity: 1,
      unitOfMeasure: "PCS",
    },)

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Requested Items
        </h3>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Line</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Type
              </label>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.type}
                readOnly
              />
            </div>

            {/* No */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                No.
              </label>

              <select
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                value={form.no}
                onChange={(e) =>
                  setForm({ ...form, no: e.target.value })
                }
              >
                <option value="">-- Select --</option>

                <option value="EQM-8838">EQM-8838 - GEARSE CUP</option>
                <option value="EQM-8841">EQM-8841 - TURBO GP</option>
                <option value="EQM-8848">EQM-8848 - FI PUMP</option>
                <option value="EQR-8522">EQR-8522 - FMC KEY</option>
                <option value="EQR-8523">EQR-8523 - VALVE BALL</option>
                <option value="EQR-8524">EQR-8524 - BEARING RETAINER</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>

              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional description"
              />
            </div>

            {/* Quantity + UOM */}
            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Quantity
                </label>

                <input
                  type="number"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  UOM
                </label>

                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.unitOfMeasure}
                  readOnly
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button size="sm" onClick={handleAdd}>
                Add Item
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="text-center text-sm text-slate-500">
                    No request items yet
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}