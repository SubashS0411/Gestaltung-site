"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NODE_THREADS, TOP_CONTRIBUTORS, LIVE_TRANSMISSIONS, SYSTEM_TICKER_UPDATES } from "@/lib/data";
import { MessageSquare, Heart, Flame, Search, Terminal, Code, Radio } from "lucide-react";
import * as THREE from "three";

const SPRING_MECH = { type: "spring" as const, stiffness: 400, damping: 20 };

/* ═══ Custom Decryption Hook ═══ */
function useDecryption(text: string, isInView: boolean) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        if (!isInView) { setDisplay(text.replace(/[a-zA-Z0-9]/g, "0")); return; }
        let iter = 0;
        const chars = "01XY$#@%&*";
        const interval = setInterval(() => {
            setDisplay(text.split("").map((char, i) => {
                if (char === " ") return " ";
                if (i < iter) return char;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iter >= text.length) clearInterval(interval);
            iter += text.length / 8;
        }, 30);
        return () => clearInterval(interval);
    }, [text, isInView]);
    return display;
}

function DecryptedText({ text, as = "p", className = "" }: { text: string; as?: any; className?: string }) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
    const decrypted = useDecryption(text, isInView);
    const Tag = as;
    return <Tag ref={ref} className={className}>{decrypted}</Tag>;
}

/* ═══ 2D Oil Fluid Shader ═══ */
const oilShader = {
    uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
        uniform float uTime; uniform vec2 uMouse; varying vec2 vUv;
        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
        float noise(vec2 st) {
            vec2 i = floor(st); vec2 f = fract(st);
            float a = random(i); float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
            vec2 u = f*f*(3.0-2.0*f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        void main() {
            vec2 uv = vUv;
            float dist = distance(uv, uMouse);
            float interaction = exp(-dist * 5.0) * sin(dist * 20.0 - uTime * 5.0) * 0.05;
            vec2 pos = vec2(uv * 3.0);
            float pattern = noise(pos + uTime * 0.1 + interaction);
            pattern = noise(pos + pattern * 2.0 - interaction);
            vec3 darkOil = vec3(0.01, 0.01, 0.01);
            vec3 goldSheen = vec3(0.83, 0.68, 0.21) * 0.15;
            vec3 color = mix(darkOil, goldSheen, pattern);
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

function OilFluidBackground() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const mouse = useRef(new THREE.Vector2(0.5, 0.5));
    const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
    useEffect(() => {
        const h = (e: MouseEvent) => {
            targetMouse.current.x = e.clientX / window.innerWidth;
            targetMouse.current.y = 1.0 - (e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", h);
        return () => window.removeEventListener("mousemove", h);
    }, []);
    useFrame(({ clock }) => {
        if (!materialRef.current) return;
        mouse.current.lerp(targetMouse.current, 0.05);
        materialRef.current.uniforms.uTime.value = clock.elapsedTime;
        materialRef.current.uniforms.uMouse.value = mouse.current;
    });
    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial ref={materialRef} attach="material" args={[oilShader]} depthWrite={false} depthTest={false} />
        </mesh>
    );
}

function NodeHubScene() {
    return (
        <>
            <OilFluidBackground />
            <EffectComposer>
                <Bloom luminanceThreshold={0.5} intensity={0.5} />
                <Noise opacity={0.04} />
                <Vignette eskil={false} offset={0.1} darkness={0.9} />
            </EffectComposer>
        </>
    );
}

/* ═══ Bento Grid Thread Card ═══ */
function BentoThreadCard({ thread, span }: { thread: typeof NODE_THREADS[0]; span: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={SPRING_MECH}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-xl overflow-hidden ${span} ${isHovered ? "bg-gold/[0.06] border-gold/30" : "bg-black/40 border-white/[0.06] hover:border-gold/20"
                }`}
        >
            {/* SVG border draw animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <motion.rect
                    x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="12" ry="12"
                    fill="none" stroke="#D4AF37" strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.15 } : {}}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                />
            </svg>

            {/* Faint Background Image Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay">
                <Image
                    src={thread.imageUrl}
                    alt="Thread artwork"
                    fill
                    className="object-cover filter contrast-150 saturate-50 transition-transform duration-1000 transform-gpu group-hover:scale-105"
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[7px] text-gold">{thread.avatar}</div>
                    <span className="font-mono text-[8px] text-gold/80 tracking-wider">{thread.author}</span>
                    {thread.hot && <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />}
                    <span className={`ml-auto font-mono text-[7px] px-2 py-0.5 rounded tracking-wider ${thread.status === "RESOLVED" ? "text-emerald-400 bg-emerald-400/10" : thread.status === "PINNED" ? "text-gold bg-gold/10" : "text-white/50 bg-white/5"
                        }`}>{thread.status}</span>
                </div>

                <DecryptedText text={thread.title} className={`font-mono text-sm leading-snug mb-3 ${isHovered ? "text-gold" : "text-white/90"}`} />
                <p className="font-mono text-[10px] text-white/50 leading-relaxed line-clamp-3 mb-4">{thread.content}</p>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                    {thread.tags.map(tag => (
                        <span key={tag} className="font-mono text-[7px] text-gold/60 tracking-wider bg-gold/[0.05] border border-gold/10 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                </div>

                <div className="flex items-center gap-3 font-mono text-[7px] text-white/50">
                    <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5 stroke-[1]" />{thread.replies}</span>
                    <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5 stroke-[1]" />{thread.likes}</span>
                    <span className="ml-auto">{thread.timestamp}</span>
                </div>
            </div>
        </motion.div>
    );
}

/* ═══ Glitch Contributor Card ═══ */
function GlitchContributorCard({ contributor, index }: { contributor: typeof TOP_CONTRIBUTORS[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING_MECH, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/[0.06] hover:border-gold/30 transition-all cursor-pointer group relative overflow-hidden"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <div className={`relative w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-mono text-xs text-gold transition-all border border-gold/20 overflow-hidden ${isHovered ? "shadow-[0_0_15px_rgba(212,175,55,0.4)]" : ""}`}>
                        <Image src={contributor.avatar} alt={contributor.name} fill className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    {/* RGB glitch layers */}
                    {isHovered && (
                        <>
                            <div className="absolute inset-0 w-10 h-10 rounded-full bg-red-500/30 mix-blend-screen translate-x-0.5 animate-pulse" />
                            <div className="absolute inset-0 w-10 h-10 rounded-full bg-blue-500/30 mix-blend-screen -translate-x-0.5 animate-pulse" style={{ animationDelay: "100ms" }} />
                            <div className="absolute inset-0 w-10 h-10 rounded-full bg-green-500/20 mix-blend-screen translate-y-0.5 animate-pulse" style={{ animationDelay: "200ms" }} />
                        </>
                    )}
                </div>
                <div>
                    <p className="font-mono text-xs text-white group-hover:text-gold transition-colors tracking-wider">{contributor.name}</p>
                    <p className="font-mono text-[7px] text-white/50 tracking-wider">{contributor.role}</p>
                </div>
            </div>
            <div className="flex items-center justify-between font-mono text-[8px] text-white/50 tracking-wider">
                <span>{contributor.contributions} POSTS</span>
                <span className="text-gold">{contributor.streak}d STREAK</span>
            </div>
            <div className="mt-2 font-mono text-[7px] text-gold/40 tracking-wider">{contributor.specialty}</div>
        </motion.div>
    );
}

/* ═══ Code Diff Typing Effect ═══ */
function CodeDiffBlock() {
    const [lines, setLines] = useState<string[]>([]);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const diffLines = useMemo(() => [
        { type: "ctx", text: "  const lerp = 0.05;" },
        { type: "del", text: "- const damping = 10;" },
        { type: "add", text: "+ const damping = 25;" },
        { type: "ctx", text: "  const stiffness = 300;" },
        { type: "del", text: "- const mass = 1;" },
        { type: "add", text: "+ const mass = 3; // Heavy mechanical feel" },
        { type: "ctx", text: "" },
        { type: "add", text: "+ // Spring dampener for IDE divider" },
        { type: "add", text: "+ const springConfig = { mass, damping, stiffness };" },
    ], []);

    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < diffLines.length) {
                setLines(prev => [...prev, diffLines[i].type + ":" + diffLines[i].text]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [isInView, diffLines]);

    return (
        <div ref={ref} className="bg-[#050505] rounded-xl border border-white/[0.06] p-5 font-mono text-[10px] leading-[1.8]">
            <div className="flex items-center gap-2 mb-4">
                <Code className="w-3 h-3 text-gold" />
                <span className="text-[8px] text-gold tracking-[0.3em]">CODE REVIEW — LIVE</span>
            </div>
            {lines.map((line, i) => {
                const [type, ...textParts] = line.split(":");
                const text = textParts.join(":");
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`px-2 ${type === "add" ? "text-emerald-400 bg-emerald-400/[0.05]" : type === "del" ? "text-red-400 bg-red-400/[0.05]" : "text-white/60"}`}
                    >
                        {text}
                    </motion.div>
                );
            })}
            <div className="mt-2 text-gold/40 animate-pulse">▮</div>
        </div>
    );
}

/* ═══ Main Page ═══ */
export default function NodeHubPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const filteredThreads = searchQuery
        ? NODE_THREADS.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        : NODE_THREADS;

    // Bento grid spans
    const bentoSpans = [
        "col-span-2 row-span-2",
        "col-span-1 row-span-1",
        "col-span-1 row-span-2",
        "col-span-1 row-span-1",
        "col-span-2 row-span-1",
        "col-span-1 row-span-1",
    ];

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden">
            {/* Oil Fluid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, 1.5]}>
                    <Suspense fallback={null}><NodeHubScene /></Suspense>
                </Canvas>
            </div>

            {/* ═══ Section 1: Live Transmissions Ticker ═══ */}
            <div className="sticky top-16 z-30 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.04] overflow-hidden">
                <div className="flex animate-[ticker_30s_linear_infinite]">
                    {[...SYSTEM_TICKER_UPDATES, ...SYSTEM_TICKER_UPDATES].map((update, i) => (
                        <span key={i} className="shrink-0 px-8 py-2 font-mono text-[9px] text-gold/70 tracking-[0.2em] whitespace-nowrap">
                            ◆ {update}
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative z-10 px-6 md:px-12 pt-24 pb-32">
                {/* Intro */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
                    <p className="font-mono text-[10px] text-gold tracking-[0.5em] mb-4">02 — THE NETWORK</p>
                    <DecryptedText as="h1" text="NODE HUB" className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-3 drop-shadow-lg" />
                    <DecryptedText as="p" text="Elite frequency — live design-engineering transmissions." className="font-mono text-sm text-white/80 tracking-wider mb-8" />

                    {/* Search */}
                    <div className="relative mb-8 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 stroke-[1]" />
                        <input type="text" placeholder="Search threads, tags, architects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-12 py-3.5 font-mono text-sm text-white/90 placeholder:text-white/70 focus:outline-none focus:border-gold/30 transition-colors" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-white/80 tracking-wider bg-white/[0.04] px-2 py-1 rounded">⌘K</span>
                    </div>
                </motion.div>

                {/* ═══ Section 2: Bento Grid ═══ */}
                <div className="mb-20">
                    <div className="flex items-center gap-2 mb-8">
                        <Terminal className="w-3.5 h-3.5 text-gold stroke-[1]" />
                        <span className="font-mono text-[9px] text-gold tracking-[0.3em]">ACTIVE THREADS</span>
                    </div>

                    <div className="grid grid-cols-3 auto-rows-[200px] gap-4">
                        {filteredThreads.map((thread, i) => (
                            <BentoThreadCard
                                key={thread.id}
                                thread={thread}
                                span={bentoSpans[i % bentoSpans.length]}
                            />
                        ))}
                    </div>
                </div>

                {/* ═══ Section 3: Architect Leaderboard + Section 4: Code Review ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    {/* Leaderboard */}
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Radio className="w-3.5 h-3.5 text-gold stroke-[1]" />
                            <span className="font-mono text-[9px] text-gold tracking-[0.3em]">ARCHITECT LEADERBOARD</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TOP_CONTRIBUTORS.map((c, i) => (
                                <GlitchContributorCard key={c.id} contributor={c} index={i} />
                            ))}
                        </div>
                    </div>

                    {/* Bespoke Feedback / Code Review */}
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Code className="w-3.5 h-3.5 text-gold stroke-[1]" />
                            <span className="font-mono text-[9px] text-gold tracking-[0.3em]">BESPOKE FEEDBACK</span>
                        </div>
                        <CodeDiffBlock />

                        {/* Live Transmissions mini-feed */}
                        <div className="mt-6 border border-white/[0.06] rounded-xl bg-black/40 backdrop-blur-xl overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/40">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                                <span className="font-mono text-[8px] text-gold tracking-[0.3em]">LIVE FEED</span>
                            </div>
                            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                {LIVE_TRANSMISSIONS.slice(0, 4).map((msg) => (
                                    <motion.div key={msg.id}
                                        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={SPRING_MECH}
                                        className={`p-3 rounded-lg border ${msg.type === "SYSTEM" ? "bg-gold/[0.03] border-gold/10" : msg.type === "CODE" ? "bg-blue-500/[0.03] border-blue-500/10" : "bg-white/[0.02] border-white/[0.04]"}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center font-mono text-[5px] text-gold">{msg.avatar}</div>
                                            <span className="font-mono text-[7px] text-gold/80 tracking-wider">{msg.author}</span>
                                            <span className="font-mono text-[6px] text-white/50 ml-auto">{msg.timestamp}</span>
                                        </div>
                                        {msg.type === "CODE" ?
                                            <pre className="font-mono text-[9px] text-white/80 bg-[#050505] rounded p-2 overflow-x-auto border border-white/[0.04]"><code>{msg.content}</code></pre>
                                            :
                                            <p className="font-mono text-[9px] text-white/70 leading-relaxed">{msg.content}</p>
                                        }
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticker keyframes */}
            <style jsx global>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
