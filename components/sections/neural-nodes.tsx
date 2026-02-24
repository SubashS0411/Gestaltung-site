"use client";

import { motion } from "framer-motion";
import ParallaxImage from "../ui/parallax-image";

const nodes = [
    {
        id: "01",
        title: "FIBER OPTICS",
        coord: "COORD: 45.22.11",
        src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // Abstract Tech
        align: "left"
    },
    {
        id: "02",
        title: "SERVER CORE",
        coord: "COORD: 89.10.33",
        src: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2668&auto=format&fit=crop", // Server Room
        align: "right"
    },
    {
        id: "03",
        title: "LIQUID METAL",
        coord: "COORD: 12.00.99",
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract Liquid
        align: "left"
    }
];

export default function NeuralNodes() {
    return (
        <section className="py-32 px-6">
            <div className="container mx-auto space-y-32">
                {nodes.map((node, i) => (
                    <div key={node.id} className={`flex flex-col md:flex-row ${node.align === 'right' ? 'md:justify-end' : ''} items-center gap-12`}>

                        {/* Gradient Border Wrapper */}
                        <div className={`relative w-full md:w-5/12 aspect-[3/4] p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/20 to-transparent ${node.align === 'right' ? 'order-last' : 'order-first'}`}>
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-void">
                                <ParallaxImage
                                    src={node.src}
                                    alt={node.title}
                                    aspectRatio="3/4"
                                    className="will-change-transform transform-gpu"
                                />

                                {/* Floating Data Overlay */}
                                <motion.div
                                    initial={{ opacity: 0, x: node.align === 'right' ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className={`absolute -bottom-8 ${node.align === 'right' ? '-left-12' : '-right-12'} bg-obsidian/80 backdrop-blur-md border border-white/10 p-4 z-30`}
                                >
                                    <span className="font-mono text-[10px] text-gold tracking-[0.2em] block mb-1">NODE_{node.id}</span>
                                    <h3 className="font-serif text-2xl text-white">{node.title}</h3>
                                    <div className="h-[1px] w-full bg-gold/30 my-2" />
                                    <span className="font-mono text-[9px] text-white/40">{node.coord}</span>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}
