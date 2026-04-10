"use client";

import { useAppStore } from "@/store/use-app-store";
import {
    Activity,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Calendar,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStats, useTrends, useActivities } from "@/hooks/use-dashboard";
import type { ActivityItem, TrendPoint } from "@/lib/api";

export default function DashboardPage() {
    const { role } = useAppStore();

    return (
        <div className="bg-white min-h-screen font-interTight">
            {/* Top Actions Bar */}
            <div className="flex justify-end items-center px-8 py-4 border-b border-[#DFE1E6]">
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
                </div>
            </div>

            <div className="p-8 space-y-8">
                {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
            </div>
        </div>
    );
}

function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = useStats();
    const { data: trendsData } = useTrends();
    const { data: activitiesData } = useActivities(1, 10);

    const series = trendsData?.series ?? [];
    const activities = activitiesData?.results ?? [];

    return (
        <div className="space-y-6 pb-10">
            {/* Top Stats Grid (4 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Records" value={statsLoading ? "..." : (stats?.total_records ?? 0).toLocaleString()} percentage="10.5%" trend="up" subValue={`+${stats?.total_records ?? 0}`} subLabel="total" />
                <StatsCard title="Records Pulled" value={statsLoading ? "..." : (stats?.records_pulled ?? 0).toLocaleString()} percentage="3.4%" trend="up" subValue={`${stats?.records_pulled ?? 0}`} subLabel="pulled" />
                <StatsCard title="Active Vendors" value={statsLoading ? "..." : (stats?.active_vendors ?? 0).toLocaleString()} percentage="15.2%" trend="down" subValue={`${stats?.active_vendors ?? 0}`} subLabel="active" />
                <StatsCard title="Total Vendors" value={statsLoading ? "..." : (stats?.total_vendors ?? 0).toLocaleString()} percentage="0.5%" trend="down" subValue={`${stats?.total_vendors ?? 0}`} subLabel="total" />
            </div>

            {/* Middle Stats Grid (2 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard title="API Uptime" value={statsLoading ? "..." : `${(stats?.api_uptime_pct ?? 0).toFixed(2)}%`} percentage="10.5%" trend="up" subValue="Uptime" subLabel="last 30 days" />
                <StatsCard title="Submissions" value={statsLoading ? "..." : (stats?.submissions_count ?? 0).toLocaleString()} percentage="0.5%" trend="up" subValue={`${stats?.downloads_count ?? 0}`} subLabel="downloads" />
            </div>

            {/* Chart Section */}
            <TrendsChart series={series} title="Exchange Trends" />

            <RecentActivities activities={activities} showVendor />
        </div>
    );
}

function UserDashboard() {
    const { data: stats, isLoading: statsLoading } = useStats();
    const { data: trendsData } = useTrends();
    const { data: activitiesData } = useActivities(1, 10);

    const series = trendsData?.series ?? [];
    const activities = activitiesData?.results ?? [];

    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Submission Circles" value={statsLoading ? "..." : (stats?.submissions_count ?? 0).toLocaleString()} percentage="10.5%" trend="up" />
                <StatsCard title="Download Circles" value={statsLoading ? "..." : (stats?.downloads_count ?? 0).toLocaleString()} percentage="3.4%" trend="up" />
                <StatsCard title="Data Quality" value={statsLoading ? "..." : `${(stats?.api_uptime_pct ?? 100).toFixed(0)}%`} percentage="Active" trend="up" hideTrendIcon />
            </div>

            <TrendsChart series={series} title="Uploads vs Submissions" />

            <RecentActivities activities={activities} />

            <div className="border border-[#DFE1E6] rounded-[24px] bg-[#F9FAFB] p-10 shadow-sm">
                <div className="max-w-4xl space-y-6">
                    <div>
                        <h3 className="text-[24px] font-bold text-[#060B1E] leading-[130%] font-interTight mb-2">Need help with your integration?</h3>
                        <p className="text-[#060B1E]/60 text-[12px] font-semibold font-interTight leading-[150%] tracking-[0.02em]">Check our comprehensive documentation or reach out to our technical support team for assistance with API endpoints or authentication.</p>
                    </div>
                    <Button variant="outline" className="gap-2 h-10 px-4 rounded-xl border-[#DFE1E6] bg-white hover:bg-gray-50 transition-all font-semibold text-[12px] text-[#060B1E] shadow-sm">
                        <FileText size={16} className="text-[#060B1E]/60" /> View API Docs
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TrendsChart({ series, title }: { series: TrendPoint[]; title: string }) {
    const maxVal = 2000;
    const chartData = series.length > 0 ? series : Array.from({ length: 12 }, (_, i) => ({ date: `2025-${String(i + 1).padStart(2, "0")}-01`, households: 0, persons: 0 }));

    return (
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="bg-white border border-[#DFE1E6] rounded-[24px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[24px] font-semibold text-[#060B1E] leading-[130%] font-interTight">{title}</h3>
                    <div className="flex items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#060B1E]/60 font-interTight">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#129426]" /> Households</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFBD4C]" /> Persons</div>
                    </div>
                </div>

                <div className="relative h-72 w-full mt-4">
                    <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between text-[11px] font-semibold text-[#060B1E]/40 uppercase tracking-widest text-right w-12 pr-4 z-10 pointer-events-none">
                        <span>2000</span><span>1200</span><span>400</span><span>0</span>
                    </div>

                    <div className="absolute inset-0 ml-10">
                        <div className="absolute inset-0 flex flex-col justify-between py-1">
                            {[0, 1, 2, 3].map((i) => <div key={i} className="w-full border-t border-[#DFE1E6]/60 border-dashed" />)}
                        </div>

                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 288" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#129426" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#129426" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FFBD4C" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#FFBD4C" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {chartData.length > 1 && (
                                <>
                                    <path d={`${buildPath(chartData, "households", maxVal)} L 1000 288 L 0 288 Z`} fill="url(#hg)" />
                                    <path d={buildPath(chartData, "households", maxVal)} fill="none" stroke="#129426" strokeWidth="2" />
                                    <path d={`${buildPath(chartData, "persons", maxVal)} L 1000 288 L 0 288 Z`} fill="url(#pg)" />
                                    <path d={buildPath(chartData, "persons", maxVal)} fill="none" stroke="#FFBD4C" strokeWidth="2" />
                                </>
                            )}
                        </svg>
                    </div>
                </div>

                {chartData.length > 0 && (
                    <div className="flex justify-between mt-8 text-[11px] font-bold text-[#060B1E]/50 px-10 tracking-[0.02em] pl-20 font-interTight">
                        <span>{chartData[0].date}</span>
                        <span>{chartData[chartData.length - 1].date}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function buildPath(data: TrendPoint[], key: "households" | "persons", maxVal: number) {
    const len = data.length;
    if (len === 0) return "";
    const step = 1000 / (len - 1 || 1);
    return data.reduce((acc, d, i) => {
        const y = 288 - (d[key] / maxVal * 288);
        const x = i * step;
        if (i === 0) return `M ${x} ${y}`;
        const px = (i - 1) * step;
        const py = 288 - (data[i - 1][key] / maxVal * 288);
        const cx1 = (px + x) / 2;
        return `${acc} C ${cx1} ${py}, ${cx1} ${y}, ${x} ${y}`;
    }, "");
}

interface StatsCardProps {
    title: string;
    value: string;
    percentage: string;
    trend: "up" | "down";
    subValue?: string;
    subLabel?: string;
    hideTrendIcon?: boolean;
}

function StatsCard({ title, value, percentage, trend, subValue, subLabel, hideTrendIcon }: StatsCardProps) {
    const isUp = trend === "up";
    return (
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white group hover:shadow-md transition-all">
            <div className="bg-white border border-[#DFE1E6] rounded-[24px] p-4 shadow-sm overflow-hidden relative">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[12px] text-[#060B1E]/40 font-semibold tracking-[0.02em] font-interTight leading-[150%] uppercase">{title}</p>
                    <div className="w-8 h-8 border-[1.5px] border-[#129426]/20 rounded-xl bg-gray-50 flex items-center justify-center text-[#129426] transition-colors">
                        <Activity size={14} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h4 className="text-[18px] font-semibold text-[#060B1E] leading-[135%] tracking-[0em] font-interTight">{value}</h4>
                        {!hideTrendIcon && (
                            <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit", isUp ? "bg-[#C6EDE5]" : "bg-[#FFEBEF]")}>
                                <div className={cn("w-3.5 h-3.5 rounded-full flex items-center justify-center bg-white shadow-sm", isUp ? "text-[#40C4AA]" : "text-[#DF1C41]")}>
                                    {isUp ? <ArrowUpRight size={8} strokeWidth={3} /> : <ArrowDownRight size={8} strokeWidth={3} />}
                                </div>
                                <span className={cn(isUp ? "text-[#40C4AA]" : "text-[#DF1C41]")}>{percentage}</span>
                            </div>
                        )}
                    </div>
                    <ArrowUpRight size={14} className="text-[#060B1E]/20" />
                </div>
                {subValue && (
                    <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
                        <span className={cn("text-[11px] font-bold", isUp ? "text-[#060B1E]" : "text-[#DF1C41]")}>{subValue}</span>
                        <span className="text-[11px] text-[#060B1E]/40 font-semibold">{subLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function RecentActivities({ activities, showVendor }: { activities: ActivityItem[]; showVendor?: boolean }) {
    return (
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                    <h3 className="text-[24px] font-bold text-[#060B1E] leading-[130%] font-interTight">Recent Exchange Activities</h3>
                    <HelpCircle size={20} className="text-[#060B1E]/20" />
                </div>
                <div className="overflow-x-auto border-t border-[#DFE1E6]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/30 text-[#060B1E]/40 text-[10px] uppercase font-black tracking-[0.2em] whitespace-nowrap border-b border-[#DFE1E6]">
                                <th className="px-6 py-4">Activity ID</th>
                                <th className="px-6 py-4">Timestamp</th>
                                {showVendor && <th className="px-6 py-4">Source Tool</th>}
                                <th className="px-6 py-4">Operation</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DFE1E6] text-[14px] font-interTight">
                            {activities.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">No activities yet</td></tr>
                            )}
                            {activities.map((act, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group whitespace-nowrap">
                                    <td className="px-6 py-4 font-semibold text-[#326D8E] leading-[150%] tracking-[0.02em] cursor-pointer group-hover:underline decoration-2 underline-offset-4">{act.activity_id}</td>
                                    <td className="px-6 py-4 font-semibold text-[#060B1E] leading-[150%] tracking-[0.02em]">{new Date(act.timestamp).toLocaleString()}</td>
                                    {showVendor && <td className="px-6 py-4 text-[#060B1E] font-semibold leading-[150%] tracking-[0.02em]">{act.tool}</td>}
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "rounded-full font-medium text-[11px] px-2 py-0.5 flex justify-center w-fit border",
                                            act.action === "Upload" ? "bg-[#E7FEF8] text-[#287F6E] border-[#287F6E]/10" :
                                                act.action === "Download" ? "bg-[#E0E7FF] text-[#4338CA] border-[#4338CA]/10" :
                                                    "bg-[#FFF7ED] text-[#F97316] border-[#F97316]/10"
                                        )}>
                                            {act.action}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full w-fit border",
                                            act.status === "Successful" ? "bg-[#E7FEF8] text-[#287F6E] border-[#287F6E]/10" : "bg-[#FFEBEF] text-[#DF1C41] border-[#DF1C41]/10"
                                        )}>
                                            <div className={cn("w-1 h-1 rounded-full", act.status === "Successful" ? "bg-[#40C4AA]" : "bg-[#DF1C41]")} />
                                            <span>{act.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
