"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGISTRY_ITEMS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { ArrowUpRight, Copy, Check, X, Download, Package, Star } from "lucide-react";

export default function DashboardRegistryPage() {
    const { selectedRegistryItem, setSelectedRegistryItem, savedItems, toggleSaved } = useAppStore();
    const [copied, setCopied] = useState(false);
    const selected = REGISTRY_ITEMS.find((r) => r.id === selectedRegistryItem);

    const copyCode = async (code: string) => {
        try { await navigator.clipboard.writeText(code); } catch { }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <span className="font-mono text-[10px] text-gold tracking-[0.5em] block mb-2">ASSET STORE</span>
                <h1 className="font-serif text-4xl text-white tracking-tight">Component Registry</h1>
                <p className="font-mono text-xs text-white/80 mt-2 tracking-wider">Premium UI components for the protocol.</p>
            </motion.div>

            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {REGISTRY_ITEMS.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.5 }}
                        onClick={() => setSelectedRegistryItem(item.id)}
                        className="break-inside-avoid cursor-pointer group"
                    >
                        <div className="p-[1px] rounded-xl bg-gradient-to-b from-white/10 to-transparent hover:from-gold/25 hover:to-transparent transition-all duration-500">
                            <div className="bg-[#050505] rounded-xl overflow-hidden hover:bg-[#070707] transition-colors duration-300">
                                {/* Preview */}
                                <div className="h-40 relative overflow-hidden" style={{ background: item.previewBg }}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                        <Package className="w-12 h-12 text-white/10 stroke-[0.5]" />
                                    </div>
                                    {item.isNew && (
                                        <span className="absolute top-3 right-3 font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>
                                    )}
                                    <span className={`absolute top-3 left-3 font-mono text-[7px] tracking-wider px-2 py-0.5 rounded ${item.price === "FREE" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" :
                                            item.price === "PRO" ? "text-gold bg-gold/10 border border-gold/20" :
                                                "text-purple-400 bg-purple-400/10 border border-purple-400/20"
                                        }`}>{item.price}</span>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="font-serif text-sm text-white/90 group-hover:text-gold transition-colors duration-500">{item.name}</h3>
                                        <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-gold/50 transition-colors shrink-0" />
                                    </div>
                                    <p className="font-mono text-[10px] text-white/80 leading-relaxed tracking-wide mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3 font-mono text-[8px] text-white/70 tracking-wider">
                                            <span>{item.size}</span>
                                            <span>{item.category}</span>
                                        </div>
                                        <div className="flex items-center gap-1 font-mono text-[8px] text-white/70">
                                            <Download className="w-3 h-3 stroke-[1.5]" />
                                            <span>{(item.downloads / 1000).toFixed(1)}K</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8"
                        onClick={() => setSelectedRegistryItem(null)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-2xl"
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelectedRegistryItem(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header */}
                            <div className="p-8 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`font-mono text-[8px] tracking-wider px-2 py-0.5 rounded ${selected.price === "FREE" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" :
                                            selected.price === "PRO" ? "text-gold bg-gold/10 border border-gold/20" :
                                                "text-purple-400 bg-purple-400/10 border border-purple-400/20"
                                        }`}>{selected.price}</span>
                                    <span className="font-mono text-[8px] text-white/70 tracking-wider">{selected.category}</span>
                                    {selected.isNew && <span className="font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>}
                                </div>
                                <h2 className="font-serif text-3xl text-white tracking-tight mb-2">{selected.name}</h2>
                                <p className="font-mono text-xs text-white/90 tracking-wide leading-relaxed">{selected.description}</p>

                                <div className="flex items-center gap-6 mt-6 font-mono text-[9px] text-white/80 tracking-wider">
                                    <span>SIZE: {selected.size}</span>
                                    <span>DOWNLOADS: {selected.downloads.toLocaleString()}</span>
                                    <span>DEPS: {selected.dependencies.length > 0 ? selected.dependencies.join(", ") : "None"}</span>
                                </div>
                            </div>

                            {/* Code */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-[9px] text-gold tracking-[0.3em]">SOURCE CODE</span>
                                    <button
                                        onClick={() => copyCode(selected.code)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-gold/20 bg-white/[0.02] hover:bg-gold/[0.05] transition-all duration-300"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/80" />}
                                        <span className="font-mono text-[9px] text-white/80 tracking-wider">{copied ? "COPIED" : "COPY CODE"}</span>
                                    </button>
                                </div>
                                <pre className="bg-[#050505] border border-white/[0.06] rounded-xl p-6 overflow-x-auto">
                                    <code className="font-mono text-[11px] text-white/70 leading-relaxed whitespace-pre">
                                        {selected.code}
                                    </code>
                                </pre>
                            </div>

                            {/* Actions */}
                            <div className="px-8 pb-8 flex gap-3">
                                <button
                                    onClick={() => toggleSaved(selected.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300 ${savedItems.includes(selected.id)
                                            ? "border-gold/30 bg-gold/10 text-gold"
                                            : "border-white/10 text-white/80 hover:border-gold/20 hover:text-gold"
                                        }`}
                                >
                                    <Star className={`w-3.5 h-3.5 ${savedItems.includes(selected.id) ? "fill-gold" : ""}`} />
                                    <span className="font-mono text-[9px] tracking-wider">{savedItems.includes(selected.id) ? "SAVED" : "SAVE"}</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
