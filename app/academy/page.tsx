"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, useInView } from "framer-motion";
import { MASTERCLASSES } from "@/lib/data";
import { Play, Clock, Layers, Users, ChevronRight } from "lucide-react";
import * as THREE from "three";

/* ═══ 3D Swirling Particles ═══ */
function SwirlingParticles({ count = 100, accentColor = "#D4AF37" }: { count?: number; accentColor?: string }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() =>
        Array.from({ length: count }, () => ({
            radius: 2 + Math.random() * 8,
            speed: 0.01 + Math.random() * 0.04,
            offset: Math.random() * Math.PI * 2,
            y: (Math.random() - 0.5) * 12,
            size: 0.01 + Math.random() * 0.025,
        })),
        [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        particles.forEach((p, i) => {
            const angle = t * p.speed + p.offset;
            dummy.position.set(
                Math.cos(angle) * p.radius,
                p.y + Math.sin(t * 0.3 + p.offset) * 0.5,
                Math.sin(angle) * p.radius - 5
            );
            dummy.scale.setScalar(p.size + Math.sin(t * 0.5 + p.offset) * 0.005);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.4} />
        </instancedMesh>
    );
}

function AcademyScene({ accentColor }: { accentColor: string }) {
    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={0.3} color={accentColor} />
            <pointLight position={[-5, -3, 3]} intensity={0.2} color="#F3E5AB" />
            <SwirlingParticles count={80} accentColor={accentColor} />
            <Stars radius={50} depth={25} count={600} factor={2} saturation={0} fade speed={0.3} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.8} intensity={0.3} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══ Main Page ═══ */
export default function AcademyPage() {
    const [activeAccent, setActiveAccent] = useState("#D4AF37");

    return (
        <div className="relative min-h-screen bg-[#050505]">
            {/* 3D Canvas */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                    <Suspense fallback={null}><AcademyScene accentColor={activeAccent} /></Suspense>
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-[3] max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">03 — THE ACADEMY</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-3 drop-shadow-lg">ACADEMY</h1>
                    <p className="font-mono text-sm text-white/80 tracking-wider mb-8">Masterclass protocols — cinematic education for architects.</p>
                </motion.div>

                {/* Featured */}
                <FeaturedCourse course={MASTERCLASSES[0]} onAccent={setActiveAccent} />

                {/* Carousel */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-mono text-[9px] text-gold tracking-[0.5em]">ALL MASTERCLASSES</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/20 to-transparent" />
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                        {MASTERCLASSES.map((course, i) => (
                            <CourseCard key={course.id} course={course} index={i} onAccent={setActiveAccent} />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="mt-24 space-y-16">
                    {MASTERCLASSES.map((course, i) => (
                        <CourseDetail key={course.id} course={course} index={i} onAccent={setActiveAccent} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeaturedCourse({ course, onAccent }: { course: typeof MASTERCLASSES[0]; onAccent: (c: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });
    useEffect(() => { if (isInView) onAccent(course.accentColor); }, [isInView, course.accentColor, onAccent]);

    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="relative aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer">
            <div className="absolute inset-0">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">FEATURED</span>
                    <span className={`font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT" ? "text-gold border-gold/30 bg-gold/10" : "text-white/90 border-white/20 bg-white/5"}`}>{course.difficulty}</span>
                </div>
                <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-[0.95] mb-3 drop-shadow-lg">{course.title}</h2>
                <p className="font-mono text-xs text-gold tracking-[0.2em] mb-4">{course.subtitle}</p>
                <p className="font-mono text-sm text-white/80 max-w-2xl leading-relaxed mb-6">{course.description}</p>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-3 px-6 py-3 bg-gold text-black font-mono text-[10px] tracking-wider rounded-lg hover:bg-gold/90 transition-all group/btn">
                        <Play className="w-4 h-4 fill-current" />&nbsp;BEGIN PROTOCOL
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-white/80 tracking-wider">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1]" />{course.duration}</span>
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3 stroke-[1]" />{course.lessons} LESSONS</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 stroke-[1]" />{course.students.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-lg flex items-center justify-center border border-gold/30"><Play className="w-8 h-8 text-gold fill-current ml-1" /></div>
            </div>
        </motion.div>
    );
}

function CourseCard({ course, index, onAccent }: { course: typeof MASTERCLASSES[0]; index: number; onAccent: (c: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.7 });
    useEffect(() => { if (isInView) onAccent(course.accentColor); }, [isInView, course.accentColor, onAccent]);

    return (
        <motion.div ref={ref} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}
            className="shrink-0 w-[70vw] md:w-[40vw] lg:w-[30vw] snap-start cursor-pointer group">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-lg flex items-center justify-center border border-gold/30"><Play className="w-6 h-6 text-gold fill-current ml-0.5" /></div>
                </div>
                <span className={`absolute top-3 right-3 font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT" ? "text-gold border-gold/30 bg-gold/10" : "text-white/90 border-white/20 bg-white/5"}`}>{course.difficulty}</span>
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

function CourseDetail({ course, index, onAccent }: { course: typeof MASTERCLASSES[0]; index: number; onAccent: (c: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    useEffect(() => { if (isInView) onAccent(course.accentColor); }, [isInView, course.accentColor, onAccent]);

    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 backdrop-blur flex items-center justify-center border border-gold/30"><Play className="w-4 h-4 text-gold fill-current ml-0.5" /></div>
                    <span className="font-mono text-[9px] text-white/90 tracking-wider">{course.duration}</span>
                </div>
            </div>
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <span className={`font-mono text-[7px] tracking-wider px-2 py-0.5 rounded border ${course.difficulty === "ARCHITECT" ? "text-gold border-gold/30 bg-gold/10" : "text-white/90 border-white/20 bg-white/5"}`}>{course.difficulty}</span>
                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{course.lessons} LESSONS</span>
                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{course.students.toLocaleString()} ENROLLED</span>
                </div>
                <h3 className="font-serif text-3xl text-white tracking-tight">{course.title}</h3>
                <p className="font-mono text-[10px] text-gold/80 tracking-[0.2em]">{course.subtitle}</p>
                <p className="font-mono text-sm text-white/80 leading-relaxed">{course.description}</p>
                <div className="space-y-2">
                    <span className="font-mono text-[8px] text-gold tracking-[0.3em]">CHAPTERS</span>
                    {course.chapters.map((ch, i) => (
                        <div key={ch} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                            <span className="font-mono text-[9px] text-gold/80 w-6">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-mono text-xs text-white/90 tracking-wide">{ch}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">{course.tags.map((tag) => (<span key={tag} className="tag-pill text-[7px]">{tag}</span>))}</div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[8px] text-gold">{course.instructor.slice(0, 2)}</div>
                    <div><p className="font-mono text-xs text-white tracking-wider">{course.instructor}</p><p className="font-mono text-[8px] text-white/80 tracking-wider">{course.instructorRole}</p></div>
                </div>
            </div>
        </motion.div>
    );
}
