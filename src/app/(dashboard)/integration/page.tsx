"use client";

import { useState } from "react";
import {
    Copy,
    RefreshCcw,
    Calendar,
    HelpCircle,
    Database,
    Clock,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { useGenerateToken } from "@/hooks/use-vendors";
import { useVendorActivities } from "@/hooks/use-vendors";

export default function IntegrationPage() {
    const [env, setEnv] = useState<"test" | "production">("test");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<1 | 2>(1);
    const [generatedToken, setGeneratedToken] = useState("");
    const user = useAppStore((s) => s.user);
    const vendorId = (user as unknown as { vendor?: string })?.vendor ?? "";
    const generateTokenMutation = useGenerateToken();
    const { data: activitiesData } = useVendorActivities(vendorId, 1, 50);

    // Derive tokens from activities (API calls serve as token usage records)
    const tokenRecords = activitiesData?.results ?? [];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleGenerate = () => {
        if (!vendorId) {
            toast.error("No vendor assigned to your account");
            return;
        }
        generateTokenMutation.mutate(vendorId, {
            onSuccess: (data) => {
                setGeneratedToken(data.token);
                setModalStep(2);
            },
            onError: (err) => toast.error(err.message || "Failed to generate token"),
        });
    };

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Integrations & Connectivity</h2>

            {/* Primary Database Bridge Card */}
            <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
                <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[20px] bg-gray-50 border border-gray-100 flex items-center justify-center text-[#129426]">
                                <Database size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-[24px] font-bold text-[#060B1E] font-interTight">Primary Database Bridge</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-[#40C4AA]" />
                                    <span className="text-[13px] text-[#060B1E]/40 font-semibold uppercase tracking-wider">Active & Operational</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[#DFE1E6] bg-white shadow-sm hover:bg-gray-50 transition-all">
                                <RefreshCcw size={18} className="text-[#060B1E]/60" />
                            </Button>
                            <Button className="h-12 px-8 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold text-[14px] shadow-sm">
                                Edit
                            </Button>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 pb-8">
                        <div className="p-1 bg-[#F9FAFB] border border-[#DFE1E6] rounded-2xl inline-flex">
                            <button
                                onClick={() => setEnv("test")}
                                className={cn(
                                    "px-10 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                                    env === "test" ? "bg-white shadow-sm text-[#060B1E] border border-[#DFE1E6]" : "text-[#060B1E]/40"
                                )}
                            >
                                Test
                            </button>
                            <button
                                onClick={() => setEnv("production")}
                                className={cn(
                                    "px-10 py-2.5 rounded-xl text-[13px] font-bold transition-all ml-0.5",
                                    env === "production" ? "bg-white shadow-sm text-[#060B1E] border border-[#DFE1E6]" : "text-[#060B1E]/40"
                                )}
                            >
                                Production
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tokens Section */}
            <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white mt-10">
                <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[20px] font-bold text-[#060B1E] font-interTight">Tokens</h3>
                            <HelpCircle size={18} className="text-[#060B1E]/20" />
                        </div>
                        <Button
                            onClick={() => {
                                setModalStep(1);
                                setGeneratedToken("");
                                setIsModalOpen(true);
                            }}
                            className="bg-[#129426] hover:bg-[#129426]/90 text-white rounded-xl h-11 px-6 font-bold text-[13px]"
                        >
                            Generate Token
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB]">
                                <tr className="text-[#060B1E]/30 text-[10px] uppercase font-black tracking-[0.2em] whitespace-nowrap border-b border-[#DFE1E6]/50">
                                    <th className="px-8 py-5">Activity</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-interTight">
                                {tokenRecords.length === 0 && (
                                    <tr><td colSpan={3} className="px-8 py-8 text-center text-[#060B1E]/40 font-semibold">No token activity yet</td></tr>
                                )}
                                {tokenRecords.map((rec, i) => {
                                    const isSuccess = (rec.http_status_code || 0) < 400;
                                    return (
                                        <tr key={i} className="hover:bg-gray-50/30 transition-all whitespace-nowrap group">
                                            <td className="px-8 py-6 font-semibold text-[#060B1E]/60 text-[14px]">
                                                {rec.http_method} {rec.endpoint}
                                            </td>
                                            <td className="px-8 py-6 font-semibold text-[#060B1E]/80 text-[14px]">
                                                {new Date(rec.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "w-fit px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider",
                                                    isSuccess
                                                        ? "bg-[#C6EDE5] text-[#129426] border border-[#129426]/10"
                                                        : "bg-[#FFEBEF] text-[#DF1C41] border border-[#DF1C41]/10"
                                                )}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", isSuccess ? "bg-[#129426]" : "bg-[#DF1C41]")} />
                                                    {isSuccess ? "Success" : "Failed"}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Generate Token Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[620px] p-0 rounded-[32px] overflow-hidden border-none shadow-2xl">
                    <div className="bg-white">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#060B1E] font-interTight">Integrations & Connectivity</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#060B1E]/20 hover:text-[#060B1E] transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-8 pb-8 space-y-8">
                            {/* Tabs in Modal */}
                            <div className="p-1 bg-[#F9FAFB] border border-[#DFE1E6] rounded-2xl flex w-fit">
                                <button
                                    className={cn(
                                        "px-10 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                                        env === "test" ? "bg-white shadow-sm text-[#060B1E] border border-[#DFE1E6]" : "text-[#060B1E]/40"
                                    )}
                                    onClick={() => setEnv("test")}
                                >
                                    Test
                                </button>
                                <button
                                    className={cn(
                                        "px-10 py-2.5 rounded-xl text-[13px] font-bold transition-all ml-0.5",
                                        env === "production" ? "bg-white shadow-sm text-[#060B1E] border border-[#DFE1E6]" : "text-[#060B1E]/40"
                                    )}
                                    onClick={() => setEnv("production")}
                                >
                                    Production
                                </button>
                            </div>

                            {/* Info Banner */}
                            <div className="p-5 bg-[#F9FAFB] border border-[#DFE1E6] rounded-2xl flex items-start gap-4">
                                <div className="w-5 h-5 rounded-full border border-[#060B1E]/10 flex items-center justify-center text-[#060B1E]/20 mt-0.5">
                                    <HelpCircle size={12} />
                                </div>
                                <p className="text-[13px] leading-[160%] text-[#060B1E]/40 font-semibold font-interTight">
                                    {modalStep === 1
                                        ? "Generate a new access token for your vendor integration. The token will be shown once — make sure to copy it."
                                        : "Your access token has been successfully generated. Copy it now — it won't be shown again."}
                                </p>
                            </div>

                            {modalStep === 1 ? (
                                <>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[14px] font-bold text-[#060B1E]/60 ml-1">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20" size={18} />
                                                <Input
                                                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                                    className="pl-12 h-14 rounded-2xl border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/40 shadow-sm"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[14px] font-bold text-[#060B1E]/60 ml-1">Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20" size={18} />
                                                <Input
                                                    placeholder="00:00:00"
                                                    className="pl-12 h-14 rounded-2xl border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/40 shadow-sm"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsModalOpen(false)}
                                            className="h-12 px-8 rounded-xl border-[#DFE1E6] font-bold text-[#060B1E]/60"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={generateTokenMutation.isPending}
                                            className="h-12 px-8 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold"
                                        >
                                            {generateTokenMutation.isPending ? "Generating..." : "Generate"}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <label className="text-[14px] font-bold text-[#060B1E]/60 ml-1">Access Token</label>
                                            <HelpCircle size={14} className="text-[#060B1E]/20" />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                value={generatedToken}
                                                readOnly
                                                className="h-14 rounded-2xl border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/60 pr-12 shadow-sm"
                                            />
                                            <button
                                                onClick={() => handleCopy(generatedToken)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20 hover:text-[#129426] transition-colors"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsModalOpen(false)}
                                            className="h-12 px-8 rounded-xl border-[#DFE1E6] font-bold text-[#060B1E]/60"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={() => handleCopy(generatedToken)}
                                            className="h-12 px-8 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold"
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
