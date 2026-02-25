"use client";

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Environment } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { FOUNDRY_DEFAULT_CODE, FOUNDRY_COMMANDS } from "@/lib/data";
import { Play, Terminal, Command, Settings, Copy, Check, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import * as THREE from "three";

/* ═══ 3D Gold Hexagon ═══ */
function GoldHexagon({ scrollProgress = 0 }: { scrollProgress: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const edgesRef = useRef<THREE.LineSegments>(null);

    const hexShape = useMemo(() => {
        const shape = new THREE.Shape();
        for (let i = 0; i <= 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 1.5;
            const y = Math.sin(angle) * 1.5;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        return shape;
    }, []);

    const geometry = useMemo(() => new THREE.ExtrudeGeometry(hexShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }), [hexShape]);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
            meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.3;
        }
        if (edgesRef.current) {
            edgesRef.current.rotation.y = clock.getElapsedTime() * 0.3;
            edgesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.3;
        }
    });

    // Dynamic light intensity based on scroll
    const lightIntensity = 0.3 + scrollProgress * 0.7;

    return (
        <>
            <pointLight position={[3, 3, 3]} intensity={lightIntensity} color="#D4AF37" />
            <pointLight position={[-3, -2, 2]} intensity={lightIntensity * 0.5} color="#F3E5AB" />
            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
                <group position={[0, 0, 0]}>
                    <mesh ref={meshRef} geometry={geometry}>
                        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} envMapIntensity={1.5} />
                    </mesh>
                    <lineSegments ref={edgesRef} geometry={edgesGeometry}>
                        <lineBasicMaterial color="#F3E5AB" transparent opacity={0.4} />
                    </lineSegments>
                </group>
            </Float>
        </>
    );
}

function FoundryScene({ scrollProgress }: { scrollProgress: number }) {
    return (
        <>
            <ambientLight intensity={0.15} />
            <GoldHexagon scrollProgress={scrollProgress} />
            <Stars radius={30} depth={15} count={300} factor={2} saturation={0} fade speed={0.3} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.7} intensity={0.5} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>
        </>
    );
}

/* ═══ Main Page ═══ */
export default function FoundryPage() {
    const [code] = useState(FOUNDRY_DEFAULT_CODE);
    const [output, setOutput] = useState<string[]>(["[FOUNDRY] Ready. Awaiting protocol...", "[SYSTEM] Compiler initialized — v2.4.0", "[SYSTEM] Gold particle shader preloaded"]);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const editorRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCommandPaletteOpen((p) => !p); }
        if (e.key === "Escape") setCommandPaletteOpen(false);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleEditorScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const progress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
        setScrollProgress(Math.min(progress, 1));
    };

    const runCode = () => {
        setOutput((o) => [...o, `[${new Date().toLocaleTimeString()}] Compiling protocol...`, "[COMPILER] AST parsed — 0 errors", "[COMPILER] Bundle size: 4.1 KB (gzipped: 1.8 KB)", "[DEPLOY] Component rendered successfully ✓"]);
    };

    const executeCommand = (action: string) => {
        setCommandPaletteOpen(false);
        switch (action) {
            case "deploy": setOutput((o) => [...o, "[DEPLOY] Deploying to edge network... Done ✓"]); break;
            case "diagnose": setOutput((o) => [...o, "[DIAG] Memory: 12MB | FPS: 60 | Layout shifts: 0 | CLS: 0.00"]); break;
            case "style": setOutput((o) => [...o, "[INJECT] Void & Gold stylesheet injected ✓"]); break;
            case "export": setOutput((o) => [...o, "[EXPORT] Protocol exported as .gestaltung package"]); break;
            case "preview": setOutput((o) => [...o, "[PREVIEW] Live preview toggled"]); break;
            case "clear": setOutput(["[FOUNDRY] Console cleared."]); break;
        }
    };

    const copyCode = async () => {
        try { await navigator.clipboard.writeText(code); } catch { }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative min-h-screen bg-[#050505]">
            {/* Content */}
            <div className="relative z-[3] max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">04 — THE LABORATORY</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-3 drop-shadow-lg">FOUNDRY</h1>
                    <p className="font-mono text-sm text-white/80 tracking-wider mb-10">Live synthesis & compilation — where protocols are forged.</p>
                </motion.div>

                {/* IDE */}
                <div className={`rounded-2xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden ${fullscreen ? "fixed inset-4 z-[80]" : ""}`}>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" /></div>
                            <span className="font-mono text-[9px] text-white/80 tracking-wider">particle-burst.tsx</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCommandPaletteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-gold/20 transition-colors">
                                <Command className="w-3 h-3 text-white/80 stroke-[1]" /><span className="font-mono text-[8px] text-white/80 tracking-wider">⌘K</span>
                            </button>
                            <button onClick={runCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black transition-all group">
                                <Play className="w-3 h-3 text-gold group-hover:text-black stroke-[1] fill-current" /><span className="font-mono text-[8px] text-gold group-hover:text-black tracking-wider">RUN</span>
                            </button>
                            <button onClick={copyCode} className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-gold/20 transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/80 stroke-[1]" />}
                            </button>
                            <button onClick={() => setFullscreen(!fullscreen)} className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-gold/20 transition-colors">
                                {fullscreen ? <Minimize2 className="w-3.5 h-3.5 text-white/80 stroke-[1]" /> : <Maximize2 className="w-3.5 h-3.5 text-white/80 stroke-[1]" />}
                            </button>
                        </div>
                    </div>

                    {/* Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
                        {/* LEFT — Editor */}
                        <div className="border-r border-white/[0.06]">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                                <Terminal className="w-3 h-3 text-gold stroke-[1]" /><span className="font-mono text-[8px] text-gold tracking-[0.3em]">EDITOR</span>
                            </div>
                            <div ref={editorRef} onScroll={handleEditorScroll} className="relative p-4 overflow-auto max-h-[55vh]">
                                <pre className="font-mono text-[11px] leading-[1.8]">
                                    {code.split("\n").map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-8 text-right pr-4 text-white/80 select-none shrink-0 text-[10px]">{i + 1}</span>
                                            <code className={`${line.includes("//") || line.includes("/*") || line.includes("* ") ? "text-white/80" :
                                                    line.includes("export") || line.includes("import") || line.includes("const") || line.includes("function") || line.includes("return") || line.includes("interface") ? "text-gold" :
                                                        line.includes("className") ? "text-emerald-400/90" :
                                                            line.includes('"') || line.includes("'") || line.includes('`') ? "text-amber-300/90" : "text-white/90"
                                                }`}>{line || " "}</code>
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        </div>

                        {/* RIGHT — Live 3D Preview */}
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                                <Settings className="w-3 h-3 text-gold stroke-[1]" /><span className="font-mono text-[8px] text-gold tracking-[0.3em]">LIVE 3D PREVIEW</span>
                            </div>
                            <div className="h-[55vh] bg-[#030303]">
                                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
                                    <Suspense fallback={null}><FoundryScene scrollProgress={scrollProgress} /></Suspense>
                                </Canvas>
                            </div>
                        </div>
                    </div>

                    {/* Console Output */}
                    <div className="border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.01]"><ChevronRight className="w-3 h-3 text-gold" /><span className="font-mono text-[8px] text-gold tracking-[0.3em]">CONSOLE</span></div>
                        <div className="p-4 max-h-[20vh] overflow-y-auto font-mono text-[10px] space-y-1">
                            {output.map((line, i) => (
                                <motion.div key={`${i}-${line}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                                    className={`${line.includes("✓") ? "text-emerald-400" : line.includes("ERROR") ? "text-red-400" : line.includes("[SYSTEM]") || line.includes("[FOUNDRY]") ? "text-gold/80" : "text-white/80"}`}>{line}</motion.div>
                            ))}
                            <div className="flex items-center gap-1 mt-2"><ChevronRight className="w-3 h-3 text-gold" /><span className="text-gold/80 animate-pulse">_</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Palette */}
            <AnimatePresence>
                {commandPaletteOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-start justify-center pt-[20vh]" onClick={() => setCommandPaletteOpen(false)}>
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, y: -20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.96 }} transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
                            <div className="px-4 py-3 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2"><Command className="w-4 h-4 text-gold stroke-[1]" /><span className="font-mono text-[9px] text-gold tracking-[0.3em]">FOUNDRY COMMAND NETWORK</span></div>
                            </div>
                            <div className="p-2">
                                {FOUNDRY_COMMANDS.map((cmd) => (
                                    <button key={cmd.action} onClick={() => executeCommand(cmd.action)} className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gold/[0.05] transition-colors group">
                                        <span className="font-mono text-xs text-white/90 tracking-wider group-hover:text-gold transition-colors">{cmd.label}</span>
                                        <span className="font-mono text-[9px] text-white/80 bg-white/[0.04] px-2 py-0.5 rounded">{cmd.shortcut}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
