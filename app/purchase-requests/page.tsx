"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  BadgeCheck,
  Clock3,
  Eye,
  FileEdit,
  XCircle,
  Plus,
  Search,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { sileo } from "sileo"

import { DimensionType, DimensionValueType, RequestType, RequisitionType, SessionUser } from "@/types/bc-types"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RequestList {
  requestType: string
  requestNo: string
  description: string
  status: string
  sectionCode: string
  requestedBy: string
  dateRequested: string
  ShortcutDimension1Code: string
  ShortcutDimension2Code: string
  ShortcutDimension3Code: string
  ShortcutDimension4Code: string
  ShortcutDimension5Code: string
  ShortcutDimension6Code: string
  ShortcutDimension7Code: string
  ShortcutDimension8Code: string
}

interface CreateRequestForm {
  requestType: string
  description: string
  dimensions: Record<string, string>
}

const emptyForm = (): CreateRequestForm => ({
  requestType: "",
  description: "",
  dimensions: {
    ShortcutDimension1Code: "",
    ShortcutDimension2Code: "",
    ShortcutDimension3Code: "",
    ShortcutDimension4Code: "",
    ShortcutDimension5Code: "",
    ShortcutDimension6Code: "",
    ShortcutDimension7Code: "",
    ShortcutDimension8Code: "",
  },
})

// ─── Status Badge ─────────────────────────────────────────────────────────────

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "Entered":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Entered
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
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">
          <FileEdit className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      )
  }
}

// ─── Dimension Select (for Create Dialog) ────────────────────────────────────

function DimensionSelect({
  dim,
  value,
  onChange,
}: {
  dim: DimensionType
  value: string
  onChange: (key: string, value: string) => void
}) {
  const key = `ShortcutDimension${dim.ShortcutDimensionNo}Code`
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
        sileo.error({ title: `Failed to Load Values — Could not load values for ${dim.DimensionCode}.`, fill: "#171717" })
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

// ─── Base Table Columns ───────────────────────────────────────────────────────

const baseColumns: ColumnDef<RequestList>[] = [
  {
    accessorKey: "requestNo",
    header: "Request No.",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-semibold text-blue-600">{row.getValue("requestNo")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{row.original.dateRequested}</p>
      </div>
    ),
  },
  {
    accessorKey: "requestType",
    header: "Request Type",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-medium text-slate-800">{row.getValue("requestType")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{row.original.sectionCode}</p>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[320px]">
        <p className="truncate text-xs text-slate-700">{row.getValue("description")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Requested by {row.original.requestedBy || "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
  },
]

// ─── Actions Cell ─────────────────────────────────────────────────────────────

function ActionsCell({ row, onView }: { row: Row<RequestList>; onView: (requestNo: string) => void }) {
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900"
        onClick={() => onView(row.original.requestNo)}
      >
        <Eye className="mr-1 h-4 w-4" />
        View
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const router = useRouter()

  // Session
  const [user, setUser] = useState<SessionUser | null>(null)

  // Table state
  const [requests, setRequests] = useState<RequestType[]>([])
  const [visibleDimensions, setVisibleDimensions] = useState<DimensionType[]>([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")

  // Create dialog state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateRequestForm>(emptyForm())
  const [dialogDimensions, setDialogDimensions] = useState<DimensionType[]>([])
  const [requisitionTypes, setRequisitionTypes] = useState<RequisitionType[]>([])
  const [submitting, setSubmitting] = useState(false)

  // ── Fetch session user ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user ?? null)
      } catch {
        sileo.error({ title: "Session Error — Could not load your session. Please refresh.", fill: "#171717" })
      }
    }
    fetchMe()
  }, [])

  // ── Fetch table data once user is ready ────────────────────────────────────
  useEffect(() => {
    if (!user) return

    const fetchVisibleDimensions = async () => {
      try {
        const res = await fetch("/api/get-visible-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _VisibleIn: "Header" }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setVisibleDimensions(data.VisibleDimensions ?? [])
      } catch {
        sileo.error({ title: "Failed to Load Dimensions — Could not load visible dimensions.", fill: "#171717" })
      }
    }

    const fetchRequestList = async () => {
      try {
        setLoadingTable(true)
        const res = await fetch("/api/get-request-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserName: user.UserId, LocationCode: '' }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setRequests(data.Requests ?? [])
      } catch {
        sileo.error({ title: "Failed to Load Requests — Could not fetch the request list.", fill: "#171717" })
      } finally {
        setLoadingTable(false)
      }
    }

    fetchVisibleDimensions()
    fetchRequestList()
  }, [user])

  // ── Fetch dialog data when dialog opens ────────────────────────────────────
  useEffect(() => {
    if (!open) return

    const fetchDialogDimensions = async () => {
      try {
        const res = await fetch("/api/get-visible-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _VisibleIn: "Header" }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setDialogDimensions(data.VisibleDimensions ?? [])
      } catch {
        sileo.error({ title: "Failed to Load Dimensions — Could not load visible dimensions.", fill: "#171717" })
      }
    }

    const fetchRequisitionTypes = async () => {
      try {
        const res = await fetch("/api/get-requisition-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ IsSubRequest: "false" }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setRequisitionTypes(data.RequisitionTypes ?? [])
      } catch {
        sileo.error({ title: "Failed to Load Requisition Types — Could not load available requisition types.", fill: "#171717" })
      }
    }

    fetchDialogDimensions()
    fetchRequisitionTypes()
  }, [open])

  // ── Dialog handlers ────────────────────────────────────────────────────────
  const handleOpen = () => {
    setForm(emptyForm())
    setOpen(true)
  }

  const handleDimensionChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }))
  }

  const handleSubmit = async () => {
    if (!form.requestType) {
      sileo.error({ title: "Validation Error — Request Type is required.", fill: "#171717" })
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch("/api/create-request-header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RequestType: form.requestType,
          Description: form.description,
          CreatedBy: user?.UserId ?? "",
          ...form.dimensions,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || "Failed to create request."
        sileo.error({ title: `Failed to Create Request — ${message}`, fill: "#171717" })
        return
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to create request."
        sileo.error({ title: `Failed to Create Request — ${message}`, fill: "#171717" })
        return
      }

      sileo.success({ title: "Request created successfully.", fill: "#171717" })
      setOpen(false)
      router.push(`/purchase-requests/${encodeURIComponent(data.RequestNo)}`)
    } catch {
      sileo.error({ title: "Failed to Create Request — An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Table setup ────────────────────────────────────────────────────────────
  const handleView = (requestNo: string) => {
    router.push(`/purchase-requests/${encodeURIComponent(requestNo)}`)
  }

  const dynamicDimensionColumns = useMemo((): ColumnDef<RequestList>[] => {
    return visibleDimensions.map((dim) => ({
      accessorKey: `ShortcutDimension${dim.ShortcutDimensionNo}Code` as keyof RequestList,
      header: dim.DimensionCode,
      cell: ({ row }: { row: Row<RequestList> }) => (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
          {(row.getValue(`ShortcutDimension${dim.ShortcutDimensionNo}Code`) as string) || "-"}
        </Badge>
      ),
    }))
  }, [visibleDimensions])

  const actionsColumn: ColumnDef<RequestList> = useMemo(() => ({
    id: "actions",
    header: () => <div className="text-right" />,
    cell: ({ row }) => <ActionsCell row={row} onView={handleView} />,
  }), [])

  const allColumns = useMemo((): ColumnDef<RequestList>[] => {
    return [...baseColumns, ...dynamicDimensionColumns, actionsColumn]
  }, [dynamicDimensionColumns, actionsColumn])

  const tableData: RequestList[] = useMemo(
    () =>
      requests.map((item) => ({
        requestType: item.RequestType,
        requestNo: item.RequestNo,
        description: item.Description,
        status: item.RequestStatus,
        sectionCode: item.SectionCode,
        requestedBy: item.RequestedBy,
        dateRequested: "",
        ShortcutDimension1Code: item.ShortcutDimension1Code ?? "",
        ShortcutDimension2Code: item.ShortcutDimension2Code ?? "",
        ShortcutDimension3Code: item.ShortcutDimension3Code ?? "",
        ShortcutDimension4Code: item.ShortcutDimension4Code ?? "",
        ShortcutDimension5Code: item.ShortcutDimension5Code ?? "",
        ShortcutDimension6Code: item.ShortcutDimension6Code ?? "",
        ShortcutDimension7Code: item.ShortcutDimension7Code ?? "",
        ShortcutDimension8Code: item.ShortcutDimension8Code ?? "",
      })),
    [requests]
  )

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="Purchase Requests" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-4 p-3 md:p-4 lg:p-5">

              <section className="rounded-md border bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="Search by request no., type, description…"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <Button size="sm" onClick={handleOpen} className="shrink-0">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Create Request
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b bg-slate-50 hover:bg-slate-50">
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className={`h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${
                                header.column.id === "actions" ? "text-right" : "text-left"
                              }`}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>

                    <TableBody>
                      {loadingTable ? (
                        <TableRow>
                          <TableCell colSpan={allColumns.length} className="h-24 text-center text-sm text-slate-500">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="px-4 py-3 align-middle">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={allColumns.length} className="h-24 text-center text-sm text-slate-500">
                            {globalFilter ? `No results for "${globalFilter}".` : "No requests found."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Footer count */}
                {!loadingTable && tableData.length > 0 && (
                  <div className="border-t px-4 py-2">
                    <p className="text-[11px] text-slate-400">
                      {table.getRowModel().rows.length} of {tableData.length} request{tableData.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>

        {/* Create Request Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold text-slate-900">
                Create Request
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Fill in the details below to create a new purchase request.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-12 gap-4 py-2">
              {/* Request Type */}
              <div className="col-span-6 space-y-1">
                <Label className="text-xs font-medium text-slate-600">
                  Request Type <span className="text-red-500">*</span>
                </Label>
                <select
                  value={form.requestType}
                  onChange={(e) => setForm((prev) => ({ ...prev, requestType: e.target.value }))}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                >
                  <option value="">Select type...</option>
                  {requisitionTypes.map((rt) => (
                    <option key={rt.Code} value={rt.Code}>
                      {rt.Code}{rt.Description ? ` — ${rt.Description}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="col-span-12 space-y-1">
                <Label className="text-xs font-medium text-slate-600">Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter request description..."
                  className="min-h-[72px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              {/* Dynamic Dimension Selects */}
              {dialogDimensions.map((dim) => (
                <DimensionSelect
                  key={dim.ShortcutDimensionNo}
                  dim={dim}
                  value={form.dimensions[`ShortcutDimension${dim.ShortcutDimensionNo}Code`] ?? ""}
                  onChange={handleDimensionChange}
                />
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  )
}