"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Stars } from "@react-three/drei";
import { EffectComposer, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MANIFESTO_LINES, ABOUT_TIMELINE, ABOUT_PRINCIPLES } from "@/lib/data";
import { Hexagon, Target, Eye, Shield } from "lucide-react";
import * as THREE from "three";

const iconMap: Record<string, React.ReactNode> = {
    hexagon: <Hexagon className="w-6 h-6 stroke-[0.5]" />,
    target: <Target className="w-6 h-6 stroke-[0.5]" />,
    eye: <Eye className="w-6 h-6 stroke-[0.5]" />,
    shield: <Shield className="w-6 h-6 stroke-[0.5]" />,
};

/* ═══ 3D Rotating Gold Hexagon ═══ */
function GoldHexagon() {
    const meshRef = useRef<THREE.Mesh>(null);
    const edgesRef = useRef<THREE.LineSegments>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
            meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
        }
        if (edgesRef.current) {
            edgesRef.current.rotation.y = clock.getElapsedTime() * 0.15;
            edgesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
        }
    });

    const hexShape = useMemo(() => {
        const shape = new THREE.Shape();
        const sides = 6;
        const radius = 2;
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        return shape;
    }, []);

    const geometry = useMemo(() => {
        return new THREE.ExtrudeGeometry(hexShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    }, [hexShape]);

    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    return (
        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
            <group position={[0, 0, -2]}>
                <mesh ref={meshRef} geometry={geometry}>
                    <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} transparent opacity={0.08} />
                </mesh>
                <lineSegments ref={edgesRef} geometry={edgesGeometry}>
                    <lineBasicMaterial color="#D4AF37" transparent opacity={0.25} />
                </lineSegments>
            </group>
        </Float>
    );
}

/* ═══ Gold Particle Field ═══ */
function GoldParticles({ count = 200 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10 - 5,
            ] as [number, number, number],
            speed: 0.005 + Math.random() * 0.02,
            offset: Math.random() * Math.PI * 2,
        }));
    }, [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        particles.forEach((p, i) => {
            dummy.position.set(
                p.position[0] + Math.sin(clock.getElapsedTime() * p.speed + p.offset) * 0.5,
                p.position[1] + Math.cos(clock.getElapsedTime() * p.speed * 0.7 + p.offset) * 0.3,
                p.position[2]
            );
            dummy.scale.setScalar(0.01 + Math.sin(clock.getElapsedTime() * 0.5 + p.offset) * 0.005);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
        </instancedMesh>
    );
}

/* ═══ 3D Scene ═══ */
function AboutScene() {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#D4AF37" />
            <pointLight position={[-5, -5, 3]} intensity={0.3} color="#F3E5AB" />
            <GoldHexagon />
            <GoldParticles count={150} />
            <Stars radius={50} depth={30} count={800} factor={2} saturation={0} fade speed={0.3} />
            <EffectComposer>
                <DepthOfField focusDistance={0.02} focalLength={0.06} bokehScale={3} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══ Main Page ═══ */
export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#050505]">
            {/* Fixed 3D Canvas Background */}
            <div className="fixed inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 1.5]}
                >
                    <Suspense fallback={null}>
                        <AboutScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Film grain overlay */}
            <div className="fixed inset-0 z-[2] pointer-events-none mix-blend-overlay opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content overlay */}
            <div className="relative z-[3]">
                {/* Hero */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                    >
                        <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-8">05 — THE MANIFESTO</p>
                        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] text-gradient-gold tracking-[0.08em] leading-[0.85]">
                            GESTALTUNG
                        </h1>
                        <p className="font-mono text-xs text-white/80 tracking-[0.3em] mt-6">CODE AS LUXURY MATERIAL</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="absolute bottom-12 flex flex-col items-center gap-2"
                    >
                        <span className="font-mono text-[8px] text-white/70 tracking-[0.4em]">SCROLL TO READ</span>
                        <div className="h-8 w-[1px] relative overflow-hidden">
                            <motion.div className="absolute top-0 w-full bg-gold/70" animate={{ height: ["0%", "100%"], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </div>
                    </motion.div>
                </section>

                {/* Manifesto Sections */}
                <section className="max-w-4xl mx-auto px-6 py-20 space-y-0">
                    {MANIFESTO_LINES.map((line, i) => (
                        <ManifestoLine key={i} line={line} />
                    ))}
                </section>

                {/* Divider */}
                <div className="max-w-4xl mx-auto px-6 flex items-center gap-4 my-20">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gold/20" />
                    <span className="w-2 h-2 rotate-45 border border-gold/30" />
                    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gold/20" />
                </div>

                {/* Principles */}
                <section className="max-w-4xl mx-auto px-6 mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <span className="font-mono text-[9px] text-gold tracking-[0.5em]">CORE PROTOCOLS</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ABOUT_PRINCIPLES.map((p, i) => (
                            <PrincipleCard key={p.title} principle={p} index={i} />
                        ))}
                    </div>
                </section>

                {/* Timeline */}
                <section className="max-w-4xl mx-auto px-6 mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <span className="font-mono text-[9px] text-gold tracking-[0.5em]">PROTOCOL TIMELINE</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/20 to-transparent" />
                    </div>
                    {ABOUT_TIMELINE.map((item, i) => (
                        <TimelineEntry key={item.year} item={item} index={i} />
                    ))}
                </section>

                {/* Closing */}
                <section className="max-w-4xl mx-auto px-6 text-center py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="font-mono text-[10px] text-gold/80 tracking-[0.5em] mb-6">ΓΕΣΤΑΛΤΥΝΓε</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-4">This is not a platform.</h2>
                        <h2 className="font-serif text-4xl md:text-6xl text-gradient-gold tracking-tight">It is a protocol.</h2>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}

/* ═══ Sub-Components ═══ */
function ManifestoLine({ line }: { line: { type: string; text: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    if (line.type === "heading") {
        return (
            <div ref={ref} className="overflow-hidden py-8 md:py-14">
                <motion.h2
                    initial={{ y: "110%" }}
                    animate={inView ? { y: "0%" } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]"
                >
                    {line.text}
                </motion.h2>
            </div>
        );
    }

    return (
        <div ref={ref} className="py-4">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-mono text-sm md:text-base text-white/90 leading-[1.9] tracking-wide max-w-3xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
            >
                {line.text}
            </motion.p>
        </div>
    );
}

function PrincipleCard({ principle, index }: { principle: typeof ABOUT_PRINCIPLES[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="p-8 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-gold/25 transition-all duration-700 group"
        >
            <div className="text-gold/80 mb-6 group-hover:text-gold transition-colors">{iconMap[principle.icon]}</div>
            <h3 className="font-mono text-sm text-gold tracking-[0.3em] mb-3">{principle.title}</h3>
            <p className="font-mono text-xs text-white/80 leading-relaxed tracking-wide">{principle.desc}</p>
        </motion.div>
    );
}

function TimelineEntry({ item, index }: { item: typeof ABOUT_TIMELINE[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="flex gap-6 py-8 border-b border-white/[0.04] group"
        >
            <div className="shrink-0 w-20">
                <span className="font-serif text-3xl text-gold tracking-tight">{item.year}</span>
            </div>
            <div className="relative pl-6 border-l border-white/[0.08]">
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-gold/80 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                <span className="font-mono text-[8px] text-gold tracking-[0.3em] mb-2 block">{item.phase}</span>
                <p className="font-mono text-sm text-white/90 leading-relaxed tracking-wide">{item.event}</p>
            </div>
        </motion.div>
    );
}
