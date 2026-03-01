"use client";

import { useRef, useMemo, Suspense, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, useScroll, useSpring, useTransform, useInView, useMotionValue } from "framer-motion";
import { ABOUT_PRINCIPLES, ABOUT_TIMELINE, MANIFESTO_LINES } from "@/lib/data";
import * as THREE from "three";

/* ═══ Volumetric Mouse Flashlight ═══ */
function Flashlight() {
    const lightRef = useRef<THREE.SpotLight>(null);
    const targetRef = useRef<THREE.Object3D>(null);
    const { viewport } = useThree();

    useFrame(({ pointer }) => {
        if (!lightRef.current || !targetRef.current) return;
        const x = (pointer.x * viewport.width) / 2;
        const y = (pointer.y * viewport.height) / 2;
        targetRef.current.position.set(x, y, 0);
        lightRef.current.position.set(x, y, 8);
    });

    return (
        <>
            <spotLight ref={lightRef} color="#D4AF37" intensity={15} distance={20} angle={0.4} penumbra={1} decay={2} castShadow />
            <object3D ref={targetRef} />
            {lightRef.current && targetRef.current && (
                <primitive object={lightRef.current.target} position={targetRef.current.position} />
            )}
        </>
    );
}

/* ═══ Wireframe Terrain (Data Topography) ═══ */
function WireframeTerrain({ scrollYProgress }: { scrollYProgress: any }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 30 });

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
        const positions = geometry.attributes.position;
        const time = clock.elapsedTime;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = Math.sin(x * 0.5 + time * 0.3) * Math.cos(y * 0.5 + time * 0.2) * 0.5 + Math.sin(x * 1.5 + time * 0.1) * 0.2;
            positions.setZ(i, z);
        }
        positions.needsUpdate = true;

        // Slow morph based on scroll
        meshRef.current.rotation.x = -0.6 + smoothScroll.get() * 0.2;
    });

    return (
        <mesh ref={meshRef} position={[0, -8, -4]} rotation={[-0.6, 0, 0]}>
            <planeGeometry args={[30, 30, 40, 40]} />
            <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.06} />
        </mesh>
    );
}

/* ═══ Lore Monument Wall ═══ */
function LoreMonumentWall({ scrollYProgress }: { scrollYProgress: any }) {
    const groupRef = useRef<THREE.Group>(null);
    const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 40 });
    const yPosition = useTransform(smoothY, [0, 1], [0, 45]);

    useFrame(() => {
        if (groupRef.current) groupRef.current.position.y = yPosition.get();
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, -20, -1]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#020202" roughness={0.9} metalness={0.1} />
            </mesh>

            <Text position={[0, 2, 0]} fontSize={1.2} color="#D4AF37" material-toneMapped={false}>
                <meshStandardMaterial metalness={1} roughness={0.2} color="#D4AF37" />
                MANIFESTO
            </Text>

            <Text position={[0, 0, 0]} fontSize={0.3} maxWidth={6} textAlign="center" lineHeight={1.5} color="#D4AF37">
                <meshStandardMaterial metalness={0.8} roughness={0.4} color="#D4AF37" />
                {"THE BLACK EDITION PROTOCOL IS A FRAMEWORK FOR THE ELITE.\nAN ARCHITECTURE OF SHADOWS, GOLD, AND UNAPOLOGETIC PERFORMANCE."}
            </Text>

            {ABOUT_PRINCIPLES.map((principle, i) => (
                <group key={principle.id} position={[0, -5 - i * 4, 0]}>
                    <Text position={[0, 0.8, 0]} fontSize={0.2} color="#F3E5AB" letterSpacing={0.2}>
                        <meshStandardMaterial metalness={0.9} roughness={0.3} color="#F3E5AB" />
                        {`0${i + 1} — ${principle.title}`}
                    </Text>
                    <Text position={[0, 0, 0]} fontSize={0.25} maxWidth={5} textAlign="center" lineHeight={1.6} color="#ffffff">
                        <meshStandardMaterial metalness={0.5} roughness={0.6} color="#ffffff" />
                        {principle.description}
                    </Text>
                </group>
            ))}

            <Text position={[0, -23, 0]} fontSize={0.8} color="#D4AF37">
                <meshStandardMaterial metalness={1} roughness={0.2} color="#D4AF37" />
                EPOCHS
            </Text>

            {ABOUT_TIMELINE.map((item, i) => (
                <group key={item.epoch} position={[0, -26 - i * 4, 0]}>
                    <Text position={[-3, 0, 0]} fontSize={0.4} color="#D4AF37" anchorX="right">
                        <meshStandardMaterial metalness={0.9} roughness={0.2} color="#D4AF37" />
                        {item.epoch}
                    </Text>
                    <Text position={[-2.5, 0.2, 0]} fontSize={0.25} color="#ffffff" anchorX="left">
                        <meshStandardMaterial metalness={0.7} roughness={0.4} color="#ffffff" />
                        {item.phase}
                    </Text>
                    <Text position={[-2.5, -0.3, 0]} fontSize={0.18} maxWidth={5} lineHeight={1.5} color="#aaaaaa" anchorX="left">
                        <meshStandardMaterial metalness={0.5} roughness={0.6} color="#aaaaaa" />
                        {item.event}
                    </Text>
                </group>
            ))}

            <Text position={[0, -42, 0]} fontSize={0.6} color="#D4AF37" letterSpacing={0.1}>
                <meshStandardMaterial metalness={1} roughness={0.2} color="#D4AF37" />
                WELCOME TO THE VOID.
            </Text>
        </group>
    );
}

function LoreScene({ scrollYProgress }: { scrollYProgress: any }) {
    return (
        <>
            <Flashlight />
            <LoreMonumentWall scrollYProgress={scrollYProgress} />
            <WireframeTerrain scrollYProgress={scrollYProgress} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.4} intensity={1} levels={4} mipmapBlur />
                <Noise opacity={0.06} />
                <Vignette eskil={false} offset={0.1} darkness={0.95} />
            </EffectComposer>
        </>
    );
}

/* ═══ Word-by-Word Scroll Reveal ═══ */
function ManifestoReveal() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    return (
        <section ref={sectionRef} className="relative min-h-[200vh] bg-[#050505] py-40">
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-8">
                    {MANIFESTO_LINES.map((line, lineIndex) => (
                        <ManifestoLine
                            key={lineIndex}
                            line={line}
                            lineIndex={lineIndex}
                            totalLines={MANIFESTO_LINES.length}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ManifestoLine({
    line,
    lineIndex,
    totalLines,
    scrollYProgress,
}: {
    line: { type: "heading" | "body"; text: string };
    lineIndex: number;
    totalLines: number;
    scrollYProgress: any;
}) {
    const startProgress = lineIndex / totalLines;
    const endProgress = (lineIndex + 0.8) / totalLines;

    const opacity = useTransform(scrollYProgress, [startProgress, startProgress + 0.05, endProgress, endProgress + 0.05], [0, 1, 1, 0.3]);
    const y = useTransform(scrollYProgress, [startProgress, startProgress + 0.05], [30, 0]);

    return (
        <motion.div
            style={{ opacity, y }}
            className={`mb-6 transform-gpu ${line.type === "heading"
                ? "font-serif text-2xl md:text-4xl text-gold tracking-tight leading-tight"
                : "font-mono text-xs md:text-sm text-white/60 leading-relaxed tracking-wider max-w-3xl"
                }`}
        >
            {line.text}
        </motion.div>
    );
}

/* ═══ Magnetic CTA Button ═══ */
function MagneticCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { damping: 15, stiffness: 200 });
    const sy = useSpring(y, { damping: 15, stiffness: 200 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative py-40 bg-[#050505] flex items-center justify-center">
            {/* Noise grain intensification overlay */}
            <motion.div
                animate={{ opacity: isHovered ? 0.15 : 0.04 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9998] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <motion.div
                ref={ref}
                style={{ x: sx, y: sy }}
                onMouseMove={(e) => {
                    const rect = ref.current?.getBoundingClientRect();
                    if (!rect) return;
                    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
                    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
                }}
                onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileTap={{ scale: 0.97 }}
                className="transform-gpu"
            >
                <div className={`px-16 py-8 border-2 rounded-lg cursor-pointer transition-all duration-500 ${isHovered
                    ? "border-gold bg-gold/10 shadow-[0_0_60px_rgba(212,175,55,0.3)]"
                    : "border-white/10 bg-transparent shadow-none"
                    }`}>
                    <span className="font-mono text-sm md:text-base tracking-[0.4em] text-gold">
                        INITIALIZE PROTOCOL
                    </span>
                </div>
            </motion.div>
        </section>
    );
}

/* ═══ Main Page ═══ */
export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    return (
        <div className="bg-[#000000]">
            {/* ═══ Section 1: The Monolith (3D Flashlight) ═══ */}
            <section ref={containerRef} className="relative h-[600vh] selection:bg-gold selection:text-black cursor-crosshair">
                <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
                    {/* Atmospheric image overlay */}
                    <div className="absolute inset-0 z-0 opacity-20 filter contrast-150 saturate-50 mix-blend-screen pointer-events-none">
                        <Image src="https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2574&auto=format&fit=crop" alt="Atmosphere" fill className="object-cover" priority />
                    </div>
                    <Canvas className="relative z-10" camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: false }} dpr={[1, 1.5]}>
                        <Suspense fallback={null}>
                            <LoreScene scrollYProgress={scrollYProgress} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Hint overlay */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative">
                            <div className="w-1 h-1 bg-gold rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            <svg className="w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="0.5" strokeDasharray="4 8" />
                            </svg>
                        </div>
                        <p className="font-mono text-[9px] text-white/50 tracking-[0.4em] text-center leading-relaxed">
                            PITCH BLACK VOID DETECTED.<br />
                            DRAG CURSOR TO ILLUMINATE.<br />
                            SCROLL TO SCAN LORE MONUMENT.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ Section 2: Core Tenets (Word-by-Word Reveal) ═══ */}
            <ManifestoReveal />

            {/* ═══ Section 4: End-Point CTA ═══ */}
            <MagneticCTA />
        </div>
    );
}
