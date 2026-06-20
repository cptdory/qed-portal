"use client"

import React from "react";
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
import { signOut } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner";
import { EllipsisVerticalIcon, CircleUserRoundIcon, BellIcon, LogOutIcon } from "lucide-react"
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
  const { isMobile } = useSidebar()
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logout()
      .then(() => (window.location.href = '/login'))
  };
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
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/50">
                  <CircleUserRoundIcon className="size-4"
                  />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/50">
                  <BellIcon className="size-4"
                  />
                  Notifications
                </DropdownMenuItem>
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
    </>

  )
}
