"use client";

import {
    HelpCircle,
    RefreshCcw,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/hooks/use-dashboard";

export default function AuditLogsPage() {
    const { data: activitiesData, isLoading, refetch } = useActivities(1, 50);
    const logs = activitiesData?.results ?? [];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white mb-2">
                <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Audit Log</h2>
                <Button variant="outline" size="icon" onClick={() => refetch()} className="h-10 w-10 rounded-xl border-[#DFE1E6] bg-white shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                    <RefreshCcw size={18} className="text-[#060B1E]/60" />
                </Button>
            </div>

            <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
                <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                        <h3 className="text-[20px] font-bold text-[#060B1E] font-interTight">Audit Log</h3>
                        <HelpCircle size={18} className="text-[#060B1E]/20" />
                    </div>

                    <div className="divide-y divide-[#DFE1E6]/50">
                        {isLoading && (
                            <div className="p-8 text-center text-[#060B1E]/40 font-semibold">Loading...</div>
                        )}
                        {!isLoading && logs.length === 0 && (
                            <div className="p-8 text-center text-[#060B1E]/40 font-semibold">No audit logs yet</div>
                        )}
                        {logs.map((log, i) => {
                            const Icon = log.action === "Upload" ? RefreshCcw : User;
                            const ts = new Date(log.timestamp);
                            const dateStr = ts.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                            const timeStr = ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                            const timeAgo = getTimeAgo(ts);

                            return (
                                <div
                                    key={i}
                                    className="p-6 flex items-center justify-between hover:bg-[#F9FAFB]/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-[#DFE1E6] flex items-center justify-center text-[#060B1E]/60 group-hover:bg-[#129426]/5 group-hover:border-[#129426]/20 transition-all">
                                            <Icon size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[14px] font-bold text-[#060B1E] font-interTight">{log.action}</h4>
                                            <p className="text-[11px] font-semibold text-[#060B1E]/40 font-interTight flex items-center gap-1.5">
                                                {log.tool} <span className="text-[#DFE1E6]">|</span> {dateStr}, {timeStr}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-[12px] font-bold text-[#060B1E] font-interTight">
                                        {timeAgo}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
