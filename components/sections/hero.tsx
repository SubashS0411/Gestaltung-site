"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

const EASE_CIN = [0.76, 0, 0.24, 1] as const;

/* ═══ 3D Tunnel — geometric gold nodes the camera flies through ═══ */
function TunnelGeometry() {
    const groupRef = useRef<THREE.Group>(null);
    const ringCount = 20;

    const rings = useMemo(() =>
        Array.from({ length: ringCount }, (_, i) => ({
            z: -i * 6,
            radius: 3 + Math.sin(i * 0.5) * 1.5,
            rotation: i * 0.3,
            segments: 6,
        })),
        []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {rings.map((ring, i) => (
                <group key={i} position={[0, 0, ring.z]} rotation={[0, 0, ring.rotation]}>
                    <mesh>
                        <ringGeometry args={[ring.radius - 0.02, ring.radius, ring.segments]} />
                        <meshBasicMaterial color="#D4AF37" transparent opacity={0.08 + (i % 3) * 0.04} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh>
                        <ringGeometry args={[ring.radius - 0.01, ring.radius, ring.segments]} />
                        <meshBasicMaterial color="#D4AF37" transparent opacity={0.15} wireframe />
                    </mesh>
                    {Array.from({ length: ring.segments }).map((_, j) => {
                        const angle = (j / ring.segments) * Math.PI * 2;
                        return (
                            <mesh key={j} position={[Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0]}>
                                <sphereGeometry args={[0.04, 6, 6]} />
                                <meshBasicMaterial color="#F3E5AB" transparent opacity={0.4} />
                            </mesh>
                        );
                    })}
                </group>
            ))}
        </group>
    );
}

/* ═══ Camera controller — moves forward on scroll ═══ */
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
    const { camera } = useThree();
    useFrame(() => {
        // Extreme forward motion to crash through
        camera.position.z = 8 - scrollProgress * 150;
        camera.position.y = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
    });
    return null;
}

/* ═══ Text Shatter Particle Explosion ═══ */
function ShatterBurst({ scrollProgress }: { scrollProgress: number }) {
    const count = 150; // Reduced from 400 for performance
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const burstParticles = useMemo(() =>
        Array.from({ length: count }, () => {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 2;
            return {
                basePos: [Math.cos(angle) * radius, Math.sin(angle) * radius, -20] as [number, number, number],
                dir: [
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 20
                ] as [number, number, number],
                size: 0.02 + Math.random() * 0.05,
            };
        }),
        [count]);

    useFrame(() => {
        if (!meshRef.current) return;

        // Massive explosion happens after 55% scroll when crashing through text
        const explodeFactor = Math.max(0, scrollProgress - 0.55) * 5;

        burstParticles.forEach((p, i) => {
            dummy.position.set(
                p.basePos[0] + p.dir[0] * explodeFactor,
                p.basePos[1] + p.dir[1] * explodeFactor,
                p.basePos[2] + p.dir[2] * explodeFactor
            );
            const currentSize = Math.max(0, p.size * (1 - explodeFactor * 0.4));
            dummy.scale.setScalar(currentSize);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.8} />
        </instancedMesh>
    );
}

/* ═══ Gold particles in void ═══ */
function VoidParticles({ count = 100 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() =>
        Array.from({ length: count }, () => ({
            pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, -Math.random() * 150] as [number, number, number],
            size: 0.01 + Math.random() * 0.04,
            speed: 0.002 + Math.random() * 0.01,
            offset: Math.random() * Math.PI * 2,
        })),
        [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        particles.forEach((p, i) => {
            dummy.position.set(
                p.pos[0] + Math.sin(clock.elapsedTime * p.speed + p.offset),
                p.pos[1] + Math.cos(clock.elapsedTime * p.speed + p.offset),
                p.pos[2]
            );
            dummy.scale.setScalar(p.size);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
        </instancedMesh>
    );
}

function HeroScene({ scrollProgress }: { scrollProgress: number }) {
    // Chromatic aberration intensity increases with scroll speed
    const aberrationOffset = new THREE.Vector2(scrollProgress * 0.005, scrollProgress * 0.002);

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[0, 0, 5]} intensity={0.5} color="#D4AF37" distance={20} />
            <CameraRig scrollProgress={scrollProgress} />
            <TunnelGeometry />
            <VoidParticles count={50} />
            <ShatterBurst scrollProgress={scrollProgress} />
            <Stars radius={60} depth={100} count={300} factor={3} saturation={0} fade speed={0.5} />
            <EffectComposer>
                <ChromaticAberration offset={aberrationOffset} radialModulation={false} modulationOffset={0.5} />
                <Bloom luminanceThreshold={0.8} intensity={0.4} levels={4} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={0.9} />
            </EffectComposer>
        </>
    );
}

/* ═══ Magnetic CTA Button ═══ */
function MagneticButton({ children, href, variant = "primary" }: { children: React.ReactNode; href: string; variant?: "primary" | "ghost" }) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`inline-flex items-center gap-2 px-8 py-4 font-mono text-[10px] tracking-[0.3em] transition-all duration-300 transform-gpu ${variant === "primary"
                    ? "bg-gold text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] pointer-events-auto"
                    : "border border-white/20 text-white/90 hover:border-gold/40 hover:text-gold pointer-events-auto"
                    }`}
            >
                {children}
            </motion.div>
        </Link>
    );
}

/* ═══ Main Hero ═══ */
export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const scrollVal = useRef(0);

    // Track scroll for the 3D scene
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        scrollVal.current = v;
    });

    // The Physical Typography Wall -> Camera crashes through it
    // Text scales from 1x to 30x to simulate crushing past the Z-plane
    const textScale = useTransform(scrollYProgress, [0.3, 0.6], [1, 30]);
    const textOpacity = useTransform(scrollYProgress, [0.45, 0.55], [1, 0]);
    const textBlur = useTransform(scrollYProgress, [0.4, 0.55], ["blur(0px)", "blur(30px)"]);

    return (
        <section ref={containerRef} className="relative h-[250vh]">
            {/* Sticky 3D Canvas */}
            <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                        <Suspense fallback={null}>
                            <HeroSceneWrapper scrollRef={scrollVal} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Foreground text — physical wall that scales up & shatters */}
                <motion.div
                    style={{ opacity: textOpacity, scale: textScale, filter: textBlur }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center transform-gpu will-change-transform pointer-events-none"
                >
                    <motion.div
                        initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }}
                        animate={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
                        transition={{ duration: 0.8, delay: 3.8, ease: EASE_CIN }}
                        className="mb-6 pointer-events-auto"
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40" className="text-gold opacity-60">
                            <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <polygon points="20,8 31,14 31,26 20,32 9,26 9,14" fill="none" stroke="currentColor" strokeWidth="0.3" />
                        </svg>
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ clipPath: "inset(0 50% 0 50%)" }}
                            animate={{ clipPath: "inset(0 0% 0 0%)" }}
                            transition={{ duration: 0.7, delay: 4, ease: EASE_CIN }}
                            className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-gradient-gold tracking-[0.08em] leading-[0.85] drop-shadow-[0_0_40px_rgba(212,175,55,0.15)] pointer-events-auto"
                        >
                            GESTALTUNG
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }}
                        animate={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
                        transition={{ duration: 0.5, delay: 4.3, ease: EASE_CIN }}
                        className="font-mono text-xs text-white/80 tracking-[0.4em] mt-6 mb-8 pointer-events-auto"
                    >
                        THE BLACK EDITION PROTOCOL
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 4.6, ease: EASE_CIN }}
                        className="flex items-center gap-4"
                    >
                        <MagneticButton href="/dashboard" variant="primary">INITIALIZE ENTRY</MagneticButton>
                        <MagneticButton href="/registry" variant="ghost">BROWSE VAULT →</MagneticButton>
                    </motion.div>
                </motion.div>

                {/* Scroll reminder that fades out early */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
                >
                    <span className="font-mono text-[7px] text-white/70 tracking-[0.4em]">SCROLL TO SHATTER</span>
                    <div className="h-8 w-[1px] relative overflow-hidden">
                        <motion.div className="absolute top-0 w-full bg-gold/70" animate={{ height: ["0%", "100%"], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* Bridge component to pass scrollRef into R3F context */
function HeroSceneWrapper({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
    useFrame(() => { }); // Keep scene alive
    return <HeroScene scrollProgress={scrollRef.current} />;
}
