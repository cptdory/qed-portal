"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestListTable } from "./request-list-table"
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
import { DimensionType, DimensionValueType, RequisitionType, SessionUser } from "@/types/bc-types"

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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchValues()
  }, [dim.DimensionCode])

  return (
    <div className="col-span-6 space-y-1">
      <Label className="text-xs font-medium text-slate-600">
        {dim.DimensionCode}
      </Label>
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

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateRequestForm>(emptyForm())
  const [dimensions, setDimensions] = useState<DimensionType[]>([])
  const [requisitionTypes, setRequisitionTypes] = useState<RequisitionType[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const data = await res.json()
        setUser(data?.user ?? null)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])
  useEffect(() => {
    if (!open) return

    const fetchDimensions = async () => {
      try {
        const res = await fetch("/api/get-visible-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _VisibleIn: "Header" }),
        })
        if (!res.ok) throw new Error("Failed to fetch dimensions")
        const data = await res.json()
        setDimensions(data.VisibleDimensions ?? [])
      } catch (err) {
        console.error(err)
      }
    }

    const fetchRequisitionTypes = async () => {
      try {
        const res = await fetch("/api/get-requisition-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ IsSubRequest: "false" }),
        })
        if (!res.ok) throw new Error("Failed to fetch requisition types")
        const data = await res.json()
        setRequisitionTypes(data.RequisitionTypes ?? [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchDimensions()
    fetchRequisitionTypes()
  }, [open])

  const handleOpen = () => {
    setForm(emptyForm())
    setError(null)
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
      setError("Request Type is required.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

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

      if (!res.ok) throw new Error("Failed to create request")

      const data = await res.json()

      if (data.Status !== "Successful") {
        setError(data.Message ?? "Failed to create request.")
        return
      }

      setOpen(false)
      router.push(`/purchase-requests/${encodeURIComponent(data.RequestNo)}`)
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
        <SiteHeader headerTitle="Purchase Requests" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-4 p-3 md:p-4 lg:p-5">

              <section className="rounded-md border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="text-xs text-slate-500">Search purchase requests</p>
                  </div>
                  <Button size="sm" onClick={handleOpen}>
                    Create Request
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
                  <div className="space-y-1 xl:col-span-2">
                    <Label className="text-xs font-medium text-slate-600">Search</Label>
                    <Input placeholder="Search request number" className="h-8 text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Status</Label>
                    <select
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      defaultValue="all"
                    >
                      <option value="all">All</option>
                      <option value="draft">Draft</option>
                      <option value="open">Open</option>
                      <option value="approved">Approved</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Request Type</Label>
                    <select
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      defaultValue="all"
                    >
                      <option value="all">All</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Location</Label>
                    <select
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      defaultValue="all"
                    >
                      <option value="all">All</option>
                      <option value="davao">DAVAO</option>
                      <option value="cebu">CEBU</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-md border bg-white p-3 shadow-sm">
                <RequestListTable />
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
              {dimensions.map((dim) => (
                <DimensionSelect
                  key={dim.ShortcutDimensionNo}
                  dim={dim}
                  value={form.dimensions[`ShortcutDimension${dim.ShortcutDimensionNo}Code`] ?? ""}
                  onChange={handleDimensionChange}
                />
              ))}

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
                {submitting ? "Creating..." : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  )
}