"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { REGISTRY_ASSETS } from "@/lib/data";
import { Cpu, Download, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ═══ Featured Component Card ═══ */
function FeaturedCard({ item, index }: { item: typeof REGISTRY_ASSETS[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="group relative cursor-pointer"
        >
            <div className={`h-full p-[1px] rounded-2xl transition-all duration-700 ${hovered ? "bg-gradient-to-b from-gold/40 to-gold/5" : "bg-gradient-to-b from-white/10 to-transparent"
                }`}>
                <div className="h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
                    {/* Preview area */}
                    <div
                        className="relative h-44 overflow-hidden"
                        style={{ background: item.previewGradient }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={hovered ? { scale: 1.1, rotate: 15 } : { scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <Cpu className={`w-10 h-10 transition-all duration-500 ${hovered ? "text-gold" : "text-white/10"
                                    }`} />
                            </motion.div>
                        </div>

                        {/* Tier badge */}
                        <span className={`absolute top-3 left-3 font-mono text-[7px] tracking-[0.2em] px-2 py-0.5 rounded ${item.tier === "BLACK EDITION"
                                ? "text-gold bg-gold/10 border border-gold/20"
                                : "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                            }`}>
                            {item.tier}
                        </span>

                        {item.isNew && (
                            <span className="absolute top-3 right-3 font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">
                                NEW
                            </span>
                        )}

                        {/* Hover shine */}
                        <motion.div
                            animate={hovered ? { x: "200%" } : { x: "-100%" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-gold/10 to-transparent skew-x-12 pointer-events-none"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className={`font-serif text-base mb-2 transition-colors duration-300 ${hovered ? "text-gold" : "text-white/90"
                            }`}>
                            {item.name}
                        </h3>
                        <p className="font-mono text-[10px] text-white/50 leading-relaxed line-clamp-2 mb-4">
                            {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3 font-mono text-[8px] text-white/40 tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5" />{item.performanceCost}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Download className="w-2.5 h-2.5" />{(item.downloads / 1000).toFixed(1)}k
                                </span>
                            </div>
                            <span className="font-mono text-[8px] text-white/30 tracking-wider">
                                {item.size}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function FeaturedComponents() {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={sectionRef} className="relative py-32 px-6 bg-[#050505] overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-end justify-between mb-16"
                >
                    <div>
                        <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">COMPONENT VAULT</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
                            Featured Arsenal
                        </h2>
                        <p className="font-mono text-xs text-white/50 tracking-wider mt-3 max-w-lg">
                            Precision-engineered components. Every animation GPU-accelerated.
                            Every interaction physics-based. Zero compromise.
                        </p>
                    </div>
                    <Link href="/registry" className="hidden md:flex items-center gap-2 font-mono text-[10px] text-gold tracking-[0.3em] hover:text-white transition-colors group">
                        VIEW ALL <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {REGISTRY_ASSETS.slice(0, 4).map((item, i) => (
                        <FeaturedCard key={item.id} item={item} index={i} />
                    ))}
                </div>

                {/* Second row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                    {REGISTRY_ASSETS.slice(4, 8).map((item, i) => (
                        <FeaturedCard key={item.id} item={item} index={i + 4} />
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="md:hidden mt-8 text-center">
                    <Link href="/registry" className="inline-flex items-center gap-2 font-mono text-[10px] text-gold tracking-[0.3em]">
                        VIEW ALL COMPONENTS <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
