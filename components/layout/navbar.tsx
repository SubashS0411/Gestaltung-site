"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const SPRING_GAME = { type: "spring" as const, stiffness: 400, damping: 25 };
const EASE_CIN = [0.76, 0, 0.24, 1] as const;

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
        <>
            <motion.nav
                style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
                className="fixed top-0 left-0 right-0 z-[60] h-16 px-6 md:px-10 border-b backdrop-blur-xl transform-gpu will-change-transform"
            >
                <div className="h-full flex items-center justify-between max-w-[1400px] mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <motion.svg
                            viewBox="0 0 40 40" className="w-6 h-6"
                            whileHover={{ rotate: 60 }}
                            transition={SPRING_GAME}
                        >
                            <defs>
                                <linearGradient id="nG2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#D4AF37" />
                                    <stop offset="100%" stopColor="#F3E5AB" />
                                </linearGradient>
                            </defs>
                            <polygon points="20,3 37,12 37,28 20,37 3,28 3,12" fill="none" stroke="url(#nG2)" strokeWidth="1" />
                            <circle cx="20" cy="20" r="2" fill="#D4AF37" />
                        </motion.svg>
                        <span className="hidden sm:block font-mono text-[10px] text-gold tracking-[0.35em] group-hover:tracking-[0.5em] transition-all duration-500">
                            GESTALTUNG
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-7">
                        {links.map((l) => {
                            const isActive = pathname === l.href;
                            const isEnter = l.href === "/auth";
                            return (
                                <Link key={l.href} href={l.href}>
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={SPRING_GAME}
                                        className={`relative font-mono text-[9px] tracking-[0.25em] transition-colors duration-300 ${isEnter
                                                ? "text-gold border border-gold/30 px-4 py-1.5 rounded hover:bg-gold hover:text-black"
                                                : isActive
                                                    ? "text-gold"
                                                    : "text-white/80 hover:text-white"
                                            }`}
                                    >
                                        {isActive && !isEnter && (
                                            <motion.span
                                                layoutId="navActive"
                                                className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                                                transition={SPRING_GAME}
                                            />
                                        )}
                                        {l.label}
                                    </motion.span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Trigger */}
                    <motion.button
                        onClick={() => setOpen(!open)}
                        whileTap={{ scale: 0.9 }}
                        transition={SPRING_GAME}
                        className="md:hidden p-2 text-gold"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </motion.button>
                </div>
            </motion.nav>

            {/* Fullscreen "Pause Menu" Mobile Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Heavy blur background — "pause menu" effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[55] bg-[#050505]/85 backdrop-blur-3xl transform-gpu"
                            onClick={() => setOpen(false)}
                        />

                        {/* Menu content — snaps in with game-UI aggression */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={SPRING_GAME}
                            className="fixed inset-0 z-[58] flex flex-col items-center justify-center transform-gpu"
                        >
                            <div className="space-y-1 w-64">
                                {links.map((l, i) => (
                                    <motion.div
                                        key={l.href}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        transition={{ ...SPRING_GAME, delay: i * 0.04 }}
                                    >
                                        <Link
                                            href={l.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-4 py-4 font-mono text-sm tracking-[0.3em] border-b border-white/[0.04] transition-all duration-300 ${pathname === l.href
                                                    ? "text-gold"
                                                    : "text-white/80 hover:text-gold hover:pl-2"
                                                }`}
                                        >
                                            {pathname === l.href && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
                                            )}
                                            <span>{l.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Close hint */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="font-mono text-[8px] text-white/70 tracking-[0.4em] mt-12"
                            >
                                TAP OUTSIDE TO RESUME
                            </motion.p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
