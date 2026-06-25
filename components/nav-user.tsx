"use client"

import React from "react";
import { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { SessionUser } from "@/types/bc-types"
import { signOut } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner";
import { EllipsisVerticalIcon, LocateIcon, BellIcon, LogOutIcon } from "lucide-react"
import { sileo } from "sileo";

interface UpdateLocationForm {
  UserName: string
  LocationCode: string
}

// One entry returned by /api/get-requisition-locations
interface LocationOption {
  Code: string
  Description: string
}

const emptyForm = (): UpdateLocationForm => ({
  UserName: "",
  LocationCode: "",
})
async function logout(): Promise<void> {
  const res = await fetch("/api/logout", {
    method: "POST",
  });
  await signOut({ callbackUrl: "/login", redirect: true })
  if (!res.ok) throw new Error("Logout failed");
}
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const [sessionUser, setUser] = useState<SessionUser | null>(null)
  const [locations, setLocations] = useState<LocationOption[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const { isMobile } = useSidebar()
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UpdateLocationForm>(emptyForm())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user ?? null)
      } catch {
        sileo.error({ title: "Session Error — Could not load your session. Please refresh.", fill: "#171717" })
      }
    }
    fetchMe()
  }, [])

  const handleLogout = () => {
    setLoggingOut(true);
    logout()
      .then(() => (window.location.href = '/login'))
  };

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true)
      const res = await fetch("/api/get-requisition-locations")
      if (!res.ok) throw new Error("Failed to fetch locations")
      const data = await res.json()
      setLocations(data?.Locations ?? [])
    } catch (err) {
      console.error("Failed to fetch locations:", err)
      sileo.error({ title: "Could not load locations — please try again.", fill: "#171717" })
    } finally {
      setLoadingLocations(false)
    }
  }

  // Load the location list and reset the form each time the modal opens
  useEffect(() => {
    if (open) {
      setForm({ UserName: user.name, LocationCode: "" })
      fetchLocations()
    }
  }, [open])

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const res = await fetch("/api/update-request-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: form.UserName,
          LocationCode: form.LocationCode,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || "Failed to request location."
        sileo.error({ title: `Failed to request location — ${message}`, fill: "#171717" })
        return
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to request location."
        sileo.error({ title: `Failed to request location — ${message}`, fill: "#171717" })
        return
      }

      sileo.success({ title: "Location requested successfully.", fill: "#171717" })
      setOpen(false)
    } catch {
      sileo.error({ title: "Failed to update location — An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Spinner className="mb-4 h-8 w-8 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Logging out...
          </span>
        </div>
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent/60 data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/40 transition-colors duration-150 rounded-md"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border/50">
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold">FL</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user.email}
                  </span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4 text-sidebar-foreground/60" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg border border-border/50">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">FL</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="cursor-pointer hover:bg-accent/50"
                >
                  <LocateIcon className="size-4" />
                  Change Location
                </DropdownMenuItem >
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive">
                <LogOutIcon className="size-4"
                />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
            <DialogDescription>
              Choose the location you'd like to request. Your request will be sent for approval.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-2">
            <label htmlFor="location-select" className="text-sm font-medium text-foreground">
              Location
            </label>
            <select
              id="location-select"
              value={form.LocationCode}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, LocationCode: e.target.value }))
              }
              disabled={loadingLocations || submitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                {loadingLocations
                  ? "Loading locations..."
                  : locations.length === 0
                    ? "No locations available"
                    : "Select a location"}
              </option>
              {locations.map((loc) => (
                <option key={loc.Code} value={loc.Code}>
                  {loc.Description ? `${loc.Code} — ${loc.Description}` : loc.Code}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !form.LocationCode || loadingLocations}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Spinner className="h-4 w-4" />}
              Request Change
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}