"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { REGISTRY_ASSETS, RECENTLY_DECRYPTED } from "@/lib/data";
import { Copy, Check, X, Cpu, Zap, Download, Search } from "lucide-react";
import * as THREE from "three";

const SPRING_TIGHT = { type: "spring" as const, stiffness: 400, damping: 30 };

/* ═══ 3D Floating Particles ═══ */
function RegistryScene() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() =>
        Array.from({ length: 60 }, () => ({
            pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5] as [number, number, number],
            speed: 0.005 + Math.random() * 0.01,
            offset: Math.random() * Math.PI * 2,
        })),
        []);

    useFrame(({ clock, pointer }) => {
        if (!meshRef.current) return;
        const t = clock.elapsedTime;
        particles.forEach((p, i) => {
            dummy.position.set(
                p.pos[0] + Math.sin(t * p.speed + p.offset) * 0.5 + pointer.x * 2,
                p.pos[1] + Math.cos(t * p.speed * 0.8 + p.offset) * 0.5 + pointer.y * 2,
                p.pos[2]
            );
            dummy.scale.setScalar(0.015);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 5]} intensity={0.5} color="#D4AF37" />
            <instancedMesh ref={meshRef} args={[undefined, undefined, 60]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
            </instancedMesh>
            <Stars radius={40} depth={20} count={100} factor={2} saturation={0} fade speed={0.2} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.9} intensity={0.4} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══ Cursor Following Preview ═══ */
function CursorPreview({ image, mouseX, mouseY }: { image: string; mouseX: number; mouseY: number }) {
    return (
        <motion.div
            className="fixed pointer-events-none z-[90] w-48 h-32 rounded-lg overflow-hidden border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] transform-gpu"
            style={{ left: mouseX + 16, top: mouseY - 16 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
        >
            <div className="w-full h-full bg-gradient-to-br from-[#0a0a08] to-[#1a1510]" />
        </motion.div>
    );
}

/* ═══ Wheel Card Component ═══ */
function WheelCard({ item, index, total, containerRef, onSelect }: {
    item: typeof REGISTRY_ASSETS[0];
    index: number;
    total: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onSelect: (id: string) => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const { scrollYProgress } = useScroll({
        container: containerRef,
        target: cardRef,
        axis: "x",
        offset: ["end start", "start end"]
    });

    const distance = useTransform(scrollYProgress, [0, 1], [1, -1]);
    const rotateY = useTransform(distance, [-1, 0, 1], [-45, 0, 45]);
    const scale = useTransform(distance, [-1, 0, 1], [0.7, 1, 0.7]);
    const opacity = useTransform(distance, [-1, -0.2, 0, 0.2, 1], [0.1, 0.4, 1, 0.4, 0.1]);
    const zIndex = useTransform(distance, [-1, 0, 1], [0, 50, 0]);

    const initialEntry = { opacity: 0, z: -1000, scale: 0.5 };
    const animateEntry = { opacity: 1, z: 0, scale: 1, transition: { ...SPRING_TIGHT, delay: index * 0.05 + 0.5 } };

    return (
        <motion.div
            ref={cardRef}
            initial={initialEntry}
            animate={animateEntry}
            style={{ rotateY, scale, opacity, zIndex, transformStyle: "preserve-3d" }}
            className="shrink-0 w-[400px] h-[500px] mx-4 snap-center cursor-pointer relative group flex items-center justify-center transform-gpu will-change-transform"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onSelect(item.id)}
        >
            <motion.div
                animate={isHovered ? { z: 50 } : { z: 0 }}
                transition={SPRING_TIGHT}
                className={`w-full h-full rounded-2xl border transition-colors duration-500 overflow-hidden relative ${isHovered ? "border-gold/60 bg-black/60 backdrop-blur-3xl shadow-[0_0_50px_rgba(212,175,55,0.2)]" : "border-white/10 bg-black/40 backdrop-blur-md"
                    }`}
            >
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.2)_0%,transparent_50%)] pointer-events-none"
                />

                <div className="h-1/2 relative overflow-hidden group/image border-b border-white/[0.04]">
                    <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 filter contrast-125 saturate-50"
                    />

                    <div className="absolute top-4 left-4 z-20">
                        <div className="w-8 h-8 rounded border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center">
                            <Cpu className={`w-4 h-4 transition-colors duration-500 ${isHovered ? "text-gold" : "text-white/40"}`} />
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className={`font-serif text-2xl mb-3 transition-colors ${isHovered ? "text-gold" : "text-white"}`}>{item.name}</h3>
                    <p className="font-mono text-xs text-white/60 mb-6 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex gap-4 font-mono text-[9px] text-white/50 tracking-wider">
                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" />{item.performanceCost}</span>
                        <span className="flex items-center gap-1.5"><Download className="w-3 h-3" />{(item.downloads / 1000).toFixed(1)}k</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ═══ Main Page ═══ */
export default function RegistryPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const selectedItem = REGISTRY_ASSETS.find((r) => r.id === selected);

    const copyCode = async (code: string) => {
        try { await navigator.clipboard.writeText(code); } catch { }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden">
            {/* 3D Canvas Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                    <Suspense fallback={null}><RegistryScene /></Suspense>
                </Canvas>
            </div>

            {/* ═══ Section 1: HUD Search Terminal ═══ */}
            <div className="sticky top-16 z-30 backdrop-blur-2xl bg-[#050505]/80 border-b border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                        <span className="font-mono text-[9px] text-gold tracking-[0.3em]">REGISTRY v4.0</span>
                    </div>
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-gold/60">{">"}</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Query Assets..."
                            className="w-full bg-black/40 border border-white/[0.06] rounded px-8 py-2.5 font-mono text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-gold/30 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-pulse font-mono text-gold/60 text-xs">▮</span>
                    </div>
                </div>
            </div>

            {/* ═══ Section 2: Header + Vault Wheel ═══ */}
            <div className="relative z-10 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="text-center mb-8 pointer-events-none"
                >
                    <p className="font-mono text-[9px] text-gold tracking-[0.5em] mb-3">WEAPON WHEEL UI</p>
                    <h1 className="font-serif text-3xl md:text-5xl text-white tracking-widest drop-shadow-2xl">THE REGISTRY</h1>
                </motion.div>

                {/* Inventory Wheel Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="relative w-full h-[60vh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex items-center"
                    style={{ scrollbarWidth: "none", perspective: "1200px" }}
                >
                    <div className="w-[50vw] shrink-0" />
                    {REGISTRY_ASSETS.map((item, i) => (
                        <WheelCard
                            key={item.id}
                            item={item}
                            index={i}
                            total={REGISTRY_ASSETS.length}
                            containerRef={scrollContainerRef}
                            onSelect={setSelected}
                        />
                    ))}
                    <div className="w-[50vw] shrink-0" />
                </div>
            </div>

            {/* ═══ Section 3: Recently Decrypted ═══ */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24" onMouseMove={handleMouseMove}>
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                    <span className="font-mono text-[9px] text-gold tracking-[0.4em]">RECENTLY DECRYPTED</span>
                </div>

                <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-black/30 backdrop-blur-md">
                    {RECENTLY_DECRYPTED.map((item) => (
                        <motion.div
                            key={item.id}
                            onHoverStart={() => setHoveredRow(item.id)}
                            onHoverEnd={() => setHoveredRow(null)}
                            className={`flex items-center justify-between px-6 py-4 border-b border-white/[0.03] cursor-pointer transition-colors duration-200 ${hoveredRow === item.id ? "bg-gold/[0.04]" : "bg-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <span className="font-mono text-[8px] text-white/30 tracking-wider w-12">{item.id}</span>
                                <span className={`font-mono text-xs tracking-wider transition-colors ${hoveredRow === item.id ? "text-gold" : "text-white/80"}`}>
                                    {item.name}
                                </span>
                                <span className="font-mono text-[8px] text-gold/50 tracking-[0.2em] bg-gold/[0.05] border border-gold/10 px-2 py-0.5 rounded">
                                    {item.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 font-mono text-[9px] text-white/40 tracking-wider">
                                <span>{item.author}</span>
                                <span>{item.date}</span>
                                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{(item.downloads / 1000).toFixed(1)}k</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cursor-following preview */}
                <AnimatePresence>
                    {hoveredRow && (
                        <CursorPreview
                            image={RECENTLY_DECRYPTED.find(r => r.id === hoveredRow)?.preview || ""}
                            mouseX={mousePos.x}
                            mouseY={mousePos.y}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ Section 4: Blast Door Detail Modal ═══ */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl bg-black/40"
                        onClick={() => setSelected(null)}
                    >
                        {/* Left blast door */}
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: "-100%" }}
                            exit={{ x: 0 }}
                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-y-0 left-0 w-1/2 bg-[#020202] border-r-2 border-gold/40 z-[101] shadow-[10px_0_40px_rgba(0,0,0,0.8)]"
                        />
                        {/* Right blast door */}
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: "100%" }}
                            exit={{ x: 0 }}
                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-y-0 right-0 w-1/2 bg-[#020202] border-l-2 border-gold/40 z-[101] shadow-[-10px_0_40px_rgba(0,0,0,0.8)]"
                        />

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: 0.3, ...SPRING_TIGHT }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-2xl border border-gold/30 rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.15)] z-[102] transform-gpu"
                        >
                            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-10 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="font-mono text-[9px] text-gold bg-gold/10 border border-gold/20 tracking-wider px-3 py-1 rounded">{selectedItem.tier}</span>
                                    <span className="font-mono text-[9px] text-white/50 tracking-wider">{selectedItem.category}</span>
                                </div>
                                <h2 className="font-serif text-4xl text-white tracking-tight mb-4">{selectedItem.name}</h2>
                                <p className="font-mono text-sm text-white/70 leading-relaxed max-w-2xl">{selectedItem.description}</p>
                            </div>

                            <div className="p-10 bg-black/50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-[10px] text-gold tracking-[0.3em]">SOURCE PROTOCOL</span>
                                    <button onClick={() => copyCode(selectedItem.code)} className="flex items-center gap-2 px-5 py-2.5 rounded border border-gold/30 hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all font-mono text-[10px] tracking-wider text-gold group">
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:text-black" />}
                                        {copied ? "COPIED" : "COPY PROTOCOL"}
                                    </button>
                                </div>
                                <pre className="bg-[#050505] border border-white/[0.06] rounded-xl p-6 overflow-x-auto"><code className="font-mono text-xs text-white/90 leading-loose">{selectedItem.code}</code></pre>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
