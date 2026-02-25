"use client";

import { motion } from "framer-motion";
import { ACADEMY_COURSES } from "@/lib/data";
import { BookOpen, Clock, Play, ArrowUpRight } from "lucide-react";

export default function DashboardAcademyPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <span className="font-mono text-[10px] text-gold tracking-[0.5em] block mb-2">LEARNING</span>
                <h1 className="font-serif text-4xl text-white tracking-tight">Academy</h1>
                <p className="font-mono text-xs text-white/80 mt-2 tracking-wider">Structured learning protocols for the collective.</p>
            </motion.div>

            <div className="space-y-4">
                {ACADEMY_COURSES.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.5 }}
                        className="group cursor-pointer p-[1px] rounded-xl bg-gradient-to-r from-white/10 to-transparent hover:from-gold/20 hover:to-transparent transition-all duration-500"
                    >
                        <div className="bg-[#050505] rounded-xl p-6 hover:bg-[#070707] transition-colors flex flex-col md:flex-row gap-6">
                            {/* Thumbnail */}
                            <div className="w-full md:w-48 h-32 rounded-lg bg-gradient-to-br from-gold/[0.05] to-transparent border border-white/[0.04] flex items-center justify-center shrink-0">
                                <Play className="w-8 h-8 text-gold/20 group-hover:text-gold/40 transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`font-mono text-[7px] tracking-[0.2em] px-2 py-0.5 rounded border ${course.difficulty === "ADVANCED" ? "text-gold/80 border-gold/20" :
                                                course.difficulty === "INTERMEDIATE" ? "text-blue-400/80 border-blue-400/20" :
                                                    "text-emerald-400/80 border-emerald-400/20"
                                            }`}>{course.difficulty}</span>
                                    </div>
                                    <h3 className="font-serif text-lg text-white/90 group-hover:text-gold transition-colors duration-500 mb-2">{course.title}</h3>
                                    <p className="font-mono text-[10px] text-white/80 tracking-wide leading-relaxed">{course.description}</p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-4 font-mono text-[9px] text-white/80 tracking-wider">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1.5]" />{course.duration}</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 stroke-[1.5]" />{course.lessons} lessons</span>
                                        <span>by {course.instructor}</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-gold/40 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
