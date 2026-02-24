"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/ui/preloader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false);

    const handleComplete = useCallback(() => setLoaded(true), []);

    return (
        <>
            <AnimatePresence mode="wait">
                {!loaded && <Preloader key="preloader" onComplete={handleComplete} />}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0 }}
                transition={{ duration: 0.6 }}
            >
                {children}
            </motion.div>
        </>
    );
}
