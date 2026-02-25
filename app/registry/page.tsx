"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { REGISTRY_ASSETS } from "@/lib/data";
import { Copy, Check, X, Cpu, Zap, Download } from "lucide-react";
import * as THREE from "three";

/* ═══ 3D Floating Grid Lines ═══ */
function FloatingGrid() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock, pointer }) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = pointer.x * 0.15 + clock.getElapsedTime() * 0.02;
        groupRef.current.rotation.x = pointer.y * 0.1;
    });

    const lines = useMemo(() => {
        const arr: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 10 - 5;
            arr.push({
                start: new THREE.Vector3(x, y, z),
                end: new THREE.Vector3(x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3, z),
            });
        }
        return arr;
    }, []);

    return (
        <group ref={groupRef}>
            {lines.map((l, i) => {
                const geom = new THREE.BufferGeometry().setFromPoints([l.start, l.end]);
                return (
                    <line key={i} geometry={geom}>
                        <lineBasicMaterial color="#D4AF37" transparent opacity={0.12} />
                    </line>
                );
            })}
            <Stars radius={40} depth={20} count={600} factor={2} saturation={0} fade speed={0.2} />
        </group>
    );
}

/* ═══ 3D Floating Particles ═══ */
function GoldDust({ count = 80 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() =>
        Array.from({ length: count }, () => ({
            pos: [(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12 - 4] as [number, number, number],
            speed: 0.003 + Math.random() * 0.015,
            offset: Math.random() * Math.PI * 2,
        })),
        [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        particles.forEach((p, i) => {
            dummy.position.set(
                p.pos[0] + Math.sin(clock.getElapsedTime() * p.speed + p.offset) * 0.8,
                p.pos[1] + Math.cos(clock.getElapsedTime() * p.speed * 0.6 + p.offset) * 0.5,
                p.pos[2]
            );
            dummy.scale.setScalar(0.012 + Math.sin(clock.getElapsedTime() * 0.4 + p.offset) * 0.006);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
        </instancedMesh>
    );
}

function RegistryScene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[8, 8, 5]} intensity={0.4} color="#D4AF37" />
            <FloatingGrid />
            <GoldDust />
            <EffectComposer>
                <Bloom luminanceThreshold={0.9} intensity={0.3} />
                <Noise opacity={0.025} />
                <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
        </>
    );
}

/* ═══ Main Page ═══ */
export default function RegistryPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const selectedItem = REGISTRY_ASSETS.find((r) => r.id === selected);

    const filtered = filter ? REGISTRY_ASSETS.filter((r) => r.category === filter) : REGISTRY_ASSETS;
    const categories = Array.from(new Set(REGISTRY_ASSETS.map((r) => r.category)));

    const copyCode = async (code: string) => {
        try { await navigator.clipboard.writeText(code); } catch { }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative min-h-screen bg-[#050505]">
            {/* 3D Canvas Background */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                    <Suspense fallback={null}><RegistryScene /></Suspense>
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-[3] max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">01 — THE VAULT</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-3 drop-shadow-lg">REGISTRY</h1>
                    <p className="font-mono text-sm text-white/80 tracking-wider">Bespoke UI protocols — production-grade components for the uncompromising.</p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mt-10 mb-10">
                    <button onClick={() => setFilter(null)} className={`tag-pill text-[8px] ${!filter ? "border-gold/80 text-gold bg-gold/10" : ""}`}>ALL</button>
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`tag-pill text-[8px] ${filter === cat ? "border-gold/80 text-gold bg-gold/10" : ""}`}>{cat}</button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 gap-5 space-y-5">
                    {filtered.map((item, i) => (
                        <MasonryCard key={item.id} item={item} index={i} onSelect={setSelected} />
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setSelected(null)}>
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-white/[0.08] rounded-2xl">
                            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                            <div className="p-8 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border ${selectedItem.tier === "FREE" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-gold bg-gold/10 border-gold/20"}`}>{selectedItem.tier}</span>
                                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{selectedItem.category}</span>
                                    <span className="font-mono text-[8px] text-white/80 tracking-wider">{selectedItem.framework}</span>
                                    {selectedItem.isNew && <span className="font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>}
                                </div>
                                <h2 className="font-serif text-3xl text-white tracking-tight mb-2">{selectedItem.name}</h2>
                                <p className="font-mono text-xs text-white/80 tracking-wide leading-relaxed">{selectedItem.description}</p>
                                <div className="flex items-center gap-6 mt-6 font-mono text-[9px] text-white/80 tracking-wider">
                                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3 stroke-[1]" />{selectedItem.performanceCost}</span>
                                    <span>{selectedItem.size}</span>
                                    <span className="flex items-center gap-1"><Download className="w-3 h-3 stroke-[1]" />{selectedItem.downloads.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-[9px] text-gold tracking-[0.3em]">SOURCE PROTOCOL</span>
                                    <button onClick={() => copyCode(selectedItem.code)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-gold/20 bg-white/[0.02] hover:bg-gold/[0.05] transition-all">
                                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/80" />}
                                        <span className="font-mono text-[9px] text-white/80 tracking-wider">{copied ? "COPIED" : "COPY PROTOCOL"}</span>
                                    </button>
                                </div>
                                <pre className="bg-[#050505] border border-white/[0.06] rounded-xl p-6 overflow-x-auto"><code className="font-mono text-[11px] text-white/90 leading-relaxed whitespace-pre">{selectedItem.code}</code></pre>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MasonryCard({ item, index, onSelect }: { item: typeof REGISTRY_ASSETS[0]; index: number; onSelect: (id: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.06, duration: 0.5 }}
            onClick={() => onSelect(item.id)} className="break-inside-avoid cursor-pointer group">
            <div className="relative rounded-xl overflow-hidden bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-gold/30 transition-all duration-700 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <div className="h-44 relative overflow-hidden" style={{ background: item.previewGradient }}>
                    <div className="absolute inset-4 border border-dashed border-gold/0 group-hover:border-gold/30 rounded-lg transition-all duration-700 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 text-center">
                            <Cpu className="w-8 h-8 text-gold/80 mx-auto mb-2 stroke-[0.5]" />
                            <span className="font-mono text-[8px] text-gold/80 tracking-[0.3em]">LIVE SYNTHESIS</span>
                        </div>
                    </div>
                    {item.isNew && <span className="absolute top-3 right-3 font-mono text-[7px] text-black bg-gold px-2 py-0.5 rounded tracking-wider">NEW</span>}
                    <span className={`absolute top-3 left-3 font-mono text-[7px] tracking-wider px-2 py-0.5 rounded ${item.tier === "FREE" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-gold bg-gold/10 border border-gold/20"}`}>{item.tier}</span>
                </div>
                <div className="p-5">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-500 mb-2">{item.name}</h3>
                    <p className="font-mono text-[10px] text-white/80 leading-relaxed tracking-wide mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[8px] text-white/80 tracking-wider mb-4">
                        <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5 stroke-[1]" />{item.performanceCost}</span>
                        <span>{item.size}</span>
                        <span>{item.framework}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {item.dependencies.slice(0, 2).map((dep) => (<span key={dep} className="font-mono text-[7px] text-white/80 bg-white/[0.04] px-2 py-0.5 rounded">{dep}</span>))}
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[8px] text-white/80"><Download className="w-3 h-3 stroke-[1]" /><span>{(item.downloads / 1000).toFixed(1)}K</span></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
