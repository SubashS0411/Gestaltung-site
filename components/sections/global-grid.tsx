"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GLOBAL_GRID_NODES } from "@/lib/data";

/* ═══ SVG Wireframe World Map (simplified contours) ═══ */
function WireframeMap() {
    return (
        <svg
            viewBox="0 0 100 80"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Grid lines */}
            {Array.from({ length: 9 }, (_, i) => (
                <line
                    key={`h-${i}`}
                    x1="0"
                    y1={(i + 1) * 8}
                    x2="100"
                    y2={(i + 1) * 8}
                    stroke="rgba(212,175,55,0.05)"
                    strokeWidth="0.15"
                />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
                <line
                    key={`v-${i}`}
                    x1={(i + 1) * 9}
                    y1="0"
                    x2={(i + 1) * 9}
                    y2="80"
                    stroke="rgba(212,175,55,0.05)"
                    strokeWidth="0.15"
                />
            ))}

            {/* Simplified continent outlines */}
            {/* North America */}
            <path
                d="M18,15 L22,12 L28,14 L30,18 L28,25 L25,28 L20,26 L18,20 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />
            {/* South America */}
            <path
                d="M28,35 L32,32 L34,38 L33,48 L30,52 L27,48 L26,40 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />
            {/* Europe */}
            <path
                d="M45,14 L52,12 L55,16 L52,20 L48,22 L44,18 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />
            {/* Africa */}
            <path
                d="M48,28 L54,26 L58,32 L56,45 L52,50 L48,45 L46,35 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />
            {/* Asia */}
            <path
                d="M56,12 L68,10 L78,14 L80,22 L75,28 L68,30 L60,26 L56,20 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />
            {/* Australia */}
            <path
                d="M75,42 L82,40 L85,44 L83,50 L78,52 L74,48 Z"
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="0.2"
                fill="rgba(212,175,55,0.02)"
            />

            {/* Connection lines between active nodes */}
            {GLOBAL_GRID_NODES.filter((n) => n.active).map((node, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return (
                    <line
                        key={`conn-${node.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={next.x}
                        y2={next.y}
                        stroke="rgba(212,175,55,0.06)"
                        strokeWidth="0.1"
                        strokeDasharray="1 2"
                    />
                );
            })}
        </svg>
    );
}

/* ═══ Blinking Node Dot ═══ */
function NodeDot({
    node,
    index,
}: {
    node: (typeof GLOBAL_GRID_NODES)[0];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                delay: index * 0.1 + 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20,
            }}
            className="absolute group"
            style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
            }}
        >
            {/* Outer pulse ring */}
            {node.active && (
                <div className="absolute inset-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                </div>
            )}

            {/* Dot */}
            <div
                className={`w-1.5 h-1.5 rounded-full ${node.active
                        ? "bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                        : "bg-white/20"
                    }`}
            />

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-gold/20 rounded px-3 py-1.5">
                    <p className="font-mono text-[7px] text-gold tracking-[0.2em]">
                        {node.label}
                    </p>
                    <p className="font-mono text-[8px] text-white/60">
                        {node.architects} ARCHITECTS
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function GlobalGrid() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const totalArchitects = GLOBAL_GRID_NODES.reduce(
        (sum, n) => sum + n.architects,
        0
    );

    return (
        <section
            ref={sectionRef}
            className="relative py-32 px-6 bg-[#030303] overflow-hidden border-t border-white/[0.04]"
        >
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="text-center mb-16"
            >
                <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">
                    GLOBAL NETWORK
                </p>
                <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-4">
                    ACTIVE ARCHITECTS
                </h2>
                <motion.p
                    className="font-mono text-2xl md:text-4xl text-gold tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    {totalArchitects.toLocaleString()}
                </motion.p>
            </motion.div>

            {/* Map container */}
            <div className="relative max-w-5xl mx-auto aspect-[5/4]">
                {/* Wireframe SVG map */}
                <div className="absolute inset-0">
                    <WireframeMap />
                </div>

                {/* Glow effect behind map */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

                {/* Active nodes */}
                {GLOBAL_GRID_NODES.map((node, i) => (
                    <NodeDot key={node.id} node={node} index={i} />
                ))}
            </div>

            {/* Bottom stats ticker */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex items-center justify-center gap-12 mt-16 font-mono text-[9px] text-white/40 tracking-[0.3em]"
            >
                <span>
                    NODES ONLINE:{" "}
                    <span className="text-gold">
                        {GLOBAL_GRID_NODES.filter((n) => n.active).length}
                    </span>
                </span>
                <span className="w-[1px] h-3 bg-white/10" />
                <span>
                    LATENCY:{" "}
                    <span className="text-emerald-400">8ms</span>
                </span>
                <span className="w-[1px] h-3 bg-white/10" />
                <span>
                    PROTOCOL:{" "}
                    <span className="text-gold">v4.0</span>
                </span>
            </motion.div>
        </section>
    );
}
