"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.05, // "Oiled" heavy luxury feel
                duration: 1.5,
                smoothWheel: true,
                wheelMultiplier: 1.0,
            }}
        >
            {children}
        </ReactLenis>
    );
}
