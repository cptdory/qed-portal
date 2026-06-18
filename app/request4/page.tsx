"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestItemsTable } from "./request-items-table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { HandHelping } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const receiveItems = [
  {
    lineNo: 10000,
    no: "EQM-8838",
    description: "(GEARSE CUP HEAD SC120-20)",
    uom: "PCS",
    requestedQty: 20,
    receivedQty: 0,
  },
  {
    lineNo: 20000,
    no: "EQM-8841",
    description: "(TURBO GP-CAT 10R2622)",
    uom: "PCS",
    requestedQty: 15,
    receivedQty: 0,
  },
  {
    lineNo: 30000,
    no: "EQM-8848",
    description: "(FI PUMP 3973900)",
    uom: "PCS",
    requestedQty: 30,
    receivedQty: 0,
  },
  {
    lineNo: 40000,
    no: "EQR-8522",
    description: "(FMC 305 KEY 50 X 12 X 8 (ITEM#21))",
    uom: "PCS",
    requestedQty: 45,
    receivedQty: 0,
  },
  {
    lineNo: 50000,
    no: "EQR-8523",
    description: "(P/N 1101419 Valve Ball)",
    uom: "PCS",
    requestedQty: 50,
    receivedQty: 0,
  },
  {
    lineNo: 60000,
    no: "EQR-8524",
    description: "(FMC 305 BEARING RETAINER (ITEM#10))",
    uom: "PCS",
    requestedQty: 8,
    receivedQty: 0,
  },
]

export default function Page() {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [receiveOpen, setReceiveOpen] = React.useState(false)
  const [confirmReceiveOpen, setConfirmReceiveOpen] = React.useState(false)

  const handleSubmit = () => {
    setConfirmOpen(false)

    setTimeout(() => {
      setSuccessOpen(true)
    }, 300)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="MAINTENANCE - REQ00000002" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">

            <div className="space-y-3 p-3 md:p-4 lg:p-5">

              {/* GENERAL */}
              <section className="rounded-md border bg-white shadow-sm">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-2">

                  <h2 className="text-sm font-semibold text-slate-900">
                    General
                  </h2>

                  {/* Action Button */}
                  <Button
                    type="button"
                    onClick={() => setReceiveOpen(true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3  font-medium transition-colors"
                  >
                    <HandHelping className="h-3.5 w-3.5" />
                    <span>Receive Requested Items</span>
                  </Button>

                </div>

                {/* Content */}
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
                    <Input
                      value="REQ00000002"
                      readOnly
                      className="h-8 text-xs bg-slate-100"
                    />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Warehouse Location
                    </Label>
                    <Input
                      value="WAREHOUSE"
                      readOnly
                      className="h-8 text-xs bg-slate-100"
                    />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Section Code
                    </Label>
                    <Input
                      value="REQUEST"
                      readOnly
                      className="h-8 text-xs bg-slate-100"
                    />
                  </div>

                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Request Location
                    </Label>
                    <Input
                      value="DAVAO"
                      readOnly
                      className="h-8 text-xs bg-slate-100"
                    />
                  </div>

                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Created By
                    </Label>
                    <Input
                      value="JOHN.PALMA"
                      readOnly
                      className="h-8 text-xs bg-slate-100"
                    />
                  </div>

                  <div className="col-span-12 space-y-1">
                    <Label className="text-xs text-slate-600">
                      Remarks
                    </Label>

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

                  {/* Request Status */}
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">
                      Request Status
                    </Label>
                    <Input
                      value="Approved"
                      readOnly
                      className="h-8 text-xs bg-slate-50"
                    />
                  </div>

                  {/* Warehouse Status */}
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">
                      Warehouse Status
                    </Label>
                    <Input
                      value="To Process"
                      readOnly
                      className="h-8 text-xs bg-slate-50"
                    />
                  </div>

                  {/* Purchase Status */}
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">
                      Purchase Status
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 text-xs bg-slate-50"
                    />
                  </div>

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
                  <Input
                    value="OGPI-TRUEBLUE"
                    readOnly
                    className="h-8 text-xs bg-slate-100"
                  />

                  <Input
                    value="DIDIPIO"
                    readOnly
                    className="h-8 text-xs bg-slate-100"
                  />

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

              {/* RECEIVE ITEMS DIALOG */}
              <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
                <DialogContent className="!w-[98vw] !max-w-[1000px] p-5">

                  <DialogHeader>
                    <DialogTitle className="text-sm font-semibold">
                      Receive Requested Items
                    </DialogTitle>
                  </DialogHeader>

                  {/* TOP CONTROLS */}
                  <div className="flex items-end gap-2">

                    <div className="w-full space-y-1">
                      <Label className="text-xs font-medium text-slate-600">
                        Document Issuance No.
                      </Label>

                      <Input
                        placeholder="Enter document issuance no."
                        className="h-8 text-xs"
                      />
                    </div>

                    <Button
                      type="button"
                      className="h-8 px-4 text-xs"
                    >
                      Enter
                    </Button>

                  </div>

                  {/* SINGLE INSTRUCTION CONTAINER */}
                  <div className="rounded-md border bg-slate-50 p-3 space-y-2">

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                      <p>
                        Enter or select the <span className="font-semibold">Document Issuance No.</span> to automatically load issued items and quantities.
                      </p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                      <p>
                        Verify the loaded data and adjust <span className="font-semibold">Received Quantity</span> if it differs from actual issued quantity before confirming.
                      </p>
                    </div>

                  </div>

                  {/* TABLE */}
                  <div className="overflow-hidden rounded-md border bg-white">

                    <table className="w-full border-collapse text-xs">

                      <thead className="bg-slate-50">
                        <tr className="border-b">

                          <th className="w-10 px-3 py-2 text-center">

                          </th>

                          <th className="px-3 py-2 text-left font-medium text-slate-600">
                            Line No
                          </th>

                          <th className="px-3 py-2 text-left font-medium text-slate-600">
                            No.
                          </th>

                          <th className="px-3 py-2 text-left font-medium text-slate-600">
                            Description
                          </th>

                          <th className="px-3 py-2 text-center font-medium text-slate-600">
                            UOM
                          </th>

                          <th className="px-3 py-2 text-right font-medium text-slate-600">
                            Requested Qty
                          </th>

                          <th className="px-3 py-2 text-right font-medium text-slate-600">
                            Received Qty
                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        {receiveItems.map((item) => (
                          <tr
                            key={item.lineNo}
                            className="border-b last:border-0 hover:bg-slate-50"
                          >

                            <td className="px-3 py-3 text-center">
                              <div className="flex justify-center">
                                <Checkbox className="h-5 w-5 border-2 border-slate-500 shadow-sm hover:border-blue-500 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                              </div>
                            </td>

                            <td className="px-3 py-3 text-slate-700">
                              {item.lineNo}
                            </td>

                            <td className="px-3 py-3 font-medium text-blue-600">
                              {item.no}
                            </td>

                            <td className="px-3 py-3 text-slate-600">
                              {item.description}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {item.uom}
                            </td>

                            <td className="px-3 py-3 text-right font-medium">
                              {item.requestedQty}
                            </td>

                            <td className="px-3 py-3 text-right">
                              <Input className="h-8 w-24 text-right text-xs" />
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>

                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end gap-2 pt-2">

                    <Button
                      variant="outline"
                      onClick={() => setReceiveOpen(false)}
                      className="h-8 text-xs"
                    >
                      Cancel
                    </Button>

                    <Button
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                      onClick={() => setConfirmReceiveOpen(true)}
                    >
                      Confirm Receive
                    </Button>

                  </div>

                </DialogContent>
              </Dialog>
              {/* CONFIRM DIALOG */}
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                  </DialogHeader>

                  <p className="text-sm text-slate-600">
                    Are you sure you want to submit this request?
                    You won’t be able to edit it after submission.
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
              <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
                <DialogContent className="sm:max-w-md">

                  <DialogHeader>
                    <DialogTitle>Confirm Receipt</DialogTitle>
                  </DialogHeader>

                  <div className="text-sm text-slate-600 space-y-2">
                    <p>
                      Are you sure you want to confirm receiving these items?
                    </p>

                    <p className="text-xs text-amber-600">
                      You can still go back if you need to adjust quantities.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">

                    <Button
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setConfirmReceiveOpen(false)}
                    >
                      Go Back
                    </Button>

                    <Button
                      className="h-8 text-xs"
                      onClick={() => {
                        setConfirmReceiveOpen(false)
                        setReceiveOpen(false)
                      }}
                    >
                      Yes, Confirm
                    </Button>

                  </div>

                </DialogContent>
              </Dialog>
              {/* SUCCESS DIALOG */}
              <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent>

                  <DialogHeader>
                    <DialogTitle>
                      Success 🎉
                    </DialogTitle>
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

              {/* SUBMIT BAR */}
              <div className="-mx-3 border-t bg-white/95 px-4 py-3 shadow-md backdrop-blur-md md:-mx-4 lg:-mx-5">

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
                      className="h-8 rounded-md px-4 text-xs font-medium"
                      onClick={() => setConfirmOpen(true)}
                    >
                      Submit Request
                    </Button>

                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}