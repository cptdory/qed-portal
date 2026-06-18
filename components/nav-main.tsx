"use client"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon, MailIcon } from "lucide-react"
import Link from "next/link"
export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup className="py-4">
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                className="hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-150 rounded-md"
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
