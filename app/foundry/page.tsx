"use client";

import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PresentationControls } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FOUNDRY_DEFAULT_CODE, FOUNDRY_COMMANDS, FOUNDRY_COMPONENTS } from "@/lib/data";
import { Play, Terminal, Command, Settings, ChevronRight, Maximize2, Minimize2, ChevronUp, GripVertical } from "lucide-react";
import * as THREE from "three";

const SPRING_MECH = { type: "spring" as const, stiffness: 300, damping: 25 };
const SPRING_HEAVY = { type: "spring" as const, stiffness: 150, damping: 30 };

/* ═══ 3D Draggable Rigid Body ═══ */
function HeavyGoldHexagon() {
    const meshRef = useRef<THREE.Mesh>(null);
    const edgesRef = useRef<THREE.LineSegments>(null);
    const shape = new THREE.Shape();
    for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        shape.lineTo(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8);
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 });
    const edgesGeometry = new THREE.EdgesGeometry(geometry);

    useFrame(({ clock }) => {
        if (!meshRef.current || !edgesRef.current) return;
        meshRef.current.rotation.y += Math.sin(clock.elapsedTime * 0.5) * 0.002;
        edgesRef.current.rotation.y += Math.sin(clock.elapsedTime * 0.5) * 0.002;
    });

    return (
        <PresentationControls global snap rotation={[0, 0, 0]} polar={[-Math.PI / 3, Math.PI / 3]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]} speed={0.5} zoom={0.8} cursor={true}>
            <group>
                <mesh ref={meshRef} geometry={geometry}>
                    <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
                </mesh>
                <lineSegments ref={edgesRef} geometry={edgesGeometry}>
                    <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
                </lineSegments>
            </group>
        </PresentationControls>
    );
}

function FoundryScene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#D4AF37" decay={2} />
            <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ffffff" decay={2} />
            <HeavyGoldHexagon />
            <Stars radius={30} depth={15} count={100} factor={2} saturation={0} fade speed={0.1} />
            <EffectComposer>
                <Bloom luminanceThreshold={0.6} intensity={0.5} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.2} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══ Active Console ═══ */
function ActiveConsole({ output, setOutput }: { output: string[]; setOutput: React.Dispatch<React.SetStateAction<string[]>> }) {
    const consoleRef = useRef<HTMLDivElement>(null);

    // Auto-print success codes
    useEffect(() => {
        const codes = [
            "[RENDER] Frame 60fps stable — GPU composite ✓",
            "[HEAP] Memory: 42MB / 256MB — optimal ✓",
            "[PHYSICS] Spring dampener calibrated — mass: 3 ✓",
            "[SHADER] Gold metalness pass compiled — 0.2ms ✓",
            "[LAYOUT] Zero CLS detected — stable ✓",
            "[NET] WebSocket latency: 8ms — connected ✓",
        ];
        let i = 0;
        const interval = setInterval(() => {
            setOutput(o => [...o.slice(-30), `[${new Date().toLocaleTimeString()}] ${codes[i % codes.length]}`]);
            i++;
        }, 3000);
        return () => clearInterval(interval);
    }, [setOutput]);

    // Auto-scroll
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#080808] border-b border-white/[0.02] shrink-0">
                <span className="font-mono text-[8px] text-gold tracking-[0.3em]">CONSOLE DIAGNOSTICS</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div ref={consoleRef} className="flex-1 p-3 overflow-y-auto font-mono text-[9px] space-y-1" style={{ scrollbarWidth: "none" }}>
                {output.map((line, i) => (
                    <div key={`${i}-${line.slice(0, 20)}`} className={line.includes("✓") ? "text-emerald-400" : line.includes("ERROR") ? "text-red-400" : line.includes("[CMD]") ? "text-gold" : "text-white/50"}>
                        {line}
                    </div>
                ))}
                <div className="flex items-center gap-1 mt-1 text-gold"><ChevronRight className="w-3 h-3" /><span className="animate-pulse">_</span></div>
            </div>
        </div>
    );
}

/* ═══ Component Injector Drawer ═══ */
function ComponentInjector({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isOpen ? "0%" : "calc(100% - 40px)" }}
            transition={SPRING_HEAVY}
            className="absolute bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-gold/20 rounded-t-xl"
        >
            {/* Handle */}
            <button onClick={onToggle} className="w-full flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-gold/[0.03] transition-colors">
                <ChevronUp className={`w-4 h-4 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`} />
                <span className="font-mono text-[8px] text-gold tracking-[0.3em]">COMPONENT INJECTOR</span>
            </button>

            <div className="px-6 pb-6 grid grid-cols-6 gap-3">
                {FOUNDRY_COMPONENTS.map((comp) => (
                    <motion.div
                        key={comp.id}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center justify-center gap-2 h-24 rounded-lg border border-white/[0.06] hover:border-gold/30 cursor-grab active:cursor-grabbing transition-colors relative overflow-hidden group/comp"
                    >
                        <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover/comp:opacity-40" />
                        <Image src={comp.imageUrl} alt={comp.name} fill className="object-cover opacity-50 group-hover/comp:opacity-80 transition-all duration-700 filter contrast-125 saturate-50 group-hover/comp:scale-110" />
                        <span className="text-2xl z-20 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" style={{ color: comp.color }}>{comp.icon}</span>
                        <span className="font-mono text-[8px] text-white/90 tracking-wider z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{comp.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══ Main Page ═══ */
export default function FoundryPage() {
    const [code] = useState(FOUNDRY_DEFAULT_CODE);
    const [output, setOutput] = useState<string[]>(["[FOUNDRY] Ready. Target locked.", "[SYSTEM] Rigid body physics engine initialized.", "[SYSTEM] Component injector loaded — 6 blocks available."]);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Draggable divider
    const dividerX = useMotionValue(45); // % from left
    const springDividerX = useSpring(dividerX, SPRING_HEAVY);
    const isDragging = useRef(false);

    const handleDividerDrag = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const pct = (e.clientX / window.innerWidth) * 100;
        dividerX.set(Math.max(25, Math.min(75, pct)));
    }, [dividerX]);

    const runCode = () => {
        setOutput((o) => [...o, `[${new Date().toLocaleTimeString()}] Compiling...`, "[COMPILER] AST parsed — 0 errors", "[DEPLOY] Component injected to active port ✓"]);
    };

    return (
        <div
            className="relative h-screen bg-[#050505] overflow-hidden flex flex-col pt-16"
            onMouseMove={handleDividerDrag}
            onMouseUp={() => { isDragging.current = false; }}
        >
            {/* Blast Door Preloader */}
            <motion.div className="absolute inset-y-0 left-0 w-1/2 bg-[#020202] z-[80] border-r-4 border-gold shadow-[20px_0_50px_rgba(0,0,0,0.9)]" initial={{ x: 0 }} animate={{ x: "-100%" }} transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }} />
            <motion.div className="absolute inset-y-0 right-0 w-1/2 bg-[#020202] z-[80] border-l-4 border-gold shadow-[-20px_0_50px_rgba(0,0,0,0.9)]" initial={{ x: 0 }} animate={{ x: "100%" }} transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }} />

            {/* ═══ Section 1: Command Palette Bar ═══ */}
            <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#080808]">
                <div>
                    <h1 className="font-serif text-2xl text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">FOUNDRY</h1>
                    <p className="font-mono text-[9px] text-gold tracking-[0.4em]">MECHANICAL INTERLOCK ENABLED. DRAG TO TEST MASS.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCommandPaletteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] hover:border-gold/30 transition-colors">
                        <Command className="w-3 h-3 text-white/50" /><span className="font-mono text-[8px] text-white/80 tracking-wider">⌘K</span>
                    </button>
                    <button onClick={runCode} className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-gold/10 border border-gold/40 hover:bg-gold hover:text-black transition-all group">
                        <Play className="w-3 h-3 text-gold group-hover:text-black fill-current" /><span className="font-mono text-[9px] font-bold text-gold group-hover:text-black tracking-wider">EXECUTE</span>
                    </button>
                    <button onClick={() => setFullscreen(!fullscreen)} className="p-1.5 rounded bg-white/[0.03] border border-white/[0.06] hover:border-gold/30 transition-colors">
                        {fullscreen ? <Minimize2 className="w-4 h-4 text-white/50" /> : <Maximize2 className="w-4 h-4 text-white/50" />}
                    </button>
                </div>
            </div>

            {/* ═══ Section 2: Split IDE with Draggable Divider ═══ */}
            <div className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${fullscreen ? "fixed inset-0 z-[70] bg-[#050505]" : ""}`}>
                {/* LEFT — Code Editor */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, ...SPRING_MECH }}
                    className="flex flex-col border-r border-white/[0.06] bg-[#030303]"
                    style={{ width: `${springDividerX.get()}%`, minWidth: "25%", maxWidth: "75%" }}
                >
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04] bg-[#080808] shrink-0">
                        <Terminal className="w-3 h-3 text-gold" /><span className="font-mono text-[8px] text-gold tracking-[0.3em]">EDITOR.TSX</span>
                    </div>
                    <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-[1.8] text-white/80" style={{ scrollbarWidth: "none" }}>
                        <pre>
                            {code.split("\n").map((line, i) => (
                                <div key={i} className="flex">
                                    <span className="w-8 text-right pr-4 text-white/30 select-none shrink-0 text-[10px]">{i + 1}</span>
                                    <code className={
                                        line.includes("//") ? "text-white/40" :
                                            line.includes("export") || line.includes("import") || line.includes("return") ? "text-gold" :
                                                line.includes("className") ? "text-emerald-400" :
                                                    line.includes('"') || line.includes("'") ? "text-amber-300" : "text-white/90"
                                    }>{line || " "}</code>
                                </div>
                            ))}
                        </pre>
                    </div>

                    {/* ═══ Section 4: Console Diagnostics ═══ */}
                    <div className="h-48 border-t border-white/[0.06] bg-[#010101]">
                        <ActiveConsole output={output} setOutput={setOutput} />
                    </div>
                </motion.div>

                {/* Draggable Divider */}
                <motion.div
                    onMouseDown={() => { isDragging.current = true; }}
                    className="hidden lg:flex w-3 cursor-col-resize items-center justify-center bg-[#050505] hover:bg-gold/10 transition-colors z-30 shrink-0"
                >
                    <GripVertical className="w-3 h-3 text-white/20" />
                </motion.div>

                {/* RIGHT — Live 3D Preview */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                    className="flex-1 relative cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_50%_50%,#111_0%,#000_100%)]"
                >
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <Settings className="w-3 h-3 text-gold animate-[spin_4s_linear_infinite]" />
                        <span className="font-mono text-[8px] text-gold tracking-[0.3em]">LIVE 3D PREVIEW / MASS: HEAVY</span>
                    </div>
                    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                        <Suspense fallback={null}><FoundryScene /></Suspense>
                    </Canvas>

                    {/* ═══ Section 3: Component Injector ═══ */}
                    <ComponentInjector isOpen={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />
                </motion.div>
            </div>

            {/* Command Palette Modal */}
            <AnimatePresence>
                {commandPaletteOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-start justify-center pt-32 bg-black/80 backdrop-blur-xl"
                        onClick={() => setCommandPaletteOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={SPRING_MECH}
                            onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-[#0a0a0a] border border-gold/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                        >
                            <div className="px-4 py-3 border-b border-white/[0.06]"><span className="font-mono text-[9px] text-gold tracking-[0.3em]">FOUNDRY COMMAND NETWORK</span></div>
                            <div className="p-2">
                                {FOUNDRY_COMMANDS.map((cmd) => (
                                    <button key={cmd.action} onClick={() => { setCommandPaletteOpen(false); setOutput(o => [...o, `[CMD] Executed: ${cmd.label}`]); }} className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gold/10 transition-colors group">
                                        <span className="font-mono text-xs text-white/90 tracking-wider group-hover:text-gold transition-colors">{cmd.label}</span>
                                        <span className="font-mono text-[9px] text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">{cmd.shortcut}</span>
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
