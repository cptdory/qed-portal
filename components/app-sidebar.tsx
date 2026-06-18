"use client"

import * as React from "react"
import Image from "next/image"

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

import { ShoppingBasket, ListCheck, CircleGauge } from "lucide-react"

const data = {
  user: {
    name: "Francis Lofranco",
    email: "francis.lofranco@cloudsteps.com.ph",
    avatar: "",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: <CircleGauge />,
    },
    {
      title: "Purchase Request",
      url: "requests",
      icon: <ListCheck />,
    },
    {
      title: "New Item Request",
      url: "item-requests",
      icon: <ShoppingBasket />,
    },
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
              <a href="#" className="flex items-center gap-3">
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
              </a>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={data.user} />
      </SidebarFooter>

    </Sidebar>
  )
}