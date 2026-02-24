"use client";

import PageShell from "@/components/layout/page-shell";
import { motion } from "framer-motion";
import { Wrench, Download, ArrowUpRight } from "lucide-react";
import { getVisualForCategory } from "@/lib/visuals";

const tools = [
    { name: "Parallax Engine v3.2", category: "MOTION", downloads: "12.4K" },
    { name: "Void Theme Generator", category: "DESIGN", downloads: "8.7K" },
    { name: "Lenis Config Preset Pack", category: "SCROLL", downloads: "15.1K" },
    { name: "Gold Gradient Library", category: "ASSETS", downloads: "6.2K" },
    { name: "Cinematic Noise Shader", category: "EFFECTS", downloads: "9.8K" },
    { name: "Glassmorphism Toolkit", category: "UI", downloads: "11.3K" },
];

export default function FoundryPage() {
    return (
        <PageShell sectionNumber="06" title="FOUNDRY" subtitle="TOOLS & RESOURCES FOR THE PROTOCOL">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((t, i) => {
                    const visual = getVisualForCategory(t.category);

                    return (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            className="glass-card p-0 group cursor-pointer overflow-hidden flex flex-row h-32"
                        >
                            {/* Visual Preview Area */}
                            <div className="w-1/3 relative overflow-hidden border-r border-white/5">
                                <div
                                    className={`absolute inset-0 w-full h-full ${visual.className || ''}`}
                                    style={visual.style}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-5 flex flex-col justify-between relative">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowUpRight className="w-4 h-4 text-gold" />
                                </div>

                                <div>
                                    <span className="font-mono text-[7px] text-gold-muted tracking-[0.2em] border border-white/[0.1] px-2 py-0.5 rounded inline-block mb-2 group-hover:bg-gold/10 transition-colors">
                                        {t.category}
                                    </span>
                                    <h3 className="font-serif text-sm text-white/90 tracking-wide group-hover:text-gold transition-colors duration-500">
                                        {t.name}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1 font-mono text-[8px] text-white/50 tracking-wider">
                                    <Download className="w-3 h-3 stroke-[1.5]" />
                                    <span>{t.downloads}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </PageShell>
    );
}
