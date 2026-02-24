"use client";

import MagneticButton from "../ui/magnetic-button";

export default function FooterMicDrop() {
    return (
        <footer className="relative h-[80vh] flex flex-col items-center justify-between overflow-hidden pt-32 bg-[#050505]">

            {/* CTA */}
            <div className="flex flex-col items-center gap-8 z-10">
                <p className="font-mono text-sm text-gold/60 tracking-widest text-center">
                    INITIATE SEQUENCE
                </p>
                <MagneticButton className="w-64 h-64 text-xl bg-gold/10 border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors duration-500">
                    JOIN THE NETWORK
                </MagneticButton>
            </div>

            {/* Massive Cut-off Text */}
            <div className="relative w-full flex justify-center translate-y-[15%]">
                <h1 className="font-serif text-[23vw] leading-none text-white tracking-tighter select-none opacity-90 mix-blend-difference transform-gpu will-change-transform">
                    GESTALTUNG
                </h1>

                {/* Gradient Overlay to fade bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
            </div>

            {/* Footer Meta */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between font-mono text-[10px] text-white/20 uppercase tracking-widest">
                <span>© 2024 GESTALTUNG SYSTEMS</span>
                <span className="hidden md:inline">ZURICH • TOKYO • NEW YORK</span>
                <span>SCROLL TO TOP</span>
            </div>
        </footer>
    );
}
