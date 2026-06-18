import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestItemsTable } from "./request-items-table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader headerTitle="Create Request" />
        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-3 p-3 md:p-4 lg:p-5">
              {/* GENERAL Section */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    General
                  </h2>
                </div>
                <div className="grid grid-cols-12 gap-4 p-4">
                  {/* Request Type */}
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Request Type
                    </Label>

                    <select
                      defaultValue="MAINTENANCE"
                      className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400"
                    >
                      <option value="CONSUMABLES">CONSUMABLES</option>
                      <option value="FOR STOCK">FOR STOCK</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="REPAIRS">REPAIRS</option>
                      <option value="TRAVEL">TRAVEL</option>
                    </select>
                  </div>

                  {/* Request No */}
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Request No.
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  {/* Warehouse */}
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Warehouse Location
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  {/* Section */}
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Section Code
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  {/* Request Location */}
                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Request Location
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  {/* Created By */}
                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Created By
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="col-span-12 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Remarks
                    </Label>

                    <textarea
                      defaultValue=""
                      className="min-h-[72px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700"
                    />
                  </div>
                </div>
              </section>

              {/* Statuses Section */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    Statuses
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Request Status
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 text-xs bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Warehouse Status
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 text-xs bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
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

              {/* Dimensions Section */}
              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    Dimensions
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Project Code
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Site Code
                    </Label>
                    <Input
                      value=""
                      readOnly
                      className="h-8 bg-slate-100 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Asset ID Code
                    </Label>

                    <select
                      defaultValue=""
                      className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400"
                    >
                      <option value="">Select Asset ID Code</option>

                      <option value="D101">D101</option>
                      <option value="D102">D102</option>
                      <option value="D24">D24</option>
                      <option value="QHV31">QHV31</option>
                      <option value="QHV-32">QHV-32</option>
                      <option value="QLV69">QLV69</option>
                      <option value="QLV72-2024">QLV72-2024</option>
                      <option value="SP07">SP07</option>
                      <option value="TC18">TC18</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Table */}
              <section className="rounded-md border bg-white p-3 shadow-sm">
                <RequestItemsTable />
              </section>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
