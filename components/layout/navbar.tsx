"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";

const links = [
    { href: "/", label: "HOME" },
    { href: "/registry", label: "REGISTRY" },
    { href: "/node-hub", label: "NODE HUB" },
    { href: "/academy", label: "ACADEMY" },
    { href: "/foundry", label: "FOUNDRY" },
    { href: "/about", label: "ABOUT" },
    { href: "/auth", label: "ENTER HUB" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { scrollY } = useScroll();
    const navBg = useTransform(scrollY, [0, 80], ["rgba(5,5,5,0)", "rgba(5,5,5,0.92)"]);
    const navBorder = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"]);

    return (
        <motion.nav
            style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
            className="fixed top-0 left-0 right-0 z-[50] h-20 px-6 md:px-10 border-b backdrop-blur-xl"
        >
            <div className="h-full flex items-center justify-between max-w-[1400px] mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <svg viewBox="0 0 40 40" className="w-6 h-6">
                        <defs>
                            <linearGradient id="nG" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#F3E5AB" />
                            </linearGradient>
                        </defs>
                        <polygon points="20,3 37,12 37,28 20,37 3,28 3,12" fill="none" stroke="url(#nG)" strokeWidth="1" />
                        <circle cx="20" cy="20" r="2" fill="#D4AF37" />
                    </svg>
                    <span className="hidden sm:block font-mono text-[10px] text-gold tracking-[0.35em]">
                        GESTALTUNG
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((l) => {
                        const isActive = pathname === l.href;
                        const isEnter = l.href === "/auth";
                        return (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`relative font-mono text-[9px] tracking-[0.25em] transition-all duration-500 group ${isEnter
                                        ? "text-gold border border-gold/30 px-4 py-1.5 rounded hover:bg-gold hover:text-black"
                                        : isActive
                                            ? "text-gold"
                                            : "text-white/80 hover:text-white"
                                    }`}
                            >
                                {isActive && !isEnter && (
                                    <motion.span
                                        layoutId="navDot"
                                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                )}
                                {l.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Trigger */}
                <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gold">
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="absolute top-20 left-0 right-0 border-t border-white/[0.04] bg-[#050505]/98 backdrop-blur-xl md:hidden"
                >
                    <div className="px-6 py-4 space-y-1">
                        {links.map((l, i) => (
                            <motion.div
                                key={l.href}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 py-3 font-mono text-xs tracking-[0.2em] border-b border-white/[0.03] ${pathname === l.href ? "text-gold" : "text-white/80"
                                        }`}
                                >
                                    {pathname === l.href && <span className="w-1 h-1 rounded-full bg-gold" />}
                                    <span>{l.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
