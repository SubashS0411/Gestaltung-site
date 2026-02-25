"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cases = [
    { id: "01", title: "VELOCITY PROTOCOL", desc: "Automated physics engine for high-frequency trading interfaces. Real-time data at 240fps." },
    { id: "02", title: "QUANTUM AESTHETICS", desc: "Generative design systems for next-gen automotive displays. Adaptive color theory at scale." },
    { id: "03", title: "SILENT ENGINE", desc: "Auditory feedback loops for silent electric propulsion. Haptic-visual synchronization." },
    { id: "04", title: "NEURAL NETWORK", desc: "Real-time data visualization of synaptic connections. 12M nodes rendered in WebGPU." },
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
                    {cases.map((item) => (
                        <div key={item.id} className="relative h-[65vh] w-[85vw] md:w-[70vw] shrink-0 p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/15 to-transparent group">
                            <div className="relative h-full w-full rounded-2xl bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                                {/* Background glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
                                    <div className="flex items-start justify-between border-b border-white/10 pb-6">
                                        <span className="font-mono text-2xl text-gold tracking-wider">{item.id}</span>
                                        <div className="h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_#D4AF37]" />
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight transition-transform duration-700 group-hover:translate-x-4 leading-[0.95]">
                                            {item.title}
                                        </h3>
                                        <p className="max-w-xl font-mono text-sm text-white/60 tracking-wide leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
