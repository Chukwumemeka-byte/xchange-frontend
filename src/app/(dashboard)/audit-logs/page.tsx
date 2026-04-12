"use client";

import {
    HelpCircle,
    RefreshCcw,
    User,
    Activity,
    ChevronDown,
    ChevronUp,
    Zap,
    Clock,
    Database,
    AlertCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

export default function AuditLogsPage() {
    const { data: activitiesData, isLoading, refetch } = useActivities(1, 50);
    const [expandedId, setExpandedId] = useState<string | null>(null);
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
                        {logs.map((log) => {
                            const isExpanded = expandedId === log.id;
                            const ts = new Date(log.timestamp);
                            const dateStr = ts.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                            const timeStr = ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                            const timeAgo = getTimeAgo(ts);

                            return (
                                <div key={log.id} className="border-b border-[#DFE1E6]/30 last:border-none">
                                    <div
                                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                        className={cn(
                                            "p-6 flex items-center justify-between hover:bg-[#F9FAFB]/80 transition-all cursor-pointer group",
                                            isExpanded && "bg-[#F9FAFB] border-l-4 border-[#129426]"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border",
                                                isExpanded ? "bg-[#129426] text-white border-[#129426]" : "bg-white text-[#060B1E]/60 border-[#DFE1E6]"
                                            )}>
                                                {log.activity_type === "data_submission" ? <Zap size={20} /> : <Activity size={20} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[15px] font-bold text-[#060B1E] font-interTight leading-tight">
                                                    {log.activity_type_display}
                                                </h4>
                                                <p className="text-[12px] font-medium text-[#060B1E]/40 font-interTight flex items-center gap-1.5 leading-none">
                                                    {log.vendor_name} <span className="text-[#DFE1E6]">•</span> {dateStr}, {timeStr}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                log.status === "success" ? "bg-[#C6EDE5] text-[#129426] border-[#129426]/10" : 
                                                log.status === "processing" ? "bg-blue-50 text-blue-600 border-blue-600/10" :
                                                "bg-[#FFEBEF] text-[#DF1C41] border-[#DF1C41]/10"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", 
                                                    log.status === "success" ? "bg-[#129426]" : 
                                                    log.status === "processing" ? "bg-blue-400" :
                                                    "bg-[#DF1C41]"
                                                )} />
                                                {log.status_display}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[12px] font-bold text-[#060B1E]/40 font-interTight min-w-[80px] text-right">
                                                    {timeAgo}
                                                </span>
                                                {isExpanded ? <ChevronUp size={18} className="text-[#060B1E]/20" /> : <ChevronDown size={18} className="text-[#060B1E]/20" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <div className={cn(
                                        "overflow-hidden transition-all duration-300 ease-in-out bg-[#F9FAFB]/50",
                                        isExpanded ? "max-h-[500px] border-t border-[#DFE1E6]/30" : "max-h-0"
                                    )}>
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem icon={<User size={14} />} label="Vendor" value={log.vendor_name} />
                                            <DetailItem icon={<Clock size={14} />} label="Duration" value={`${log.duration_ms}ms`} />
                                            <DetailItem icon={<Activity size={14} />} label="Method & Status" value={`${log.http_method} ${log.http_status_code || ""}`} />
                                            <DetailItem icon={<Database size={14} />} label="Records Result" value={`${log.records_processed} processed / ${log.records_affected} affected`} />
                                            <DetailItem icon={<RefreshCcw size={14} />} label="Endpoint" value={log.endpoint} className="lg:col-span-2" />
                                            
                                            {log.error_message && (
                                                <div className="col-span-full mt-2 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-red-600">
                                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-black uppercase tracking-wider">Error Message</p>
                                                        <p className="text-[13px] font-medium leading-relaxed">{log.error_message}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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

function DetailItem({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: string | number; className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2 text-[#060B1E]/40">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
            </div>
            <p className="text-[14px] font-bold text-[#060B1E] font-interTight truncate" title={String(value)}>
                {value || "N/A"}
            </p>
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
