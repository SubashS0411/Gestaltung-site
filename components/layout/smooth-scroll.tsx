"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAbout = pathname === "/about";

    return (
        <ReactLenis
            root
            options={{
                lerp: isAbout ? 0.02 : 0.08, // 0.08 = luxury heavy feel, 0.02 = ultra-friction on About
                duration: 1.5,
                smoothWheel: true,
                wheelMultiplier: 1.0,
            }}
        >
            {children}
        </ReactLenis>
    );
}
