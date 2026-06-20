"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Trash2, Plus, Pencil } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DimensionType, DimensionValueType, RequestLineType } from "@/types/bc-types"
import { sileo } from "sileo";

const LINE_TYPES = ["Item"]

interface RequestItemsTableProps {
  lines: RequestLineType[]
  requestNo: string
  requestType: string
  warehouseLocation: string
  headerDimensionValues: Record<string, string>
  editable: boolean
  onLineCreated?: () => void
  onLineUpdated?: () => void
  onLineDeleted?: (lineNo: number) => void
}

function LineDimensionSelect({
  dim,
  value,
  onChange,
}: {
  dim: DimensionType
  value: string
  onChange: (key: string, value: string) => void
}) {
  const key = `LineShortcutDimension${dim.ShortcutDimensionNo}Code`
  const [values, setValues] = useState<DimensionValueType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await fetch("/api/get-dimension-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ DimensionCode: dim.DimensionCode }),
        })
        if (!res.ok) throw new Error("Failed to fetch dimension values")
        const data = await res.json()
        setValues(data.DimensionValues ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchValues()
  }, [dim.DimensionCode])

  return (
    <div className="col-span-6 space-y-1">
      <Label className="text-xs font-medium text-slate-600">{dim.DimensionCode}</Label>
      <select
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        disabled={loading}
        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{loading ? "Loading..." : `Select ${dim.DimensionCode}...`}</option>
        {values.map((v) => (
          <option key={v.Code} value={v.Code}>
            {v.Name}
          </option>
        ))}
      </select>
    </div>
  )
}

type LineForm = {
  type: string
  no: string
  quantity: string
  dimensions: Record<string, string>
}

const emptyLineForm = (headerDimensionValues: Record<string, string>): LineForm => {
  const lineDims: Record<string, string> = {}
  for (let i = 1; i <= 8; i++) {
    lineDims[`LineShortcutDimension${i}Code`] = headerDimensionValues[`ShortcutDimension${i}Code`] ?? ""
  }
  return {
    type: "Item",
    no: "",
    quantity: "",
    dimensions: lineDims,
  }
}

const lineFormFromExisting = (line: RequestLineType): LineForm => {
  const lineDims: Record<string, string> = {}
  for (let i = 1; i <= 8; i++) {
    const key = `LineShortcutDimension${i}Code`
    lineDims[key] = (line as any)[key] ?? ""
  }
  return {
    type: line.Type || "Item",
    no: line.No || "",
    quantity: line.Quantity != null ? String(line.Quantity) : "",
    dimensions: lineDims,
  }
}

export function RequestItemsTable({
  lines,
  requestNo,
  requestType,
  warehouseLocation,
  headerDimensionValues,
  editable,
  onLineCreated,
  onLineUpdated,
  onLineDeleted,
}: RequestItemsTableProps) {
  const [dimensions, setDimensions] = useState<DimensionType[]>([]);
  const [items, setItems] = useState<any[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingLine, setEditingLine] = useState<RequestLineType | null>(null)
  const [form, setForm] = useState<LineForm>(() => emptyLineForm(headerDimensionValues))
  const [submitting, setSubmitting] = useState(false)

  const isEditing = editingLine !== null

  useEffect(() => {
    const fetchLineDimensions = async () => {
      try {
        const res = await fetch("/api/get-visible-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _VisibleIn: "Line" }),
        });
        if (!res.ok) throw new Error("Failed to fetch line dimensions");
        const data = await res.json();
        setDimensions(data.VisibleDimensions ?? []);
      } catch (error) {
        console.error("Error fetching line dimensions:", error);
      }
    };
    fetchLineDimensions();
  }, []);

  const fetchItems = async () => {
    try {
      setLoadingItems(true)

      const res = await fetch("/api/get-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RequestType: requestType,
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch items")

      const data = await res.json()

      setItems(data.Items ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingItems(false)
    }
  }

  useEffect(() => {
    if (!open) return
    fetchItems()
  }, [open, requestType])

  const handleOpenCreate = () => {
    if (!editable) return
    setEditingLine(null)
    setForm(emptyLineForm(headerDimensionValues))
    setOpen(true)
  }

  const handleOpenEdit = (line: RequestLineType) => {
    if (!editable) return
    setEditingLine(line)
    setForm(lineFormFromExisting(line))
    setOpen(true)
  }

  const handleDimensionChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }))
  }

  const handleNoChange = (value: string) => {
    setForm((prev) => ({ ...prev, no: value }))
    // Re-fetch items whenever a selection is made, per spec
    fetchItems()
  }

  const handleDelete = async (lineNo: number) => {
    if (!editable) return

    if (!confirm("Delete this line?")) return

    try {
      const res = await fetch("/api/delete-request-line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RequestType: requestType,
          RequestNo: requestNo,
          LineNo: lineNo,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || data?.Status !== "Successful") {
        const message = data?.error || data?.Message || "Failed to delete line."
        sileo.error({ title: "Delete Failed", description: message, fill: "#171717" })
        return
      }

      onLineDeleted?.(lineNo)
      sileo.success({ title: "Request line deleted successfully.", fill: "#171717" });
    } catch (err) {
      console.error(err)
      sileo.error({ title: "Delete Failed", description: "An unexpected error occurred.", fill: "#171717" })
    }
  }

  const handleSubmit = async () => {
    if (!editable) return

    if (!form.no) {
      sileo.error({ title: "No. is required.", fill: "#171717" })
      return
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      sileo.error({ title: "Quantity must be greater than 0.", fill: "#171717" })
      return
    }

    const payload = {
      RequestType: requestType,
      RequestNo: requestNo,
      Type: form.type,
      No: form.no,
      Quantity: Number(form.quantity),
      WarehouseLocation: warehouseLocation,
      Dim1: form.dimensions.LineShortcutDimension1Code,
      Dim2: form.dimensions.LineShortcutDimension2Code,
      Dim3: form.dimensions.LineShortcutDimension3Code,
      Dim4: form.dimensions.LineShortcutDimension4Code,
      Dim5: form.dimensions.LineShortcutDimension5Code,
      Dim6: form.dimensions.LineShortcutDimension6Code,
      Dim7: form.dimensions.LineShortcutDimension7Code,
      Dim8: form.dimensions.LineShortcutDimension8Code,
    }

    try {
      setSubmitting(true)

      const endpoint = isEditing ? "/api/update-request-line" : "/api/create-request-line"
      const body = isEditing ? { ...payload, LineNo: editingLine!.LineNo } : payload

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || `Failed to ${isEditing ? "update" : "create"} request line.`
        sileo.error({ title: message, fill: "#171717" })
        return
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? `Failed to ${isEditing ? "update" : "create"} request line.`
        sileo.error({ title: message, fill: "#171717" })
        return
      }

      setOpen(false)
      setEditingLine(null)

      if (isEditing) {
        onLineUpdated?.()
        sileo.success({ title: "Request line updated.", fill: "#171717" });
      } else {
        onLineCreated?.()
        sileo.success({ title: "Request line added.", fill: "#171717" });
      }
    } catch (err) {
      console.error(err)
      sileo.error({ title: "An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  const dynamicDimensionColumns: ColumnDef<RequestLineType>[] = dimensions.map((dim) => ({
    accessorKey: `LineShortcutDimension${dim.ShortcutDimensionNo}Code`,
    header: dim.DimensionCode,
    cell: ({ row }: { row: Row<RequestLineType> }) => (
      <div className="text-xs text-slate-600">
        {(row.getValue(`LineShortcutDimension${dim.ShortcutDimensionNo}Code`) as string) || "-"}
      </div>
    ),
  }));

  const baseColumns: ColumnDef<RequestLineType>[] = [
    {
      accessorKey: "Type",
      header: "Type",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-slate-700">{row.getValue("Type")}</div>
      ),
    },
    {
      accessorKey: "No",
      header: "No.",
      cell: ({ row }) => (
        <div className="text-xs font-semibold text-blue-600">{row.getValue("No")}</div>
      ),
    },
    {
      accessorKey: "Description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-xs text-slate-600">{row.getValue("Description")}</div>
      ),
    },
    {
      accessorKey: "Quantity",
      header: () => <div className="text-right">Qty</div>,
      cell: ({ row }) => (
        <div className="text-right text-xs font-medium tabular-nums">{row.getValue("Quantity")}</div>
      ),
    },
    {
      accessorKey: "UnitOfMeasure",
      header: () => <div className="text-center">UOM</div>,
      cell: ({ row }) => (
        <div className="text-center text-xs text-slate-700">{row.getValue("UnitOfMeasure")}</div>
      ),
    },
    ...dynamicDimensionColumns,
    ...(editable
      ? ([
        {
          id: "actions",
          header: "",
          cell: ({ row }) => (
            <div className="flex justify-end gap-1">
              <button
                onClick={() => handleOpenEdit(row.original)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(row.original.LineNo)}
                className="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
        },
      ] as ColumnDef<RequestLineType>[])
      : []),
  ];

  const table = useReactTable({
    data: lines,
    columns: baseColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Request Items</h3>
        {editable && (
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleOpenCreate}>
            <Plus className="h-3.5 w-3.5" />
            New Line
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-slate-50 hover:bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-9 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={baseColumns.length} className="h-20 text-center text-sm text-slate-500">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* New / Edit Line Dialog */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditingLine(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-slate-900">
              {isEditing ? `Edit Line${editingLine ? ` #${editingLine.LineNo}` : ""}` : "New Line"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Request No. {requestNo} — Warehouse Location {warehouseLocation || "—"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-4 py-2">
            <div className="col-span-4 space-y-1">
              <Label className="text-xs font-medium text-slate-600">Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              >
                {LINE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-4 space-y-1">
              <Label className="text-xs font-medium text-slate-600">
                No. <span className="text-red-500">*</span>
              </Label>
              <select
                value={form.no}
                onChange={(e) => handleNoChange(e.target.value)}
                disabled={loadingItems}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
              >
                <option value="">
                  {loadingItems ? "Loading items..." : "Select Item"}
                </option>

                {items.map((item) => (
                  <option key={item.No} value={item.No}>
                    {item.No} - {item.Description}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-4 space-y-1">
              <Label className="text-xs font-medium text-slate-600">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                className="h-8 text-xs"
                placeholder="0"
              />
            </div>

            {dimensions.map((dim) => (
              <LineDimensionSelect
                key={dim.ShortcutDimensionNo}
                dim={dim}
                value={form.dimensions[`LineShortcutDimension${dim.ShortcutDimensionNo}Code`] ?? ""}
                onChange={handleDimensionChange}
              />
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Line")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}