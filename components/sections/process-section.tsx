"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
    {
        number: "01",
        title: "DISCOVER",
        subtitle: "Browse the Registry",
        description: "Explore 247+ precision-engineered components. Filter by category, framework, and performance cost. Every component ships with full source code and zero dependencies you don't need.",
        features: ["Physics-based previews", "Performance benchmarks", "Copy-paste source code"],
        accent: "from-gold/30",
    },
    {
        number: "02",
        title: "INTEGRATE",
        subtitle: "Drop into your stack",
        description: "Components are framework-agnostic by design. Copy the protocol directly into your Next.js, React, or Vanilla project. No package installs required — just pure, clean source.",
        features: ["Zero config required", "TypeScript native", "SSR compatible"],
        accent: "from-gold/20",
    },
    {
        number: "03",
        title: "CUSTOMIZE",
        subtitle: "Tune the physics",
        description: "Every spring constant, damping ratio, and easing curve is exposed as a prop. The Foundry provides a live IDE where you can test modifications in real-time with instant 3D preview.",
        features: ["Live physics tuning", "Real-time preview", "Export variants"],
        accent: "from-gold/15",
    },
    {
        number: "04",
        title: "DEPLOY",
        subtitle: "Ship with confidence",
        description: "Components are stress-tested at 240fps, profiled for memory leaks, and validated for zero cumulative layout shift. Your users experience silk — you experience zero bug reports.",
        features: ["60fps guaranteed", "Zero layout shift", "Memory profiled"],
        accent: "from-gold/10",
    },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="relative group"
        >
            <div className="flex gap-8 md:gap-12 items-start">
                {/* Number column */}
                <div className="shrink-0 relative">
                    <motion.div
                        animate={isInView ? { scale: [0, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center bg-gold/[0.03] group-hover:border-gold/40 group-hover:bg-gold/[0.08] transition-all duration-500"
                    >
                        <span className="font-mono text-xl text-gold">{step.number}</span>
                    </motion.div>
                    {/* Connecting line */}
                    {index < STEPS.length - 1 && (
                        <motion.div
                            initial={{ scaleY: 0 }}
                            animate={isInView ? { scaleY: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="absolute left-1/2 top-16 w-[1px] h-24 md:h-32 -translate-x-1/2 origin-top bg-gradient-to-b from-gold/20 to-transparent"
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-20 md:pb-28">
                    <p className="font-mono text-[9px] text-gold/60 tracking-[0.3em] mb-2">{step.subtitle}</p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white tracking-tight mb-4 group-hover:text-gold transition-colors duration-500">
                        {step.title}
                    </h3>
                    <p className="font-mono text-xs text-white/50 leading-relaxed tracking-wider mb-6 max-w-lg">
                        {step.description}
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2">
                        {step.features.map((feature) => (
                            <span
                                key={feature}
                                className="font-mono text-[8px] text-gold/70 tracking-[0.15em] bg-gold/[0.05] border border-gold/10 px-3 py-1.5 rounded-full"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProcessSection() {
    return (
        <section className="relative py-32 px-6 bg-[#050505] overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40vw] h-[60vh] bg-gold/[0.015] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">THE PROTOCOL</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-4">
                        How It Works
                    </h2>
                    <p className="font-mono text-xs text-white/40 tracking-wider max-w-xl mx-auto">
                        From discovery to deployment in four precise steps. No friction. No ambiguity.
                    </p>
                </motion.div>

                {/* Steps */}
                {STEPS.map((step, i) => (
                    <StepCard key={step.number} step={step} index={i} />
                ))}
            </div>
        </section>
    );
}
