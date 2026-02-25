"use client";

import { motion } from "framer-motion";
import { NODES, SYSTEM_UPDATES } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Heart, MessageSquare, ArrowUpRight, Zap, Radio, AlertTriangle, Package } from "lucide-react";

const updateIcons: Record<string, any> = {
    RELEASE: Package,
    NODE: Radio,
    SYSTEM: Zap,
    ALERT: AlertTriangle,
};

export default function DashboardFeed() {
    const { activeNodeId, setActiveNode } = useAppStore();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <span className="font-mono text-[10px] text-gold tracking-[0.5em] block mb-2">LIVE FEED</span>
                    <h1 className="font-serif text-4xl text-white tracking-tight">Neural Network</h1>
                    <p className="font-mono text-xs text-white/40 mt-2 tracking-wider">Real-time transmissions from the collective.</p>
                </motion.div>
            </div>

            {/* System Updates */}
            <div className="mb-10 space-y-2">
                <span className="font-mono text-[9px] text-white/30 tracking-[0.3em] block mb-3">SYSTEM UPDATES</span>
                {SYSTEM_UPDATES.map((u, i) => {
                    const Icon = updateIcons[u.type] || Zap;
                    return (
                        <motion.div
                            key={u.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="flex items-center gap-4 py-3 px-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-gold/10 transition-all duration-300"
                        >
                            <Icon className={`w-3.5 h-3.5 shrink-0 stroke-[1.5] ${u.type === "ALERT" ? "text-amber-400" : "text-gold/50"}`} />
                            <p className="font-mono text-[11px] text-white/60 tracking-wide flex-1">{u.message}</p>
                            <span className="font-mono text-[8px] text-white/20 tracking-wider shrink-0">{u.time}</span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Node Cards */}
            <div className="space-y-4">
                <span className="font-mono text-[9px] text-white/30 tracking-[0.3em] block mb-3">TRANSMISSIONS</span>
                {NODES.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setActiveNode(activeNodeId === node.id ? null : node.id)}
                        className={`group cursor-pointer p-[1px] rounded-xl bg-gradient-to-b from-white/10 to-transparent hover:from-gold/20 hover:to-transparent transition-all duration-500`}
                    >
                        <div className="bg-[#050505] rounded-xl p-6 hover:bg-[#070707] transition-colors duration-300">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center">
                                        <span className="font-mono text-[8px] text-gold">{node.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="font-mono text-[10px] text-white/70 tracking-wider">{node.author}</p>
                                        <p className="font-mono text-[8px] text-white/25 tracking-wider">{node.role} · {node.timestamp}</p>
                                    </div>
                                </div>
                                {node.hot && <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />}
                            </div>

                            <h3 className="font-serif text-lg text-white/90 tracking-wide mb-3 group-hover:text-gold transition-colors duration-500">
                                {node.title}
                            </h3>

                            {/* Expandable content */}
                            <motion.div
                                animate={{ height: activeNodeId === node.id ? "auto" : 0, opacity: activeNodeId === node.id ? 1 : 0 }}
                                className="overflow-hidden"
                            >
                                <p className="font-mono text-[11px] text-white/50 leading-relaxed tracking-wide mb-4">
                                    {node.content}
                                </p>
                            </motion.div>

                            {/* Tags & actions */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex gap-2">
                                    {node.tags.map((tag) => (
                                        <span key={tag} className="tag-pill text-[7px]">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 font-mono text-[9px] text-white/25">
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 stroke-[1.5]" />{node.likes}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 stroke-[1.5]" />{node.replies}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-gold/40 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
