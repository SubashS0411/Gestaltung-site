"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { getVisualForCategory } from "@/lib/visuals";

const items = [
    { title: "Abstract Glass Structure", category: "ASSETS", visual: "ASSETS" },
    { title: "Neural Network Visualization", category: "EFFECTS", visual: "EFFECTS" },
    { title: "Gold Fluid Dynamics", category: "MOTION", visual: "MOTION" },
    { title: "Dark Matter Interface", category: "UI", visual: "UI" },
];

export default function Gallery() {
    return (
        <section className="py-32 px-6 relative border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <span className="font-mono text-[10px] text-gold tracking-[0.4em] uppercase mb-4 block">
                            VISUAL OUTPUT
                        </span>
                        <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
                            Generated Assets
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item, i) => {
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="group relative aspect-video overflow-hidden rounded-2xl glass-card border-none"
                            >
                                {/* High-Gloss Procedural Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505]" />

                                {/* 1. Metallic Gradient Overlay */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_70%)] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* 2. Grid / Pattern */}
                                <div
                                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                                    style={{
                                        backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                        backgroundSize: "40px 40px"
                                    }}
                                />

                                {/* 3. Gloss Reflection (Diagonal Shine) */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                                        <span className="font-mono text-[9px] text-gold tracking-[0.2em] mb-3 block border-l-2 border-gold pl-3">{item.category}</span>
                                        <h3 className="font-serif text-3xl text-white mix-blend-overlay">{item.title}</h3>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                                    <ArrowUpRight className="w-4 h-4 text-gold" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
