"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks/use-auth";

const formSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = (values: FormValues) => {
        loginMutation.mutate(
            { username: values.username, password: values.password },
            {
                onSuccess: () => toast.success("Login successful!"),
                onError: (err) => toast.error(err.message || "Invalid credentials"),
            }
        );
    };

    return (
        <div className="flex h-screen w-full max-w-[1440px] mx-auto overflow-hidden bg-white font-interTight">
            {/* Left Section - 790px */}
            <div className="hidden lg:flex w-[790px] relative items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, #C6CBF6 0%, #c0ddf7ff 40%, #c8f1fbff 70%, #cce6f4ff 100%)" }}
            >
                {/* Glassmorphism Container Wrapper */}
                <div className="relative">
                    {/* Background Ellipses */}
                    <Image src="/darker-Ellipse.svg" alt="" width={130} height={130} className="absolute -top-10 right-20 w-[130px] h-auto pointer-events-none opacity-90 z-0" />
                    <Image src="/lighter-Ellipse.svg" alt="" width={130} height={130} className="absolute -bottom-10 left-20 w-[130px] h-auto pointer-events-none opacity-90 z-0" />

                    {/* Glassmorphism Container: 570x600 */}
                    <div
                        className="relative z-10 flex flex-col items-center w-[500px] h-[600px] bg-[#FFFFFF4D] backdrop-blur-[15px] border-[3px] border-white/30 rounded-[24px] p-12 text-center shadow-2xl overflow-hidden"
                    >
                        {/* Card Image */}
                        <div className="mb-auto w-[380px] mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <Image src="/Card.svg" alt="Ingestion Rate Chart" width={380} height={380} className="w-full h-auto" />
                        </div>

                        {/* Content & Transition Dots Group */}
                        <div className="flex flex-col gap-10 items-center">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-[32px] font-semibold leading-[125%] text-[#060B1E]">
                                    Track Data Sharing <br /> in Real-Time
                                </h2>
                                <p className="text-[16px] font-normal leading-[150%] text-[#060B1E]/60 max-w-[420px] mx-auto">
                                    Velit pretium ullamcorper ultricies adipiscing eget orci ut. Tellus risus faucibus sollicitudin magna pretium auctor et nibh. Sed vel et vivamus lorem nec suscipit.
                                </p>
                            </div>

                            {/* Transition Dots */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={cn(
                                        "h-1.5 rounded-full transition-all duration-300",
                                        i === 1 ? "bg-black w-6" : "bg-black/10 w-1.5"
                                    )}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - 650px */}
            <div className="flex-1 lg:w-[650px] flex flex-col p-8 md:p-12 lg:p-16 relative bg-white overflow-y-auto">
                {/* Logo at Top Left */}
                <div className="absolute top-15 left-12 lg:top-16 lg:left-16">
                    <Image src="/logo.svg" alt="COREX Logo" width={40} height={40} className="w-10 h-10" />
                </div>

                <div className="w-full max-w-[420px] mx-auto mt-40 mb-20">
                    <div className="mb-10">
                        <h1 className="text-[32px] font-semibold leading-[125%] text-[#060B1E] mb-2">Welcome back</h1>
                        <p className="text-[16px] font-normal leading-[150%] text-[#060B1E]/60">Glad to see you again. Log in to your account.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[14px] font-semibold text-[#060B1E]">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/20" />
                                                <Input
                                                    placeholder="Enter your username"
                                                    {...field}
                                                    className="pl-12 h-14 bg-white border-black/10 rounded-xl focus:border-[#129426] focus:ring-1 focus:ring-[#129426] transition-all text-[15px] font-medium placeholder:text-black/20"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[14px] font-semibold text-[#060B1E]">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/20" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="pl-12 h-14 bg-white border-black/10 rounded-xl focus:border-[#129426] focus:ring-1 focus:ring-[#129426] transition-all text-[15px] font-medium placeholder:text-black/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        className="w-5 h-5 rounded border-black/10 data-[state=checked]:bg-[#129426] data-[state=checked]:border-[#129426] transition-all"
                                        checked={form.watch("rememberMe")}
                                        onCheckedChange={(checked) => form.setValue("rememberMe", !!checked)}
                                    />
                                    <label htmlFor="rememberMe" className="text-[14px] font-medium text-[#060B1E]/60 cursor-pointer">
                                        Keep me logged in
                                    </label>
                                </div>
                                <button type="button" className="text-[14px] font-semibold text-[#129426] hover:underline transition-all">
                                    Forgot password
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full h-14 text-[16px] font-semibold bg-[#A1D9A7] hover:bg-[#129426]/90 text-white rounded-xl shadow-lg shadow-[#129426]/10 transition-all active:scale-[0.99] disabled:opacity-60"
                            >
                                {loginMutation.isPending ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
