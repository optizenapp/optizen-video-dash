"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  BarChart3,
  Store,
  DollarSign,
  Megaphone,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "App Overview", href: "/app-overview", icon: BarChart3 },
  { name: "Stores", href: "/stores", icon: Store },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Reports", href: "/reports", icon: FileText },
];

const adminNavigation = [
  { name: "Discounts", href: "/admin/discounts", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">Optizen Analytics</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Admin Section */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin
            </p>
          </div>
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">App Owner</p>
            <p className="text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

