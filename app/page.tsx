"use client";

import Hero from "@/components/sections/hero";
import Manifesto from "@/components/sections/manifesto";
import NeuralNodes from "@/components/sections/neural-nodes";
import RegistrySlider from "@/components/sections/registry-slider";
import FooterMicDrop from "@/components/sections/footer-mic-drop";
import ScrollInterlude from "@/components/sections/scroll-interlude";
import ProtocolGrid from "@/components/sections/protocol-grid";
import Preloader from "@/components/ui/preloader";
import Navbar from "@/components/layout/navbar";

export default function Home() {
    return (
        <main className="bg-[#050505] min-h-screen selection:bg-[#D4AF37] selection:text-black">
            <Preloader onComplete={() => { }} />
            <Navbar />

            {/* SECTION A: Atmospheric Hero */}
            <Hero />

            {/* INTERLUDE 1 */}
            <ScrollInterlude
                topText="THE PROTOCOL"
                headline="Precision engineered for the void."
                subtext="A digital experience that feels heavy, expensive, and inevitable. Every interaction carries weight."
            />

            {/* SECTION B: The Manifesto */}
            <Manifesto />

            {/* SECTION C: Protocol Specifications */}
            <ProtocolGrid />

            {/* INTERLUDE 2 */}
            <ScrollInterlude
                topText="INFRASTRUCTURE"
                headline="Where design meets engineering."
                subtext="Three neural nodes. Twelve regions. Sub-millisecond latency. The backbone of cinematic validation."
                gradient="radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 70%)"
            />

            {/* SECTION D: Neural Nodes (Zig-Zag with images) */}
            <NeuralNodes />

            {/* SECTION E: Registry (Horizontal scroll) */}
            <RegistrySlider />

            {/* SECTION F: The Mic Drop */}
            <FooterMicDrop />
        </main>
    );
}
