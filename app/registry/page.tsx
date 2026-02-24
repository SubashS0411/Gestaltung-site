"use client";

import PageShell from "@/components/layout/page-shell";
import { motion } from "framer-motion";
import { MessageSquare, Users, Clock, ArrowUpRight, Search } from "lucide-react";

const threads = [
    { title: "Optimizing Framer Motion Performance", author: "CIPHER-7", replies: 42, time: "2h ago", hot: true },
    { title: "Lenis Scroll Physics — Deep Dive", author: "VOID-ARCHITECT", replies: 28, time: "4h ago", hot: true },
    { title: "Tailwind Dark Mode Strategies", author: "NODE-451", replies: 15, time: "6h ago", hot: false },
    { title: "Next.js App Router Advanced Patterns", author: "ARCHITECT-X", replies: 33, time: "8h ago", hot: false },
    { title: "Cinematic Web Design Principles", author: "GOLD-STANDARD", replies: 56, time: "12h ago", hot: true },
    { title: "Glassmorphism in Production — 2026", author: "CRYSTAL-NODE", replies: 21, time: "1d ago", hot: false },
];

export default function RegistryPage() {
    return (
        <PageShell sectionNumber="03" title="REGISTRY" subtitle="KNOWLEDGE ARCHIVE & COMMUNITY TRANSMISSIONS">
            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass-card p-4 mb-8 flex items-center gap-3"
            >
                <Search className="w-4 h-4 text-white/20 stroke-[1.5]" />
                <input
                    type="text"
                    placeholder="SEARCH TRANSMISSIONS..."
                    className="flex-1 bg-transparent font-mono text-xs text-white/90 tracking-[0.1em] placeholder:text-white/30 focus:outline-none"
                />
                <span className="font-mono text-[8px] text-white/30 border border-white/[0.1] px-2 py-1 rounded">⌘K</span>
            </motion.div>

            {/* Thread list */}
            <div className="space-y-2">
                {threads.map((t, i) => (
                    <motion.div
                        key={t.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        whileHover={{ x: 4 }}
                        className="glass-card p-5 group cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    {t.hot && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                                    <h3 className="font-serif text-sm text-white/90 tracking-wide truncate group-hover:text-gold transition-colors duration-500">
                                        {t.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 text-white/50 font-mono text-[9px] tracking-wider">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3 stroke-[1.5] text-gold/60" />{t.author}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 stroke-[1.5] text-gold/60" />{t.replies}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1.5] text-gold/60" />{t.time}</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-white/8 group-hover:text-gold group-hover:rotate-12 transition-all duration-500 shrink-0 mt-1" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageShell>
    );
}
