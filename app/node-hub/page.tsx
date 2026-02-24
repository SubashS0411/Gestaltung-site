"use client";

import PageShell from "@/components/layout/page-shell";
import { motion, useInView } from "framer-motion";
import { Globe, Server, Activity, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [c, setC] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        let f: number; const s = performance.now();
        const tick = (n: number) => { const p = Math.min((n - s) / 2000, 1); setC(Math.floor((1 - Math.pow(1 - p, 4)) * target)); if (p < 1) f = requestAnimationFrame(tick); };
        f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f);
    }, [inView, target]);
    return <span ref={ref}>{c.toLocaleString()}{suffix}</span>;
}

const nodes = [
    { id: "NODE-001", name: "ALPHA NEXUS", region: "EU-WEST", status: "active", latency: "12ms", load: 34 },
    { id: "NODE-042", name: "VOID RELAY", region: "US-EAST", status: "active", latency: "8ms", load: 67 },
    { id: "NODE-128", name: "GOLD GATE", region: "ASIA-PAC", status: "active", latency: "45ms", load: 22 },
    { id: "NODE-256", name: "OBSIDIAN CORE", region: "EU-CENTRAL", status: "maintenance", latency: "—", load: 0 },
    { id: "NODE-512", name: "CIPHER BRIDGE", region: "US-WEST", status: "active", latency: "15ms", load: 89 },
];

export default function NodeHubPage() {
    return (
        <PageShell sectionNumber="04" title="NODE HUB" subtitle="DECENTRALIZED INFRASTRUCTURE MONITORING">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                    { label: "NODES", value: 482, icon: Server },
                    { label: "UPTIME", value: 99, suffix: ".97%", icon: Activity },
                    { label: "REGIONS", value: 12, icon: Globe },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} className="glass-card p-5">
                        <s.icon className="w-4 h-4 text-gold stroke-[1.5] mb-3" />
                        <p className="font-serif text-2xl text-white"><Counter target={s.value} suffix={s.suffix || ""} /></p>
                        <p className="font-mono text-[8px] text-white/40 tracking-[0.2em] mt-1">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Node list */}
            <div className="space-y-2">
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 4 }}
                        className="glass-card p-5 group cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-2 h-2 rounded-full", node.status === "active" ? "bg-emerald-400" : "bg-amber-400")} />
                                <div>
                                    <h3 className="font-serif text-sm text-white/90 tracking-wide group-hover:text-gold transition-colors duration-500">{node.name}</h3>
                                    <div className="flex gap-4 mt-1 font-mono text-[8px] text-white/50 tracking-wider">
                                        <span>{node.id}</span>
                                        <span>{node.region}</span>
                                        <span>PING: {node.latency}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {node.load > 0 && (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-20 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${node.load}%` }}
                                                transition={{ delay: 0.3, duration: 0.8 }}
                                                viewport={{ once: true }}
                                                className={cn("h-full rounded-full", node.load > 80 ? "bg-amber-400/80" : "bg-gold/80")}
                                            />
                                        </div>
                                        <span className="font-mono text-[8px] text-white/50 w-6">{node.load}%</span>
                                    </div>
                                )}
                                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-gold transition-all duration-500" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageShell>
    );
}
