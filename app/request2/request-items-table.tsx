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

export function RequestItemsTable() {
  // ✅ table data state
  const [data, setData] = React.useState<RequestItem[]>([])

  // ✅ dialog state
  const [open, setOpen] = React.useState(false)

  // ✅ form state
  const [form, setForm] = React.useState({
    type: "",
    no: "",
    description: "",
    quantity: 1,
    unitOfMeasure: "",
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleAdd = () => {
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
      type: "",
      no: "",
      description: "",
      quantity: 1,
      unitOfMeasure: "",
    })

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
          Request Items
        </h3>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          New Line
        </Button>
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
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="e.g. Material / Service"
                value="Item" readOnly
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
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

                <option value="1001">
                  1001 - (DRILL ROD; NT 3.0M)
                </option>

                <option value="1002">
                  1002 - BIT-0031-Hammer Bit 137mm
                </option>

                <option value="1004">
                  1004 - DOW-0036 (SPLIT TUBE 1.5m, HD PWL3 SET 2)
                </option>

                <option value="EQM-8838">
                  EQM-8838
                </option>

                <option value="EQM-8841">
                  EQM-8841 - (TURBO GP-CAT 10R2622)
                </option>

                <option value="EQM-8848">
                  EQM-8848 - (FI PUMP 3973900)
                </option>

                <option value="EQR-8522">
                  EQR-8522 - (FMC 305 KEY 50 X 12 X 8)
                </option>

                <option value="EQR-8523">
                  EQR-8523 - (P/N 1101419 Valve Ball)
                </option>

                <option value="EQR-8524">
                  EQR-8524 - (FMC 305 BEARING RETAINER)
                </option>

                <option value="FMNGTFEE">FMNGTFEE - Fixed Management Fee</option>
                <option value="MTAC">MTAC - Meters Drilled Air Core</option>
                <option value="MTDB">MTDB - Meters Drilled Drill & Blast</option>
                <option value="MTDC">MTDC - Meters Drilled Diamond Core</option>
                <option value="MTOP">MTOP - Meters Drilled Odex and Paste Fill</option>
                <option value="MTRC">MTRC - Meters Drilled Reverse Circulation</option>
                <option value="MTWB">MTWB - Meters Drilled Water Bore</option>

                <option value="RIM-6577">RIM-6577 - (OX Wear Bend Ceramic Tiles)</option>
                <option value="RIM-8446">RIM-8446</option>
                <option value="RIM-8925">RIM-8925</option>
                <option value="RIM-9191">RIM-9191</option>
                <option value="RIR-0476">RIR-0476</option>
                <option value="RIR-2873">RIR-2873</option>
                <option value="RIR-4111">RIR-4111</option>
                <option value="SCHARGHOURS">SCHARGHOURS</option>
                <option value="SEQUIPRENT">SEQUIPRENT</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="" readOnly
                value="(GEARSE CUP HEAD SC120-20)"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Quantity + UOM */}
            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Quantity
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
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
                  Unit of Measure
                </label>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  placeholder=""
                  value="PCS" readOnly
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unitOfMeasure: e.target.value,
                    })
                  }
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
                <TableCell
                  colSpan={columns.length}
                  className="h-32"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No request items yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Click "New Line" to add your first item
                    </p>
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