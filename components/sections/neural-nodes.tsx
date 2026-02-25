"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, useInView } from "framer-motion";

const nodes = [
    {
        id: "01",
        title: "FIBER OPTICS",
        desc: "High-bandwidth neural pathways for real-time design validation. Sub-millisecond latency across distributed nodes.",
        coord: "COORD: 45.22.11",
        src: "/images/node-fiber.png",
        align: "left" as const,
    },
    {
        id: "02",
        title: "SERVER CORE",
        desc: "Redundant processing infrastructure powering the protocol engine. Self-healing architecture with zero-downtime deployments.",
        coord: "COORD: 89.10.33",
        src: "/images/node-server.png",
        align: "right" as const,
    },
    {
        id: "03",
        title: "LIQUID METAL",
        desc: "Adaptive interface rendering pipeline. Every surface responds to context, morphing between states with cinematic fluidity.",
        coord: "COORD: 12.00.99",
        src: "/images/node-liquid.png",
        align: "left" as const,
    }
];

function NodeCard({ node, index }: { node: typeof nodes[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15%" });
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col md:flex-row ${node.align === "right" ? "md:flex-row-reverse" : ""} items-center gap-8 md:gap-16`}
        >
            {/* Image with parallax and gradient border */}
            <div className="relative w-full md:w-5/12 aspect-[3/4] p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/15 to-transparent">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#050505]">
                    <motion.div style={{ y: imgY }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                        <Image
                            src={node.src}
                            alt={node.title}
                            fill
                            className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                            sizes="(max-width: 768px) 100vw, 40vw"
                        />
                    </motion.div>
                    {/* Bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                </div>
            </div>

            {/* Text content */}
            <div className="w-full md:w-5/12 space-y-6">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-gold tracking-[0.3em]">NODE_{node.id}</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                </div>
                <h3 className="font-serif text-4xl md:text-5xl text-white tracking-wide leading-tight">{node.title}</h3>
                <p className="font-mono text-sm text-white/60 leading-relaxed tracking-wide max-w-md">
                    {node.desc}
                </p>
                <div className="flex items-center gap-3 pt-2">
                    <div className="w-2 h-2 rounded-full bg-gold/60" />
                    <span className="font-mono text-[10px] text-white/80 tracking-wider">{node.coord}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function NeuralNodes() {
    return (
        <section className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto space-y-32">
                {/* Section header */}
                <div className="text-center mb-8">
                    <span className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4 block">INFRASTRUCTURE</span>
                    <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tight">Neural Nodes</h2>
                    <p className="font-mono text-sm text-white/90 mt-4 max-w-lg mx-auto tracking-wide">
                        The distributed backbone powering every design validation across the network.
                    </p>
                </div>

                {nodes.map((node, i) => (
                    <NodeCard key={node.id} node={node} index={i} />
                ))}
            </div>
        </section>
    );
}
