"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useVelocity } from "framer-motion";
import { ARSENAL_ITEMS } from "@/lib/data";

/* ═══ Dynamic Canvas — SSR disabled for R3F ═══ */
const ArsenalCanvas = dynamic(() => import("./arsenal-canvas"), { ssr: false });

export default function ArsenalPreview() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const velocityRef = useRef(0);

    useEffect(() => {
        const unsub = scrollVelocity.on("change", (v) => {
            velocityRef.current = v;
        });
        return unsub;
    }, [scrollVelocity]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-[#050505] py-32 overflow-hidden"
        >
            {/* Section label */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="text-center mb-16 relative z-10"
            >
                <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">
                    THE ARSENAL
                </p>
                <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
                    THREE PRINCIPLES
                </h2>
            </motion.div>

            {/* 3D Canvas */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 z-0">
                    <ArsenalCanvas velocityRef={velocityRef} />
                </div>
            </div>

            {/* Labels below the objects */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-3 gap-8">
                    {ARSENAL_ITEMS.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: i * 0.15,
                                duration: 0.6,
                                ease: [0.76, 0, 0.24, 1],
                            }}
                            className="text-center"
                        >
                            <h3 className="font-mono text-xs text-gold tracking-[0.3em] mb-2">
                                {item.label}
                            </h3>
                            <p className="font-mono text-[10px] text-white/50 tracking-wider leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
