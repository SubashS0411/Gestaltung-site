"use client";

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Radio } from "lucide-react";
import Navbar from "./navbar";

interface PageShellProps {
    children: ReactNode;
    sectionNumber: string;
    title: string;
    subtitle: string;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            >{children}</motion.div>
        </div>
    );
}

export default function PageShell({ children, sectionNumber, title, subtitle }: PageShellProps) {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#D4AF37] selection:text-black relative">
            <Navbar />
            <div className="pt-28 pb-24 px-4 md:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-3">
                            <Radio className="w-3.5 h-3.5 text-gold/60 stroke-[1.5]" />
                            <span className="font-mono text-[9px] text-gold tracking-[0.4em]">SECTION {sectionNumber}</span>
                        </div>
                        <Reveal><h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-[0.08em] text-white">{title}</h1></Reveal>
                        <p className="font-mono text-xs text-white/80 tracking-[0.2em] mt-3 max-w-lg">{subtitle}</p>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 h-[1px] w-full origin-left bg-gradient-to-r from-gold/30 via-gold/10 to-transparent"
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
