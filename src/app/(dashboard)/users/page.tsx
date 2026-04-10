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
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUsers, useCreateUser } from "@/hooks/use-users";

export default function UserManagementPage() {
  const [view, setView] = useState<"list" | "add">("list");
  const { data: users = [], isLoading, refetch } = useUsers();

  if (view === "add") {
    return <AddUserForm onBack={() => setView("list")} />;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white">
        <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">User Management</h2>
      </div>

      <div className="flex justify-between items-end">
        <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white w-fit min-w-[280px]">
          <div className="p-6 border border-[#DFE1E6] rounded-[24px] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#DFE1E6] flex items-center justify-center text-[#129426] bg-[#F9FAFB]">
                <User size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#060B1E]/40 mb-1">Total Users</p>
                <h3 className="text-[28px] font-bold text-[#060B1E] font-interTight leading-none">{isLoading ? "..." : users.length}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[#DFE1E6] text-[#060B1E]/60 shadow-sm hover:bg-gray-50" onClick={() => refetch()}>
            <RefreshCcw size={20} />
          </Button>
          <Button onClick={() => setView("add")} className="gap-2 h-12 px-6 rounded-xl bg-[#447185] hover:bg-[#385b6c] transition-all font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-[#447185]/10">
            <Plus size={18} /> Add User
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
                    <th className="px-6 py-5">User ID</th>
                    <th className="px-6 py-5">Full Name</th>
                    <th className="px-6 py-5">Email</th>
                    <th className="px-6 py-5">Phone</th>
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE1E6]/30 font-interTight">
                  {isLoading && (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">Loading...</td></tr>
                  )}
                  {!isLoading && users.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-[#060B1E]/40 font-semibold">No users found</td></tr>
                  )}
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#F9FAFB]/50 transition-all whitespace-nowrap group">
                      <td className="px-6 py-5"><Checkbox className="rounded-md border-[#DFE1E6]" /></td>
                      <td className="px-6 py-5 font-bold text-[#129426] text-[14px]">{user.username}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{`${user.first_name} ${user.last_name}`.trim() || user.username}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{user.email}</td>
                      <td className="px-6 py-5 font-bold text-[#060B1E] text-[14px]">{user.phone || "—"}</td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={cn(
                          "rounded-full font-bold text-[10px] uppercase tracking-wider px-3 py-1 bg-white",
                          user.role === "super_admin" ? "text-[#129426] border-[#129426]/20" : "text-[#7B86EA] border-[#7B86EA]/20"
                        )}>
                          <div className={cn("w-1 h-1 rounded-full mr-1.5", user.role === "super_admin" ? "bg-[#129426]" : "bg-[#7B86EA]")} />
                          {user.role === "super_admin" ? "Super Admin" : user.role === "support_specialist" ? "Support Specialist" : "Viewer"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 font-bold text-[#060B1E]/40 text-[14px]">
                        {user.last_activity ? new Date(user.last_activity).toLocaleString() : "—"}
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

function AddUserForm({ onBack }: { onBack: () => void }) {
  const createMutation = useCreateUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("support_specialist");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !password) { toast.error("Email and password are required"); return; }
    createMutation.mutate(
      {
        username: email,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        phone,
        password,
      },
      {
        onSuccess: () => { toast.success("User created!"); onBack(); },
        onError: (err) => toast.error(err.message || "Failed to create user"),
      }
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white">
        <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">User Management</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack} className="h-10 px-6 rounded-xl border-[#DFE1E6] text-[#060B1E] font-bold shadow-sm">Discard</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="h-10 px-6 rounded-xl bg-[#129426] hover:bg-[#129426]/90 text-white font-bold shadow-sm">
            {createMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-[#060B1E] font-bold text-[14px] py-4">
        <ArrowLeft size={18} /> Add User
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-8">
          <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#060B1E] font-interTight leading-none">User Details</h3>
                <HelpCircle size={16} className="text-[#060B1E]/30" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">First name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Last name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                  <div className="p-4 bg-[#F9FAFB] border border-[#DFE1E6]/50 rounded-xl flex gap-3 text-[#060B1E]/40">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p className="text-[12px] font-bold leading-relaxed">Access credentials will be sent to this address.</p>
                  </div>
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Phone number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[12px] font-bold text-[#060B1E]/40 uppercase tracking-widest ml-1">Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" className="h-12 rounded-xl border-[#DFE1E6] bg-white px-4 font-bold text-[15px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-[3px] border border-[#DFE1E6] rounded-[28px] bg-white">
            <div className="p-8 border border-[#DFE1E6] rounded-[24px] bg-white shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#060B1E] font-interTight leading-none">User Role</h3>
                <HelpCircle size={16} className="text-[#060B1E]/30" />
              </div>
              <RadioGroup value={role} onValueChange={setRole} className="flex flex-row gap-12 pt-2">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="super_admin" id="super-admin" className="border-[#DFE1E6] text-[#129426] ring-[#129426]" />
                  <Label htmlFor="super-admin" className="font-bold text-[15px] text-[#060B1E]">Super Admin</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="support_specialist" id="support" className="border-[#DFE1E6] text-[#129426] ring-[#129426]" />
                  <Label htmlFor="support" className="font-bold text-[15px] text-[#060B1E]/60">Support Specialist</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
