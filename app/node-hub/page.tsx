"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NODE_THREADS, TOP_CONTRIBUTORS, LIVE_TRANSMISSIONS } from "@/lib/data";
import { MessageSquare, Heart, Flame, Search, Terminal, Code, Radio } from "lucide-react";
import * as THREE from "three";

/* ═══ 3D Particle Network ═══ */
function ParticleNetwork({ count = 120 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.Group>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    const particles = useMemo(() =>
        Array.from({ length: count }, () => ({
            pos: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8 - 3] as [number, number, number],
            speed: 0.003 + Math.random() * 0.012,
            offset: Math.random() * Math.PI * 2,
            size: 0.015 + Math.random() * 0.02,
        })),
        [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        particles.forEach((p, i) => {
            dummy.position.set(
                p.pos[0] + Math.sin(t * p.speed + p.offset) * 0.8,
                p.pos[1] + Math.cos(t * p.speed * 0.6 + p.offset) * 0.6,
                p.pos[2]
            );
            dummy.scale.setScalar(p.size + Math.sin(t * 0.5 + p.offset) * 0.005);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;

        if (meshRef.current.parent) {
            meshRef.current.parent.rotation.y = mx * 0.3 + t * 0.03;
            meshRef.current.parent.rotation.x = my * 0.15;
        }
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
            </instancedMesh>
            <Stars radius={50} depth={25} count={600} factor={2} saturation={0} fade speed={0.3} />
        </group>
    );
}

function NodeHubScene() {
    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={0.3} color="#D4AF37" />
            <ParticleNetwork count={100} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.8} intensity={0.4} />
                <Noise opacity={0.025} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══ Main Page ═══ */
export default function NodeHubPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeThread, setActiveThread] = useState<string | null>(null);

    const filteredThreads = searchQuery
        ? NODE_THREADS.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        : NODE_THREADS;

    return (
        <div className="relative min-h-screen bg-[#050505]">
            {/* 3D Canvas Background */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                    <Suspense fallback={null}><NodeHubScene /></Suspense>
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-[3] max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">02 — THE NETWORK</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-3 drop-shadow-lg">NODE HUB</h1>
                    <p className="font-mono text-sm text-white/80 tracking-wider mb-8">Elite frequency — live design-engineering transmissions.</p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 stroke-[1]" />
                    <input type="text" placeholder="Search threads, tags, architects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl px-12 py-3.5 font-mono text-sm text-white/90 placeholder:text-white/70 focus:outline-none focus:border-gold/30 transition-colors" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-white/80 tracking-wider bg-white/[0.04] px-2 py-1 rounded">⌘K</span>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_260px] gap-6">
                    {/* LEFT */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4"><Terminal className="w-3.5 h-3.5 text-gold stroke-[1]" /><span className="font-mono text-[9px] text-gold tracking-[0.3em]">ACTIVE THREADS</span></div>
                        {filteredThreads.map((thread, i) => (
                            <motion.div key={thread.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                onClick={() => setActiveThread(activeThread === thread.id ? null : thread.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-500 border backdrop-blur-sm ${activeThread === thread.id ? "bg-gold/[0.06] border-gold/20" : "bg-white/[0.03] border-white/[0.06] hover:border-white/10"}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[7px] text-gold">{thread.avatar}</div>
                                    <span className="font-mono text-[8px] text-gold/80 tracking-wider">{thread.author}</span>
                                    {thread.hot && <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />}
                                    {thread.status === "RESOLVED" && <span className="font-mono text-[6px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">RESOLVED</span>}
                                </div>
                                <h4 className="font-mono text-[11px] text-white leading-snug mb-2 line-clamp-2">{thread.title}</h4>
                                <div className="flex items-center gap-3 font-mono text-[7px] text-white/80">
                                    <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5 stroke-[1]" />{thread.replies}</span>
                                    <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5 stroke-[1]" />{thread.likes}</span>
                                    <span>{thread.timestamp}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CENTER — Feed */}
                    <div className="border border-white/[0.06] rounded-xl bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-mono text-[9px] text-gold tracking-[0.3em]">LIVE TRANSMISSIONS</span>
                            <span className="font-mono text-[7px] text-white/80 tracking-wider ml-auto">{LIVE_TRANSMISSIONS.length} ACTIVE</span>
                        </div>
                        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            {LIVE_TRANSMISSIONS.map((msg, i) => (
                                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    className={`p-4 rounded-lg border ${msg.type === "SYSTEM" ? "bg-gold/[0.03] border-gold/10" : msg.type === "CODE" ? "bg-blue-500/[0.03] border-blue-500/10" : msg.type === "REVIEW" ? "bg-purple-500/[0.03] border-purple-500/10" : "bg-white/[0.02] border-white/[0.04]"}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[6px] text-gold">{msg.avatar}</div>
                                        <span className="font-mono text-[8px] text-gold/80 tracking-wider">{msg.author}</span>
                                        <span className={`font-mono text-[6px] tracking-wider px-1.5 py-0.5 rounded ${msg.type === "SYSTEM" ? "text-gold bg-gold/10" : msg.type === "CODE" ? "text-blue-400 bg-blue-400/10" : msg.type === "REVIEW" ? "text-purple-400 bg-purple-400/10" : "text-white/80 bg-white/5"}`}>{msg.type}</span>
                                        <span className="font-mono text-[7px] text-white/80 ml-auto">{msg.timestamp}</span>
                                    </div>
                                    {msg.type === "CODE" ? <pre className="font-mono text-[10px] text-white/90 bg-[#050505] rounded p-3 overflow-x-auto"><code>{msg.content}</code></pre> : <p className="font-mono text-[11px] text-white/90 leading-relaxed">{msg.content}</p>}
                                </motion.div>
                            ))}
                        </div>
                        <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-2 mb-3"><Code className="w-3.5 h-3.5 text-gold stroke-[1]" /><span className="font-mono text-[8px] text-gold tracking-[0.3em]">BESPOKE FEEDBACK</span></div>
                            <textarea placeholder="> Paste code for peer review..." className="w-full h-20 bg-[#050505] border border-white/[0.06] rounded-lg px-4 py-3 font-mono text-xs text-white/90 placeholder:text-white/70 resize-none focus:outline-none focus:border-gold/20 transition-colors" />
                            <button className="mt-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg font-mono text-[9px] text-gold tracking-wider hover:bg-gold hover:text-black transition-all">SUBMIT FOR REVIEW</button>
                        </div>
                    </div>

                    {/* RIGHT — Contributors */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4"><Radio className="w-3.5 h-3.5 text-gold stroke-[1]" /><span className="font-mono text-[9px] text-gold tracking-[0.3em]">ARCHITECTS</span></div>
                        {TOP_CONTRIBUTORS.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-gold/20 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[8px] text-gold">{c.avatar}</div>
                                    <div><p className="font-mono text-xs text-white group-hover:text-gold transition-colors tracking-wider">{c.name}</p><p className="font-mono text-[7px] text-white/80 tracking-wider">{c.role}</p></div>
                                </div>
                                <div className="flex items-center justify-between font-mono text-[7px] text-white/80 tracking-wider">
                                    <span>{c.contributions} contributions</span><span>{c.streak}d streak 🔥</span>
                                </div>
                                <div className="font-mono text-[7px] text-gold/80 mt-2 tracking-wider">{c.specialty}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-12 flex flex-wrap gap-2">
                    {["#PERFORMANCE", "#SHADERS", "#TYPOGRAPHY", "#MOBILE", "#MOTION", "#CSS", "#NEXTJS", "#SCROLL", "#THREE", "#DESIGN"].map((tag) => (
                        <button key={tag} onClick={() => setSearchQuery(tag)} className="tag-pill text-[8px] hover:border-gold/80 hover:text-gold">{tag}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
