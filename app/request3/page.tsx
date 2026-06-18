"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestItemsTable } from "./request-items-table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function Page() {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)

  const handleSubmit = () => {
    setConfirmOpen(false)

    // simulate submit delay
    setTimeout(() => {
      setSuccessOpen(true)
    }, 300)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="Create Request" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">

            <div className="space-y-3 p-3 md:p-4 lg:p-5">

              {/* GENERAL */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold text-slate-900">
                    General
                  </h2>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4">

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Request Type
                    </Label>
                    <select
                      defaultValue="MAINTENANCE"
                      className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs"
                    >
                      <option value="CONSUMABLES">CONSUMABLES</option>
                      <option value="FOR STOCK">FOR STOCK</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="REPAIRS">REPAIRS</option>
                      <option value="TRAVEL">TRAVEL</option>
                    </select>
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Request No.
                    </Label>
                    <Input value="REQ00000002" readOnly className="h-8 text-xs bg-slate-100" />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Warehouse Location
                    </Label>
                    <Input value="WAREHOUSE" readOnly className="h-8 text-xs bg-slate-100" />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Section Code
                    </Label>
                    <Input value="REQUEST" readOnly className="h-8 text-xs bg-slate-100" />
                  </div>

                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Request Location
                    </Label>
                    <Input value="DAVAO" readOnly className="h-8 text-xs bg-slate-100" />
                  </div>

                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Created By
                    </Label>
                    <Input value="JOHN.PALMA" readOnly className="h-8 text-xs bg-slate-100" />
                  </div>

                  <div className="col-span-12 space-y-1">
                    <Label className="text-xs text-slate-600">Remarks</Label>
                    <textarea
                      defaultValue="Scheduled Maintenance RIG24"
                      readOnly
                      className="min-h-[72px] w-full rounded-md border bg-slate-100 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </section>

              {/* STATUS */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Statuses
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4">
                  <Input value="Draft" readOnly className="h-8 text-xs bg-slate-50" />
                  <Input value="Pending" readOnly className="h-8 text-xs bg-slate-50" />
                  <Input value="Pending" readOnly className="h-8 text-xs bg-slate-50" />
                </div>
              </section>

              {/* DIMENSIONS */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Dimensions
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4">
                  <Input value="OGPI-TRUEBLUE" readOnly className="h-8 text-xs bg-slate-100" />
                  <Input value="DIDIPIO" readOnly className="h-8 text-xs bg-slate-100" />

                  <select className="h-8 w-full rounded-md border bg-white px-2 text-xs">
                    <option>Select Asset ID Code</option>
                    <option>D101</option>
                    <option>D102</option>
                    <option>D24</option>
                  </select>
                </div>
              </section>

              {/* TABLE */}
              <section className="rounded-md border bg-white p-3 shadow-sm">
                <RequestItemsTable />
              </section>

              {/* SUBMIT SECTION */}
              <div className="-mx-3 border-t bg-white/95 backdrop-blur-md px-4 py-3 shadow-md md:-mx-4 lg:-mx-5">
                <div className="flex items-center justify-between">

                  <div className="text-xs text-slate-500">
                    Review all items before submitting
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      className="h-8 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Save Draft
                    </button>

                    <Button
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                      className="h-8 px-4 text-xs font-medium"
                    >
                      Submit Request
                    </Button>

                  </div>
                </div>
              </div>

              {/* CONFIRM DIALOG */}
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                  </DialogHeader>

                  <p className="text-sm text-slate-600">
                    Are you sure you want to submit this request? You won’t be able to edit it after submission.
                  </p>

                  <DialogFooter className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button onClick={handleSubmit}>
                      Yes, Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* SUCCESS DIALOG */}
              <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Success 🎉</DialogTitle>
                  </DialogHeader>

                  <p className="text-sm text-slate-600">
                    Your request has been submitted successfully.
                  </p>

                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setSuccessOpen(false)}>
                      Back to Purchase Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}