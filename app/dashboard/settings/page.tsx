"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { User, Shield, Palette, Bell, LogOut } from "lucide-react";

export default function DashboardSettingsPage() {
    const { user, logout } = useAuthStore();

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <span className="font-mono text-[10px] text-gold tracking-[0.5em] block mb-2">CONFIGURATION</span>
                <h1 className="font-serif text-4xl text-white tracking-tight">Settings</h1>
            </motion.div>

            <div className="space-y-4">
                {[
                    { icon: User, label: "PROFILE", desc: `Callsign: ${user?.name || "—"} · Role: ${user?.role || "—"}` },
                    { icon: Shield, label: "SECURITY", desc: "Encrypted channel active · Zero-trust protocol" },
                    { icon: Palette, label: "APPEARANCE", desc: "Theme: Void & Gold · Noise: 4% · Scroll: Lenis" },
                    { icon: Bell, label: "NOTIFICATIONS", desc: "System alerts: Enabled · Node updates: Enabled" },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-6 flex items-center gap-5"
                    >
                        <div className="w-10 h-10 rounded-lg bg-gold/[0.05] border border-gold/10 flex items-center justify-center">
                            <s.icon className="w-4 h-4 text-gold/60 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="font-mono text-[10px] text-white/70 tracking-[0.2em] mb-1">{s.label}</h3>
                            <p className="font-mono text-[10px] text-white/80 tracking-wider">{s.desc}</p>
                        </div>
                    </motion.div>
                ))}

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={logout}
                    className="mt-8 flex items-center gap-3 px-6 py-3 rounded-lg border border-red-500/20 text-red-400/60 hover:bg-red-500/5 hover:text-red-400 transition-all duration-300"
                >
                    <LogOut className="w-4 h-4 stroke-[1.5]" />
                    <span className="font-mono text-[10px] tracking-[0.2em]">DISCONNECT SESSION</span>
                </motion.button>
            </div>
        </div>
    );
}
