"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Manifesto() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
    const fillPercent = useTransform(scrollYProgress, [0.25, 0.65], [0, 100]);

    return (
        <section ref={containerRef} className="min-h-[150vh] flex items-center justify-center py-32 relative">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left: decorative */}
                <div className="hidden md:flex flex-col items-end gap-8 pr-12">
                    <motion.div style={{ opacity }} className="space-y-4 text-right">
                        <span className="font-mono text-[10px] text-gold tracking-[0.5em] block">THE MANIFESTO</span>
                        <div className="w-32 h-[1px] bg-gradient-to-l from-gold/30 to-transparent ml-auto" />
                        <p className="font-mono text-xs text-white/40 tracking-wider leading-relaxed max-w-xs ml-auto">
                            We believe interfaces should carry weight.
                            Not the weight of complexity — the weight of intention.
                            Every transition, every hover state, every scroll interaction
                            is a conversation between human and machine.
                        </p>
                    </motion.div>
                </div>

                {/* Right: main text */}
                <div className="relative">
                    <motion.div style={{ opacity }} className="relative">
                        {/* Outlined text */}
                        <h2 className="font-serif text-[7vw] md:text-[5vw] leading-[0.95] tracking-tight text-transparent"
                            style={{ WebkitTextStroke: "1px rgba(212, 175, 55, 0.4)" }}>
                            WE DO NOT
                            <br />
                            DESIGN.
                            <br />
                            WE CALCULATE.
                        </h2>

                        {/* Fill Animation Layer */}
                        <motion.div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: useTransform(fillPercent, (v) => `inset(0 0 ${100 - v}% 0)`) }}
                        >
                            <h2 className="font-serif text-[7vw] md:text-[5vw] leading-[0.95] tracking-tight text-gradient-gold">
                                WE DO NOT
                                <br />
                                DESIGN.
                                <br />
                                WE CALCULATE.
                            </h2>
                        </motion.div>
                    </motion.div>

                    <motion.p
                        style={{ opacity: useTransform(scrollYProgress, [0.55, 0.75], [0, 1]) }}
                        className="font-mono text-sm text-gold/80 mt-12 max-w-md tracking-wider leading-relaxed"
                    >
                        THE INTERSECTION OF INTELLIGENCE AND AESTHETICS.
                        <br />
                        <span className="text-white/40 text-xs mt-2 block">SYSTEM.LOG(INIT_MANIFESTO_PROTOCOL)</span>
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
