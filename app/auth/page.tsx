"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Hexagon, ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function AuthPage() {
    const [name, setName] = useState("");
    const [phase, setPhase] = useState<"idle" | "linking" | "done">("idle");
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
        if (!name.trim()) return;
        setPhase("linking");
        // Simulate auth handshake
        await new Promise((r) => setTimeout(r, 1500));
        login(name.trim());
        setPhase("done");
        await new Promise((r) => setTimeout(r, 500));
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.02] blur-[120px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        animate={{ rotateZ: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-8"
                    >
                        <Hexagon className="w-16 h-16 text-gold stroke-[0.5]" />
                    </motion.div>
                    <h1 className="font-serif text-3xl text-white tracking-wide mb-2">Initialize Link</h1>
                    <p className="font-mono text-[11px] text-white/80 tracking-wider text-center">
                        Authenticate to access the Neural Hub
                    </p>
                </div>

                {/* Auth card */}
                <div className="glass-card p-8 space-y-6">
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { icon: Shield, label: "SECURE" },
                            { icon: Zap, label: "INSTANT" },
                            { icon: Lock, label: "PRIVATE" },
                        ].map((f) => (
                            <div key={f.label} className="flex flex-col items-center gap-2 py-3">
                                <f.icon className="w-4 h-4 text-gold/40 stroke-[1.5]" />
                                <span className="font-mono text-[7px] text-white/80 tracking-[0.2em]">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div>
                        <label className="font-mono text-[9px] text-white/80 tracking-[0.2em] block mb-2">
                            OPERATOR CALLSIGN
                        </label>
                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 focus-within:border-gold/20 transition-colors">
                            <span className="font-mono text-[11px] text-gold/40">&gt;</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                placeholder="Enter your callsign..."
                                className="flex-1 bg-transparent font-mono text-sm text-white/80 tracking-wider placeholder:text-white/70 focus:outline-none"
                                disabled={phase !== "idle"}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                        onClick={handleLogin}
                        disabled={!name.trim() || phase !== "idle"}
                        whileTap={{ scale: 0.97 }}
                        className="w-full group relative overflow-hidden border border-gold/30 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gold transition-colors duration-700 hover:text-[#050505] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
                    >
                        <span className="absolute inset-0 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {phase === "idle" && <><ArrowRight className="w-3.5 h-3.5" />INITIALIZE LINK</>}
                            {phase === "linking" && (
                                <motion.span animate={{ opacity: [0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                                    ESTABLISHING CONNECTION...
                                </motion.span>
                            )}
                            {phase === "done" && "LINK ESTABLISHED ✓"}
                        </span>
                    </motion.button>
                </div>

                {/* Footer */}
                <p className="font-mono text-[9px] text-white/70 text-center mt-8 tracking-wider">
                    GESTALTUNG PROTOCOL v2.4.0 · ENCRYPTED CHANNEL
                </p>
            </motion.div>
        </div>
    );
}
