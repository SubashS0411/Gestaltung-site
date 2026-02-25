"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { REGISTRY_ASSETS } from "@/lib/data";
import { Copy, Check, X, ArrowUpRight, Cpu, Zap, Download, Star } from "lucide-react";
import PageShell from "@/components/layout/page-shell";

export default function RegistryPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const selectedItem = REGISTRY_ASSETS.find((r) => r.id === selected);

    const filtered = filter ? REGISTRY_ASSETS.filter((r) => r.category === filter) : REGISTRY_ASSETS;
    const categories = Array.from(new Set(REGISTRY_ASSETS.map((r) => r.category)));

    const copyCode = async (code: string) => {
        try { await navigator.clipboard.writeText(code); } catch { }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PageShell sectionNumber="01" title="REGISTRY" subtitle="THE COMPONENT VAULT — BESPOKE UI PROTOCOLS">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-10">
                <button
                    onClick={() => setFilter(null)}
                    className={`tag-pill text-[8px] ${!filter ? "border-gold/80 text-gold bg-gold/10" : ""}`}
                >
                    ALL
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`tag-pill text-[8px] ${filter === cat ? "border-gold/80 text-gold bg-gold/10" : ""}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 gap-5 space-y-5">
                {filtered.map((item, i) => (
                    <MasonryCard key={item.id} item={item} index={i} onSelect={setSelected} />
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                        onClick={() => setSelected(null)}
                    >
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-white/[0.08] rounded-2xl"
                        >
                            <button onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all">
                                <X className="w-4 h-4" />
                            </button>

                            <div className="p-8 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border ${selectedItem.tier === "FREE" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-gold bg-gold/10 border-gold/20"
                                        }`}>{selectedItem.tier}</span>
                                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{selectedItem.category}</span>
                                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{selectedItem.framework}</span>
                                    {selectedItem.isNew && <span className="font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>}
                                </div>
                                <h2 className="font-serif text-3xl text-white tracking-tight mb-2">{selectedItem.name}</h2>
                                <p className="font-mono text-xs text-white/80 tracking-wide leading-relaxed">{selectedItem.description}</p>
                                <div className="flex items-center gap-6 mt-6 font-mono text-[9px] text-white/80 tracking-wider">
                                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3 stroke-[1]" />{selectedItem.performanceCost}</span>
                                    <span>{selectedItem.size}</span>
                                    <span className="flex items-center gap-1"><Download className="w-3 h-3 stroke-[1]" />{selectedItem.downloads.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-[9px] text-gold tracking-[0.3em]">SOURCE PROTOCOL</span>
                                    <button onClick={() => copyCode(selectedItem.code)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-gold/20 bg-white/[0.02] hover:bg-gold/[0.05] transition-all">
                                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/80" />}
                                        <span className="font-mono text-[9px] text-white/80 tracking-wider">{copied ? "COPIED" : "COPY PROTOCOL"}</span>
                                    </button>
                                </div>
                                <pre className="bg-[#050505] border border-white/[0.06] rounded-xl p-6 overflow-x-auto">
                                    <code className="font-mono text-[11px] text-white/90 leading-relaxed whitespace-pre">{selectedItem.code}</code>
                                </pre>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageShell>
    );
}

function MasonryCard({ item, index, onSelect }: { item: typeof REGISTRY_ASSETS[0]; index: number; onSelect: (id: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.06, duration: 0.5 }}
            onClick={() => onSelect(item.id)}
            className="break-inside-avoid cursor-pointer group"
        >
            <div className="relative rounded-xl overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-gold/30 transition-all duration-700 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]">
                {/* Live Synthesis Preview */}
                <div className="h-44 relative overflow-hidden" style={{ background: item.previewGradient }}>
                    {/* Gold wireframe on hover */}
                    <div className="absolute inset-4 border border-dashed border-gold/0 group-hover:border-gold/30 rounded-lg transition-all duration-700 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 text-center">
                            <Cpu className="w-8 h-8 text-gold/80 mx-auto mb-2 stroke-[0.5]" />
                            <span className="font-mono text-[8px] text-gold/80 tracking-[0.3em]">LIVE SYNTHESIS</span>
                        </div>
                    </div>
                    {item.isNew && <span className="absolute top-3 right-3 font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>}
                    <span className={`absolute top-3 left-3 font-mono text-[7px] tracking-wider px-2 py-0.5 rounded ${item.tier === "FREE" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-gold bg-gold/10 border border-gold/20"
                        }`}>{item.tier}</span>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-500 mb-2">{item.name}</h3>
                    <p className="font-mono text-[10px] text-white/80 leading-relaxed tracking-wide mb-4 line-clamp-2">{item.description}</p>

                    {/* Tech specs in JetBrains Mono */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[8px] text-white/80 tracking-wider mb-4">
                        <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5 stroke-[1]" />{item.performanceCost}</span>
                        <span>{item.size}</span>
                        <span>{item.framework}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {item.dependencies.slice(0, 2).map((dep) => (
                                <span key={dep} className="font-mono text-[7px] text-white/80 bg-white/[0.04] px-2 py-0.5 rounded">{dep}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[8px] text-white/80">
                            <Download className="w-3 h-3 stroke-[1]" />
                            <span>{(item.downloads / 1000).toFixed(1)}K</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
