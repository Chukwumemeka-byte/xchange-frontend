"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useVendors, useCreateVendor, useVendorStats, useVendorActivities, useGenerateToken, useUpdateVendor } from "@/hooks/use-vendors";
import type { Vendor } from "@/lib/api";

export default function VendorsPage() {
  const [view, setView] = useState<"list" | "add" | "detail">("list");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const { data: vendors = [], isLoading, refetch } = useVendors();

  if (view === "add") {
    return <AddVendorForm onBack={() => setView("list")} />;
  }

  if (view === "detail" && selectedVendorId) {
    const vendor = vendors.find((v) => v.id === selectedVendorId);
    if (vendor) return <VendorDetailView vendor={vendor} onBack={() => setView("list")} />;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white">
        <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Vendors</h2>
      </div>

      <div className="flex justify-between items-end">
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white w-fit min-w-[280px]">
          <div className="p-6 border border-[#DFE1E6] rounded-[24px] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#DFE1E6] flex items-center justify-center text-[#129426] bg-[#F9FAFB]">
                <Store size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#060B1E]/40 mb-1">Total Vendors</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-[28px] font-bold text-[#060B1E] font-interTight leading-none">{isLoading ? "..." : vendors.length}</h3>
                  <Badge variant="outline" className="h-5 rounded-full border-[#DFE1E6] bg-gray-50 text-[10px] font-bold text-[#060B1E]/40">+0</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[#DFE1E6] text-[#060B1E]/60 shadow-sm hover:bg-gray-50" onClick={() => refetch()}>
            <RefreshCcw size={20} />
          </Button>
          <Button onClick={() => setView("add")} className="gap-2 h-12 px-6 rounded-xl bg-[#447185] hover:bg-[#385b6c] transition-all font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-[#447185]/10">
            <Plus size={18} /> Add Vendor
          </Button>
        </div>
      </div>

      <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
        <div className="bg-white border border-[#DFE1E6] rounded-[24px] overflow-hidden shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20" size={18} />
              <Input placeholder="Search..." className="pl-12 h-10 rounded-full border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/40 shadow-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-[#DFE1E6] text-[#060B1E]/60 shadow-sm hover:bg-gray-50" onClick={() => refetch()}>
                <RefreshCcw size={18} />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-[#DFE1E6] text-[#060B1E]/60 shadow-sm hover:bg-gray-50">
                <SlidersHorizontal size={18} />
              </Button>
            </div>
          </div>

          <div className="border border-gray-50 rounded-[20px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F9FAFB]/50">
                  <tr className="text-[#060B1E]/30 text-[10px] uppercase font-black tracking-[0.2em] whitespace-nowrap border-b border-[#DFE1E6]/50">
                    <th className="px-6 py-5 w-[1%]"><Checkbox className="rounded-md border-[#DFE1E6]" /></th>
                    <th className="px-6 py-5">Vendor ID</th>
                    <th className="px-6 py-5">Vendor Name</th>
                    <th className="px-6 py-5">Email</th>
                    <th className="px-6 py-5">Onboarding Date</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE1E6]/30 font-interTight">
                  {isLoading && (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">Loading...</td></tr>
                  )}
                  {!isLoading && vendors.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">No vendors found</td></tr>
                  )}
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-[#F9FAFB]/50 transition-all whitespace-nowrap group cursor-pointer"
                      onClick={() => { setSelectedVendorId(vendor.id); setView("detail"); }}
                    >
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}><Checkbox className="rounded-md border-[#DFE1E6]" /></td>
                      <td className="px-6 py-5 font-bold text-[#326D8E] text-[14px] hover:underline underline-offset-4 decoration-2">{vendor.token_prefix || vendor.id.slice(0, 8)}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{vendor.name}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{vendor.contact_email}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{new Date(vendor.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={cn(
                          "rounded-full font-bold text-[10px] uppercase tracking-wider px-3 py-1 bg-white",
                          vendor.status === "active" ? "text-[#129426] border-[#129426]/20" :
                            vendor.status === "pending" ? "text-[#F3C13D] border-[#F3C13D]/20" :
                              "text-[#DF1C41] border-[#DF1C41]/20"
                        )}>
                          <div className={cn("w-1 h-1 rounded-full mr-1.5",
                            vendor.status === "active" ? "bg-[#129426]" : vendor.status === "pending" ? "bg-[#F3C13D]" : "bg-[#DF1C41]"
                          )} />
                          {vendor.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Badge variant="outline" className="rounded-full font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-[#DFE1E6] text-[#060B1E]">
                          {vendor.can_write_back ? "Full" : "Read only"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-[#DFE1E6]/50 flex items-center justify-between">
              <p className="text-[12px] font-bold text-[#060B1E] font-interTight">Page 1 of 1</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-[#DFE1E6]/50"><ChevronLeft size={16} /></Button>
                <Button variant="secondary" className="w-8 h-8 p-0 rounded-lg bg-[#129426] text-white font-bold text-xs">1</Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-[#DFE1E6]/50"><ChevronRight size={16} /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddVendorForm({ onBack }: { onBack: () => void }) {
  const createMutation = useCreateVendor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");

  const handleSubmit = () => {
    if (!name || !email) { toast.error("Name and email are required"); return; }
    createMutation.mutate(
      { name, contact_email: email, can_write_back: permission === "write", status: "active" },
      {
        onSuccess: () => { toast.success("Vendor created!"); onBack(); },
        onError: (err) => toast.error(err.message || "Failed to create vendor"),
      }
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white">
        <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Vendors</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack} className="h-10 px-6 rounded-xl border-[#DFE1E6] text-[#060B1E] font-bold shadow-sm">Cancel</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="h-10 px-6 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold shadow-sm">
            {createMutation.isPending ? "Saving..." : "Share"}
          </Button>
        </div>
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-[#060B1E] font-bold text-[14px] py-4">
        <ArrowLeft size={18} /> Add Vendor
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
        <div className="space-y-8">
          <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#060B1E] font-interTight leading-none">Vendor Details</h3>
                <HelpCircle size={16} className="text-[#060B1E]/30" />
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Vendor Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter vendor name" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vendor@example.com" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                  <div className="p-4 bg-[#F9FAFB] border border-[#DFE1E6]/50 rounded-xl flex gap-3 text-[#060B1E]/40">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p className="text-[12px] font-bold leading-relaxed">Access credentials will be sent to this address.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#060B1E] font-interTight leading-none">Permissions</h3>
                <HelpCircle size={16} className="text-[#060B1E]/30" />
              </div>
              <div className="p-4 bg-[#F9FAFB] border border-[#DFE1E6]/50 rounded-xl flex gap-3 text-[#060B1E]/40">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p className="text-[12px] font-bold leading-relaxed">Choose what permissions the vendor would need.</p>
              </div>
              <RadioGroup value={permission} onValueChange={setPermission} className="flex items-center gap-12 pt-2">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="read" id="read" className="border-[#DFE1E6] text-[#129426] ring-[#129426]" />
                  <Label htmlFor="read" className="font-bold text-[15px] text-[#060B1E]">Read</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="write" id="write" className="border-[#DFE1E6] text-[#129426] ring-[#129426]" />
                  <Label htmlFor="write" className="font-bold text-[15px] text-[#060B1E]/40">Write</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorDetailView({ vendor, onBack }: { vendor: Vendor; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");
  const { data: vendorStats } = useVendorStats(vendor.id);
  const { data: vendorActivities } = useVendorActivities(vendor.id);
  const updateMutation = useUpdateVendor();
  const tokenMutation = useGenerateToken();

  const handleDeactivate = () => {
    updateMutation.mutate(
      { id: vendor.id, data: { status: "deactivated" } },
      { onSuccess: () => { toast.success("Vendor deactivated"); onBack(); } }
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white">
        <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Vendors</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDeactivate} disabled={updateMutation.isPending} className="h-10 px-6 rounded-xl border-[#FFEBEB] text-[#FF4D4D] font-bold font-interTight hover:bg-[#FFEBEB]/10">
            Deactivate
          </Button>
          <Button
            onClick={() => tokenMutation.mutate(vendor.id, {
              onSuccess: (d) => { navigator.clipboard.writeText(d.token); toast.success("Token generated & copied!"); },
              onError: (e) => toast.error(e.message),
            })}
            disabled={tokenMutation.isPending}
            className="h-10 px-8 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold font-interTight"
          >
            {tokenMutation.isPending ? "Generating..." : "Generate Token"}
          </Button>
        </div>
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-[#060B1E] font-bold text-[14px] py-2">
        <ArrowLeft size={18} /> Vendor List
      </button>

      <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
        <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-[#DFE1E6] flex items-center justify-center text-[#129426] bg-[#F9FAFB]">
              <Store size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#060B1E]/30 mb-0.5">Vendor</p>
              <h3 className="text-[24px] font-bold text-[#129426] font-interTight leading-none">{vendor.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Uptime (30d)", value: vendorStats ? `${vendorStats.uptime_pct.toFixed(2)}%` : "..." },
              { label: "Total Requests", value: vendorStats ? String(vendorStats.total_requests) : "..." },
              { label: "No. of Downloads", value: vendorStats ? String(vendorStats.downloads) : "..." },
              { label: "No. of Uploads", value: vendorStats ? String(vendorStats.uploads) : "..." },
            ].map((stat, i) => (
              <div key={i} className="p-5 border border-[#DFE1E6] rounded-[20px] bg-white space-y-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#060B1E]/30">{stat.label}</p>
                <h4 className="text-[20px] font-bold text-[#060B1E]/80 font-interTight">{stat.value}</h4>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-[#F9FAFB] border border-[#DFE1E6]/50 rounded-xl w-fit font-interTight">
              <button onClick={() => setActiveTab("overview")} className={cn("h-9 px-6 rounded-lg font-bold text-[12px] transition-all", activeTab === "overview" ? "bg-white text-[#060B1E] shadow-sm" : "text-[#060B1E]/40")}>Overview</button>
              <button onClick={() => setActiveTab("activity")} className={cn("h-9 px-6 rounded-lg font-bold text-[12px] transition-all", activeTab === "activity" ? "bg-white text-[#060B1E] shadow-sm" : "text-[#060B1E]/40")}>Activity Log</button>
            </div>

            {activeTab === "overview" ? (
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
                  <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white space-y-8">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-[#060B1E] font-interTight leading-none">Vendor/Tool Info</h3>
                      <HelpCircle size={14} className="text-[#060B1E]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-y-8">
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Vendor ID</p><p className="text-[14px] font-bold text-[#129426] font-interTight">{vendor.id.slice(0, 12)}...</p></div>
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Vendor Name</p><p className="text-[14px] font-bold text-[#060B1E] font-interTight">{vendor.name}</p></div>
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Onboarding Date</p><p className="text-[14px] font-bold text-[#060B1E] font-interTight">{new Date(vendor.created_at).toLocaleDateString()}</p></div>
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Email</p><p className="text-[14px] font-bold text-[#060B1E] font-interTight">{vendor.contact_email}</p></div>
                    </div>
                  </div>
                </div>
                <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
                  <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white space-y-8">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-[#060B1E] font-interTight leading-none">Status Info</h3>
                      <HelpCircle size={14} className="text-[#060B1E]/30" />
                    </div>
                    <div className="space-y-8">
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Status</p>
                        <Badge variant="outline" className="bg-[#D6F5DE] border-none text-[#129426] font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">{vendor.status}</Badge>
                      </div>
                      <div><p className="text-[11px] font-black uppercase tracking-widest text-[#060B1E]/30 mb-2">Permissions</p>
                        <Badge variant="outline" className="bg-[#F9FAFB] border-[#DFE1E6]/50 text-[#060B1E]/40 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">{vendor.can_write_back ? "Full" : "Read only"}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
                <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white space-y-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-[#060B1E] font-interTight leading-none">Vendor Activities</h3>
                    <HelpCircle size={14} className="text-[#060B1E]/30" />
                  </div>
                  <div className="border border-gray-50 rounded-[24px] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB]/50 border-b border-[#DFE1E6]/50">
                        <tr className="text-[#060B1E]/30 text-[9px] uppercase font-black tracking-[0.2em] whitespace-nowrap">
                          <th className="px-6 py-4">Timestamp</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Path</th>
                          <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-interTight">
                        {(!vendorActivities?.results || vendorActivities.results.length === 0) && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">No activities yet</td></tr>
                        )}
                        {vendorActivities?.results.map((act, i) => (
                          <tr key={i} className="text-[12px] font-bold text-[#060B1E] hover:bg-gray-50/50 transition-all">
                            <td className="px-6 py-4 text-[#060B1E]/40 font-semibold">{new Date(act.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-[#F0F2FE] text-[#7B86EA] border-none text-[9px] font-bold px-2 py-0.5 uppercase">{act.method}</Badge>
                            </td>
                            <td className="px-6 py-4 text-[#326D8E]">{act.path}</td>
                            <td className="px-6 py-4 text-right">
                              <div className={cn("flex items-center justify-end gap-1.5", act.status_code < 400 ? "text-[#129426]" : "text-[#DF1C41]")}>
                                <div className={cn("w-1 h-1 rounded-full", act.status_code < 400 ? "bg-[#129426]" : "bg-[#DF1C41]")} />
                                {act.status_code}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
