"use client";

import Hero from "@/components/sections/hero";
import PhilosophySection from "@/components/sections/philosophy-section";
import ArsenalPreview from "@/components/sections/arsenal-preview";
import FeaturedComponents from "@/components/sections/featured-components";
import LiveMetrics from "@/components/sections/live-metrics";
import ProcessSection from "@/components/sections/process-section";
import ArchitectVoices from "@/components/sections/architect-voices";
import GlobalGrid from "@/components/sections/global-grid";
import CTAFooter from "@/components/sections/cta-footer";
import Preloader from "@/components/ui/preloader";

export default function Home() {
    return (
        <main className="bg-[#050505] min-h-screen selection:bg-[#D4AF37] selection:text-black">
            <Preloader onComplete={() => { }} />
            <Hero />
            <PhilosophySection />
            <ArsenalPreview />
            <FeaturedComponents />
            <LiveMetrics />
            <ProcessSection />
            <ArchitectVoices />
            <GlobalGrid />
            <CTAFooter />
        </main>
    );
}
