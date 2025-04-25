"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  PiggyBank, 
  Settings, 
  Menu, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    name: "Payroll Vault",
    href: "/payroll-vault",
    icon: PiggyBank,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-0 bg-transparent text-white hover:bg-slate-800/80"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-[#121a29] transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-center px-4 py-4 md:justify-start">
          <Logo />
        </div>

        <div className="mt-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#1e293b] text-white" 
                    : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="rounded-lg bg-[#1e293b] p-4">
            <p className="text-sm font-medium text-white">Need help?</p>
            <p className="mt-1 text-xs text-gray-400">Contact our support team</p>
            <Button 
              className="mt-3 w-full bg-blue-600 text-xs hover:bg-blue-700"
              size="sm"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}