"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxTextProps {
    text: string;
    className?: string;
}

/**
 * Massive background text that drifts upward at 0.5x scroll speed
 */
export default function ParallaxText({ text, className }: ParallaxTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);

    return (
        <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <motion.div
                style={{ y }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <span
                    className={`font-serif text-[18vw] md:text-[14vw] leading-none tracking-[0.15em] uppercase whitespace-nowrap ${className || ""}`}
                    style={{
                        color: "transparent",
                        WebkitTextStroke: "1px rgba(212, 175, 55, 0.05)",
                    }}
                >
                    {text}
                </span>
            </motion.div>
        </div>
    );
}
