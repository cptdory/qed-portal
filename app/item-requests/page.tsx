"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ColumnDef,
  FilterFn,
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
  ImageIcon,
  PackageSearch,
  Plus,
  Search,
  XCircle,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

/* ----------------------------------------------------------------------- */
/*  Types                                                                   */
/* ----------------------------------------------------------------------- */

interface CreateItemRequestForm {
  No: string
  Description: string
  BaseUnitOfMeasure: string
  ItemCategoryCode: string
  PartNo: string
  PictureBase64: string
  PicturePreview: string
}

export interface ItemRequestList {
  requestNo: string
  newItemRequestNo: string
  description: string
  itemCategory: string
  picture?: string
  status: string
  requestedBy: string
  partNo: string
  baseUnitOfMeasure: string
}

const emptyForm = (): CreateItemRequestForm => ({
  No: "",
  Description: "",
  BaseUnitOfMeasure: "",
  ItemCategoryCode: "",
  PartNo: "",
  PictureBase64: "",
  PicturePreview: "",
})

/* ----------------------------------------------------------------------- */
/*  Status badge helper                                                     */
/* ----------------------------------------------------------------------- */

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <BadgeCheck className="mr-1 h-3 w-3" /> Approved
        </Badge>
      )
    case "Pending Approval":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50">
          <Clock3 className="mr-1 h-3 w-3" /> Pending Approval
        </Badge>
      )
    case "Rejected":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
          <XCircle className="mr-1 h-3 w-3" /> Rejected
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">
          <FileEdit className="mr-1 h-3 w-3" /> Draft
        </Badge>
      )
  }
}

/* ----------------------------------------------------------------------- */
/*  Global filter — powers the "Search" box using TanStack Table            */
/* ----------------------------------------------------------------------- */

const itemRequestGlobalFilter: FilterFn<ItemRequestList> = (row, _columnId, filterValue) => {
  const search = String(filterValue ?? "").trim().toLowerCase()
  if (!search) return true

  const haystack = [
    row.original.requestNo,
    row.original.newItemRequestNo,
    row.original.description,
    row.original.itemCategory,
    row.original.partNo,
    row.original.status,
    row.original.requestedBy,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(search)
}

/* ----------------------------------------------------------------------- */
/*  Item request table                                                      */
/* ----------------------------------------------------------------------- */

function ItemRequestListTable({
  refreshKey,
  searchQuery,
}: {
  refreshKey: number
  searchQuery: string
}) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [data, setData] = useState<ItemRequestList[]>([])
  const [loading, setLoading] = useState(false)

  // Step 1: Fetch user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const json = await res.json()
        setUserId(json?.user?.UserId ?? null)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])

  // Step 2: Fetch item requests after userId is set (and whenever refreshKey changes)
  useEffect(() => {
    if (!userId) return

    const fetchItemRequests = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/get-new-item-request-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CreatedBy: userId }),
        })

        const result = await res.json()

        if (result?.Status !== "Successful") return

        const mapped: ItemRequestList[] = (result.Items ?? []).map((item: any) => ({
          requestNo: item.No,
          newItemRequestNo: item.NewItemRequestNo,
          description: item.Description,
          itemCategory: item.ItemCategoryCode,
          partNo: item.PartNo,
          baseUnitOfMeasure: item.BaseUnitOfMeasure,
          status: item.ItemRequestStatus,
          requestedBy: item.CreatedBy,
          picture: item.Picture ? `data:image/png;base64,${item.Picture}` : undefined,
        }))

        setData(mapped)
      } catch (error) {
        console.error("Error fetching item requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItemRequests()
  }, [userId, refreshKey])

  const columns = useMemo<ColumnDef<ItemRequestList>[]>(
    () => [
      {
        accessorKey: "requestNo",
        header: "Item Request No.",
        cell: ({ row }) => (
          <div>
            <p className="text-xs font-semibold text-blue-600">{row.getValue("requestNo")}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{row.original.newItemRequestNo}</p>
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
                  unoptimized
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
            <p className="line-clamp-2 text-xs text-slate-700">{row.getValue("description")}</p>
            <p className="mt-1 text-[11px] text-slate-500">Requested by {row.original.requestedBy}</p>
          </div>
        ),
      },
      {
        accessorKey: "itemCategory",
        header: "Item Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            <PackageSearch className="mr-1 h-3 w-3" />
            {row.getValue("itemCategory") || "-"}
          </Badge>
        ),
      },
      {
        accessorKey: "partNo",
        header: "Part No.",
        cell: ({ row }) => <p className="text-xs text-slate-700">{row.getValue("partNo") || "-"}</p>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
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
              onClick={() => router.push(`/item-requests/${encodeURIComponent(row.original.newItemRequestNo)}`)}
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
          </div>
        ),
      },
    ],
    [router]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: searchQuery,
    },
    globalFilterFn: itemRequestGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-center align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-slate-500">
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

/* ----------------------------------------------------------------------- */
/*  Page                                                                     */
/* ----------------------------------------------------------------------- */

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateItemRequestForm>(emptyForm())
  const [itemCategories, setItemCategories] = useState<{ Code: string; Description: string }[]>([])
  const [baseUnitOfMeasures, setBaseUnitOfMeasures] = useState<{ Code: string; Description: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const json = await res.json()
        setUserId(json?.user?.UserId ?? null)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])

  const handleOpen = () => {
    setForm(emptyForm())
    setError(null)
    setOpen(true)
  }

  useEffect(() => {
    const fetchBaseUnitOfMeasures = async () => {
      try {
        const res = await fetch("/api/get-base-unit-of-measure")
        const data = await res.json()
        setBaseUnitOfMeasures(data?.BaseUnitOfMeasures ?? [])
      } catch (err) {
        console.error("Failed to fetch base unit of measures:", err)
      }
    }
    fetchBaseUnitOfMeasures()
  }, [])

  useEffect(() => {
    const fetchItemCategories = async () => {
      try {
        const res = await fetch("/api/get-item-categories")
        const data = await res.json()
        setItemCategories(data?.ItemCategories ?? [])
      } catch (err) {
        console.error("Failed to fetch item categories:", err)
      }
    }
    fetchItemCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] // strip data:image/...;base64,
      setForm((prev) => ({
        ...prev,
        PictureBase64: base64,
        PicturePreview: result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.No) {
      setError("No. is required.")
      return
    }

    if (!userId) {
      setError("User session not found.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const res = await fetch("/api/create-new-item-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          No: form.No,
          CreatedBy: userId,
          Description: form.Description,
          BaseUnitOfMeasure: form.BaseUnitOfMeasure,
          ItemCategoryCode: form.ItemCategoryCode,
          PartNo: form.PartNo,
          PictureBase64: form.PictureBase64,
        }),
      })

      const result = await res.json()

      if (result?.Status !== "Successful") {
        setError(result?.Message ?? "Failed to create item request.")
        return
      }

      setOpen(false)
      setRefreshKey((k) => k + 1) // ✅ Trigger table refresh
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="New Item Request" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-4 p-3 md:p-4 lg:p-5">

              {/* Table */}
              <section className="rounded-md border bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="Search by no., description, category, status…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <Button size="sm" onClick={handleOpen} className="shrink-0">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Create Item Request
                  </Button>
                </div>

                {/* Table Content */}
                <div className="overflow-hidden">
                  <ItemRequestListTable refreshKey={refreshKey} searchQuery={searchQuery} />
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold text-slate-900">
                Create Item Request
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Fill in the details to submit a new item request.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">

              {/* Picture Upload */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-600">Picture</Label>
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-6 transition hover:border-slate-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.PicturePreview ? (
                    <Image
                      src={form.PicturePreview}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md object-cover"
                      unoptimized
                    />
                  ) : (
                    <>
                      <ImageIcon className="mb-2 h-8 w-8 text-slate-300" />
                      <p className="text-xs text-slate-400">Click to upload image</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {form.PicturePreview && (
                  <button
                    className="text-[11px] text-slate-400 underline hover:text-slate-600"
                    onClick={() => setForm((prev) => ({ ...prev, PictureBase64: "", PicturePreview: "" }))}
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* No. */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-600">
                  No. <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.No}
                  onChange={(e) => setForm((prev) => ({ ...prev, No: e.target.value }))}
                  placeholder="e.g. SAMPLE001"
                  className="h-8 text-xs"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-600">Description</Label>
                <Input
                  value={form.Description}
                  onChange={(e) => setForm((prev) => ({ ...prev, Description: e.target.value }))}
                  placeholder="Enter description"
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Base Unit of Measure */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-slate-600">Base Unit of Measure</Label>
                  <select
                    value={form.BaseUnitOfMeasure}
                    onChange={(e) => setForm((prev) => ({ ...prev, BaseUnitOfMeasure: e.target.value }))}
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  >
                    <option value="">Select unit...</option>
                    {baseUnitOfMeasures.map((uom) => (
                      <option key={uom.Code} value={uom.Code}>
                        {uom.Code}{uom.Description ? ` - ${uom.Description}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Category Code */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-slate-600">Item Category Code</Label>
                  <select
                    value={form.ItemCategoryCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, ItemCategoryCode: e.target.value }))}
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  >
                    <option value="">Select category...</option>
                    {itemCategories.map((cat) => (
                      <option key={cat.Code} value={cat.Code}>
                        {cat.Code}{cat.Description ? ` - ${cat.Description}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Part No. */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-600">Part No.</Label>
                <Input
                  value={form.PartNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, PartNo: e.target.value }))}
                  placeholder="Enter part number"
                  className="h-8 text-xs"
                />
              </div>

            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  )
}