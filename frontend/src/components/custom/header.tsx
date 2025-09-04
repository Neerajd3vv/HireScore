"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { User, Settings, LayoutDashboard, LogOut, ChevronDown, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
function Header() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getInitials = () => {
        const first = session?.user?.firstname || ""
        const last = session?.user?.lastname || ""
        if (first && last) return (first[0] + last[0]).toUpperCase()
        if (first) return first.length > 1 ? first.substring(0, 2).toUpperCase() : first[0].toUpperCase()
        return "?"
    }

    const handleSignOut = () => {
        setOpen(false)
        signOut()
    }

    return (
        <header
            className="w-full fixed top-0 z-50 bg-transparent backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-7 h-7 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        HireScore
                    </h1>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className={cn(
                            "flex items-center cursor-pointer gap-2 p-1 rounded-full transition-all duration-200 ease-in-out",
                            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400/40",
                            "group relative",
                        )}
                    >
                        {session?.user?.imgUrl ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full blur-sm opacity-0 group-hover:opacity transition-opacity duration-300" />
                                <Image
                                    width={40}
                                    height={40}
                                    src={session.user.imgUrl || "/placeholder.svg"}
                                    alt="User avatar"
                                    className="relative w-10 h-10 rounded-full border-2 border-white/20 group-hover:border-indigo-400/50 shadow-lg object-cover transition-all duration-300"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                                <div className="relative w-10 h-10 rounded-full border-2 border-white/20 group-hover:border-indigo-400/50 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-all duration-300">
                                    {getInitials()}
                                </div>
                            </div>
                        )}
                        <ChevronDown
                            className={cn("w-4 h-4 text-white transition-transform duration-200", open && "rotate-180")}
                        />
                    </button>

                    {open && (
                        <>
                            <div className="fixed  inset-0 z-40" onClick={() => setOpen(false)} />
                            <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0f] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 text-sm z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <div className="flex items-center gap-3 ">
                                        {session?.user?.imgUrl ? (
                                            <Image
                                                width={32}
                                                height={32}
                                                src={session.user.imgUrl || "/placeholder.svg"}
                                                alt="User avatar"
                                                className="w-8 h-8 rounded-full border border-white/10 object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs">
                                                {getInitials()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate">
                                                {session?.user?.firstname} {session?.user?.lastname}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    {/* Dashboard */}
                                    <button
                                        disabled={!session}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 group ${session
                                            ? "text-gray-300 hover:bg-white/10 hover:text-white"
                                            : "text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </button>

                                    {/* Profile */}
                                    <button
                                        disabled={!session}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 group ${session
                                            ? "text-gray-300 hover:bg-white/10 hover:text-white"
                                            : "text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </button>

                                    {/* Settings */}
                                    <button
                                        disabled={!session}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 group ${session
                                            ? "text-gray-300 hover:bg-white/10 hover:text-white"
                                            : "text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                {/* Auth Section */}
                                <div className="border-t border-white/10 pt-1">
                                    {session ? (
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-150 group"
                                        >
                                            <LogOut className="w-4 h-4 transition-colors" />
                                            <span>Sign out</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push("/signin")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-colors duration-150 group"
                                        >
                                            <LogIn className="w-4 h-4 transition-colors" />
                                            <span>Sign in</span>
                                        </button>
                                    )}
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
