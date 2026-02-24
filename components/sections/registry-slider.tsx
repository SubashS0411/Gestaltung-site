"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cases = [
    { id: "01", title: "VELOCITY PROTOCOL", desc: "Automated physics engine for high-frequency trading interfaces." },
    { id: "02", title: "QUANTUM AESTHETICS", desc: "Generative design systems for next-gen automotive displays." },
    { id: "03", title: "SILENT ENGINE", desc: "Auditory feedback loops for silent electric propulsion." },
    { id: "04", title: "NEURAL NETWORK", desc: "Real-time data visualization of synaptic connections." },
];

export default function RegistrySlider() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#020202]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-20 px-20 transform-gpu will-change-transform">
                    {cases.map((item) => (
                        <div key={item.id} className="relative h-[70vh] w-[80vw] shrink-0 p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/20 to-transparent group">
                            <div className="relative h-full w-full rounded-3xl bg-white/5 backdrop-blur-3xl overflow-hidden">
                                {/* Background Bloom */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                                <div className="absolute inset-0 flex flex-col justify-between p-12 md:p-20">
                                    <div className="flex items-start justify-between border-b border-white/10 pb-8">
                                        <span className="font-mono text-xl text-gold">{item.id}</span>
                                        <div className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_#D4AF37]" />
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="font-serif text-6xl text-white transition-transform duration-700 group-hover:translate-x-4 md:text-8xl">
                                            {item.title}
                                        </h3>
                                        <p className="max-w-xl font-mono text-sm text-white/50">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
