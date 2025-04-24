"use client";

import { Button } from "@/components/ui/button";
import { BellIcon, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname();

  // Determine title based on pathname if not provided
  const pageTitle = title || (() => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/employees") return "Employees";
    if (pathname === "/payroll-vault") return "Payroll Vault";
    if (pathname === "/settings") return "Settings";
    return "Dashboard";
  })();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1e293b] bg-[#0f172a]/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center">
        <h1 className="ml-12 text-xl font-bold md:ml-0 md:text-2xl">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-semibold">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs text-blue-500">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="flex cursor-pointer flex-col items-start px-4 py-2">
                  <span className="text-sm font-medium">Payroll Processing Complete</span>
                  <span className="text-xs text-muted-foreground">
                    April {12 + i}, 2025 • 10:3{i} AM
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="border-t border-[#1e293b] p-2">
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-blue-500">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-xs">JS</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">John Smith</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem>Help Center</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}