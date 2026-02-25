"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, Database, Cpu, Globe, Zap, Radio, Shield, Wifi } from "lucide-react";

/* ─── Typewriter ─── */
function useTypewriter(phrases: string[], speed = 50) {
    const [text, setText] = useState("");
    const [idx, setIdx] = useState(0);
    const [del, setDel] = useState(false);
    useEffect(() => {
        const phrase = phrases[idx];
        let t: NodeJS.Timeout;
        if (!del && text === phrase) t = setTimeout(() => setDel(true), 2500);
        else if (del && text === "") { setDel(false); setIdx((i) => (i + 1) % phrases.length); }
        else t = setTimeout(() => setText(del ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1)), del ? 25 : speed);
        return () => clearTimeout(t);
    }, [text, del, idx, phrases, speed]);
    return text;
}

/* ─── Counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [c, setC] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        let f: number; const s = performance.now();
        const tick = (n: number) => { const p = Math.min((n - s) / 2000, 1); setC(Math.floor((1 - Math.pow(1 - p, 4)) * target)); if (p < 1) f = requestAnimationFrame(tick); };
        f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f);
    }, [inView, target]);
    return <span ref={ref}>{c.toLocaleString()}{suffix}</span>;
}

/* ─── Mask Reveal ─── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div initial={{ y: "100%" }} animate={inView ? { y: "0%" } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
        </div>
    );
}

const cards = [
    { title: "SYSTEM STATUS", value: "OPTIMAL", icon: Terminal, accent: "text-emerald-400", bar: 99 },
    { title: "NODE CONNECTIONS", value: "482", icon: Globe, accent: "text-blue-400", bar: 72 },
    { title: "MEMORY", value: "12% / 64GB", icon: Database, accent: "text-violet-400", bar: 12 },
    { title: "PROCESSING", value: "98%", icon: Cpu, accent: "text-gold", bar: 98 },
];

const feed = [
    { t: "10:42:01", msg: "Framer Motion orchestration optimized", s: "ok" },
    { t: "10:42:05", msg: "React-Lenis scroll engine — Online", s: "ok" },
    { t: "10:42:12", msg: "Establishing secure connection...", s: "wait" },
    { t: "10:42:15", msg: "Access granted. Welcome, Operator.", s: "gold" },
    { t: "10:42:18", msg: "All subsystems nominal", s: "ok" },
    { t: "10:42:24", msg: "Visual cortex sync complete", s: "ok" },
    { t: "10:42:30", msg: "Particle physics simulation: ACTIVE", s: "gold" },
];

export default function NeuralHub() {
    const typewriterText = useTypewriter([
        "Query: Scroll physics parameters?",
        "Analyze parallax depth ratios...",
        "Configure luxury motion engine...",
    ]);

    return (
        <section className="relative w-full px-4 py-24 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-3">
                        <Radio className="w-4 h-4 text-gold stroke-[1.5]" />
                        <span className="font-mono text-[10px] text-gold tracking-[0.35em]">SECTION 02</span>
                    </div>
                    <Reveal>
                        <h2 className="font-serif text-4xl md:text-6xl tracking-[0.06em] text-white">NEURAL HUB</h2>
                    </Reveal>
                    <p className="font-mono text-xs text-white/80 tracking-[0.15em] mt-3">
                        System monitoring interface — real-time diagnostics
                    </p>
                    <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-gold/25 via-gold/8 to-transparent" />
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Status Cards */}
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="md:col-span-3 glass-card p-6 group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-5">
                                <div className="p-2.5 rounded-lg bg-white/[0.04]">
                                    <card.icon className={`w-5 h-5 stroke-[1.5] ${card.accent}`} />
                                </div>
                                <span className="font-mono text-[9px] text-white/70 tracking-wider">0{i + 1}</span>
                            </div>
                            <p className="font-mono text-[10px] text-white/80 tracking-[0.15em] mb-1.5">{card.title}</p>
                            <p className="font-serif text-2xl text-white tracking-wide mb-4">{card.value}</p>
                            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-gold/40 to-gold/80"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${card.bar}%` }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                />
                            </div>
                        </motion.div>
                    ))}

                    <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
                        {/* Main Feed - Large Card */}
                        <div className="md:col-span-2 md:row-span-2 relative group">
                            <div className="absolute inset-0 bg-obsidian border border-white/10 group-hover:border-gold/50 transition-colors duration-500 rounded-lg backdrop-blur-xl overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="p-8 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="font-mono text-xs text-gold tracking-[0.2em]">LIVE TRANSMISSION</h3>
                                        <div className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        </div>
                                    </div>

                                    {/* Console Output */}
                                    <div className="flex-1 font-mono text-xs space-y-3 overflow-hidden text-white/90">
                                        {feed.map((line, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`flex gap-3 ${line.s === 'gold' ? 'text-gold' : ''}`}
                                            >
                                                <span className="opacity-30">{line.t}</span>
                                                <span>{line.msg}</span>
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-2 h-4 bg-gold mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card 1 */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-obsidian border border-white/10 hover:border-gold/40 rounded-lg p-6 flex flex-col justify-between group cursor-crosshair"
                        >
                            <h4 className="font-mono text-[10px] text-white/80 tracking-widest">SYSTEM STATUS</h4>
                            <div className="text-right">
                                <div className="font-serif text-4xl text-white">Optimal</div>
                                <div className="text-gold text-xs font-mono mt-1">NO LATENCY DETECTED</div>
                            </div>
                        </motion.div>

                        {/* Stats Card 2 */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-obsidian border border-white/10 hover:border-gold/40 rounded-lg p-6 flex flex-col justify-between group cursor-crosshair"
                        >
                            <h4 className="font-mono text-[10px] text-white/80 tracking-widest">NODE CONNECTIONS</h4>
                            <div className="text-right">
                                <div className="font-serif text-4xl text-white">482</div>
                                <div className="text-green-500 text-xs font-mono mt-1">SECURE ENCRYPTION</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Neural Assistant */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="md:col-span-4 glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                            <span className="font-mono text-[11px] text-gold tracking-[0.15em]">NEURAL ASSISTANT</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-gold/60" />
                                <div className="w-2 h-2 rounded-full bg-gold/30" />
                                <div className="w-2 h-2 rounded-full bg-gold/15" />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="font-mono text-[9px] text-white/80 tracking-[0.15em] mb-2 block">QUERY PROTOCOL</label>
                            <div className="bg-black/40 border border-white/[0.06] rounded-lg py-3.5 px-4 font-mono text-[12px] text-white/90 min-h-[48px] flex items-center">
                                <span>{typewriterText}</span>
                                <span className="animate-pulse text-gold ml-0.5">▎</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/25 border border-white/[0.05] mb-5">
                            <p className="font-serif text-[13px] italic text-white/80 leading-relaxed">
                                &ldquo;Every pixel must breathe. The interface should feel heavy, cinematic, and atmospheric.&rdquo;
                            </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-white/[0.05]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-emerald-400/60 stroke-[1.5]" />
                                    <span className="font-mono text-[10px] text-white/80 tracking-wider">SECURE</span>
                                </div>
                                <span className="font-mono text-[10px] text-emerald-400/60">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-3.5 h-3.5 text-gold/40 stroke-[1.5]" />
                                    <span className="font-mono text-[10px] text-white/80 tracking-wider">LATENCY</span>
                                </div>
                                <span className="font-mono text-[10px] text-gold/60">12ms</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
