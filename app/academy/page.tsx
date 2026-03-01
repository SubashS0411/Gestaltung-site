"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useVelocity, useSpring, useTransform, useInView } from "framer-motion";
import { MASTERCLASSES, INSTRUCTORS, CURRICULUM_NODES } from "@/lib/data";
import { Play, ChevronRight, Award, BookOpen, Users } from "lucide-react";

const SPRING_WOBBLE = { type: "spring" as const, stiffness: 300, damping: 15 };

/* ═══ Text Scramble ═══ */
function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        if (!trigger) return;
        let iter = 0;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01";
        const interval = setInterval(() => {
            setDisplay(text.split("").map((c, i) => {
                if (c === " ") return " ";
                if (i < iter) return c;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iter >= text.length) clearInterval(interval);
            iter += text.length / 15;
        }, 30);
        return () => clearInterval(interval);
    }, [text, trigger]);
    return <>{display || text.replace(/[a-zA-Z]/g, "0")}</>;
}

/* ═══ Section 1: Featured Masterclass with Momentum Smear ═══ */
function FeaturedMasterclass({ course, scrollVelocity }: { course: typeof MASTERCLASSES[0]; scrollVelocity: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });
    const [isHovered, setIsHovered] = useState(false);

    const skew = useTransform(scrollVelocity, [-2000, 2000], [15, -15]);
    const scaleY = useTransform(scrollVelocity, [-2000, 0, 2000], [1.15, 1, 1.15]);
    const blur = useTransform(scrollVelocity, [-2000, 0, 2000], ["blur(12px)", "blur(0px)", "blur(12px)"]);
    const smoothSkew = useSpring(skew, SPRING_WOBBLE);
    const smoothScaleY = useSpring(scaleY, SPRING_WOBBLE);

    return (
        <motion.div
            ref={cardRef}
            style={{ skewY: smoothSkew, scaleY: smoothScaleY, filter: blur }}
            className="relative w-full aspect-video md:aspect-[21/9] mb-24 origin-center transform-gpu will-change-transform z-10"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" xmlns="http://www.w3.org/2000/svg">
                <motion.rect
                    width="100%" height="100%" fill="none" stroke="#D4AF37" strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                />
            </svg>

            <motion.div
                initial={{ opacity: 0, backgroundColor: "#D4AF37" }}
                animate={isInView ? { opacity: 1, backgroundColor: "rgba(0,0,0,0)" } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden bg-black"
            >
                <motion.div style={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 1 }} className="absolute inset-0">
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover opacity-80 filter contrast-125 saturate-50"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

                {isHovered && (
                    <>
                        <div className="absolute inset-0 bg-red-500/10 mix-blend-screen translate-x-1 animate-[glitch1_0.2s_ease_both_infinite]" />
                        <div className="absolute inset-0 bg-blue-500/10 mix-blend-screen -translate-x-1 animate-[glitch2_0.2s_ease_both_infinite_reverse]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                    </>
                )}
            </motion.div>

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-30">
                <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-[8px] tracking-[0.2em] text-black bg-gold px-3 py-1 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                            <ScrambleText text={course.difficulty} trigger={isInView} />
                        </span>
                        <span className="font-mono text-[8px] tracking-wider text-white/50 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1">
                            <ScrambleText text={`${course.lessons} LESSONS`} trigger={isInView} />
                        </span>
                    </div>
                    <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9] mb-4">
                        <ScrambleText text={course.title} trigger={isInView} />
                    </h2>
                    <p className="font-mono text-xs md:text-sm text-gold tracking-[0.3em] max-w-2xl mb-8 opacity-90">
                        <ScrambleText text={course.subtitle} trigger={isInView} />
                    </p>
                    <button className="flex items-center gap-4 bg-white/5 hover:bg-gold border border-white/10 hover:border-gold px-6 py-4 transition-all duration-300 group/btn backdrop-blur-md">
                        <Play className="w-5 h-5 text-white group-hover/btn:text-black fill-current" />
                        <span className="font-mono text-[10px] text-white group-hover/btn:text-black tracking-[0.3em]">INITIALIZE PLAYBACK</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ═══ Section 2: Curriculum Timeline ═══ */
function CurriculumTimeline() {
    return (
        <div className="relative max-w-3xl mx-auto py-16">
            {/* Gold vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

            {CURRICULUM_NODES.map((node, i) => {
                const ref = useRef<HTMLDivElement>(null);
                const isInView = useInView(ref, { once: true, amount: 0.5 });

                return (
                    <motion.div
                        key={node.id}
                        ref={ref}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative pl-20 mb-12 group"
                    >
                        {/* Node dot */}
                        <div className="absolute left-[26px] top-2 z-10">
                            <motion.div
                                animate={isInView ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`w-4 h-4 rounded-full border-2 ${node.completed
                                    ? "bg-gold border-gold shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                                    : "bg-[#050505] border-white/20 group-hover:border-gold/40"
                                    } transition-all`}
                            />
                            {/* Pulse ring for completed */}
                            {node.completed && isInView && (
                                <motion.div
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 1, repeat: 1 }}
                                    className="absolute inset-0 rounded-full bg-gold/30"
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <span className="font-mono text-[8px] text-gold/60 tracking-[0.3em] mb-1 block">CHAPTER {node.chapter}</span>
                            <h3 className="font-serif text-lg text-white mb-1 group-hover:text-gold transition-colors">{node.title}</h3>
                            <p className="font-mono text-[10px] text-white/50 leading-relaxed">{node.description}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ═══ Section 3: Instructor Dossiers ═══ */
function InstructorDossiers() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="relative max-w-5xl mx-auto py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INSTRUCTORS.map((instructor) => (
                    <motion.div
                        key={instructor.id}
                        onHoverStart={() => setHoveredId(instructor.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        animate={{
                            opacity: hoveredId === null ? 1 : hoveredId === instructor.id ? 1 : 0.1,
                            scale: hoveredId === instructor.id ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className="p-8 rounded-xl bg-black/40 backdrop-blur-xl border border-white/[0.06] hover:border-gold/30 cursor-pointer transform-gpu"
                    >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-lg text-gold mb-6 relative overflow-hidden border border-gold/20">
                            <Image src={instructor.avatar} alt={instructor.name} fill className="object-cover filter grayscale" />
                        </div>
                        <h3 className="font-mono text-sm text-white tracking-wider mb-1">{instructor.name}</h3>
                        <p className="font-mono text-[8px] text-gold tracking-[0.2em] mb-4">{instructor.title}</p>
                        <p className="font-mono text-[10px] text-white/50 leading-relaxed mb-6">{instructor.bio}</p>

                        <div className="flex items-center gap-4 font-mono text-[8px] text-white/40 tracking-wider">
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{instructor.courses} COURSES</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{instructor.students.toLocaleString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Dim overlay when hovering */}
            <AnimatePresence>
                {hoveredId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#050505]/80 z-[-1] pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══ Section 4: Certification Terminal ═══ */
function CertificationTerminal() {
    const [currentLine, setCurrentLine] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const examLines = useMemo(() => [
        { type: "system", text: "[GESTALTUNG CERTIFICATION PROTOCOL v2.0]" },
        { type: "system", text: "Loading assessment module..." },
        { type: "system", text: "Assessment initialized. 4 questions queued." },
        { type: "prompt", text: "" },
        { type: "question", text: "Q1: What is the optimal lerp value for luxury Lenis scrolling?" },
        { type: "options", text: "  A) 0.05    B) 0.08    C) 0.15    D) 0.01" },
        { type: "prompt", text: "" },
        { type: "question", text: "Q2: Which CSS property triggers GPU compositing?" },
        { type: "options", text: "  A) margin    B) transform    C) width    D) top" },
        { type: "prompt", text: "" },
        { type: "question", text: "Q3: What stiffness value defines 'heavy mechanical' spring physics?" },
        { type: "options", text: "  A) 50    B) 100    C) 300    D) 1000" },
        { type: "prompt", text: "" },
        { type: "system", text: "[AWAITING INPUT] Type your answers to proceed..." },
    ], []);

    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < examLines.length) {
                setCurrentLine(i + 1);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [isInView, examLines]);

    return (
        <div ref={ref} className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#020202]">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0a] border-b border-white/[0.04]">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="font-mono text-[8px] text-gold tracking-[0.3em] ml-3">CERTIFICATION EXAM — ARCHITECT LEVEL</span>
                </div>

                {/* Terminal body */}
                <div className="p-6 min-h-[300px] font-mono text-[11px] leading-[2]">
                    {examLines.slice(0, currentLine).map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                            className={
                                line.type === "system" ? "text-gold/70" :
                                    line.type === "question" ? "text-white" :
                                        line.type === "options" ? "text-white/50" :
                                            "text-gold/40"
                            }
                        >
                            {line.type === "prompt" ? (
                                <span className="text-gold">{">"} <span className="animate-pulse">▮</span></span>
                            ) : (
                                line.text
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══ Main Page ═══ */
export default function AcademyPage() {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-gold/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-white/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="mb-16 text-center">
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">03 — THE ACADEMY</p>
                    <h1 className="font-serif text-6xl md:text-8xl text-white tracking-tight mb-6 drop-shadow-2xl">ACADEMY</h1>
                    <p className="font-mono text-xs md:text-sm text-white/50 tracking-wider max-w-2xl mx-auto uppercase">Velocity map enabled. Scroll to induce momentum distortion.</p>
                </motion.div>

                {/* ═══ Section 1: Featured Masterclasses with Momentum Smear ═══ */}
                <div className="flex flex-col items-center mb-16">
                    {MASTERCLASSES.map((course) => (
                        <FeaturedMasterclass key={course.id} course={course} scrollVelocity={scrollVelocity} />
                    ))}
                </div>

                {/* ═══ Section 2: Curriculum Timeline ═══ */}
                <div className="mb-16">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
                        <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">CURRICULUM</p>
                        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">CHAPTER NODES</h2>
                    </motion.div>
                    <CurriculumTimeline />
                </div>

                {/* ═══ Section 3: Instructor Dossiers ═══ */}
                <div className="mb-20">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
                        <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">INSTRUCTORS</p>
                        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">ARCHITECT DOSSIERS</h2>
                    </motion.div>
                    <InstructorDossiers />
                </div>

                {/* ═══ Section 4: Certification Terminal ═══ */}
                <div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
                        <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-3">CERTIFICATION</p>
                        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-3">PROVE YOUR RANK</h2>
                        <p className="font-mono text-xs text-white/40 tracking-wider">Complete the assessment to earn your Architect certification.</p>
                    </motion.div>
                    <CertificationTerminal />
                </div>
            </div>

            {/* VHS Glitch Keyframes */}
            <style jsx global>{`
                @keyframes glitch1 {
                    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
                    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
                    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
                    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
                    80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
                    100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
                }
                @keyframes glitch2 {
                    0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
                    20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
                    40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
                    60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
                    80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
                    100% { clip-path: inset(5% 0 80% 0); transform: translate(-1px, 1px); }
                }
            `}</style>
        </div>
    );
}

/* Fix for AnimatePresence import */
import { AnimatePresence } from "framer-motion";
