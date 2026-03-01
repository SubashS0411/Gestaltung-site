"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

const EASE_CINEMATIC = [0.76, 0, 0.24, 1] as const;

/**
 * Hexagon-wipe page transition at the root level.
 * Wraps children with AnimatePresence for seamless route changes.
 */
export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="relative"
                >
                    {/* Entry overlay — hexagon scale wipe */}
                    <motion.div
                        className="fixed inset-0 z-[95] bg-[#050505] pointer-events-none transform-gpu"
                        variants={{
                            initial: { clipPath: "circle(150% at 50% 50%)" },
                            enter: { clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.6, ease: EASE_CINEMATIC, delay: 0.1 } },
                            exit: { clipPath: "circle(150% at 50% 50%)", transition: { duration: 0.5, ease: EASE_CINEMATIC } },
                        }}
                    />

                    {/* Gold line flash on transition */}
                    <motion.div
                        className="fixed top-1/2 left-0 right-0 h-[1px] z-[96] pointer-events-none"
                        variants={{
                            initial: { scaleX: 0, opacity: 1 },
                            enter: { scaleX: [0, 1, 1, 0], opacity: [1, 1, 1, 0], transition: { duration: 0.8, times: [0, 0.3, 0.7, 1], ease: "easeOut" } },
                            exit: { scaleX: 0, opacity: 0 },
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    </motion.div>

                    {/* Page content */}
                    <motion.div
                        variants={{
                            initial: { opacity: 0, y: 8 },
                            enter: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15, ease: EASE_CINEMATIC } },
                            exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_CINEMATIC } },
                        }}
                        className="transform-gpu will-change-transform"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
