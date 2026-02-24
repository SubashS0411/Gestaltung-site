"use client";

import Hero from "@/components/sections/hero";
import Manifesto from "@/components/sections/manifesto";
import NeuralNodes from "@/components/sections/neural-nodes";
import RegistrySlider from "@/components/sections/registry-slider";
import FooterMicDrop from "@/components/sections/footer-mic-drop";
import Preloader from "@/components/ui/preloader";
import Navbar from "@/components/layout/navbar";

export default function Home() {
    return (
        <main className="bg-[#050505] min-h-screen selection:bg-[#D4AF37] selection:text-black">
            <Preloader onComplete={() => { }} />
            <Navbar />

            {/* SECTION A: Atmospheric Hero */}
            <Hero />

            {/* SECTION B: The Manifesto */}
            <Manifesto />

            {/* SECTION C: Neural Nodes (Zig-Zag) */}
            <NeuralNodes />

            {/* SECTION D: Registry (Horizontal) */}
            <RegistrySlider />

            {/* SECTION E: The Mic Drop */}
            <FooterMicDrop />
        </main>
    );
}
