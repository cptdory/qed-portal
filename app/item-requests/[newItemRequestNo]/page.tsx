"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImagePlus, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

const EDITABLE_STATUSES = ["Draft"]

interface ItemRequest {
  newItemRequestNo: string
  no: string
  status: string
  description: string
  baseUnitOfMeasure: string
  itemCategoryCode: string
  createdBy: string
  partNo: string
  picture?: string
}

export default function Page() {
  const { newItemRequestNo } = useParams<{ newItemRequestNo: string }>()
  const router = useRouter()

  const [item, setItem] = useState<ItemRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // editable field state
  const [noValue, setNoValue] = useState("")
  const [descriptionValue, setDescriptionValue] = useState("")
  const [baseUnitOfMeasureValue, setBaseUnitOfMeasureValue] = useState("")
  const [itemCategoryCodeValue, setItemCategoryCodeValue] = useState("")
  const [partNoValue, setPartNoValue] = useState("")
  const [pictureBase64, setPictureBase64] = useState<string | undefined>(undefined)
  const [picturePreview, setPicturePreview] = useState<string | undefined>(undefined)

  // dropdown options
  const [itemCategories, setItemCategories] = useState<{ Code: string; Description: string }[]>([])
  const [baseUnitOfMeasures, setBaseUnitOfMeasures] = useState<{ Code: string; Description: string }[]>([])

  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditable = !!item && EDITABLE_STATUSES.includes(item.status ?? "")

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/get-new-item-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NewItemRequestNo: decodeURIComponent(newItemRequestNo) }),
      })

      const result = await res.json()

      if (result?.Status !== "Successful") {
        setError(result?.Message ?? "Failed to load item request.")
        return
      }

      const i = result.Item
      const parsedItem: ItemRequest = {
        newItemRequestNo: i.NewItemRequestNo,
        no: i.No,
        status: i.ItemRequestStatus,
        description: i.Description,
        baseUnitOfMeasure: i.BaseUnitOfMeasure,
        itemCategoryCode: i.ItemCategoryCode,
        createdBy: i.CreatedBy,
        partNo: i.PartNo,
        picture: i.Picture ? `data:image/png;base64,${i.Picture}` : undefined,
      }

      setItem(parsedItem)
      setNoValue(parsedItem.no ?? "")
      setDescriptionValue(parsedItem.description ?? "")
      setBaseUnitOfMeasureValue(parsedItem.baseUnitOfMeasure ?? "")
      setItemCategoryCodeValue(parsedItem.itemCategoryCode ?? "")
      setPartNoValue(parsedItem.partNo ?? "")
      setPictureBase64(i.Picture ?? undefined)
      setPicturePreview(parsedItem.picture)
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [newItemRequestNo])

  useEffect(() => {
    if (newItemRequestNo) fetchItem()
  }, [newItemRequestNo, fetchItem])

  // load dropdown options, same as create page
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

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] // strip data:image/...;base64,
      setPictureBase64(base64)
      setPicturePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!item || !isEditable) return

    try {
      setSaving(true)

      const res = await fetch("/api/update-new-item-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          No: noValue,
          NewItemRequestNo: item.newItemRequestNo,
          Description: descriptionValue,
          BaseUnitOfMeasure: baseUnitOfMeasureValue,
          ItemCategoryCode: itemCategoryCodeValue,
          PartNo: partNoValue,
          PictureBase64: pictureBase64,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || "Failed to update item request."
        sileo.error({ title: `Failed to Update — ${message}`, fill: "#171717" })
        return
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to update item request."
        sileo.error({ title: `Failed to Update — ${message}`, fill: "#171717" })
        return
      }

      sileo.success({ title: "Item request updated successfully.", fill: "#171717" })
      await fetchItem()
    } catch (err) {
      sileo.error({ title: "Failed to Update — An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!item || !isEditable) return

    const confirmed = window.confirm(
      "Once submitted, this item request can no longer be updated. Are you sure you want to submit it?"
    )
    if (!confirmed) return

    try {
      setSubmitting(true)

      const res = await fetch("/api/submit-new-item-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          No: noValue,
          NewItemRequestNo: item.newItemRequestNo,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || "Failed to submit item request."
        sileo.error({ title: `Submit Failed — ${message}`, fill: "#171717" })
        return
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to submit item request."
        sileo.error({ title: `Submit Failed — ${message}`, fill: "#171717" })
        return
      }

      sileo.success({ title: "Item request submitted successfully.", fill: "#171717" })
      await fetchItem()
    } catch (err) {
      sileo.error({ title: "Submit Failed — An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader headerTitle="Item Request" />
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs">Loading item request...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !item) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader headerTitle="Item Request" />
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <p className="text-sm text-red-500">{error ?? "Item request not found."}</p>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader headerTitle="Item Request" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="space-y-4 p-4 md:p-6">

            {/* MAIN CARD */}
            <section className="rounded-md border bg-white shadow-sm">

              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-slate-500"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Button>
                  <span className="text-sm font-semibold text-slate-800">
                    {item.newItemRequestNo}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditable && (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={saving || submitting}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSubmit}
                        disabled={saving || submitting}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </Button>
                    </>
                  )}
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    item.status === "Draft" && "bg-amber-100 text-amber-700",
                    item.status === "Approved" && "bg-emerald-100 text-emerald-700",
                    item.status === "Rejected" && "bg-red-100 text-red-700",
                    item.status === "Pending Approval" && "bg-orange-100 text-orange-700",
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">

                {/* LEFT — Fields */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Request No.</Label>
                      <Input
                        value={item.newItemRequestNo}
                        readOnly
                        className="h-8 bg-slate-50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">No.</Label>
                      <Input
                        value={isEditable ? noValue : item.no}
                        readOnly
                        onChange={(e) => setNoValue(e.target.value)}
                        className={cn("h-8 text-xs font-mono", isEditable ? "bg-white" : "bg-slate-50")}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Part No.</Label>
                      <Input
                        value={isEditable ? partNoValue : item.partNo}
                        readOnly={!isEditable}
                        onChange={(e) => setPartNoValue(e.target.value)}
                        className={cn("h-8 text-xs", isEditable ? "bg-white" : "bg-slate-50")}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Base Unit of Measure</Label>
                      {isEditable ? (
                        <select
                          value={baseUnitOfMeasureValue}
                          onChange={(e) => setBaseUnitOfMeasureValue(e.target.value)}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        >
                          <option value="">Select unit...</option>
                          {baseUnitOfMeasures.map((uom) => (
                            <option key={uom.Code} value={uom.Code}>
                              {uom.Code}{uom.Description ? ` - ${uom.Description}` : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          value={item.baseUnitOfMeasure}
                          readOnly
                          className="h-8 bg-slate-50 text-xs"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Item Category</Label>
                      {isEditable ? (
                        <select
                          value={itemCategoryCodeValue}
                          onChange={(e) => setItemCategoryCodeValue(e.target.value)}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        >
                          <option value="">Select category...</option>
                          {itemCategories.map((cat) => (
                            <option key={cat.Code} value={cat.Code}>
                              {cat.Code}{cat.Description ? ` - ${cat.Description}` : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          value={item.itemCategoryCode}
                          readOnly
                          className="h-8 bg-slate-50 text-xs"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Created By</Label>
                      <Input
                        value={item.createdBy}
                        readOnly
                        className="h-8 bg-slate-50 text-xs"
                      />
                    </div>

                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Description</Label>
                    <textarea
                      value={isEditable ? descriptionValue : item.description}
                      readOnly={!isEditable}
                      onChange={(e) => setDescriptionValue(e.target.value)}
                      className={cn(
                        "min-h-[100px] w-full rounded-md border px-2 py-1 text-xs text-slate-700",
                        isEditable ? "bg-white" : "bg-slate-50"
                      )}
                    />
                  </div>
                </div>

                {/* RIGHT — Picture */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Item Picture
                  </p>

                  {picturePreview ? (
                    <div className="rounded-md border bg-slate-50 p-3">
                      <img
                        src={picturePreview}
                        alt="Item"
                        className="aspect-square w-full rounded-md object-contain bg-white"
                      />
                      <div className="mt-2 flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-[10px]">Picture available</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => isEditable && fileInputRef.current?.click()}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-200 bg-slate-50",
                        isEditable && "cursor-pointer hover:border-slate-300"
                      )}
                    >
                      <ImagePlus className="h-5 w-5 text-slate-300" />
                      <p className="text-xs text-slate-400">No picture uploaded</p>
                    </div>
                  )}

                  {isEditable && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {picturePreview ? "Change Picture" : "Upload Picture"}
                      </Button>
                    </>
                  )}
                </div>

              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 rounded-md border bg-white px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                Back
              </Button>
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}