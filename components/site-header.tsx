"use client"

import {
  Bell,
  CheckCircle2,
  MessageCircle,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    title: "Request Approved",
    description: "REQ00000031 approved by Warehouse.",
    time: "2m",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    title: "New Mention",
    description: "John Arnel Palma mentioned you.",
    time: "15m",
    icon: MessageCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "Delivered",
    description: "Hammer Bit 137mm delivered.",
    time: "1h",
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

export function SiteHeader({headerTitle}: {headerTitle?: string}) {
  return (
    <header className="flex h-(--header-height) items-center border-b bg-white sticky">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">

        {/* Left */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-semibold text-slate-900">
            {headerTitle || "QED"}
          </h1>
        </div>

        {/* Right */}
        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8"
            >
              <Bell className="h-4 w-4 text-slate-700" />

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[320px] p-0 overflow-hidden overflow-x-hidden rounded-lg border"
          >

            {/* Header */}
            <DropdownMenuLabel className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-semibold">
                Notifications
              </span>

              <span className="text-[10px] rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                3 new
              </span>
            </DropdownMenuLabel>

            {/* List */}
            <DropdownMenuGroup className="max-h-[260px]">

              {notifications.map((n, i) => {
                const Icon = n.icon

                return (
                  <div key={n.id}>
                    <DropdownMenuItem className="flex items-start gap-2 px-3 py-2 min-w-0">

                      {/* Icon */}
                      <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${n.bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${n.color}`} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-medium text-slate-900">
                            {n.title}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-400">
                            {n.time}
                          </span>
                        </div>

                        <p className="truncate text-[11px] text-slate-500">
                          {n.description}
                        </p>
                      </div>

                    </DropdownMenuItem>

                    {i !== notifications.length - 1 && (
                      <DropdownMenuSeparator />
                    )}
                  </div>
                )
              })}

            </DropdownMenuGroup>

            {/* Footer */}
            <div className="border-t p-2">
              <Button
                variant="ghost"
                className="h-8 w-full text-xs"
              >
                View all
              </Button>
            </div>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}