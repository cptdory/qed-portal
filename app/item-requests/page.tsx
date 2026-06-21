"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ItemRequestListTable } from "./item-request-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateItemRequestForm {
  No: string
  Description: string
  BaseUnitOfMeasure: string
  ItemCategoryCode: string
  PartNo: string
  PictureBase64: string
  PicturePreview: string
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

export default function Page() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateItemRequestForm>(emptyForm())
  const [itemCategories, setItemCategories] = useState<{ Code: string; Description: string }[]>([])
  const [baseUnitOfMeasures, setBaseUnitOfMeasures] = useState<{ Code: string; Description: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

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

              {/* Header */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="text-xs text-slate-500">Search Item requests</p>
                  </div>
                  <Button size="sm" onClick={handleOpen}>
                    Create Item Request
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
                  <div className="space-y-1 xl:col-span-2">
                    <Label className="text-xs font-medium text-slate-600">Search</Label>
                    <Input placeholder="Search item request number" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Status</Label>
                    <select
                      defaultValue="all"
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    >
                      <option value="all">All</option>
                      <option value="draft">Draft</option>
                      <option value="open">Open</option>
                      <option value="approved">Approved</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Table */}
              <section className="rounded-md border bg-white p-3 shadow-sm">
                <ItemRequestListTable key={refreshKey} />
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