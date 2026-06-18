"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCallback, useRef, useState } from "react"
import { ImagePlus, Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface UploadedImage {
  file: File
  url: string
  name: string
  size: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Page() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const setFile = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file || !file.type.startsWith("image/")) return
      if (image) URL.revokeObjectURL(image.url)

      setImage({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: formatBytes(file.size),
      })
    },
    [image]
  )

  const removeImage = useCallback(() => {
    if (image) URL.revokeObjectURL(image.url)
    setImage(null)
    if (inputRef.current) inputRef.current.value = ""
  }, [image])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      setFile(e.dataTransfer.files)
    },
    [setFile]
  )

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="Create Item Request" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="space-y-4 p-4 md:p-6">

            {/* MAIN CARD */}
            <section className="rounded-md border bg-white shadow-sm">

              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <h2 className="text-sm font-semibold">Item Request Details</h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Draft
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Request No.</Label>
                      <Input value="ITMREQ000001" readOnly className="h-8 bg-slate-50 text-xs font-mono" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Part No.</Label>
                      <Input value="" className="h-8 bg-slate-50 text-xs font-mono" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Item Category</Label>
                      <select className="h-8 w-full rounded-md border px-2 text-xs">
                        <option>-- Select --</option>
                        <option>BIT - desc</option>
                        <option>COG - desc</option>
                        <option>DOW - desc</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Status</Label>
                      <Input value="Draft" readOnly className="h-8 bg-slate-50 text-xs" />
                    </div>

                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">General Description</Label>
                    <textarea className="min-h-[150px] w-full rounded-md border px-2 py-1 text-xs" />
                  </div>

                </div>

                {/* RIGHT UPLOAD */}
                <div className="space-y-2">

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Item Picture
                  </p>

                  {!image ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                      className={cn(
                        "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed",
                        isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <ImagePlus className="h-5 w-5 text-slate-400" />
                      <p className="text-xs">Click or drag & drop</p>
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border bg-slate-50 p-3">
                      <img src={image.url} className="aspect-square w-full object-contain bg-white" />

                      <p className="text-xs truncate">{image.name}</p>

                      <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                        Change
                      </Button>

                      <Button size="sm" variant="ghost" className="text-red-500" onClick={removeImage}>
                        Remove
                      </Button>

                      <div className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-[10px]">Uploaded</span>
                      </div>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files)}
                  />
                </div>

              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 rounded-md border bg-white px-4 py-3">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>

              <Button
                size="sm"
                className={cn(
                  "min-w-[120px] font-semibold",
                  submitted ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setConfirmOpen(true)}
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    Submitting
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Submitted
                  </>
                ) : (
                  <>
                    <Send className="mr-1 h-3.5 w-3.5" />
                    Submit
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>

        {/* CONFIRMATION DIALOG */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit this item request? You can still go back and edit it.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Back to Edit
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
                onClick={async () => {
                  setConfirmOpen(false)
                  await handleSubmit()
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Confirm Submit"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  )
}