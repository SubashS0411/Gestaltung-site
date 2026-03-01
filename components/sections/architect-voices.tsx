"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const VOICES = [
    {
        id: "V-001",
        name: "CIPHER-7",
        role: "Lead Engineer, Nexus Systems",
        avatar: "C7",
        quote: "Gestaltung replaced our entire UI library. The physics-based animations alone saved us 6 weeks of development. Our conversion rate went up 34% the week we shipped.",
        metric: "+34% conversions",
    },
    {
        id: "V-002",
        name: "VOID-ARCHITECT",
        role: "CTO, Prism Studios",
        avatar: "VA",
        quote: "I've never seen components this performant. We tested at 240fps on mobile — zero jank. The team was skeptical until they saw the profiler. Now they won't use anything else.",
        metric: "240fps stable",
    },
    {
        id: "V-003",
        name: "GOLD-STANDARD",
        role: "Design Director, Lumen Labs",
        avatar: "GS",
        quote: "The typography system alone is worth the switch. Optical sizing calibrated for dark backgrounds, variable font animations — details that separate good from elite.",
        metric: "4.9★ design score",
    },
    {
        id: "V-004",
        name: "ARCHITECT-X",
        role: "Founder, Darkmode.io",
        avatar: "AX",
        quote: "We rebuilt our entire SaaS dashboard with Gestaltung components in 3 weeks. Customer feedback was immediate: 'This feels like a native app.' That's when we knew.",
        metric: "3-week rebuild",
    },
    {
        id: "V-005",
        name: "NODE-451",
        role: "Performance Lead, Quantum",
        avatar: "N4",
        quote: "Our Lighthouse scores went from 72 to 98. Bundle size dropped by 40%. The Scroll Protocol documentation alone changed how our engineering team thinks about web interactions.",
        metric: "98 Lighthouse",
    },
    {
        id: "V-006",
        name: "CRYSTAL-NODE",
        role: "Senior Dev, Obsidian Corp",
        avatar: "CN",
        quote: "The Magnetic Auth Portal component got more user engagement in a day than our custom-built login did in a year. The physics-based input focusing is pure genius.",
        metric: "12x engagement",
    },
];

function VoiceCard({ voice, index }: { voice: typeof VOICES[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.76, 0, 0.24, 1] }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className={`relative p-7 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${hovered
                    ? "bg-gold/[0.04] border-gold/25 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
                    : "bg-[#0a0a0a] border-white/[0.06]"
                }`}
        >
            {/* Quote icon */}
            <Quote className={`w-5 h-5 mb-4 transition-colors duration-300 ${hovered ? "text-gold/60" : "text-white/10"
                }`} />

            {/* Quote text */}
            <p className="font-mono text-[11px] text-white/70 leading-[1.8] tracking-wider mb-6">
                &ldquo;{voice.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[9px] transition-all duration-300 ${hovered ? "bg-gold/20 text-gold" : "bg-white/5 text-white/50"
                        }`}>
                        {voice.avatar}
                    </div>
                    <div>
                        <p className={`font-mono text-[10px] tracking-wider transition-colors ${hovered ? "text-gold" : "text-white/80"
                            }`}>
                            {voice.name}
                        </p>
                        <p className="font-mono text-[8px] text-white/40 tracking-wider">{voice.role}</p>
                    </div>
                </div>

                {/* Impact metric */}
                <span className="font-mono text-[9px] text-gold/60 bg-gold/[0.05] border border-gold/10 px-2.5 py-1 rounded tracking-wider">
                    {voice.metric}
                </span>
            </div>
        </motion.div>
    );
}

export default function ArchitectVoices() {
    return (
        <section className="relative py-32 px-6 bg-[#050505] overflow-hidden">
            {/* Ambient */}
            <div className="absolute bottom-0 right-0 w-[50vw] h-[40vh] bg-gold/[0.015] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">TRANSMISSIONS</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-4">
                        Architect Voices
                    </h2>
                    <p className="font-mono text-xs text-white/40 tracking-wider max-w-xl mx-auto">
                        What happens when elite engineers discover uncompromising UI components.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {VOICES.map((voice, i) => (
                        <VoiceCard key={voice.id} voice={voice} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
