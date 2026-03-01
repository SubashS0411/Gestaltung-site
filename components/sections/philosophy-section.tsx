"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const lines = [
    "WE DO NOT DESIGN.",
    "WE CALCULATE.",
];

const subLines = [
    "Every pixel is an equation.",
    "Every transition is a proof.",
    "Every interface is a theorem.",
    "Beauty is the byproduct of precision.",
];

export default function PhilosophySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const maskProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-40 bg-[#050505] overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold/[0.02] blur-[120px] rounded-full" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-4xl mx-auto text-center"
            >
                {/* Main declaration */}
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        style={{
                            clipPath: useTransform(
                                maskProgress,
                                [i * 30, i * 30 + 40],
                                ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
                            ),
                        }}
                        className="overflow-hidden transform-gpu"
                    >
                        <h2
                            className={`font-serif tracking-tight leading-[0.9] mb-2 ${i === 0
                                    ? "text-5xl md:text-7xl lg:text-8xl text-white/90"
                                    : "text-6xl md:text-8xl lg:text-9xl text-gradient-gold"
                                }`}
                        >
                            {line}
                        </h2>
                    </motion.div>
                ))}

                {/* Separator line */}
                <motion.div
                    style={{
                        scaleX: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
                        opacity: useTransform(scrollYProgress, [0.2, 0.35], [0, 1]),
                    }}
                    className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-16 transform-gpu origin-center"
                />

                {/* Sub-lines */}
                <div className="space-y-4">
                    {subLines.map((line, i) => (
                        <motion.p
                            key={i}
                            style={{
                                opacity: useTransform(
                                    scrollYProgress,
                                    [0.3 + i * 0.08, 0.38 + i * 0.08],
                                    [0, 1]
                                ),
                                y: useTransform(
                                    scrollYProgress,
                                    [0.3 + i * 0.08, 0.38 + i * 0.08],
                                    [20, 0]
                                ),
                            }}
                            className="font-mono text-sm md:text-base text-white/60 tracking-[0.2em] transform-gpu"
                        >
                            {line}
                        </motion.p>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
