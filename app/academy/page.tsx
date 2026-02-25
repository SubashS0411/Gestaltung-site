"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MASTERCLASSES } from "@/lib/data";
import { Play, Clock, Layers, Users, ChevronRight } from "lucide-react";
import PageShell from "@/components/layout/page-shell";

export default function AcademyPage() {
    const [activeAccent, setActiveAccent] = useState("#D4AF37");

    return (
        <PageShell sectionNumber="03" title="ACADEMY" subtitle="MASTERCLASS PROTOCOLS — CINEMATIC EDUCATION">
            {/* Ambient accent glow — shifts on viewport entry */}
            <div
                className="fixed inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
                style={{
                    background: `radial-gradient(ellipse 60% 40% at 50% 60%, ${activeAccent}08 0%, transparent 70%)`,
                }}
            />

            {/* Featured masterclass — large hero card */}
            <FeaturedCourse course={MASTERCLASSES[0]} onInView={() => setActiveAccent(MASTERCLASSES[0].accentColor)} />

            {/* Carousel row */}
            <div className="mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-[9px] text-gold tracking-[0.5em]">ALL MASTERCLASSES</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/20 to-transparent" />
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                    {MASTERCLASSES.map((course, i) => (
                        <CourseCard key={course.id} course={course} index={i} onInView={() => setActiveAccent(course.accentColor)} />
                    ))}
                </div>
            </div>

            {/* Course detail grid */}
            <div className="mt-24 space-y-16">
                {MASTERCLASSES.map((course, i) => (
                    <CourseDetail key={course.id} course={course} index={i} onInView={() => setActiveAccent(course.accentColor)} />
                ))}
            </div>
        </PageShell>
    );
}

function FeaturedCourse({ course, onInView }: { course: typeof MASTERCLASSES[0]; onInView: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });
    if (isInView) onInView();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer"
        >
            {/* Background image */}
            <div className="absolute inset-0">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">FEATURED</span>
                    <span className={`font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT"
                            ? "text-gold border-gold/30 bg-gold/10"
                            : "text-white/90 border-white/20 bg-white/5"
                        }`}>{course.difficulty}</span>
                </div>
                <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-[0.95] mb-3 drop-shadow-lg">{course.title}</h2>
                <p className="font-mono text-xs text-gold tracking-[0.2em] mb-4">{course.subtitle}</p>
                <p className="font-mono text-sm text-white/80 max-w-2xl leading-relaxed mb-6">{course.description}</p>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gold text-black font-mono text-[10px] tracking-wider rounded-lg hover:bg-gold/90 transition-all group/btn">
                        <Play className="w-4 h-4 fill-current" />
                        BEGIN PROTOCOL
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-white/80 tracking-wider">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1]" />{course.duration}</span>
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3 stroke-[1]" />{course.lessons} LESSONS</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 stroke-[1]" />{course.students.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Play icon center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-lg flex items-center justify-center border border-gold/30">
                    <Play className="w-8 h-8 text-gold fill-current ml-1" />
                </div>
            </div>
        </motion.div>
    );
}

function CourseCard({ course, index, onInView }: { course: typeof MASTERCLASSES[0]; index: number; onInView: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.7 });
    if (isInView) onInView();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="shrink-0 w-[70vw] md:w-[40vw] lg:w-[30vw] snap-start cursor-pointer group"
        >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-lg flex items-center justify-center border border-gold/30">
                        <Play className="w-6 h-6 text-gold fill-current ml-0.5" />
                    </div>
                </div>
                <span className={`absolute top-3 right-3 font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT" ? "text-gold border-gold/30 bg-gold/10" : "text-white/90 border-white/20 bg-white/5"
                    }`}>{course.difficulty}</span>
            </div>
            <h3 className="font-serif text-xl text-white group-hover:text-gold transition-colors duration-500 mb-1">{course.title}</h3>
            <p className="font-mono text-[9px] text-gold/80 tracking-[0.2em] mb-2">{course.subtitle}</p>
            <div className="flex items-center gap-4 font-mono text-[8px] text-white/80 tracking-wider">
                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5 stroke-[1]" />{course.duration}</span>
                <span>{course.lessons} LESSONS</span>
                <span>{course.instructor}</span>
            </div>
        </motion.div>
    );
}

function CourseDetail({ course, index, onInView }: { course: typeof MASTERCLASSES[0]; index: number; onInView: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    if (isInView) onInView();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
            {/* Left — image */}
            <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 backdrop-blur flex items-center justify-center border border-gold/30">
                        <Play className="w-4 h-4 text-gold fill-current ml-0.5" />
                    </div>
                    <span className="font-mono text-[9px] text-white/90 tracking-wider">{course.duration}</span>
                </div>
            </div>

            {/* Right — info */}
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <span className={`font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT" ? "text-gold border-gold/30 bg-gold/10" : "text-white/90 border-white/20 bg-white/5"
                        }`}>{course.difficulty}</span>
                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{course.lessons} LESSONS</span>
                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{course.students.toLocaleString()} ENROLLED</span>
                </div>
                <h3 className="font-serif text-3xl text-white tracking-tight">{course.title}</h3>
                <p className="font-mono text-[10px] text-gold/80 tracking-[0.2em]">{course.subtitle}</p>
                <p className="font-mono text-sm text-white/80 leading-relaxed">{course.description}</p>

                {/* Chapters */}
                <div className="space-y-2">
                    <span className="font-mono text-[8px] text-gold tracking-[0.3em]">CHAPTERS</span>
                    {course.chapters.map((ch, i) => (
                        <div key={ch} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                            <span className="font-mono text-[9px] text-gold/80 w-6">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-mono text-xs text-white/90 tracking-wide">{ch}</span>
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                        <span key={tag} className="tag-pill text-[7px]">{tag}</span>
                    ))}
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[8px] text-gold">{course.instructor.slice(0, 2)}</div>
                    <div>
                        <p className="font-mono text-xs text-white tracking-wider">{course.instructor}</p>
                        <p className="font-mono text-[8px] text-white/80 tracking-wider">{course.instructorRole}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
