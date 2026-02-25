"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number;
    onClick?: () => void;
    href?: string;
}

export default function MagneticButton({ children, className, strength = 0.35, onClick, href }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
    const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

    const move = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
    };
    const reset = () => { x.set(0); y.set(0); };

    const baseClass = `group relative overflow-hidden border border-gold/30 px-10 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gold transition-colors duration-700 hover:text-[#050505] rounded-none inline-flex items-center justify-center ${className || ""}`;
    const innerContent = (
        <>
            <span className="absolute inset-0 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 flex items-center gap-3">{children}</span>
        </>
    );

    if (href) {
        return (
            <motion.div style={{ x: springX, y: springY }} whileTap={{ scale: 0.97 }}>
                <Link
                    href={href}
                    onMouseMove={move as any}
                    onMouseLeave={reset}
                    className={baseClass}
                >
                    {innerContent}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={move}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.97 }}
            className={baseClass}
        >
            {innerContent}
        </motion.button>
    );
}
