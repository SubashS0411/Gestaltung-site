"use client";

import PageShell from "@/components/layout/page-shell";
import { motion, useInView } from "framer-motion";
import { Hexagon, Target, Eye, Layers } from "lucide-react";
import { useRef } from "react";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div initial={{ y: "100%" }} animate={inView ? { y: "0%" } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
                {children}
            </motion.div>
        </div>
    );
}

const principles = [
    { title: "PRECISION", desc: "Every element is measured, considered, and placed with intent.", icon: Target },
    { title: "ATMOSPHERE", desc: "Texture, depth, and motion create an immersive, cinematic space.", icon: Eye },
    { title: "STRUCTURE", desc: "The Gestalt principles guide every compositional decision.", icon: Layers },
    { title: "IDENTITY", desc: "The Void & Gold aesthetic is a language, not a palette.", icon: Hexagon },
];

const timeline = [
    { year: "2024", event: "Protocol conceived. First Void & Gold experiments." },
    { year: "2025", event: "Black Edition framework established. Lenis integration." },
    { year: "2026", event: "Full protocol deployment. Cinematic rendering pipeline live." },
];

export default function AboutPage() {
    return (
        <PageShell sectionNumber="07" title="ABOUT" subtitle="THE PROTOCOL MANIFESTO">
            {/* Manifesto */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden"
            >
                <div className="absolute top-6 left-6 font-serif text-6xl text-gold/20 leading-none">&ldquo;</div>
                <blockquote className="font-serif text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl ml-8 italic">
                    The site must not look flat or static. It must feel heavy, cinematic, and atmospheric.
                    Every pixel must breathe. If it looks like a standard dashboard, we have failed.
                    It must look like a sci-fi luxury interface.
                </blockquote>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gold/[0.02] blur-[100px]" />
            </motion.div>

            {/* Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
                {principles.map((p, i) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="glass-card p-6"
                    >
                        <p.icon className="w-5 h-5 text-gold/80 stroke-[1.5] mb-4" />
                        <Reveal delay={i * 0.1}>
                            <h3 className="font-serif text-lg text-white tracking-wide mb-2">{p.title}</h3>
                        </Reveal>
                        <p className="font-mono text-[10px] text-white/50 leading-relaxed tracking-wider">{p.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Timeline */}
            <div className="mb-8">
                <span className="font-mono text-[9px] text-gold-muted tracking-[0.3em] mb-6 block">TIMELINE</span>
                <div className="space-y-0">
                    {timeline.map((t, i) => (
                        <motion.div
                            key={t.year}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex gap-6 py-4 border-b border-white/[0.06]"
                        >
                            <span className="font-serif text-2xl text-gold/60 shrink-0 w-16">{t.year}</span>
                            <p className="font-mono text-[11px] text-white/50 leading-relaxed tracking-wider">{t.event}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div>
                <span className="font-mono text-[9px] text-gold-muted tracking-[0.3em] mb-4 block">TECH STACK</span>
                <div className="flex flex-wrap gap-2">
                    {["NEXT.JS 14", "TAILWIND CSS", "FRAMER MOTION", "REACT-LENIS", "LUCIDE-REACT", "TYPESCRIPT"].map((t) => (
                        <span key={t} className="tag-pill">{t}</span>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
