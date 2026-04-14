"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    History,
    FileText,
    Activity,
    Puzzle,
    ChevronLeft,
    Store,
    LucideIcon
} from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

interface SidebarItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

const adminItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Vendors", href: "/vendors", icon: Store },
    { title: "User Management", href: "/users", icon: Users },
    { title: "Audit Logs", href: "/audit-logs", icon: History },
];

const userItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Integration", href: "/integration", icon: Puzzle },
    { title: "Activities", href: "/activities", icon: Activity },
    // { title: "Documentation", href: "/documentation", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();
    const { role, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
    const items = role === "admin" ? adminItems : userItems;

    return (
        <aside className={cn(
            "border-r h-screen bg-white flex flex-col sticky top-0 transition-all duration-300 ease-in-out z-[60]",
            sidebarCollapsed ? "w-20" : "w-64"
        )}>
            <div className={cn(
                "p-6 flex items-center border-b h-16 bg-white overflow-hidden transition-all duration-300",
                sidebarCollapsed ? "justify-center" : "justify-between"
            )}>
                <Link href="/home" className="flex items-center">
                    <Image src="/logo.svg" alt="Xchange Logo" width={32} height={32} className="object-contain" />
                </Link>
                {!sidebarCollapsed && (
                    <button
                        onClick={() => setSidebarCollapsed(true)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all active:scale-95"
                    >
                        <ChevronLeft size={16} className="text-[#060B1E]/60" />
                    </button>
                )}
                {sidebarCollapsed && (
                    <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all active:scale-95 absolute right-[-14px] top-6 bg-white z-10"
                    >
                        <ChevronLeft size={16} className="text-[#060B1E]/60 rotate-180" />
                    </button>
                )}
            </div>

            <div className="flex-1 py-6 px-4 overflow-y-auto overflow-x-hidden">
                {!sidebarCollapsed && (
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] mb-4 px-2 font-interTight whitespace-nowrap">
                        Main Menu
                    </p>
                )}
                <nav className="space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={sidebarCollapsed ? item.title : ""}
                            className={cn(
                                "flex items-center rounded-xl transition-all group font-interTight leading-[150%] tracking-[0.02em] h-12",
                                sidebarCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3",
                                pathname === item.href
                                    ? "bg-[#129426]/10 text-[#129426] shadow-sm shadow-[#129426]/5"
                                    : "text-[#060B1E]/60 hover:text-[#060B1E] hover:bg-gray-50/80"
                            )}
                        >
                            <item.icon size={20} className={cn(
                                "transition-transform group-hover:scale-110 shrink-0",
                                pathname === item.href ? "text-[#129426]" : "text-[#060B1E]/40"
                            )} />
                            {!sidebarCollapsed && (
                                <span className="text-[16px] font-medium whitespace-nowrap truncate opacity-100 transition-opacity duration-300">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t">
                {/* Bottom section if needed */}
            </div>
        </aside>
    );
}
