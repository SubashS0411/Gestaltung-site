/* ═══════════════════════════════════════════════════════════════
   GESTALTUNG — Data Layer v3.0
   Elite content for all 5 core pages.
   ═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════
// REGISTRY — The Asset Vault
// ══════════════════════════════════════

export interface RegistryAsset {
  id: string;
  name: string;
  description: string;
  category: "MOTION" | "SCROLL" | "EFFECTS" | "UI" | "LAYOUT" | "DATA";
  framework: "REACT" | "NEXT.JS" | "VANILLA";
  tier: "FREE" | "BLACK EDITION";
  performanceCost: string;
  size: string;
  dependencies: string[];
  downloads: number;
  isNew: boolean;
  previewGradient: string;
  code: string;
}

export const REGISTRY_ASSETS: RegistryAsset[] = [
  {
    id: "R-001",
    name: "Kinetic Scroll Hijacker",
    description: "Full-viewport scroll interception engine with velocity-mapped parallax layers. Hijacks native scroll and replaces it with physics-based momentum using configurable damping curves. Supports nested scroll contexts.",
    category: "SCROLL",
    framework: "NEXT.JS",
    tier: "BLACK EDITION",
    performanceCost: "0.2ms Frame Drop",
    size: "3.8 KB",
    dependencies: ["framer-motion", "lenis"],
    downloads: 18400,
    isNew: false,
    previewGradient: "linear-gradient(135deg, #0a0a08 0%, #1a1510 50%, #0a0a08 100%)",
    code: `"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function KineticScroll({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.95]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ y: y1, scale }} className="absolute inset-0 z-0">
          {/* Background parallax layer */}
        </motion.div>
        <motion.div style={{ y: y2 }} className="relative z-10">
          {children}
        </motion.div>
      </div>
    </section>
  );
}`,
  },
  {
    id: "R-002",
    name: "Liquid WebGL Distort",
    description: "Real-time mesh distortion shader that responds to cursor proximity. Renders a displacement map over any DOM element using a lightweight WebGL canvas overlay. GPU-accelerated with fallback to CSS transforms.",
    category: "EFFECTS",
    framework: "REACT",
    tier: "BLACK EDITION",
    performanceCost: "0.8ms Frame Drop",
    size: "6.2 KB",
    dependencies: ["three", "framer-motion"],
    downloads: 9200,
    isNew: true,
    previewGradient: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)",
    code: `"use client";
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function LiquidDistort({ children, intensity = 0.05 }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) * intensity);
        mouseY.set((e.clientY - rect.top - rect.height / 2) * intensity);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ x: springX, y: springY, rotateX: springY, rotateY: springX }}
      className="transform-gpu will-change-transform"
    >
      {children}
    </motion.div>
  );
}`,
  },
  {
    id: "R-003",
    name: "Magnetic Auth Portal",
    description: "Physics-based authentication form with magnetic field input focusing. Inputs gravitate toward the cursor with spring dynamics. Includes encrypted animation states for loading, success, and error with particle effects.",
    category: "UI",
    framework: "NEXT.JS",
    tier: "FREE",
    performanceCost: "0.1ms Frame Drop",
    size: "4.1 KB",
    dependencies: ["framer-motion", "lucide-react"],
    downloads: 31500,
    isNew: false,
    previewGradient: "linear-gradient(135deg, #0d0d0a 0%, #12100a 100%)",
    code: `"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

export default function MagneticAuth() {
  const [phase, setPhase] = useState("idle");
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 20, stiffness: 200 });
  const sy = useSpring(y, { damping: 20, stiffness: 200 });

  return (
    <motion.form style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width/2) * 0.1);
        y.set((e.clientY - r.top - r.height/2) * 0.1);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      ref={ref}
      className="glass-card p-8 max-w-md mx-auto space-y-6">
      <Lock className="w-6 h-6 text-gold mx-auto" />
      <input placeholder="Callsign" className="w-full bg-white/5 border border-white/10
        rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-gold/30" />
      <button className="w-full py-3 bg-gold/10 border border-gold/30 text-gold
        font-mono text-xs tracking-widest hover:bg-gold hover:text-black transition-all">
        <ArrowRight className="w-4 h-4 inline mr-2" />INITIALIZE
      </button>
    </motion.form>
  );
}`,
  },
  {
    id: "R-004",
    name: "Void Gradient Mesh",
    description: "Animated CSS gradient mesh background with 6 control points. Each point orbits on unique sine wave paths creating an organic, breathing background. Zero-dependency, pure CSS animation with GPU compositing.",
    category: "EFFECTS",
    framework: "VANILLA",
    tier: "FREE",
    performanceCost: "0.05ms Frame Drop",
    size: "1.4 KB",
    dependencies: [],
    downloads: 44200,
    isNew: false,
    previewGradient: "conic-gradient(from 180deg at 50% 50%, #050505 0%, rgba(212,175,55,0.03) 25%, #050505 50%, rgba(212,175,55,0.02) 75%, #050505 100%)",
    code: `.gradient-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(170,140,44,0.02) 0%, transparent 50%);
  animation: meshShift 20s ease-in-out infinite alternate;
}
@keyframes meshShift {
  0% { background-position: 0% 0%, 100% 0%, 50% 100%; }
  100% { background-position: 100% 100%, 0% 100%, 50% 0%; }
}`,
  },
  {
    id: "R-005",
    name: "Neural Data Table",
    description: "High-density data table component with row-level hover highlighting, sortable columns, gold accent on active sort, and smooth scroll virtualization for 10K+ rows. Built for dashboards and analytics.",
    category: "DATA",
    framework: "REACT",
    tier: "BLACK EDITION",
    performanceCost: "0.3ms Frame Drop",
    size: "5.7 KB",
    dependencies: ["framer-motion"],
    downloads: 12800,
    isNew: true,
    previewGradient: "linear-gradient(180deg, #080808 0%, #050505 100%)",
    code: `"use client";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";

export default function NeuralTable({ columns, data, onSort }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="bg-white/[0.03]">
            {columns.map(col => (
              <th key={col.key} onClick={() => onSort?.(col.key)}
                className="px-4 py-3 text-left font-mono text-[9px] text-gold/80
                  tracking-widest cursor-pointer hover:text-gold group">
                {col.label}
                <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr key={i} whileHover={{ backgroundColor: "rgba(212,175,55,0.03)" }}
              className="border-t border-white/[0.04] transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 font-mono text-xs text-white/80">
                  {row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
  },
  {
    id: "R-006",
    name: "Cinematic Page Transition",
    description: "Full-screen curtain wipe transition system for Next.js App Router. Supports directional wipes (horizontal, vertical, diagonal) with configurable easing. Includes route-aware preloading and skeleton state management.",
    category: "MOTION",
    framework: "NEXT.JS",
    tier: "BLACK EDITION",
    performanceCost: "0.4ms Frame Drop",
    size: "4.9 KB",
    dependencies: ["framer-motion", "next/navigation"],
    downloads: 7600,
    isNew: true,
    previewGradient: "linear-gradient(135deg, #050505 0%, #0a0a08 50%, #050505 100%)",
    code: `"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  initial: { clipPath: "inset(0 0 100% 0)" },
  animate: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { clipPath: "inset(100% 0 0 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={variants}
        initial="initial" animate="animate" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`,
  },
];

// ══════════════════════════════════════
// NODE HUB — Elite Community
// ══════════════════════════════════════

export interface Thread {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  timestamp: string;
  tags: string[];
  replies: number;
  likes: number;
  hot: boolean;
  status: "OPEN" | "RESOLVED" | "PINNED";
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributions: number;
  streak: number;
  specialty: string;
}

export interface LiveTransmission {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: "MESSAGE" | "CODE" | "REVIEW" | "SYSTEM";
}

export const NODE_THREADS: Thread[] = [
  {
    id: "T-001", author: "CIPHER-7", avatar: "C7", role: "CORE ARCHITECT",
    title: "Optimizing Framer Motion layoutId for mobile 120Hz displays?",
    content: "On ProMotion displays, layoutId transitions show micro-jank at the 83ms boundary. I've profiled the reflow cascade — it's the measurement phase that's bottlenecking. Has anyone tried deferring the layout read to a rAF callback with useLayoutEffect?",
    timestamp: "12m ago", tags: ["#PERFORMANCE", "#MOTION", "#MOBILE"], replies: 23, likes: 89, hot: true, status: "OPEN",
  },
  {
    id: "T-002", author: "VOID-ARCHITECT", avatar: "VA", role: "VISUAL ENGINEER",
    title: "Custom shader pipeline for backdrop-blur on Firefox",
    content: "Firefox still doesn't support backdrop-filter with hardware acceleration. I've built a custom SVG filter chain that achieves 90% visual parity at 0.3ms cost. Sharing the implementation for peer review.",
    timestamp: "1h ago", tags: ["#SHADERS", "#CSS", "#FIREFOX"], replies: 45, likes: 134, hot: true, status: "OPEN",
  },
  {
    id: "T-003", author: "GOLD-STANDARD", avatar: "GS", role: "DESIGN LEAD",
    title: "Variable font optical sizing for dark interfaces — solved",
    content: "After 6 months of testing: Playfair Display needs +0.02em letter-spacing at weights below 500 on dark backgrounds. The counter-forms collapse visually. Also discovered that text-rendering: geometricPrecision actually improves gold gradient legibility by 15%.",
    timestamp: "3h ago", tags: ["#TYPOGRAPHY", "#DESIGN", "#A11Y"], replies: 67, likes: 201, hot: true, status: "RESOLVED",
  },
  {
    id: "T-004", author: "ARCHITECT-X", avatar: "AX", role: "PROTOCOL DESIGNER",
    title: "Next.js 14 streaming SSR with Framer Motion — edge cases",
    content: "When using streaming SSR with AnimatePresence, the initial server-rendered frame can flash before the client hydrates the motion values. The fix: suppressHydrationWarning on the motion wrapper + initial={{ opacity: 0 }} with a client-only mount check.",
    timestamp: "5h ago", tags: ["#NEXTJS", "#SSR", "#HYDRATION"], replies: 31, likes: 78, hot: false, status: "RESOLVED",
  },
  {
    id: "T-005", author: "NODE-451", avatar: "N4", role: "SYSTEMS DEV",
    title: "Lenis + React-Three-Fiber scroll conflicts",
    content: "When Lenis and R3F's ScrollControls coexist, the wheel events fight for control. Solution: disable Lenis smoothWheel within the R3F canvas bounds using a MutationObserver to detect the canvas mount, then pipe events through a unified dispatcher.",
    timestamp: "8h ago", tags: ["#SCROLL", "#THREE", "#LENIS"], replies: 19, likes: 56, hot: false, status: "OPEN",
  },
  {
    id: "T-006", author: "CRYSTAL-NODE", avatar: "CN", role: "UI ENGINEER",
    title: "Zero-layout-shift image loading with blurhash + SQIP",
    content: "Combining blurhash (for color) with SQIP (for structure) gives you a 98% perceived-instant image load. The trick is generating the SQIP at build time and inlining it as a data URI in the initial SSR payload. Images appear to 'materialize' rather than pop in.",
    timestamp: "14h ago", tags: ["#IMAGES", "#PERFORMANCE", "#UX"], replies: 42, likes: 167, hot: false, status: "PINNED",
  },
];

export const TOP_CONTRIBUTORS: Contributor[] = [
  { id: "C-001", name: "CIPHER-7", avatar: "C7", role: "CORE ARCHITECT", contributions: 342, streak: 47, specialty: "Motion Physics" },
  { id: "C-002", name: "VOID-ARCHITECT", avatar: "VA", role: "VISUAL ENGINEER", contributions: 289, streak: 31, specialty: "Shader Systems" },
  { id: "C-003", name: "GOLD-STANDARD", avatar: "GS", role: "DESIGN LEAD", contributions: 256, streak: 62, specialty: "Typography" },
  { id: "C-004", name: "ARCHITECT-X", avatar: "AX", role: "PROTOCOL DESIGNER", contributions: 198, streak: 28, specialty: "SSR Patterns" },
  { id: "C-005", name: "NODE-451", avatar: "N4", role: "SYSTEMS DEV", contributions: 167, streak: 15, specialty: "Performance" },
];

export const LIVE_TRANSMISSIONS: LiveTransmission[] = [
  { id: "L-001", author: "CIPHER-7", avatar: "C7", content: "Just pushed a fix for the layoutId jank — wrapping the measurement in startTransition cuts reflow by 40%.", timestamp: "2m ago", type: "MESSAGE" },
  { id: "L-002", author: "SYSTEM", avatar: "SY", content: "REGISTRY: 3 new components deployed to production. Build time: 1.2s.", timestamp: "5m ago", type: "SYSTEM" },
  { id: "L-003", author: "VOID-ARCHITECT", avatar: "VA", content: "Requesting peer review on the Firefox blur shim. Branch: feat/svg-blur-fallback", timestamp: "8m ago", type: "REVIEW" },
  { id: "L-004", author: "GOLD-STANDARD", avatar: "GS", content: "const opticalAdjust = weight < 500 ? '0.02em' : '0em';\n// Apply to all headings on dark bg", timestamp: "15m ago", type: "CODE" },
  { id: "L-005", author: "NODE-451", avatar: "N4", content: "Benchmarked the Lenis dispatcher — unified scroll handling reduces event listeners from 12 to 1. Memory footprint down 60%.", timestamp: "22m ago", type: "MESSAGE" },
  { id: "L-006", author: "SYSTEM", avatar: "SY", content: "ACADEMY: 'Architecting the Void' course updated — 2 new chapters on R3F post-processing.", timestamp: "30m ago", type: "SYSTEM" },
];

// ══════════════════════════════════════
// ACADEMY — Masterclasses
// ══════════════════════════════════════

export interface Masterclass {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  instructorRole: string;
  duration: string;
  difficulty: "FOUNDATION" | "ENGINEER" | "ARCHITECT";
  lessons: number;
  students: number;
  accentColor: string;
  tags: string[];
  chapters: string[];
  image: string;
}

export const MASTERCLASSES: Masterclass[] = [
  {
    id: "M-001",
    title: "Architecting the Void",
    subtitle: "Advanced React Three Fiber & WebGL",
    description: "Master the art of 3D rendering in React. From custom shaders to post-processing pipelines, build cinematic experiences that blur the line between web and film. Every frame is a composition.",
    instructor: "CIPHER-7",
    instructorRole: "Gestaltung Core Team",
    duration: "04:12:00",
    difficulty: "ARCHITECT",
    lessons: 16,
    students: 2400,
    accentColor: "#D4AF37",
    tags: ["WEBGL", "R3F", "SHADERS", "3D"],
    chapters: ["The Void Canvas", "Geometry as Language", "Custom Shader Materials", "Post-Processing Stack", "Performance at 60fps"],
    image: "/images/gold-neural-streams.png",
  },
  {
    id: "M-002",
    title: "Fluid Typography & Micro-Interactions",
    subtitle: "The Science of Typographic Motion",
    description: "Typography is not decoration — it is architecture. Learn variable font animation, optical sizing for dark interfaces, split-text reveals, and the mathematics of reading rhythm. Make every letter breathe.",
    instructor: "GOLD-STANDARD",
    instructorRole: "Gestaltung Core Team",
    duration: "03:45:00",
    difficulty: "ENGINEER",
    lessons: 12,
    students: 3100,
    accentColor: "#F3E5AB",
    tags: ["TYPOGRAPHY", "ANIMATION", "VARIABLE-FONTS", "UX"],
    chapters: ["Type as Architecture", "Variable Font Mastery", "Split-Text Choreography", "Micro-Interaction Physics"],
    image: "/images/gold-hexagon-grid.png",
  },
  {
    id: "M-003",
    title: "The Scroll Protocol",
    subtitle: "Physics-Based Navigation Systems",
    description: "Scroll is the most intimate interaction on the web. Master Lenis configuration, velocity-mapped parallax, scroll-linked state machines, and the art of making interfaces feel heavy, expensive, and inevitable.",
    instructor: "VOID-ARCHITECT",
    instructorRole: "Gestaltung Core Team",
    duration: "05:30:00",
    difficulty: "ARCHITECT",
    lessons: 20,
    students: 1800,
    accentColor: "#AA8C2C",
    tags: ["SCROLL", "LENIS", "PARALLAX", "PHYSICS"],
    chapters: ["Scroll as Material", "Lenis Deep Configuration", "Velocity-Mapped Parallax", "Scroll State Machines", "The Heavy Interface"],
    image: "/images/gold-pulse-particles.png",
  },
  {
    id: "M-004",
    title: "Dark Interface Systems",
    subtitle: "Design Engineering for Premium UX",
    description: "Build design systems for the void. From glassmorphism depth stacking to noise textures, vignettes, and the mathematics of the Void & Gold palette. Every pixel must breathe. If it looks like a dashboard, you have failed.",
    instructor: "ARCHITECT-X",
    instructorRole: "Gestaltung Core Team",
    duration: "04:00:00",
    difficulty: "ENGINEER",
    lessons: 14,
    students: 4200,
    accentColor: "#8A7E5E",
    tags: ["DESIGN-SYSTEMS", "GLASSMORPHISM", "COLOR", "DARK-UI"],
    chapters: ["The Void Philosophy", "Glassmorphism Depth", "Noise & Texture", "Gold as Language"],
    image: "/images/node-fiber.png",
  },
];

// ══════════════════════════════════════
// FOUNDRY — The Laboratory
// ══════════════════════════════════════

export const FOUNDRY_DEFAULT_CODE = `"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══ Gold Particle Burst Button ═══
// Click to emit particles. Customizable via props.

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
}

export default function ParticleBurstButton() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  let counter = 0;

  const emit = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newParticles = Array.from({ length: 12 }, () => ({
      id: counter++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      angle: Math.random() * Math.PI * 2,
      velocity: 2 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.includes(p))
      );
    }, 800);
  };

  return (
    <button
      ref={buttonRef}
      onClick={emit}
      className="relative overflow-hidden px-12 py-4
        bg-gold/10 border border-gold/30 text-gold
        font-mono text-sm tracking-widest
        hover:bg-gold hover:text-black
        transition-all duration-500"
    >
      SYNTHESIZE
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              x: p.x, y: p.y,
              scale: 1, opacity: 1,
            }}
            animate={{
              x: p.x + Math.cos(p.angle) * p.velocity * 30,
              y: p.y + Math.sin(p.angle) * p.velocity * 30,
              scale: 0, opacity: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-1 h-1 rounded-full bg-gold"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}`;

export const FOUNDRY_COMMANDS = [
  { label: "Deploy Component", shortcut: "⌘+D", action: "deploy" },
  { label: "Run Diagnostics", shortcut: "⌘+R", action: "diagnose" },
  { label: "Inject Styling", shortcut: "⌘+S", action: "style" },
  { label: "Export Protocol", shortcut: "⌘+E", action: "export" },
  { label: "Toggle Preview", shortcut: "⌘+P", action: "preview" },
  { label: "Clear Console", shortcut: "⌘+K", action: "clear" },
];

// ══════════════════════════════════════
// ABOUT — The Manifesto
// ══════════════════════════════════════

export const MANIFESTO_LINES = [
  { type: "heading" as const, text: "CODE IS THE NEW LUXURY MATERIAL." },
  { type: "body" as const, text: "We reject the doctrine of 'move fast and break things.' We build with the precision of Swiss watchmakers and the atmosphere of Brutalist architects. Every interface we create is a synthesis of engineering discipline and visual poetry." },
  { type: "body" as const, text: "In an ocean of generic templates and disposable UI kits, we stand as the uncompromising alternative. Our protocols are not designed for everyone — they are engineered for the 1% of developers who understand that a 2-pixel misalignment is a structural failure, not a cosmetic issue." },
  { type: "heading" as const, text: "THE VOID IS NOT EMPTY. IT IS PRECISE." },
  { type: "body" as const, text: "The void (#050505) is not absence — it is the most intentional design decision in our system. It is the canvas upon which every gold particle, every glassmorphic surface, and every typographic choice gains its meaning. Without the void, there is no atmosphere." },
  { type: "body" as const, text: "Our motion protocols are not decorative. A 0.06 lerp scroll feel is the result of 47 tested configurations across 12 devices. A 700ms hover transition is calibrated to match the cognitive threshold between 'instant' and 'perceived.' Nothing is arbitrary." },
  { type: "heading" as const, text: "WE ARE ARCHITECTS, NOT ASSEMBLERS." },
  { type: "body" as const, text: "Gestaltung exists for those who see code as bespoke digital architecture. We don't drag and drop — we compose. We don't configure — we engineer. Every component in our Registry has been stress-tested at 240fps, profiled for memory leaks, and validated against the highest visual standards on Earth." },
  { type: "body" as const, text: "This is not a platform. It is a protocol. And you are now part of it." },
];

export const ABOUT_TIMELINE = [
  { year: "2024", event: "Protocol conceived. First void experiments. The gold palette is calibrated.", phase: "GENESIS" },
  { year: "2025", event: "Black Edition framework established. Lenis integration. Registry v1.0 launches with 12 components.", phase: "FOUNDATION" },
  { year: "2026", event: "Full protocol deployment. Neural Hub live. Academy opens. 200+ components. Global collective of 4,000+ architects.", phase: "SYNTHESIS" },
];

export const ABOUT_PRINCIPLES = [
  { title: "SYNTHESIS", desc: "Every element exists in relation to every other. Isolation is a design failure.", icon: "hexagon" },
  { title: "PRECISION", desc: "Sub-pixel accuracy. 0.02em letter-spacing adjustments. Nothing is approximate.", icon: "target" },
  { title: "ATMOSPHERE", desc: "If it doesn't feel cinematic, it doesn't ship. Texture, depth, weight.", icon: "eye" },
  { title: "UNCOMPROMISING", desc: "We do not negotiate on quality. A 95% component is a 0% component.", icon: "shield" },
];

// ══════════════════════════════════════
// System Updates (Dashboard Feed)
// ══════════════════════════════════════

export const SYSTEM_UPDATES = [
  { id: "U-001", type: "RELEASE" as const, message: "Registry v2.4.0 — Kinetic Scroll Hijacker & Neural Data Table shipped", time: "1h ago" },
  { id: "U-002", type: "NODE" as const, message: "CIPHER-7 posted: Optimizing layoutId for 120Hz — 23 replies in 12 minutes", time: "2h ago" },
  { id: "U-003", type: "SYSTEM" as const, message: "Infrastructure upgrade complete — global latency reduced to 8ms avg", time: "4h ago" },
  { id: "U-004", type: "RELEASE" as const, message: "Academy: 'Architecting the Void' course — 2 new chapters deployed", time: "6h ago" },
  { id: "U-005", type: "ALERT" as const, message: "NODE-256 (OBSIDIAN CORE) maintenance window: 02:00–04:00 UTC", time: "8h ago" },
];

// Re-export legacy types for backward compat
export type { RegistryAsset as RegistryItem };
export type Node = Thread;
export type AcademyCourse = Masterclass;
export const NODES = NODE_THREADS;
export const REGISTRY_ITEMS = REGISTRY_ASSETS;
export const ACADEMY_COURSES = MASTERCLASSES;
