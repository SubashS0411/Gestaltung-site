"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Hexagon } from "lucide-react";

const LINKS = [
    { label: "REGISTRY", href: "/registry", description: "Browse 247+ components" },
    { label: "ACADEMY", href: "/academy", description: "Master the protocol" },
    { label: "NODE HUB", href: "/node-hub", description: "Join the collective" },
    { label: "FOUNDRY", href: "/foundry", description: "Build & test live" },
];

export default function CTAFooter() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Magnetic CTA
    const buttonRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { damping: 15, stiffness: 200 });
    const sy = useSpring(y, { damping: 15, stiffness: 200 });
    const [ctaHovered, setCtaHovered] = useState(false);

    return (
        <section
            ref={ref}
            className="relative py-40 px-6 bg-[#020202] overflow-hidden border-t border-white/[0.04]"
        >
            {/* Massive ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={ctaHovered
                        ? { scale: 1.5, opacity: 0.06 }
                        : { scale: 1, opacity: 0.03 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-gold rounded-full blur-[200px]"
                />
            </div>

            {/* Noise grain overlay that intensifies on hover */}
            <motion.div
                animate={{ opacity: ctaHovered ? 0.12 : 0.04 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                {/* Hexagon icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="inline-flex mb-10"
                >
                    <Hexagon className="w-12 h-12 text-gold/40 stroke-[0.5]" />
                </motion.div>

                {/* Main headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9] mb-8"
                >
                    THE VOID AWAITS<br />
                    <span className="text-gradient-gold">YOUR ARCHITECTURE.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="font-mono text-xs text-white/50 tracking-[0.2em] max-w-xl mx-auto mb-14 leading-relaxed"
                >
                    Join 4,200+ elite architects building the future of web interfaces.
                    Every component is a statement. Every interaction is uncompromising.
                </motion.p>

                {/* Magnetic CTA Button */}
                <motion.div
                    ref={buttonRef}
                    style={{ x: sx, y: sy }}
                    onMouseMove={(e) => {
                        const rect = buttonRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
                        y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
                    }}
                    onMouseLeave={() => { x.set(0); y.set(0); setCtaHovered(false); }}
                    onHoverStart={() => setCtaHovered(true)}
                    onHoverEnd={() => setCtaHovered(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="inline-block transform-gpu mb-20"
                >
                    <Link href="/registry">
                        <div className={`px-14 py-5 border-2 rounded-lg cursor-pointer transition-all duration-500 group ${ctaHovered
                                ? "border-gold bg-gold/10 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
                                : "border-white/15 bg-transparent"
                            }`}>
                            <span className="font-mono text-sm tracking-[0.4em] text-gold flex items-center gap-3">
                                INITIALIZE PROTOCOL
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>
                </motion.div>

                {/* Quick navigation links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {LINKS.map((link, i) => (
                        <Link key={link.label} href={link.href}>
                            <motion.div
                                whileHover={{ y: -4, borderColor: "rgba(212,175,55,0.3)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-gold/[0.03] transition-colors text-center group/link"
                            >
                                <p className="font-mono text-[10px] text-white/70 group-hover/link:text-gold tracking-[0.2em] transition-colors mb-1">
                                    {link.label}
                                </p>
                                <p className="font-mono text-[8px] text-white/30 tracking-wider">
                                    {link.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* Footer credits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-24 pt-8 border-t border-white/[0.04]"
                >
                    <p className="font-mono text-[8px] text-white/20 tracking-[0.3em]">
                        © 2026 GESTALTUNG — THE BLACK EDITION PROTOCOL
                    </p>
                    <p className="font-mono text-[7px] text-white/10 tracking-[0.2em] mt-2">
                        ENGINEERED WITH ZERO COMPROMISE. DEPLOYED WITH ABSOLUTE PRECISION.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
