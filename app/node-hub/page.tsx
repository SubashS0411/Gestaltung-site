"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { NODE_THREADS, TOP_CONTRIBUTORS, LIVE_TRANSMISSIONS } from "@/lib/data";
import { MessageSquare, Heart, Flame, Search, Terminal, ArrowUpRight, Code, AlertCircle, Radio } from "lucide-react";
import PageShell from "@/components/layout/page-shell";

export default function NodeHubPage() {
    const [activeThread, setActiveThread] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredThreads = searchQuery
        ? NODE_THREADS.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        : NODE_THREADS;

    return (
        <PageShell sectionNumber="02" title="NODE HUB" subtitle="ELITE FREQUENCY — LIVE DESIGN-ENGINEERING TRANSMISSIONS">
            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 stroke-[1]" />
                <input
                    type="text"
                    placeholder="Search threads, tags, architects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-12 py-3.5 font-mono text-sm text-white/90 placeholder:text-white/70 focus:outline-none focus:border-gold/30 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-white/80 tracking-wider bg-white/[0.04] px-2 py-1 rounded">⌘K</span>
            </div>

            {/* 3-Column Terminal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_260px] gap-6">
                {/* LEFT — Active Threads */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal className="w-3.5 h-3.5 text-gold stroke-[1]" />
                        <span className="font-mono text-[9px] text-gold tracking-[0.3em]">ACTIVE THREADS</span>
                    </div>
                    {filteredThreads.map((thread, i) => (
                        <motion.div
                            key={thread.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setActiveThread(activeThread === thread.id ? null : thread.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-500 border ${activeThread === thread.id
                                    ? "bg-gold/[0.05] border-gold/20"
                                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[7px] text-gold">{thread.avatar}</div>
                                <span className="font-mono text-[8px] text-gold/80 tracking-wider">{thread.author}</span>
                                {thread.hot && <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />}
                                {thread.status === "RESOLVED" && <span className="font-mono text-[6px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">RESOLVED</span>}
                                {thread.status === "PINNED" && <span className="font-mono text-[6px] text-gold bg-gold/10 px-1.5 py-0.5 rounded">PINNED</span>}
                            </div>
                            <h4 className="font-mono text-[11px] text-white leading-snug mb-2 line-clamp-2">{thread.title}</h4>
                            <div className="flex items-center gap-3 font-mono text-[7px] text-white/80">
                                <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5 stroke-[1]" />{thread.replies}</span>
                                <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5 stroke-[1]" />{thread.likes}</span>
                                <span>{thread.timestamp}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CENTER — Live Transmissions Feed */}
                <div className="border border-white/[0.06] rounded-xl bg-white/[0.01] overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-[9px] text-gold tracking-[0.3em]">LIVE TRANSMISSIONS</span>
                        <span className="font-mono text-[7px] text-white/80 tracking-wider ml-auto">{LIVE_TRANSMISSIONS.length} ACTIVE</span>
                    </div>

                    <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        {LIVE_TRANSMISSIONS.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`p-4 rounded-lg border ${msg.type === "SYSTEM" ? "bg-gold/[0.03] border-gold/10" :
                                        msg.type === "CODE" ? "bg-blue-500/[0.03] border-blue-500/10" :
                                            msg.type === "REVIEW" ? "bg-purple-500/[0.03] border-purple-500/10" :
                                                "bg-white/[0.02] border-white/[0.04]"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[6px] text-gold">{msg.avatar}</div>
                                    <span className="font-mono text-[8px] text-gold/80 tracking-wider">{msg.author}</span>
                                    <span className={`font-mono text-[6px] tracking-wider px-1.5 py-0.5 rounded ${msg.type === "SYSTEM" ? "text-gold bg-gold/10" :
                                            msg.type === "CODE" ? "text-blue-400 bg-blue-400/10" :
                                                msg.type === "REVIEW" ? "text-purple-400 bg-purple-400/10" :
                                                    "text-white/80 bg-white/5"
                                        }`}>{msg.type}</span>
                                    <span className="font-mono text-[7px] text-white/80 ml-auto">{msg.timestamp}</span>
                                </div>
                                {msg.type === "CODE" ? (
                                    <pre className="font-mono text-[10px] text-white/90 bg-[#050505] rounded p-3 overflow-x-auto"><code>{msg.content}</code></pre>
                                ) : (
                                    <p className="font-mono text-[11px] text-white/90 leading-relaxed">{msg.content}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Bespoke Feedback section */}
                    <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center gap-2 mb-3">
                            <Code className="w-3.5 h-3.5 text-gold stroke-[1]" />
                            <span className="font-mono text-[8px] text-gold tracking-[0.3em]">BESPOKE FEEDBACK</span>
                        </div>
                        <textarea
                            placeholder="> Paste code for peer review..."
                            className="w-full h-20 bg-[#050505] border border-white/[0.06] rounded-lg px-4 py-3 font-mono text-xs text-white/90 placeholder:text-white/70 resize-none focus:outline-none focus:border-gold/20 transition-colors"
                        />
                        <button className="mt-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg font-mono text-[9px] text-gold tracking-wider hover:bg-gold hover:text-black transition-all">
                            SUBMIT FOR REVIEW
                        </button>
                    </div>
                </div>

                {/* RIGHT — Top Contributors */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                        <Radio className="w-3.5 h-3.5 text-gold stroke-[1]" />
                        <span className="font-mono text-[9px] text-gold tracking-[0.3em]">ARCHITECTS</span>
                    </div>
                    {TOP_CONTRIBUTORS.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-gold/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[8px] text-gold">{c.avatar}</div>
                                <div>
                                    <p className="font-mono text-xs text-white group-hover:text-gold transition-colors tracking-wider">{c.name}</p>
                                    <p className="font-mono text-[7px] text-white/80 tracking-wider">{c.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between font-mono text-[7px] text-white/80 tracking-wider">
                                <span>{c.contributions} contributions</span>
                                <span>{c.streak}d streak 🔥</span>
                            </div>
                            <div className="font-mono text-[7px] text-gold/80 mt-2 tracking-wider">{c.specialty}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tag Cloud */}
            <div className="mt-12 flex flex-wrap gap-2">
                {["#PERFORMANCE", "#SHADERS", "#TYPOGRAPHY", "#MOBILE", "#MOTION", "#CSS", "#NEXTJS", "#SCROLL", "#THREE", "#DESIGN"].map((tag) => (
                    <button key={tag} onClick={() => setSearchQuery(tag)} className="tag-pill text-[8px] hover:border-gold/80 hover:text-gold">
                        {tag}
                    </button>
                ))}
            </div>
        </PageShell>
    );
}
