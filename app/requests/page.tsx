"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestListTable } from "./request-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="Purchase Requests" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-4 p-3 md:p-4 lg:p-5">

              {/* Header */}
              <section className="rounded-md border bg-white shadow-sm">

                {/* Top Bar */}
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Search purchase requests
                    </p>
                  </div>

                  <Link href="create-request">
                    <Button size="sm">
                      Create Request
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
                      placeholder="Search request number"
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Status
                    </Label>

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

                  {/* Request Type */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Request Type
                    </Label>

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

                  {/* Location */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">
                      Location
                    </Label>

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

              {/* Table */}
              <section className="rounded-md border bg-white p-3 shadow-sm">
                <RequestListTable />
              </section>

            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}