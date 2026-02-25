"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Radio, Database, BookOpen, Settings, LogOut, Hexagon,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

const navItems = [
    { href: "/dashboard", label: "FEED", icon: Radio },
    { href: "/dashboard/registry", label: "REGISTRY", icon: Database },
    { href: "/dashboard/academy", label: "ACADEMY", icon: BookOpen },
    { href: "/dashboard/settings", label: "SETTINGS", icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#050505]/90 backdrop-blur-xl border-r border-white/[0.06] z-40 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/[0.04]">
                <Link href="/" className="flex items-center gap-3">
                    <Hexagon className="w-5 h-5 text-gold stroke-[1]" />
                    <span className="font-mono text-[10px] text-gold tracking-[0.35em]">GESTALTUNG</span>
                </Link>
            </div>

            {/* User */}
            <div className="px-6 py-5 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-gold">{user?.avatar || "??"}</span>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] text-white/80 tracking-wider">{user?.name || "UNKNOWN"}</p>
                        <p className="font-mono text-[8px] text-white/30 tracking-wider">{user?.role || "GUEST"}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${active
                                    ? "bg-gold/[0.06] border border-gold/10"
                                    : "hover:bg-white/[0.03] border border-transparent"
                                }`}
                        >
                            {/* Gold dot */}
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? "bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "bg-white/10 group-hover:bg-white/20"
                                }`} />
                            <item.icon className={`w-4 h-4 stroke-[1.5] transition-colors duration-300 ${active ? "text-gold" : "text-white/30 group-hover:text-white/50"
                                }`} />
                            <span className={`font-mono text-[9px] tracking-[0.2em] transition-colors duration-300 ${active ? "text-gold" : "text-white/40 group-hover:text-white/60"
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/[0.04]">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.03] transition-all duration-300"
                >
                    <LogOut className="w-4 h-4 stroke-[1.5]" />
                    <span className="font-mono text-[9px] tracking-[0.2em]">DISCONNECT</span>
                </button>
            </div>

            {/* System status */}
            <div className="px-6 py-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-white/20 tracking-wider">SYSTEM ONLINE</span>
                </div>
            </div>
        </aside>
    );
}
