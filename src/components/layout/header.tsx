"use client";

import { Bell, Mail, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/use-app-store";
import { useLogout } from "@/hooks/use-auth";

export function Header() {
    const { role, setRole } = useAppStore();
    const logout = useLogout();

    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
            <h1 className="text-[24px] font-semibold text-[#060B1E] leading-[130%] font-interTight">Dashboard</h1>

            <div className="flex items-center gap-3">
                {/* Message Icon */}
                <button className="w-11 h-11 flex items-center justify-center border border-gray-100 rounded-[12px] hover:bg-gray-50 transition-all text-[#060B1E]">
                    <Mail size={20} />
                </button>

                {/* Bell Icon */}
                <button className="w-11 h-11 flex items-center justify-center border border-gray-100 rounded-[12px] hover:bg-gray-50 transition-all text-[#060B1E] relative">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#129426] rounded-full"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-[1px] bg-gray-100 mx-1" />

                {/* User Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 h-11 border border-gray-100 rounded-[12px] px-3 hover:bg-gray-50 transition-all outline-none">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <ChevronDown size={16} className="text-[#060B1E]/60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 font-interTight">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRole(role === "admin" ? "viewer" : "admin")}>
                            Switch to {role === "admin" ? "Viewer" : "Admin"} View
                        </DropdownMenuItem>
                        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600" onClick={logout}>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* More / Hamburger Icon */}
                <button className="w-11 h-11 flex items-center justify-center border border-gray-100 rounded-[12px] hover:bg-gray-50 transition-all text-[#060B1E]">
                    <div className="flex gap-0.5">
                        <span className="w-1 h-1 bg-black rounded-full"></span>
                        <span className="w-1 h-1 bg-black rounded-full"></span>
                        <span className="w-1 h-1 bg-black rounded-full"></span>
                    </div>
                </button>
            </div>
        </header>
    );
}
