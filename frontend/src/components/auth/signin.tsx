"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/loginSchema";
import { LoginFormData } from "@/types";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export default function SignInForm({ setShowSignUpModal, setShowSignInModal }: { setShowSignUpModal: React.Dispatch<React.SetStateAction<boolean>>; setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>; }) {

    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { register, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleGoogleSignIn = () => {
        setGoogleLoading(true);
        signIn("google", { callbackUrl: "/main" });
    };


    const onSubmit = async (data: LoginFormData) => {

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        })

        if (result?.error) {
            const { message, field } = JSON.parse(result?.error)
            if (field === "email") {
                setError("email", { type: "manual", message })
            } else if (field === "password") {
                setError("password", { type: "manual", message });
            }
            return
        }
        router.push("/test-page")

    };

    return (
        <Card className="w-full max-w-lg border border-white/10 bg-gradient-to-bl from-[#000000]  via-[#000814] to-[#000000]">
            <CardHeader className="space-y-1 text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#0a0a0f] via-[#111827] to-[#0f172a] border border-white/20 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <CardTitle className="text-2xl text-[#edf6f9]">Welcome back</CardTitle>
                <CardDescription className="text-slate-400 font-grotesk">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Google Sign-in Button */}
                <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-11 cursor-pointer text-[#edf6f9] border border-white/20 transition-colors bg-transparent "
                    type="button"
                >
                    {googleLoading ? (
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    )}
                    {googleLoading ? "Connecting to Google..." : "Sign up with Google"}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#000000] px-2 text-slate-400 font-medium">Or continue with email</span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Input type="email" placeholder="Email address" className="h-11 text-[#edf6f9] border border-white/20" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="h-11 text-[#edf6f9] border border-white/20"
                                {...register("password")}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                                {showPassword ? <LuEye /> : <LuEyeOff />}
                            </span>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-end text-sm">
                        <a href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <Button className="w-full h-11 cursor-pointer bg-gradient-to-tr from-[#0a0a0f] via-[#111827] to-[#0f172a] text-white font-medium hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]
                            hover:from-cyan-600  hover:via-blue-700 hover:to-indigo-800
                            hover:border-none transition-all duration-300" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : "Sign in"}
                    </Button>
                </form>

                {/* Switch Link */}
                <div className="text-center">
                    <div className="text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <span onClick={() => {
                            setShowSignInModal(false)
                            setShowSignUpModal(true)
                        }} className="text-blue-600 cursor-pointer hover:text-blue-500 font-medium">
                            Sign up
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
