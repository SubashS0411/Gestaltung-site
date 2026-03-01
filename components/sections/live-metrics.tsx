"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

/* ═══ Animated Counter ═══ */
function Counter({ target, suffix = "", prefix = "", duration = 2 }: {
    target: number; suffix?: string; prefix?: string; duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const controls = animate(0, target, {
            duration,
            ease: [0.76, 0, 0.24, 1],
            onUpdate: (v) => setValue(Math.round(v)),
        });
        return () => controls.stop();
    }, [isInView, target, duration]);

    return (
        <span ref={ref}>
            {prefix}{value.toLocaleString()}{suffix}
        </span>
    );
}

/* ═══ Metric Card ═══ */
function MetricCard({ label, value, suffix, prefix, description, index, accent }: {
    label: string; value: number; suffix?: string; prefix?: string;
    description: string; index: number; accent: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="relative group p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-gold/20 transition-all duration-500"
        >
            {/* Top accent line */}
            <div className={`absolute top-0 left-6 right-6 h-[1px] ${accent}`} />

            <p className="font-mono text-[8px] text-white/40 tracking-[0.3em] mb-4">{label}</p>
            <p className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-3">
                <Counter target={value} suffix={suffix} prefix={prefix} />
            </p>
            <p className="font-mono text-[10px] text-white/50 tracking-wider leading-relaxed">{description}</p>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}

export default function LiveMetrics() {
    return (
        <section className="relative py-32 px-6 bg-[#030303] overflow-hidden border-y border-white/[0.04]">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">SYSTEM TELEMETRY</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-4">
                        Protocol Metrics
                    </h2>
                    <p className="font-mono text-xs text-white/40 tracking-wider max-w-xl mx-auto">
                        Real-time statistics from the Gestaltung network. Every number is a proof of commitment.
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <MetricCard
                        label="TOTAL COMPONENTS"
                        value={247}
                        suffix="+"
                        description="Precision-engineered UI components in the registry vault."
                        index={0}
                        accent="bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                    />
                    <MetricCard
                        label="ACTIVE ARCHITECTS"
                        value={4200}
                        suffix="+"
                        description="Elite developers building with the Black Edition protocol."
                        index={1}
                        accent="bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                    />
                    <MetricCard
                        label="GLOBAL DOWNLOADS"
                        value={892}
                        suffix="K"
                        description="Components deployed across production applications worldwide."
                        index={2}
                        accent="bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                    />
                    <MetricCard
                        label="AVG PERFORMANCE"
                        value={60}
                        suffix=" FPS"
                        description="Guaranteed minimum frame rate across all component interactions."
                        index={3}
                        accent="bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
                    />
                </div>

                {/* Secondary stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
                    {[
                        { label: "ZERO CLS", value: "0.00", desc: "Cumulative Layout Shift" },
                        { label: "GPU ACCELERATED", value: "100%", desc: "Transform-only animations" },
                        { label: "BUNDLE SIZE", value: "<4KB", desc: "Average component weight" },
                        { label: "TREE SHAKEABLE", value: "YES", desc: "Dead code elimination" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                        >
                            <p className="font-mono text-lg md:text-xl text-gold mb-1">{stat.value}</p>
                            <p className="font-mono text-[7px] text-white/40 tracking-[0.2em]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
