"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const cases = [
    {
        id: "01",
        title: "VELOCITY PROTOCOL",
        desc: "Automated physics engine for high-frequency trading interfaces. Real-time data at 240fps.",
        gradient: "from-[#D4AF37]/20 via-[#AA8C2C]/10 to-transparent",
        accentColor: "#D4AF37",
        image: "/images/gold-neural-streams.png",
    },
    {
        id: "02",
        title: "QUANTUM AESTHETICS",
        desc: "Generative design systems for next-gen automotive displays. Adaptive color theory at scale.",
        gradient: "from-[#F3E5AB]/15 via-[#D4AF37]/8 to-transparent",
        accentColor: "#F3E5AB",
        image: "/images/gold-hexagon-grid.png",
    },
    {
        id: "03",
        title: "SILENT ENGINE",
        desc: "Auditory feedback loops for silent electric propulsion. Haptic-visual synchronization.",
        gradient: "from-[#AA8C2C]/20 via-[#8A7E5E]/10 to-transparent",
        accentColor: "#AA8C2C",
        image: "/images/gold-pulse-particles.png",
    },
    {
        id: "04",
        title: "NEURAL NETWORK",
        desc: "Real-time data visualization of synaptic connections. 12M nodes rendered in WebGPU.",
        gradient: "from-[#D4AF37]/15 via-[#F3E5AB]/8 to-transparent",
        accentColor: "#D4AF37",
        image: "/images/node-fiber.png",
    },
];

export default function RegistrySlider() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#020202]">
            {/* Section label */}
            <div className="sticky top-0 z-20 pt-8 pl-8 md:pl-16">
                <span className="font-mono text-[10px] text-gold tracking-[0.5em]">CASE STUDIES</span>
            </div>

            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 md:gap-20 px-8 md:px-20 transform-gpu will-change-transform">
                    {cases.map((item, i) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative h-[65vh] w-[85vw] md:w-[70vw] shrink-0 rounded-2xl overflow-hidden group"
                        >
                            {/* Gradient border glow */}
                            <div className="absolute inset-0 rounded-2xl p-[1px]">
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
                            </div>

                            {/* Inner card */}
                            <div className="relative h-full w-full rounded-2xl bg-[#050505] overflow-hidden border border-white/[0.06] group-hover:border-gold/20 transition-colors duration-700">
                                {/* Background image with overlay */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-1000 scale-110 group-hover:scale-100 transition-transform"
                                    />
                                    {/* Multi-layer gradient overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 to-transparent" />
                                    {/* Accent gradient glow */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                                        style={{
                                            background: `radial-gradient(ellipse 60% 50% at 80% 80%, ${item.accentColor}10 0%, transparent 70%)`,
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 z-10">
                                    {/* Top bar */}
                                    <div className="flex items-start justify-between border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-3xl text-gold tracking-wider">{item.id}</span>
                                            <span className="font-mono text-[8px] text-white/80 tracking-[0.3em] uppercase">PROTOCOL</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[8px] text-white/70 tracking-wider">ACTIVE</span>
                                            <div className="h-3 w-3 rounded-full shadow-[0_0_12px] animate-pulse" style={{ backgroundColor: item.accentColor, boxShadow: `0 0 12px ${item.accentColor}` }} />
                                        </div>
                                    </div>

                                    {/* Main content */}
                                    <div className="space-y-6">
                                        <h3 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight transition-transform duration-700 group-hover:translate-x-4 leading-[0.95] drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                                            {item.title}
                                        </h3>
                                        <p className="max-w-xl font-mono text-sm text-white/70 tracking-wide leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                                            {item.desc}
                                        </p>

                                        {/* Bottom gradient accent line */}
                                        <div className="flex items-center gap-4 pt-4">
                                            <div
                                                className="h-[2px] w-24 rounded-full transition-all duration-700 group-hover:w-40"
                                                style={{ background: `linear-gradient(90deg, ${item.accentColor}, transparent)` }}
                                            />
                                            <span className="font-mono text-[8px] text-white/80 tracking-[0.2em]">EXPLORE →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
