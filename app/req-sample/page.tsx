import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RequestItemsTable } from "./request-items-table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StepStatus = "done" | "active" | "pending"

const REQUEST_STEPS: {
  label: string
  subtitle: string
  status: StepStatus
}[] = [
  { label: "Request",    subtitle: "Completed",   status: "done"    },
  { label: "Site",       subtitle: "In progress", status: "active"  },
  { label: "OPS / MNT", subtitle: "Waiting",      status: "pending" },
  { label: "WSHE",       subtitle: "Waiting",      status: "pending" },
  { label: "Purchasing", subtitle: "Waiting",      status: "pending" },
  { label: "Finance",    subtitle: "Waiting",      status: "pending" },
]

function StepBadge({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-2 py-px text-[10px] font-medium text-emerald-700">
        Completed
      </span>
    )
  }
  if (status === "active") {
    return (
      <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-2 py-px text-[10px] font-medium text-blue-600">
        In progress
      </span>
    )
  }
  return (
    <span className="mt-0.5 text-[10px] text-slate-400">Waiting</span>
  )
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader headerTitle="Request - REQ00000034" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="flex flex-1">

            {/* ── Vertical Stepper Rail ─────────────────────────────── */}
            <nav
              aria-label="Request progress"
              className="hidden w-48 shrink-0 border-r bg-white lg:flex lg:flex-col lg:py-5"
            >
              <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Progress
              </p>

              <ol className="flex flex-col">
                {REQUEST_STEPS.map((step, i) => {
                  const isLast = i === REQUEST_STEPS.length - 1
                  return (
                    <li key={step.label} className="relative flex items-start gap-3 px-4 py-2.5">

                      {/* Connector line */}
                      {!isLast && (
                        <span
                          className={cn(
                            "absolute left-[1.9rem] top-9 w-px",
                            // extend to bottom of the li
                            "bottom-0",
                            step.status === "done"
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          )}
                        />
                      )}

                      {/* Dot */}
                      <span
                        className={cn(
                          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                          step.status === "done"  && "bg-emerald-600 text-white",
                          step.status === "active"
                            && "bg-blue-600 text-white ring-4 ring-blue-100",
                          step.status === "pending"
                            && "border border-slate-300 bg-white text-slate-400"
                        )}
                      >
                        {step.status === "done" ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        ) : (
                          i + 1
                        )}
                      </span>

                      {/* Label + badge */}
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-[12px] font-medium leading-tight",
                            step.status === "done"    && "text-emerald-700",
                            step.status === "active"  && "text-blue-600",
                            step.status === "pending" && "text-slate-400"
                          )}
                        >
                          {step.label}
                        </span>
                        <StepBadge status={step.status} />
                      </div>
                    </li>
                  )
                })}
              </ol>
            </nav>

            {/* ── Compact horizontal bar for smaller screens ───────── */}
            <div className="flex w-full items-center gap-1 overflow-x-auto border-b bg-white px-4 py-2 scrollbar-none lg:hidden">
              {REQUEST_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                        step.status === "done"    && "bg-emerald-600 text-white",
                        step.status === "active"  && "bg-blue-600 text-white",
                        step.status === "pending" && "border border-slate-300 bg-slate-100 text-slate-400"
                      )}
                    >
                      {step.status === "done" ? (
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "whitespace-nowrap text-[11px] font-medium",
                        step.status === "done"    && "text-emerald-700",
                        step.status === "active"  && "text-blue-600",
                        step.status === "pending" && "text-slate-400"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < REQUEST_STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-px w-5 shrink-0",
                        step.status === "done" ? "bg-emerald-400" : "bg-slate-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ── Main form area ────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-auto">
              <div className="space-y-3 p-3 md:p-4 lg:p-5">

                {/* General Section */}
                <section className="rounded-md border bg-white shadow-sm">
                  <div className="border-b px-4 py-2">
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                      General
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">

                    <div className="space-y-1">
                      <Label htmlFor="req-type" className="text-xs font-medium text-slate-600">
                        Request Type
                      </Label>
                      <Input
                        id="req-type"
                        value="MAINTENANCE"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="req-no" className="text-xs font-medium text-slate-600">
                        No.
                      </Label>
                      <Input
                        id="req-no"
                        value="REQ00000034"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="req-location" className="text-xs font-medium text-slate-600">
                        Request Location
                      </Label>
                      <Input
                        id="req-location"
                        value="DAVAO"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="warehouse" className="text-xs font-medium text-slate-600">
                        Warehouse
                      </Label>
                      <Input
                        id="warehouse"
                        value="WAREHOUSE"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="section" className="text-xs font-medium text-slate-600">
                        Section Code
                      </Label>
                      <Input
                        id="section"
                        value="SITE"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="status" className="text-xs font-medium text-slate-600">
                        Status
                      </Label>
                      <Input
                        id="status"
                        value="New"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1 xl:col-span-2">
                      <Label htmlFor="created-by" className="text-xs font-medium text-slate-600">
                        Created By
                      </Label>
                      <Input
                        id="created-by"
                        value="FRANCIS.LOFRANCO@CLOUDSTEPS.COM.PH"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2 xl:col-span-4">
                      <Label htmlFor="remarks" className="text-xs font-medium text-slate-600">
                        Remarks
                      </Label>
                      <textarea
                        id="remarks"
                        placeholder="Enter remarks..."
                        className="min-h-[70px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>
                </section>

                {/* Dimensions */}
                <section className="rounded-md border bg-white shadow-sm">
                  <div className="border-b px-4 py-2">
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                      Dimensions
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">

                    <div className="space-y-1">
                      <Label htmlFor="project-code" className="text-xs font-medium text-slate-600">
                        Project Code
                      </Label>
                      <Input
                        id="project-code"
                        value="APEX-UNDERGROUND"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="asset-id" className="text-xs font-medium text-slate-600">
                        Asset ID
                      </Label>
                      <Input
                        id="asset-id"
                        value="ASSET001"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="site-code" className="text-xs font-medium text-slate-600">
                        Site Code
                      </Label>
                      <Input
                        id="site-code"
                        value="DAVAO"
                        readOnly
                        className="h-8 bg-slate-100 text-xs"
                      />
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
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}