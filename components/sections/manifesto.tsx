"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Manifesto() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const fillPercent = useTransform(scrollYProgress, [0.3, 0.7], [0, 100]);

    return (
        <section ref={containerRef} className="min-h-[150vh] flex items-center justify-center py-32 relative">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="hidden md:block" /> {/* Negative Space */}

                <div className="relative">
                    <motion.div style={{ opacity }} className="relative">
                        <h2 className="font-serif text-[8vw] leading-[0.9] tracking-tight text-transparent stroke-text"
                            style={{ WebkitTextStroke: "1px rgba(212, 175, 55, 0.3)" }}>
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
                            <h2 className="font-serif text-[8vw] leading-[0.9] tracking-tight text-gradient-gold">
                                WE DO NOT
                                <br />
                                DESIGN.
                                <br />
                                WE CALCULATE.
                            </h2>
                        </motion.div>
                    </motion.div>

                    <motion.p
                        style={{ opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1]) }}
                        className="font-mono text-sm text-gold/60 mt-12 max-w-md tracking-wider leading-relaxed"
                    >
                        THE INTERSECTION OF INTELLIGENCE AND AESTHETICS.
                        <br />
                        <span className="text-white/30">SYSTEM.LOG(INIT_MANIFESTO_PROTOCOL)</span>
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
