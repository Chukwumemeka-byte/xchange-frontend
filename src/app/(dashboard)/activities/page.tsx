"use client";

import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Download,
    HelpCircle,
    RefreshCcw,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useActivities, useStats } from "@/hooks/use-dashboard";

export default function ActivitiesPage() {
    const { data: activitiesData, isLoading: activitiesLoading } = useActivities(1, 20);
    const { data: stats, isLoading: statsLoading } = useStats();
    const activities = activitiesData?.results ?? [];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white">
                <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Activities</h2>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-[#DFE1E6] bg-white shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                        <RefreshCcw size={18} className="text-[#060B1E]/60" />
                    </Button>
                    <Select defaultValue="monthly">
                        <SelectTrigger className="w-[140px] h-10 rounded-xl border-[#DFE1E6] shadow-sm bg-white font-bold text-[14px] text-[#060B1E]">
                            <Calendar className="mr-2 h-4 w-4 text-[#129426]" />
                            <SelectValue placeholder="Monthly" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#DFE1E6] shadow-xl">
                            <SelectItem value="daily" className="font-bold">Daily</SelectItem>
                            <SelectItem value="weekly" className="font-bold">Weekly</SelectItem>
                            <SelectItem value="monthly" className="font-bold">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-10 px-6 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold text-[14px] shadow-sm gap-2">
                        <Download size={18} /> Download
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <StatsCard title="Total Records" value={statsLoading ? "..." : (stats?.total_records ?? 0).toLocaleString()} percentage="10.5%" trend="up" subValue={`${stats?.total_records ?? 0}`} subLabel="total" />
                <StatsCard title="Submissions" value={statsLoading ? "..." : (stats?.submissions_count ?? 0).toLocaleString()} percentage="3.4%" trend="up" subValue={`${stats?.submissions_count ?? 0}`} subLabel="submissions" />
                <StatsCard title="Downloads" value={statsLoading ? "..." : (stats?.downloads_count ?? 0).toLocaleString()} percentage="15.2%" trend="up" subValue={`${stats?.downloads_count ?? 0}`} subLabel="downloads" />
            </div>

            <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white mt-10">
                <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                        <h3 className="text-[20px] font-bold text-[#060B1E] font-interTight">Exchange Activities</h3>
                        <HelpCircle size={18} className="text-[#060B1E]/20" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB]">
                                <tr className="text-[#060B1E]/30 text-[10px] uppercase font-black tracking-[0.2em] whitespace-nowrap border-b border-[#DFE1E6]/50">
                                    <th className="px-8 py-5">Activity ID</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5">Action</th>
                                    <th className="px-8 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-interTight">
                                {activitiesLoading && (
                                    <tr><td colSpan={4} className="px-8 py-8 text-center text-[#060B1E]/40 font-semibold">Loading...</td></tr>
                                )}
                                {!activitiesLoading && activities.length === 0 && (
                                    <tr><td colSpan={4} className="px-8 py-8 text-center text-[#060B1E]/40 font-semibold">No activities yet</td></tr>
                                )}
                                {activities.map((act, i) => (
                                    <tr key={i} className="hover:bg-gray-50/30 transition-all whitespace-nowrap group">
                                        <td className="px-8 py-6 font-semibold text-[#326D8E] text-[14px] cursor-pointer hover:underline underline-offset-4 decoration-2">{act.activity_id}</td>
                                        <td className="px-8 py-6 font-bold text-[#060B1E] text-[14px]">{new Date(act.timestamp).toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <Badge className={cn(
                                                "rounded-full font-bold text-[10px] uppercase tracking-wider border-none px-3 py-1.5 min-w-[100px] justify-center",
                                                act.action === "Upload" ? "bg-[#C6EDE5] text-[#129426]" :
                                                    act.action === "Download" ? "bg-[#F0F2FE] text-[#7B86EA]" :
                                                        "bg-[#FFF8E6] text-[#F3C13D]"
                                            )}>
                                                {act.action}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold w-fit uppercase tracking-wider",
                                                act.status === "Successful" ? "bg-[#C6EDE5] text-[#129426]" : "bg-[#FFEBEF] text-[#DF1C41]"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", act.status === "Successful" ? "bg-[#129426]" : "bg-[#DF1C41]")} />
                                                {act.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, percentage, trend, subValue, subLabel }: {
    title: string; value: string; percentage: string; trend: "up" | "down"; subValue: string; subLabel: string;
}) {
    const isUp = trend === "up";
    return (
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white group hover:shadow-md transition-all">
            <div className="bg-white border border-[#DFE1E6] rounded-[24px] p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[12px] text-[#060B1E]/40 font-semibold tracking-[0.02em] font-interTight leading-[150%] uppercase">{title}</p>
                    <div className="w-10 h-10 border-[1.5px] border-[#129426]/20 rounded-xl bg-gray-50 flex items-center justify-center text-[#129426]">
                        <Activity size={20} />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <h4 className="text-[24px] font-bold text-[#060B1E] font-interTight">{value}</h4>
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit", isUp ? "bg-[#C6EDE5] text-[#129426]" : "bg-[#FFEBEF] text-[#DF1C41]")}>
                        {isUp ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                        {percentage}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#060B1E]">{subValue}</span>
                        <span className="text-[11px] text-[#060B1E]/40 font-semibold">{subLabel}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#060B1E]/40 hover:text-[#060B1E] transition-colors cursor-pointer">
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}
