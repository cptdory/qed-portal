"use client"

import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileEdit,
  PackagePlus,
  ReceiptText,
  Truck,
  XCircle,
} from "lucide-react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  XAxis,
} from "recharts"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const requestStats = [
  {
    title: "Draft",
    value: 0,
    icon: FileEdit,
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
  {
    title: "New",
    value: 0,
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Pending Approval",
    value: 0,
    icon: Clock3,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Approved",
    value: 0,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "For Correction",
    value: 0,
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Rejected",
    value: 0,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Completed",
    value: 0,
    icon: BadgeCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

const monthlyRequests = [
  { month: "Jan", draft: 0, approved: 0, completed: 0 },
  { month: "Feb", draft: 0, approved: 0, completed: 0 },
  { month: "Mar", draft: 0, approved: 0, completed: 0 },
  { month: "Apr", draft: 0, approved: 0, completed: 0 },
  { month: "May", draft: 0, approved: 0, completed: 0 },
  { month: "Jun", draft: 0, approved: 0, completed: 0 },
]

const requestStatusData = [
  { name: "Draft", value: 0, color: "#64748b" },
  { name: "New", value: 0, color: "#2563eb" },
  { name: "Pending", value: 0, color: "#f59e0b" },
  { name: "Approved", value: 0, color: "#16a34a" },
  { name: "For Correction", value: 0, color: "#d97706" },
  { name: "Rejected", value: 0, color: "#dc2626" },
  { name: "Completed", value: 0, color: "#9333ea" },
]

const chartConfig = {
  approved: {
    label: "Approved",
    color: "#16a34a",
  },
  completed: {
    label: "Completed",
    color: "#2563eb",
  },
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader headerTitle="Dashboard" />

        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="space-y-4 p-4 md:p-5">

            {/* KPI Cards */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-7">
              {requestStats.map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.title}
                    className="shadow-none border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <div className={`rounded-md p-2 shrink-0 ${item.bg}`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] leading-tight text-slate-500 truncate">
                          {item.title}
                        </p>
                        <h2 className="text-xl font-semibold text-slate-900 leading-tight">
                          {item.value}
                        </h2>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Charts */}
            <div className="grid gap-4 xl:grid-cols-3">

              {/* Request Trend */}
              <Card className="xl:col-span-2 shadow-none border border-slate-200">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Requisition Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[280px] w-full"
                  >
                    <AreaChart data={monthlyRequests}>
                      <defs>
                        <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area
                        type="natural"
                        dataKey="approved"
                        stroke="#16a34a"
                        fill="url(#fillApproved)"
                        strokeWidth={2}
                      />
                      <Area
                        type="natural"
                        dataKey="completed"
                        stroke="#2563eb"
                        fill="url(#fillCompleted)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Request Status Distribution */}
              <Card className="shadow-none border border-slate-200">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center px-4 pb-4">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={requestStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {requestStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>

                  <div className="mt-2 w-full space-y-1.5">
                    {requestStatusData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-slate-500">{item.name}</span>
                        </div>
                        <span className="font-medium text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}