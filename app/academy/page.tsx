"use client";

import PageShell from "@/components/layout/page-shell";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowUpRight, Play } from "lucide-react";

const courses = [
    { title: "Cinematic Motion Design", level: "ADVANCED", duration: "4h 30m", lessons: 12 },
    { title: "Scroll Physics & Parallax", level: "INTERMEDIATE", duration: "3h 15m", lessons: 8 },
    { title: "Glassmorphism Mastery", level: "BEGINNER", duration: "2h 00m", lessons: 6 },
    { title: "Next.js Performance Patterns", level: "ADVANCED", duration: "5h 45m", lessons: 15 },
    { title: "Typography for Dark Interfaces", level: "INTERMEDIATE", duration: "2h 30m", lessons: 7 },
    { title: "The Void & Gold Design System", level: "ADVANCED", duration: "3h 00m", lessons: 10 },
];

export default function AcademyPage() {
    return (
        <PageShell sectionNumber="05" title="ACADEMY" subtitle="STRUCTURED LEARNING PROTOCOLS">
            {/* Academy Updates */}
            {/* Featured */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-card p-8 mb-10 relative overflow-hidden"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Play className="w-4 h-4 text-gold stroke-[1.5]" />
                    <span className="font-mono text-[9px] text-gold tracking-[0.2em]">FEATURED PROTOCOL</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white tracking-wide mb-2">The Black Edition Masterclass</h3>
                <p className="font-mono text-[10px] text-white/50 tracking-wider max-w-lg">
                    A complete deep-dive into building cinematic luxury interfaces. From scroll physics to atmospheric rendering.
                </p>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-gold/[0.03] blur-[80px]" />
            </motion.div>

            {/* Course grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courses.map((c, i) => (
                    <motion.div
                        key={c.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 4 }}
                        className="glass-card p-5 group cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-mono text-[7px] tracking-[0.2em] px-2 py-0.5 rounded border ${c.level === "ADVANCED" ? "text-gold/80 border-gold/30" :
                                        c.level === "INTERMEDIATE" ? "text-blue-400/80 border-blue-400/20" :
                                            "text-emerald-400/80 border-emerald-400/20"
                                        }`}>{c.level}</span>
                                </div>
                                <h3 className="font-serif text-sm text-white/90 tracking-wide group-hover:text-gold transition-colors duration-500 mb-2">{c.title}</h3>
                                <div className="flex gap-4 font-mono text-[8px] text-white/50 tracking-wider">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1.5]" />{c.duration}</span>
                                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 stroke-[1.5]" />{c.lessons} lessons</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-gold group-hover:rotate-12 transition-all duration-500 shrink-0 mt-1" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageShell>
    );
}
