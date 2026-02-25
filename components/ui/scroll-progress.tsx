"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50 });

    return (
        <motion.div
            style={{ scaleX, transformOrigin: "0%" }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#AA8C2C] via-[#D4AF37] to-[#F3E5AB] z-[60]"
        />
    );
}
