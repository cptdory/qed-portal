"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBasket, ListCheck, CircleGauge } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <CircleGauge />,
  },
  {
    title: "Purchase Request",
    url: "/purchase-requests",
    icon: <ListCheck />,
  },
  {
    title: "New Item Request",
    url: "/item-requests",
    icon: <ShoppingBasket />,
  },
]

interface SessionUser {
  UserId?: string
  Email?: string
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const data = await res.json()
        setUser(data?.user ?? null)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])

  const navUser = {
    name: user?.UserId ?? "",
    email: user?.Email ?? "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-14 px-3 hover:bg-sidebar-accent/40 transition-colors"
            >
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/qed-logo.png"
                  alt="QED Logo"
                  width={36}
                  height={36}
                  className="object-contain rounded-full"
                  priority
                />

                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    Quest Exploration Drilling
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  )
}