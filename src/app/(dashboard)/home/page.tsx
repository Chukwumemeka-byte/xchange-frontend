"use client";

import { Check, ArrowRight, BookOpen, Shield, LifeBuoy, Zap, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useOnboarding } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

export default function HomePage() {
    const { data: onboarding, isLoading } = useOnboarding();
    const allDone = onboarding ? onboarding.progress_pct >= 100 : false;

    return (
        <div className="space-y-8 pb-10 font-interTight">
            {/* Page Header */}
            <div>
                <h1 className="text-[24px] font-semibold text-[#060B1E] leading-[130%]">Welcome To Corex</h1>
                <p className="text-[12px] text-muted-foreground font-semibold mt-1 leading-[150%] tracking-[0.02em]">Welcome! Get started by sending your first health record</p>
            </div>

            {/* Status Banner */}
            <div className="bg-[#DFE1E6] border border-gray-100 rounded-[32px] p-10 flex items-center gap-10 relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-80 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                    <Image src="/database-frame.svg" alt="" fill className="object-contain object-right" />
                </div>

                <div className="relative z-10 flex items-center gap-10">
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl",
                        allDone ? "bg-[#129426] shadow-[#129426]/20" : "bg-[#F3C13D] shadow-[#F3C13D]/20"
                    )}>
                        {isLoading ? (
                            <Loader2 size={40} strokeWidth={2} className="animate-spin" />
                        ) : allDone ? (
                            <Check size={40} strokeWidth={3} />
                        ) : (
                            <span className="text-[20px] font-bold">{onboarding?.progress_pct ?? 0}%</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[24px] font-semibold text-[#060B1E] leading-[130%] mb-3">
                            {allDone ? "You\u2019re All Set!" : "Getting Started"}
                        </h2>
                        <p className="text-[16px] font-normal leading-[150%] text-[#060B1E]/60 max-w-2xl">
                            {allDone
                                ? "Your integration with the Corex Health Exchange has been activated. You\u2019re ready to start submitting vaccination records and household data to the national registry."
                                : `Complete your setup to start using the exchange. ${onboarding?.completed ?? 0} of ${onboarding?.total ?? 4} steps completed.`}
                        </p>

                        {/* Onboarding steps */}
                        {onboarding && !allDone && (
                            <div className="flex flex-wrap gap-3 mt-6">
                                <StepBadge label="Account Created" done={onboarding.steps.account_created} />
                                <StepBadge label="Vendor Assigned" done={onboarding.steps.vendor_assigned} />
                                <StepBadge label="Token Generated" done={onboarding.steps.token_generated} />
                                <StepBadge label="First API Call" done={onboarding.steps.first_api_call} />
                            </div>
                        )}

                        <div className="flex gap-4 mt-8">
                            <Link href="/documentation">
                                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 bg-white font-semibold text-sm shadow-sm hover:bg-gray-50 flex gap-2">
                                    <FileText size={18} /> View API Docs
                                </Button>
                            </Link>
                            <Link href="/integration">
                                <Button className="h-12 px-6 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-semibold text-sm shadow-lg shadow-[#129426]/10 flex gap-2">
                                    <Zap size={18} /> Generate Token
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Resources Section */}
            <div className="space-y-6">
                <h3 className="text-[24px] font-semibold text-[#060B1E] leading-[130%]">Quick Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResourceCard
                        title="API Documentation"
                        description="Explore detailed guides, request/response examples, and everything you need to integrate all endpoints smoothly."
                        icon={<BookOpen className="text-white" size={20} />}
                        href="/documentation"
                    />
                    <ResourceCard
                        title="Security Best Practices"
                        description="Learn recommended security measures to protect your keys, secure requests, and keep your integration safe and compliant."
                        icon={<Shield className="text-white" size={20} />}
                        href="/documentation"
                    />
                    <ResourceCard
                        title="Data Quality Standards"
                        description="Review required formats, validation rules, and guidelines to ensure every submission meets our quality expectations."
                        icon={<Zap className="text-white" size={20} />}
                        href="/documentation"
                    />
                    <ResourceCard
                        title="Support & Contact"
                        description="Reach out to our team for help with setup, troubleshooting, or questions about your integration and account."
                        icon={<LifeBuoy className="text-white" size={20} />}
                        href="/documentation"
                    />
                </div>
            </div>
        </div>
    );
}

function StepBadge({ label, done }: { label: string; done: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold border",
            done ? "bg-[#C6EDE5] text-[#129426] border-[#129426]/10" : "bg-white text-[#060B1E]/40 border-[#DFE1E6]"
        )}>
            {done && <Check size={14} strokeWidth={3} />}
            {label}
        </div>
    );
}

function ResourceCard({ title, description, icon, href }: { title: string; description: string; icon: React.ReactNode; href: string }) {
    return (
        <Link href={href} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group flex flex-col gap-6">
            <div className="w-12 h-12 bg-[#129426] rounded-full flex items-center justify-center shadow-lg shadow-[#129426]/10">
                {icon}
            </div>
            <div className="space-y-3 flex-1">
                <h4 className="text-[20px] font-semibold text-[#060B1E] leading-[130%]">{title}</h4>
                <p className="text-[14px] font-normal leading-[150%] text-[#060B1E]/60">{description}</p>
            </div>
            <button className="flex items-center gap-2 text-[#129426] font-semibold text-sm group/btn w-fit">
                View <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </Link>
    );
}
