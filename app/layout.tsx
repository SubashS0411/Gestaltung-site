import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/smooth-scroll";
import CinematicNoise from "@/components/ui/cinematic-noise";
import ScrollProgress from "@/components/ui/scroll-progress";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
});

export const metadata: Metadata = {
    title: "GESTALTUNG — The Black Edition Protocol",
    description: "A cinematic luxury interface protocol. Dark. Atmospheric. Engineered.",
    icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
            <body className="relative">
                <SmoothScroll>
                    <ScrollProgress />
                    <CinematicNoise />
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}
