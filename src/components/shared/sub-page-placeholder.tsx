"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";

export default function SubPage() {
    const pathname = usePathname();
    const { role } = useAppStore();
    const pageTitle = pathname?.split("/").pop()?.replace("-", " ") || "Page";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight capitalize">{pageTitle}</h2>
            </div>
            <div className="bg-white border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <div className="text-2xl font-bold capitalize">{pageTitle[0]}</div>
                </div>
                <h3 className="text-xl font-bold capitalize">{pageTitle} View</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                    Just a placeholder for testing {role} dashboard. Functional implementation for {pageTitle} loading...
                </p>
            </div>
        </div>
    );
}
