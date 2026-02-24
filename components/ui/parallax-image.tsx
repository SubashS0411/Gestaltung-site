"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: "video" | "square" | "portrait" | "3/4";
}

export default function ParallaxImage({ src, alt, className = "", aspectRatio = "3/4" }: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: "-10%" });

    // Parallax Logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.0]);
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    const aspectClasses = {
        "video": "aspect-video",
        "square": "aspect-square",
        "portrait": "aspect-[3/5]",
        "3/4": "aspect-[3/4]"
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden group ${aspectClasses[aspectRatio]} ${className}`}
        >
            {/* Curtain Reveal */}
            <motion.div
                initial={{ height: "100%" }}
                animate={inView ? { height: "0%" } : {}}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="absolute inset-x-0 bottom-0 bg-[#050505] z-20"
            />

            {/* Image Container with Parallax */}
            <motion.div style={{ scale, y }} className="relative w-full h-full will-change-transform transform-gpu">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </motion.div>

            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        </div>
    );
}
