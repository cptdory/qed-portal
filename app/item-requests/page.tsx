"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ItemRequestListTable } from "./item-request-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
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
        <SiteHeader headerTitle="New Item Request" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-4 p-3 md:p-4 lg:p-5">

              {/* Header */}
              <section className="rounded-md border bg-white shadow-sm">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Search Item requests
                    </p>
                  </div>
                  <Link href="create-item-request">
                    <Button size="sm">
                      Create Item Request
                    </Button>
                  </Link>
                </div>
                {/* Filters */}
                <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">

                  {/* Search */}
                  <div className="space-y-1 xl:col-span-2">
                    <Label className="text-xs font-medium text-slate-600">
                      Search
                    </Label>

                    <Input
                      placeholder="Search item request number"
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Status
                    </Label>

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

                  {/* Request Type */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Category
                    </Label>

                    <select
                      defaultValue="all"
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    >
                      <option value="all">All</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Location
                    </Label>

                    <select
                      defaultValue="all"
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    >
                      <option value="all">All</option>
                      <option value="davao">DAVAO</option>
                      <option value="cebu">CEBU</option>
                    </select>
                  </div>

                </div>
              </section>

              {/* Table */}
              <section className="rounded-md border bg-white p-3 shadow-sm">
                <ItemRequestListTable />
              </section>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}