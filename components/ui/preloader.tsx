"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    onComplete: () => void;
}

const SPRING_SNAPPY = { type: "spring" as const, stiffness: 400, damping: 25 };

export default function Preloader({ onComplete }: PreloaderProps) {
    const [phase, setPhase] = useState(0); // 0=black, 1=line, 2=text, 3=shake, 4=curtain, 5=done
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        timers.push(setTimeout(() => setPhase(1), 300));   // Gold line strikes
        timers.push(setTimeout(() => setPhase(2), 900));   // Text masks in
        timers.push(setTimeout(() => setPhase(3), 1800));  // Bass drop shake
        timers.push(setTimeout(() => setPhase(4), 2600));  // Curtains split
        timers.push(setTimeout(() => {
            setPhase(5);
            setVisible(false);
            onComplete();
        }, 3800));
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Bass-drop screen shake */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={phase >= 3 ? { y: [0, 6, -6, 3, -3, 0], x: [0, -3, 3, -2, 2, 0] } : {}}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {/* Gold line strike */}
                        <motion.div
                            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px]"
                            initial={{ scaleX: 0 }}
                            animate={phase >= 1 ? { scaleX: 1 } : {}}
                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                            {/* Line glow */}
                            <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                        </motion.div>

                        {/* "INITIALIZING PROTOCOL" text — clip-path wipe from center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8">
                            <motion.p
                                className="font-mono text-[9px] text-gold/90 tracking-[0.6em] whitespace-nowrap"
                                initial={{ clipPath: "inset(0 50% 0 50%)" }}
                                animate={phase >= 2 ? { clipPath: "inset(0 0% 0 0%)" } : {}}
                                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                            >
                                INITIALIZING PROTOCOL
                            </motion.p>
                        </div>

                        {/* Main title — aggressive clip-path slice */}
                        <div className="relative">
                            <motion.h1
                                className="font-serif text-6xl sm:text-8xl md:text-9xl text-white tracking-[0.1em] select-none"
                                initial={{ clipPath: "inset(0 50% 0 50%)" }}
                                animate={phase >= 2 ? { clipPath: "inset(0 0% 0 0%)" } : {}}
                                transition={{ duration: 0.6, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                            >
                                GESTALTUNG
                            </motion.h1>
                            {/* Gold reflection line under text */}
                            <motion.div
                                className="absolute -bottom-3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
                                initial={{ scaleX: 0 }}
                                animate={phase >= 2 ? { scaleX: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                            />
                        </div>

                        {/* Phase badge */}
                        <motion.div
                            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={phase >= 2 ? { opacity: 1 } : {}}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <span className="font-mono text-[7px] text-white/70 tracking-[0.4em]">BLACK EDITION v2.4</span>
                        </motion.div>
                    </motion.div>

                    {/* Curtain split — left */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-1/2 bg-[#050505] z-20"
                        initial={{ x: 0 }}
                        animate={phase >= 4 ? { x: "-105%" } : {}}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
                    </motion.div>

                    {/* Curtain split — right */}
                    <motion.div
                        className="absolute inset-y-0 right-0 w-1/2 bg-[#050505] z-20"
                        initial={{ x: 0 }}
                        animate={phase >= 4 ? { x: "105%" } : {}}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
