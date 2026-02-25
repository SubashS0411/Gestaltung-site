"use client";

import { motion } from "framer-motion";
import { Copy, Check, Terminal, Cpu, Box, Fingerprint } from "lucide-react";
import { useState } from "react";

const specs = [
    {
        title: "RENDER ENGINE",
        value: "V8.4.2 / WEBGPU",
        desc: "Hardware-accelerated layout composition with sub-pixel precision.",
        icon: Cpu,
    },
    {
        title: "MOTION PHYSICS",
        value: "LENIS-CUSTOM",
        desc: "Inertia modeling tuned for heavy, luxury feel (0.06 lerp).",
        icon: Box,
    },
    {
        title: "SECURITY LAYER",
        value: "VOID-AUTH",
        desc: "Biometric-ready authentication protocol with zero-trust architecture.",
        icon: Fingerprint,
    },
    {
        title: "API GATEWAY",
        value: "REST / GRAPHQL",
        desc: "Unified data plane with <12ms global latency routing.",
        icon: Terminal,
    },
];

export default function ProtocolGrid() {
    const [copied, setCopied] = useState(false);

    const copyProtocol = async () => {
        const specText = specs.map(s => `${s.title}: ${s.value}\n${s.desc}`).join("\n\n");
        try {
            await navigator.clipboard.writeText(`GESTALTUNG PROTOCOL SPECIFICATIONS\n${"═".repeat(40)}\n\n${specText}`);
        } catch { /* fallback: silent */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-32 px-6 relative border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div>
                        <span className="font-mono text-[10px] text-gold tracking-[0.4em] uppercase mb-4 block">
                            SYSTEM ARCHITECTURE
                        </span>
                        <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
                            Protocol Specifications
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={copyProtocol}
                            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-gold/30 bg-white/[0.02] hover:bg-gold/[0.05] transition-all duration-500"
                        >
                            <span className="font-mono text-[10px] text-white/50 group-hover:text-gold tracking-[0.2em] transition-colors">
                                COPY_SPEC
                            </span>
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-gold transition-colors" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06]">
                    {specs.map((spec, i) => (
                        <motion.div
                            key={spec.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-[#050505] p-8 group hover:bg-[#080808] transition-colors duration-500 relative"
                        >
                            <div className="absolute top-4 right-4 text-white/5 group-hover:text-gold/20 transition-colors duration-500">
                                <spec.icon className="w-6 h-6 stroke-[1]" />
                            </div>
                            <div className="h-full flex flex-col justify-between gap-12">
                                <div>
                                    <h3 className="font-mono text-[9px] text-gold-muted tracking-[0.2em] mb-2">
                                        {spec.title}
                                    </h3>
                                    <p className="font-serif text-xl text-white/90 tracking-wide">
                                        {spec.value}
                                    </p>
                                </div>
                                <div>
                                    <div className="w-full h-px bg-white/[0.06] mb-6 group-hover:bg-gold/20 transition-colors duration-500" />
                                    <p className="font-mono text-[10px] text-white/40 leading-relaxed tracking-wide">
                                        {spec.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
