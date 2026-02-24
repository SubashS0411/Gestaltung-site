"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import MagneticButton from "../ui/magnetic-button";
import ParallaxText from "../ui/parallax-text";
import { ArrowDown } from "lucide-react";

/* ─── Breathing Hexagon Logo ─── */
function HexLogo() {
    return (
        <div className="relative">
            <svg viewBox="0 0 180 180" className="w-28 h-28 md:w-40 md:h-40">
                <defs>
                    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#AA8C2C" />
                        <stop offset="50%" stopColor="#F3E5AB" />
                        <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <polygon points="90,8 166,48 166,132 90,172 14,132 14,48" fill="none" stroke="url(#hg)" strokeWidth="0.8" filter="url(#glow)" />
                <polygon points="90,32 140,58 140,122 90,148 40,122 40,58" fill="none" stroke="url(#hg)" strokeWidth="0.5" opacity="0.4" />
                <polygon points="90,56 115,70 115,110 90,124 65,110 65,70" fill="none" stroke="url(#hg)" strokeWidth="0.3" opacity="0.2" />
                <circle cx="90" cy="90" r="3" fill="#D4AF37" />
            </svg>
            <div className="absolute inset-0 rounded-full animate-breathe" />
        </div>
    );
}

/* ─── Mask Reveal Text ─── */
function RevealLine({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                className={className}
            >{children}</motion.div>
        </div>
    );
}

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    /* 3D Tilt */
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleMouse = useCallback((e: MouseEvent) => {
        setTilt({
            x: ((e.clientY - window.innerHeight / 2) / window.innerHeight) * -5,
            y: ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 5,
        });
    }, []);
    useEffect(() => {
        const handler = (e: MouseEvent) => handleMouse(e);
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, [handleMouse]);

    return (
        <section ref={containerRef} className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
            <ParallaxText text="GESTALTUNG" />

            <motion.div
                style={{ y: foregroundY, opacity, rotateX: tilt.x, rotateY: tilt.y, perspective: 1000 }}
                className="relative z-10 flex flex-col items-center gap-6 px-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <HexLogo />
                </motion.div>

                {/* Title — BIGGER + more visible */}
                <RevealLine delay={0.3}>
                    <h1
                        className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-[0.1em] uppercase leading-[0.85]"
                        style={{ mixBlendMode: "exclusion" }}
                    >
                        <span className="text-gradient-gold">GESTALTUNG</span>
                    </h1>
                </RevealLine>

                {/* Subtitle — readable gold */}
                <RevealLine delay={0.5}>
                    <div className="flex items-center gap-5">
                        <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-gold/50" />
                        <p className="font-mono text-[11px] sm:text-xs text-gold tracking-[0.5em] uppercase">
                            The Black Edition Protocol
                        </p>
                        <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-gold/50" />
                    </div>
                </RevealLine>

                {/* Spacer */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="flex items-center gap-3 mt-2">
                    <span className="w-1.5 h-1.5 rotate-45 border border-gold/40" />
                    <span className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                    <span className="w-1.5 h-1.5 rotate-45 border border-gold/40" />
                </motion.div>

                {/* Description text — readable */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="font-mono text-sm text-white/70 text-center max-w-lg leading-relaxed tracking-wide mt-4"
                >
                    A cinematic interface for validating design systems.
                    Built with precision. Engineered for atmosphere.
                    <br />
                    <span className="text-xs text-white/50 mt-2 block">
                        v2.4.0 • STABLE • SECURE CONNECTION
                    </span>
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4"
                >
                    <MagneticButton>
                        <ArrowDown className="w-3.5 h-3.5" />
                        Initialize Entry
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 flex flex-col items-center gap-2 z-10"
            >
                <span className="font-mono text-[8px] text-white/30 tracking-[0.4em]">SCROLL</span>
                <div className="h-8 w-[1px] relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 w-full bg-gold/50"
                        animate={{ height: ["0%", "100%"], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-[5]" />
        </section>
    );
}
