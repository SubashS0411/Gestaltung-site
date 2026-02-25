"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<"line" | "logo" | "text" | "reveal">("line");
    const [typedText, setTypedText] = useState("");
    const [visible, setVisible] = useState(true);
    const fullText = "INITIALIZING NEURAL PROTOCOL...";

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        timers.push(setTimeout(() => setPhase("logo"), 800));
        timers.push(setTimeout(() => setPhase("text"), 1800));
        timers.push(setTimeout(() => setPhase("reveal"), 3200));
        timers.push(setTimeout(() => {
            setVisible(false);
            onComplete();
        }, 4200));
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    useEffect(() => {
        if (phase !== "text" && phase !== "reveal") return;
        if (typedText.length >= fullText.length) return;
        const t = setTimeout(() => {
            setTypedText(fullText.slice(0, typedText.length + 1));
        }, 40);
        return () => clearTimeout(t);
    }, [phase, typedText, fullText]);

    if (!visible) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Left curtain */}
                    <motion.div
                        className="absolute top-0 left-0 w-1/2 h-full bg-[#050505]"
                        animate={phase === "reveal" ? { x: "-100%" } : {}}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    />
                    {/* Right curtain */}
                    <motion.div
                        className="absolute top-0 right-0 w-1/2 h-full bg-[#050505]"
                        animate={phase === "reveal" ? { x: "100%" } : {}}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Gold line */}
                        <motion.div
                            className="w-48 h-[1px] bg-gold"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {/* Hexagon logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                                phase === "logo" || phase === "text" || phase === "reveal"
                                    ? { opacity: 1, scale: 1 }
                                    : {}
                            }
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <svg viewBox="0 0 100 100" className="w-16 h-16">
                                <defs>
                                    <linearGradient id="preGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#D4AF37" />
                                        <stop offset="50%" stopColor="#F3E5AB" />
                                        <stop offset="100%" stopColor="#D4AF37" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points="50,5 93,27 93,73 50,95 7,73 7,27"
                                    fill="none"
                                    stroke="url(#preGold)"
                                    strokeWidth="1"
                                />
                                <polygon
                                    points="50,25 72,37 72,63 50,75 28,63 28,37"
                                    fill="none"
                                    stroke="url(#preGold)"
                                    strokeWidth="0.5"
                                    opacity="0.5"
                                />
                                <circle cx="50" cy="50" r="3" fill="#D4AF37" />
                            </svg>
                        </motion.div>

                        {/* Typewriter text */}
                        <div className="h-5">
                            <span className="font-mono text-[10px] text-gold/60 tracking-[0.3em]">
                                {typedText}
                                <span className="animate-pulse text-gold">▎</span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
