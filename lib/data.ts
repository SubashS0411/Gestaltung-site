/* ═══════════════════════════════════════════════════════════════
   GESTALTUNG — Data Layer v4.0
   Elite content for all 6 core pages — Full-Scale Expansion.
   ═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════
// HOME — Z-Axis Cinematic Narrative
// ══════════════════════════════════════

export const PHILOSOPHY_LINES = [
  "WE DO NOT DESIGN.",
  "WE CALCULATE.",
  "Every pixel is an equation.",
  "Every transition is a proof.",
  "Every interface is a theorem.",
  "Beauty is the byproduct of precision.",
];

export const ARSENAL_ITEMS = [
  { id: "A-001", label: "CODE", description: "Engineered architectures that breathe.", shape: "torus" as const },
  { id: "A-002", label: "DESIGN", description: "Composition as mathematical certainty.", shape: "icosahedron" as const },
  { id: "A-003", label: "LOGIC", description: "State machines with zero ambiguity.", shape: "octahedron" as const },
];

export const GLOBAL_GRID_NODES = [
  { id: "N-01", x: 22, y: 35, label: "TOKYO", architects: 342, active: true },
  { id: "N-02", x: 48, y: 28, label: "BERLIN", architects: 289, active: true },
  { id: "N-03", x: 75, y: 42, label: "SAN FRANCISCO", architects: 456, active: true },
  { id: "N-04", x: 55, y: 55, label: "DUBAI", architects: 178, active: true },
  { id: "N-05", x: 35, y: 60, label: "MUMBAI", architects: 234, active: false },
  { id: "N-06", x: 80, y: 25, label: "LONDON", architects: 312, active: true },
  { id: "N-07", x: 15, y: 50, label: "SYDNEY", architects: 145, active: true },
  { id: "N-08", x: 62, y: 68, label: "SÃO PAULO", architects: 198, active: false },
  { id: "N-09", x: 42, y: 18, label: "STOCKHOLM", architects: 167, active: true },
  { id: "N-10", x: 30, y: 45, label: "SINGAPORE", architects: 223, active: true },
];

// ══════════════════════════════════════
// REGISTRY — The Asset Vault
// ══════════════════════════════════════

export interface RegistryAsset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
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
    description: "Full-viewport intercept engine with velocity-mapped parallax layers. Replaces native scroll with configurable physics-based momentum.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
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
    description: "Real-time displacement shader responding to cursor proximity. GPU-accelerated liquid mesh overlay for DOM elements.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
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
    description: "Physics-based authentication form. Inputs gravitate toward the cursor with spring dynamics and encrypted animation states.",
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop",
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
    description: "Animated CSS gradient mesh with 6 control points orbiting on sine paths. Pure CSS architecture, zero dependencies.",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop",
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
    description: "High-density data matrix. Row-level spatial highlighting, kinetic sorting, and 10K+ row smooth virtualization.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
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
    description: "Full-screen curtain wipe engine for App Router. Directional wipes with configurable timeline easing and preloading.",
    imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
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
  {
    id: "R-007",
    name: "Magnetic Navbar",
    description: "Navigation elements pull toward cursor with mass and tension physics, emitting gold particle trails on deep interactions.",
    imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop",
    category: "UI",
    framework: "NEXT.JS",
    tier: "BLACK EDITION",
    performanceCost: "0.15ms Frame Drop",
    size: "5.3 KB",
    dependencies: ["framer-motion", "lucide-react"],
    downloads: 22100,
    isNew: true,
    previewGradient: "linear-gradient(180deg, rgba(212,175,55,0.06) 0%, #050505 100%)",
    code: `"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function MagneticLink({ children, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 300 });
  const sy = useSpring(y, { damping: 15, stiffness: 300 });

  return (
    <motion.a ref={ref} href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative font-mono text-xs text-white/80 hover:text-gold
        tracking-[0.2em] transition-colors transform-gpu">
      {children}
    </motion.a>
  );
}`,
  },
  {
    id: "R-008",
    name: "WebGL Distortion Button",
    description: "Interactive element with real-time ripple displacement mapping. Click triggers a radial shockwave at the contact point.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop",
    category: "EFFECTS",
    framework: "REACT",
    tier: "BLACK EDITION",
    performanceCost: "1.2ms Frame Drop",
    size: "7.8 KB",
    dependencies: ["three", "framer-motion"],
    downloads: 6800,
    isNew: true,
    previewGradient: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.12) 0%, #050505 60%)",
    code: `"use client";
import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function DistortionButton({ children, onClick }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });
  const scale = useSpring(1, { damping: 20, stiffness: 300 });

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  return (
    <motion.button ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => scale.set(1.05)}
      onMouseLeave={() => { scale.set(1); mouseX.set(0.5); mouseY.set(0.5); }}
      onMouseDown={() => scale.set(0.97)}
      onMouseUp={() => scale.set(1.05)}
      onClick={onClick}
      style={{ scale }}
      className="relative overflow-hidden px-10 py-4 bg-gold/10 border
        border-gold/30 text-gold font-mono text-sm tracking-widest
        hover:bg-gold hover:text-black transition-all transform-gpu">
      <motion.div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.3)_0%,transparent_60%)]
        pointer-events-none opacity-0 hover:opacity-100"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%", width: "200%", height: "200%" }} />
      {children}
    </motion.button>
  );
}`,
  },
];

// ═══ Recently Decrypted — Dense list for Registry page ═══
export const RECENTLY_DECRYPTED = [
  { id: "RD-001", name: "Parallax Depth Stack", category: "SCROLL", author: "CIPHER-7", date: "2h ago", downloads: 3400, preview: "/images/gold-neural-streams.png" },
  { id: "RD-002", name: "Glassmorphic Modal", category: "UI", author: "VOID-ARCHITECT", date: "4h ago", downloads: 5200, preview: "/images/gold-hexagon-grid.png" },
  { id: "RD-003", name: "Noise Grain Overlay", category: "EFFECTS", author: "GOLD-STANDARD", date: "6h ago", downloads: 8900, preview: "/images/gold-pulse-particles.png" },
  { id: "RD-004", name: "Spring Mass Slider", category: "MOTION", author: "NODE-451", date: "8h ago", downloads: 2100, preview: "/images/node-fiber.png" },
  { id: "RD-005", name: "Void Card Skeleton", category: "UI", author: "ARCHITECT-X", date: "12h ago", downloads: 6700, preview: "/images/gold-neural-streams.png" },
  { id: "RD-006", name: "Chromatic Text Hover", category: "EFFECTS", author: "CRYSTAL-NODE", date: "1d ago", downloads: 4300, preview: "/images/gold-hexagon-grid.png" },
  { id: "RD-007", name: "Inertia Table Sort", category: "DATA", author: "CIPHER-7", date: "1d ago", downloads: 3800, preview: "/images/gold-pulse-particles.png" },
  { id: "RD-008", name: "Scroll-Linked Loader", category: "SCROLL", author: "VOID-ARCHITECT", date: "2d ago", downloads: 5600, preview: "/images/node-fiber.png" },
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
  imageUrl: string;
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
    title: "LayoutId jank on 120Hz Displays",
    content: "Measurement phase bottleneck resolved by deferring layout read to a rAF callback with useLayoutEffect. Cuts reflow by 40%.",
    timestamp: "12m ago", tags: ["#PERFORMANCE", "#MOTION", "#MOBILE"], replies: 23, likes: 89, hot: true, status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "T-002", author: "VOID-ARCHITECT", avatar: "VA", role: "VISUAL ENGINEER",
    title: "Custom Backdrop Blur Shader Stack",
    content: "Built a custom SVG filter chain for Firefox that achieves 90% visual parity with hardware backdrop-filter at 0.3ms cost.",
    timestamp: "1h ago", tags: ["#SHADERS", "#CSS", "#FIREFOX"], replies: 45, likes: 134, hot: true, status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop",
  },
  {
    id: "T-003", author: "GOLD-STANDARD", avatar: "GS", role: "DESIGN LEAD",
    title: "Variable Font Sizing for Dark Interfaces",
    content: "Playfair Display requires +0.02em letter-spacing at weights below 500 on dark backgrounds to prevent counter-form collapse.",
    timestamp: "3h ago", tags: ["#TYPOGRAPHY", "#DESIGN", "#A11Y"], replies: 67, likes: 201, hot: true, status: "RESOLVED",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "T-004", author: "ARCHITECT-X", avatar: "AX", role: "PROTOCOL DESIGNER",
    title: "Edge SSR Streaming & Framer Motion",
    content: "SuppressHydrationWarning + initial={{ opacity: 0 }} solves the initial frame flash before client motion values hydrate.",
    timestamp: "5h ago", tags: ["#NEXTJS", "#SSR", "#HYDRATION"], replies: 31, likes: 78, hot: false, status: "RESOLVED",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "T-005", author: "NODE-451", avatar: "N4", role: "SYSTEMS DEV",
    title: "Lenis + R3F Scroll Conflict Unification",
    content: "Disabled Lenis smoothWheel within R3F canvas bounds and routed wheel events through a unified central dispatcher.",
    timestamp: "8h ago", tags: ["#SCROLL", "#THREE", "#LENIS"], replies: 19, likes: 56, hot: false, status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "T-006", author: "CRYSTAL-NODE", avatar: "CN", role: "UI ENGINEER",
    title: "Zero-CLS Blurhash Image Loading",
    content: "Generating SQIP at build time and inlining as data URI in initial SSR payload creates a 98% perceived-instant load.",
    timestamp: "14h ago", tags: ["#IMAGES", "#PERFORMANCE", "#UX"], replies: 42, likes: 167, hot: false, status: "PINNED",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop",
  },
];

export const TOP_CONTRIBUTORS: Contributor[] = [
  { id: "C-001", name: "CIPHER-7", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2667&auto=format&fit=crop", role: "CORE ARCHITECT", contributions: 342, streak: 47, specialty: "Motion Physics" },
  { id: "C-002", name: "VOID-ARCHITECT", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop", role: "VISUAL ENGINEER", contributions: 289, streak: 31, specialty: "Shader Systems" },
  { id: "C-003", name: "GOLD-STANDARD", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop", role: "DESIGN LEAD", contributions: 256, streak: 62, specialty: "Typography" },
  { id: "C-004", name: "ARCHITECT-X", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop", role: "PROTOCOL DESIGNER", contributions: 198, streak: 28, specialty: "SSR Patterns" },
  { id: "C-005", name: "NODE-451", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop", role: "SYSTEMS DEV", contributions: 167, streak: 15, specialty: "Performance" },
];

export const LIVE_TRANSMISSIONS: LiveTransmission[] = [
  { id: "L-001", author: "CIPHER-7", avatar: "C7", content: "Just pushed a fix for the layoutId jank — wrapping the measurement in startTransition cuts reflow by 40%.", timestamp: "2m ago", type: "MESSAGE" },
  { id: "L-002", author: "SYSTEM", avatar: "SY", content: "REGISTRY: 3 new components deployed to production. Build time: 1.2s.", timestamp: "5m ago", type: "SYSTEM" },
  { id: "L-003", author: "VOID-ARCHITECT", avatar: "VA", content: "Requesting peer review on the Firefox blur shim. Branch: feat/svg-blur-fallback", timestamp: "8m ago", type: "REVIEW" },
  { id: "L-004", author: "GOLD-STANDARD", avatar: "GS", content: "const opticalAdjust = weight < 500 ? '0.02em' : '0em';\n// Apply to all headings on dark bg", timestamp: "15m ago", type: "CODE" },
  { id: "L-005", author: "NODE-451", avatar: "N4", content: "Benchmarked the Lenis dispatcher — unified scroll handling reduces event listeners from 12 to 1. Memory footprint down 60%.", timestamp: "22m ago", type: "MESSAGE" },
  { id: "L-006", author: "SYSTEM", avatar: "SY", content: "ACADEMY: 'Architecting the Void' course updated — 2 new chapters on R3F post-processing.", timestamp: "30m ago", type: "SYSTEM" },
];

export const SYSTEM_TICKER_UPDATES = [
  "REGISTRY v2.4.0 deployed — 2 new BLACK EDITION components",
  "CIPHER-7 earned ARCHITECT rank — 342 contributions",
  "NODE-451 resolved Lenis scroll conflict — merged to main",
  "ACADEMY: 'Architecting the Void' — Chapter 6 live",
  "SYSTEM: Global latency reduced to 8ms avg",
  "GOLD-STANDARD published Typography Research #47",
  "FOUNDRY: Component injection protocol updated",
  "VOID-ARCHITECT pushed Firefox blur shim v2.1",
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
    description: "Master real-time rendering in React. Create post-processing pipelines and cinematic WebGL experiences that blur the line between web and film.",
    instructor: "CIPHER-7",
    instructorRole: "Gestaltung Core Team",
    duration: "04:12:00",
    difficulty: "ARCHITECT",
    lessons: 16,
    students: 2400,
    accentColor: "#D4AF37",
    tags: ["WEBGL", "R3F", "SHADERS", "3D"],
    chapters: ["The Void Canvas", "Geometry as Language", "Custom Shader Materials", "Post-Processing Stack", "Performance at 60fps"],
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: "M-002",
    title: "Fluid Typography & Micro-Interactions",
    subtitle: "The Science of Typographic Motion",
    description: "Learn variable font animation, optical sizing for dark interfaces, and split-text typography reveals. Make every letter breathe.",
    instructor: "GOLD-STANDARD",
    instructorRole: "Gestaltung Core Team",
    duration: "03:45:00",
    difficulty: "ENGINEER",
    lessons: 12,
    students: 3100,
    accentColor: "#F3E5AB",
    tags: ["TYPOGRAPHY", "ANIMATION", "VARIABLE-FONTS", "UX"],
    chapters: ["Type as Architecture", "Variable Font Mastery", "Split-Text Choreography", "Micro-Interaction Physics"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "M-003",
    title: "The Scroll Protocol",
    subtitle: "Physics-Based Navigation Systems",
    description: "Master Lenis configuration, velocity parallax, and scroll-linked state machines. Create interfaces that feel expensive and inevitable.",
    instructor: "VOID-ARCHITECT",
    instructorRole: "Gestaltung Core Team",
    duration: "05:30:00",
    difficulty: "ARCHITECT",
    lessons: 20,
    students: 1800,
    accentColor: "#AA8C2C",
    tags: ["SCROLL", "LENIS", "PARALLAX", "PHYSICS"],
    chapters: ["Scroll as Material", "Lenis Deep Configuration", "Velocity-Mapped Parallax", "Scroll State Machines", "The Heavy Interface"],
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "M-004",
    title: "Dark Interface Systems",
    subtitle: "Design Engineering for Premium UX",
    description: "Design systems for the void. Depth stacking, noise textures, and the mathematics of the Black Edition palette. Every pixel must breathe.",
    instructor: "ARCHITECT-X",
    instructorRole: "Gestaltung Core Team",
    duration: "04:00:00",
    difficulty: "ENGINEER",
    lessons: 14,
    students: 4200,
    accentColor: "#8A7E5E",
    tags: ["DESIGN-SYSTEMS", "GLASSMORPHISM", "COLOR", "DARK-UI"],
    chapters: ["The Void Philosophy", "Glassmorphism Depth", "Noise & Texture", "Gold as Language"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop",
  },
];

export const INSTRUCTORS = [
  {
    id: "I-001",
    name: "CIPHER-7",
    title: "Lead WebGL Architect",
    bio: "12 years in GPU programming. Former Pixar rendering engineer. Specializes in custom shader pipelines and real-time 3D on the web. Believes every frame is a composition.",
    courses: 3,
    students: 8400,
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2667&auto=format&fit=crop",
    specialty: "WebGL & Shaders",
  },
  {
    id: "I-002",
    name: "GOLD-STANDARD",
    title: "Typography Director",
    bio: "Obsessed with the mathematics of letterforms. 8 years designing type systems for luxury brands. Pioneered optical sizing algorithms for dark interfaces.",
    courses: 2,
    students: 6200,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
    specialty: "Typography & Motion",
  },
  {
    id: "I-003",
    name: "VOID-ARCHITECT",
    title: "Scroll Physics Engineer",
    bio: "Created the Lenis deep configuration guide. Former game physics developer at Naughty Dog. Applies AAA game physics to web interfaces.",
    courses: 4,
    students: 9100,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    specialty: "Scroll & Physics",
  },
];

export const CURRICULUM_NODES = [
  { id: "CH-01", chapter: "01", title: "The Void Canvas", description: "Setup R3F, configure renderer pipeline, establish the void.", completed: true },
  { id: "CH-02", chapter: "02", title: "Geometry as Language", description: "Primitive composition, instanced meshes, buffer geometry.", completed: true },
  { id: "CH-03", chapter: "03", title: "Custom Shader Materials", description: "GLSL fundamentals, uniforms, varyings, noise functions.", completed: true },
  { id: "CH-04", chapter: "04", title: "Post-Processing Stack", description: "Bloom, chromatic aberration, noise, vignette pipelines.", completed: false },
  { id: "CH-05", chapter: "05", title: "Performance at 60fps", description: "Profiling, instancing, LOD, occlusion culling.", completed: false },
  { id: "CH-06", chapter: "06", title: "Scroll-Linked 3D", description: "Connecting Lenis scroll to camera, geometry, and shaders.", completed: false },
  { id: "CH-07", chapter: "07", title: "The Gold Palette", description: "Metallic materials, PBR tuning, environment maps.", completed: false },
  { id: "CH-08", chapter: "08", title: "Final Composition", description: "Scene orchestration, timing, and cinematic delivery.", completed: false },
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
  { label: "Simulate Physics", shortcut: "⌘+F", action: "simulate" },
  { label: "Inject Styling", shortcut: "⌘+S", action: "style" },
  { label: "Export Protocol", shortcut: "⌘+E", action: "export" },
  { label: "Toggle Preview", shortcut: "⌘+P", action: "preview" },
  { label: "Wipe Console", shortcut: "⌘+W", action: "wipe" },
  { label: "Clear Console", shortcut: "⌘+K", action: "clear" },
];

export const FOUNDRY_COMPONENTS = [
  { id: "FC-01", name: "Button", icon: "□", color: "#D4AF37", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
  { id: "FC-02", name: "Card", icon: "▢", color: "#F3E5AB", imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop" },
  { id: "FC-03", name: "Input", icon: "▭", color: "#AA8C2C", imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" },
  { id: "FC-04", name: "Modal", icon: "▣", color: "#D4AF37", imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop" },
  { id: "FC-05", name: "Table", icon: "▦", color: "#F3E5AB", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop" },
  { id: "FC-06", name: "Chart", icon: "◈", color: "#AA8C2C", imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop" },
];

// ══════════════════════════════════════
// ABOUT — The Manifesto
// ══════════════════════════════════════

export const MANIFESTO_LINES = [
  { type: "heading" as const, text: "CODE IS THE NEW LUXURY MATERIAL." },
  { type: "body" as const, text: "We reject the doctrine of 'move fast and break things.' We engineer digital architecture for the 1% who understand that a 2-pixel misalignment is a structural failure, not a cosmetic issue." },
  { type: "heading" as const, text: "THE VOID IS NOT EMPTY. IT IS PRECISE." },
  { type: "body" as const, text: "Every gold particle, every glassmorphic surface, and every 0.06 lerp scroll feel is calibrated to the limit. Nothing is arbitrary." },
  { type: "heading" as const, text: "WE ARE ARCHITECTS, NOT ASSEMBLERS." },
  { type: "body" as const, text: "This is not a platform. It is a protocol. And you are now part of it." },
];

export const ABOUT_TIMELINE = [
  { year: "2024", event: "Protocol conceived. First void experiments. The gold palette is calibrated.", phase: "GENESIS", epoch: "EPOCH I" },
  { year: "2025", event: "Black Edition framework established. Lenis integration. Registry v1.0 launches with 12 components.", phase: "FOUNDATION", epoch: "EPOCH II" },
  { year: "2026", event: "Full protocol deployment. Neural Hub live. Academy opens. 200+ components. Global collective of 4,000+ architects.", phase: "SYNTHESIS", epoch: "EPOCH III" },
];

export const ABOUT_PRINCIPLES = [
  { id: "P-001", title: "SYNTHESIS", description: "Every element exists in relation to every other. Isolation is a design failure.", desc: "Every element exists in relation to every other. Isolation is a design failure.", icon: "hexagon" },
  { id: "P-002", title: "PRECISION", description: "Sub-pixel accuracy. 0.02em letter-spacing adjustments. Nothing is approximate.", desc: "Sub-pixel accuracy. 0.02em letter-spacing adjustments. Nothing is approximate.", icon: "target" },
  { id: "P-003", title: "ATMOSPHERE", description: "If it doesn't feel cinematic, it doesn't ship. Texture, depth, weight.", desc: "If it doesn't feel cinematic, it doesn't ship. Texture, depth, weight.", icon: "eye" },
  { id: "P-004", title: "UNCOMPROMISING", description: "We do not negotiate on quality. A 95% component is a 0% component.", desc: "We do not negotiate on quality. A 95% component is a 0% component.", icon: "shield" },
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
