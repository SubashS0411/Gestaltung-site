"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface ScrollInterludeProps {
    topText?: string;
    headline: string;
    subtext?: string;
    gradient?: string;
    backgroundImage?: string;
}

/**
 * Full-bleed Porsche-style scroll interlude section.
 * Supports cinematic background images with parallax.
 */
export default function ScrollInterlude({
    topText,
    headline,
    subtext,
    gradient = "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 60%)",
    backgroundImage,
}: ScrollInterludeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background image with parallax */}
            {backgroundImage && (
                <motion.div style={{ y: bgY, scale: imgScale }} className="absolute inset-[-20%]">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover opacity-25"
                    />
                    {/* Readability overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]" />
                    <div className="absolute inset-0 bg-[#050505]/20" />
                </motion.div>
            )}

            {/* Parallax gradient background (fallback or combined) */}
            <motion.div style={{ y: bgY }} className="absolute inset-[-20%]">
                <div className="absolute inset-0" style={{ background: gradient }} />
                {/* Abstract geometric shapes */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                    <svg viewBox="0 0 800 600" className="w-full max-w-4xl">
                        <defs>
                            <linearGradient id="intGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#F3E5AB" />
                            </linearGradient>
                        </defs>
                        <polygon points="400,50 550,137 550,312 400,400 250,312 250,137" fill="none" stroke="url(#intGrad)" strokeWidth="0.5" />
                        <polygon points="400,120 490,172 490,278 400,330 310,278 310,172" fill="none" stroke="url(#intGrad)" strokeWidth="0.3" />
                        <line x1="100" y1="300" x2="700" y2="300" stroke="url(#intGrad)" strokeWidth="0.2" />
                        <line x1="400" y1="50" x2="400" y2="550" stroke="url(#intGrad)" strokeWidth="0.2" />
                        <circle cx="400" cy="225" r="4" fill="#D4AF37" opacity="0.3" />
                        <circle cx="250" cy="137" r="2" fill="#D4AF37" opacity="0.2" />
                        <circle cx="550" cy="137" r="2" fill="#D4AF37" opacity="0.2" />
                    </svg>
                </div>
            </motion.div>

            {/* Top/bottom gradient fades */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-[2]" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-[2]" />

            {/* Content */}
            <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-6 max-w-3xl">
                {topText && (
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="font-mono text-[11px] text-gold tracking-[0.5em] uppercase mb-6 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                    >
                        {topText}
                    </motion.p>
                )}
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: "100%" }}
                        animate={inView ? { y: "0%" } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-[0.06em] leading-[1.1] drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]"
                    >
                        {headline}
                    </motion.h2>
                </div>
                {subtext && (
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="font-mono text-sm text-white/60 tracking-wider mt-6 leading-relaxed max-w-lg mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
                    >
                        {subtext}
                    </motion.p>
                )}
            </motion.div>
        </section>
    );
}
