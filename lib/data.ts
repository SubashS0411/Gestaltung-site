/* ═══════════════════════════════════════════════════════════════
   GESTALTUNG — Mock Data Layer
   The single source of truth for all platform content.
   ═══════════════════════════════════════════════════════════════ */

// ── Types ────────────────────
export interface Node {
    id: string;
    author: string;
    avatar: string;       // initials
    role: string;
    timestamp: string;
    title: string;
    content: string;
    tags: string[];
    likes: number;
    replies: number;
    hot: boolean;
}

export interface RegistryItem {
    id: string;
    name: string;
    description: string;
    category: "MOTION" | "LAYOUT" | "EFFECTS" | "UI" | "SCROLL" | "DATA";
    price: "FREE" | "PRO" | "ENTERPRISE";
    previewBg: string;        // CSS gradient for preview
    size: string;
    dependencies: string[];
    code: string;
    downloads: number;
    isNew: boolean;
}

export interface AcademyCourse {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    lessons: number;
    instructor: string;
    tags: string[];
}

// ── Nodes (Forum Posts) ────────────────────
export const NODES: Node[] = [
    {
        id: "N-001",
        author: "CIPHER-7",
        avatar: "C7",
        role: "CORE ARCHITECT",
        timestamp: "2h ago",
        title: "Scroll Physics: Why lerp 0.06 is the sweet spot",
        content: "After testing 47 different configurations across 12 devices, I've found that a Lenis lerp value of 0.06 with wheelMultiplier 0.8 produces the most premium scroll feel. The key is the deceleration curve — it must feel like inertia, not like braking.",
        tags: ["SCROLL", "PHYSICS", "LENIS"],
        likes: 128,
        replies: 42,
        hot: true,
    },
    {
        id: "N-002",
        author: "VOID-ARCHITECT",
        avatar: "VA",
        role: "VISUAL ENGINEER",
        timestamp: "4h ago",
        title: "Achieving true depth with backdrop-blur stacking",
        content: "Layer your glassmorphism: bg-white/3 → backdrop-blur-sm for far elements, bg-white/8 → backdrop-blur-xl for near elements. The key is maintaining a consistent z-depth language throughout the experience.",
        tags: ["GLASS", "DEPTH", "CSS"],
        likes: 89,
        replies: 28,
        hot: true,
    },
    {
        id: "N-003",
        author: "GOLD-STANDARD",
        avatar: "GS",
        role: "DESIGN LEAD",
        timestamp: "6h ago",
        title: "The mathematics of the Void & Gold palette",
        content: "Our palette isn't random. #050505 sits at 2% lightness — dark enough to feel like a void but light enough to allow subtle gradients. #D4AF37 (Satin Sheen Gold) was chosen for its mid-saturation warmth. It reads as expensive without being garish.",
        tags: ["COLOR", "THEORY", "GOLD"],
        likes: 256,
        replies: 67,
        hot: true,
    },
    {
        id: "N-004",
        author: "NODE-451",
        avatar: "N4",
        role: "SYSTEMS DEV",
        timestamp: "8h ago",
        title: "Performance patterns for Framer Motion at scale",
        content: "When you have 50+ animated elements, use `useInView` with `once: true` aggressively. Batch your animations into stagger groups. And always use `transform-gpu` and `will-change-transform` for anything that moves.",
        tags: ["MOTION", "PERFORMANCE", "REACT"],
        likes: 74,
        replies: 15,
        hot: false,
    },
    {
        id: "N-005",
        author: "ARCHITECT-X",
        avatar: "AX",
        role: "PROTOCOL DESIGNER",
        timestamp: "12h ago",
        title: "Next.js App Router: The parallel route pattern",
        content: "Using @modal parallel routes for the Registry detail view gives you URL-synced modals for free. Combine with intercepting routes for the 'soft navigate' pattern — click opens modal, direct URL opens full page.",
        tags: ["NEXTJS", "ROUTING", "PATTERNS"],
        likes: 112,
        replies: 33,
        hot: false,
    },
    {
        id: "N-006",
        author: "CRYSTAL-NODE",
        avatar: "CN",
        role: "UI ENGINEER",
        timestamp: "1d ago",
        title: "SVG noise textures: performance vs aesthetics",
        content: "Inline SVG feTurbulence at 0.7 baseFrequency with 4 octaves gives the richest film grain. At 4-5% opacity with mix-blend-mode: overlay, it adds texture without impacting readability. Fixed position, pointer-events: none.",
        tags: ["SVG", "TEXTURE", "PERFORMANCE"],
        likes: 63,
        replies: 21,
        hot: false,
    },
];

// ── Registry Items (Components) ────────────────────
export const REGISTRY_ITEMS: RegistryItem[] = [
    {
        id: "R-001",
        name: "Parallax Hero",
        description: "Full-viewport hero with 3D mouse tilt, mask-reveal text animations, and breathing hexagon logo. Includes scroll-linked opacity and parallax background text.",
        category: "MOTION",
        price: "PRO",
        previewBg: "linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0a0a0a 100%)",
        size: "4.2 KB",
        dependencies: ["framer-motion", "lucide-react"],
        code: `"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="text-center z-10">
        <h1 className="text-8xl font-serif text-white tracking-tight">
          YOUR TITLE
        </h1>
      </motion.div>
    </section>
  );
}`,
        downloads: 12400,
        isNew: false,
    },
    {
        id: "R-002",
        name: "Glassmorphic Card",
        description: "Premium glassmorphism card with gradient border, backdrop-blur, gold hover glow, and lift animation. Responsive and accessible.",
        category: "UI",
        price: "FREE",
        previewBg: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
        size: "1.8 KB",
        dependencies: ["framer-motion"],
        code: `"use client";
import { motion } from "framer-motion";

export default function GlassCard({ children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-transparent"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10
        hover:border-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
}`,
        downloads: 28700,
        isNew: false,
    },
    {
        id: "R-003",
        name: "Magnetic Button",
        description: "Physics-based button that follows the cursor with spring dynamics. Gold sweep fill on hover. Supports onClick and href routing.",
        category: "UI",
        price: "FREE",
        previewBg: "linear-gradient(135deg, #0d0d0a 0%, #12100a 100%)",
        size: "2.1 KB",
        dependencies: ["framer-motion", "next/link"],
        code: `"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export default function MagneticButton({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 150 });
  const sy = useSpring(y, { damping: 15, stiffness: 150 });

  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width/2) * strength);
        y.set((e.clientY - r.top - r.height/2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group relative overflow-hidden border border-gold/30 px-10 py-4
        font-mono text-xs tracking-widest text-gold hover:text-black transition-colors">
      <span className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100
        origin-left transition-transform duration-700" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}`,
        downloads: 15100,
        isNew: false,
    },
    {
        id: "R-004",
        name: "Scroll Interlude",
        description: "Full-bleed parallax text section with CSS-only geometric overlays. Mask-reveal headlines triggered by scroll position.",
        category: "SCROLL",
        price: "PRO",
        previewBg: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
        size: "3.6 KB",
        dependencies: ["framer-motion"],
        code: `"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function ScrollInterlude({ headline, subtext }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="min-h-[80vh] flex items-center justify-center">
      <motion.div style={{ y, opacity }} className="text-center max-w-3xl px-6">
        <motion.h2 initial={{ y: "100%" }} animate={inView ? { y: 0 } : {}}
          className="font-serif text-6xl text-white tracking-tight">
          {headline}
        </motion.h2>
        <p className="font-mono text-sm text-white/50 mt-6">{subtext}</p>
      </motion.div>
    </section>
  );
}`,
        downloads: 9800,
        isNew: true,
    },
    {
        id: "R-005",
        name: "Cinematic Noise Overlay",
        description: "Fixed SVG feTurbulence noise texture. 4-5% opacity, mix-blend-mode: overlay. Adds premium film grain to any dark interface.",
        category: "EFFECTS",
        price: "FREE",
        previewBg: "linear-gradient(180deg, #080808 0%, #050505 100%)",
        size: "0.9 KB",
        dependencies: [],
        code: `export default function CinematicNoise() {
  return (
    <>
      <div className="noise-overlay" />
      <div className="vignette" />
    </>
  );
}`,
        downloads: 22300,
        isNew: false,
    },
    {
        id: "R-006",
        name: "Protocol Grid",
        description: "4-column technical specification display with hover state transitions, icon corners, and copy-to-clipboard functionality.",
        category: "LAYOUT",
        price: "PRO",
        previewBg: "linear-gradient(135deg, #050505 0%, #0a0a08 50%, #050505 100%)",
        size: "3.1 KB",
        dependencies: ["framer-motion", "lucide-react"],
        code: `"use client";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function ProtocolGrid({ specs }) {
  return (
    <div className="grid grid-cols-4 gap-px bg-white/5 border border-white/5">
      {specs.map((s, i) => (
        <motion.div key={s.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#050505] p-8 hover:bg-[#080808] transition-colors group">
          <Cpu className="w-5 h-5 text-gold/20 group-hover:text-gold/40 mb-4" />
          <h3 className="font-mono text-xs text-gold tracking-widest mb-1">{s.title}</h3>
          <p className="font-serif text-xl text-white">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
}`,
        downloads: 7600,
        isNew: true,
    },
    {
        id: "R-007",
        name: "Data Visualization Bar",
        description: "Animated horizontal load bar with scroll-triggered fill. Color shifts at thresholds (gold → amber at 80%).",
        category: "DATA",
        price: "FREE",
        previewBg: "linear-gradient(90deg, rgba(212,175,55,0.1) 0%, transparent 100%)",
        size: "1.2 KB",
        dependencies: ["framer-motion"],
        code: `"use client";
import { motion } from "framer-motion";

export default function LoadBar({ value, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[9px] text-white/40 w-16">{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: value + "%" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={value > 80 ? "h-full bg-amber-400/80 rounded-full" : "h-full bg-gold/80 rounded-full"}
        />
      </div>
      <span className="font-mono text-[9px] text-white/40 w-8">{value}%</span>
    </div>
  );
}`,
        downloads: 11200,
        isNew: false,
    },
    {
        id: "R-008",
        name: "Masonry Image Grid",
        description: "Responsive masonry layout with parallax image reveals. Curtain-wipe entrance animation with staggered delays.",
        category: "LAYOUT",
        price: "PRO",
        previewBg: "linear-gradient(135deg, #0a0a0a 0%, #080808 100%)",
        size: "5.4 KB",
        dependencies: ["framer-motion", "next/image"],
        code: `"use client";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function MasonryGrid({ items }) {
  return (
    <div className="columns-2 md:columns-3 gap-4 space-y-4">
      {items.map((item, i) => (
        <MasonryItem key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}

function MasonryItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-lg break-inside-avoid">
      <Image src={item.src} alt={item.alt} width={400} height={300}
        className="w-full object-cover" />
    </motion.div>
  );
}`,
        downloads: 6300,
        isNew: true,
    },
];

// ── Academy Courses ────────────────────
export const ACADEMY_COURSES: AcademyCourse[] = [
    {
        id: "A-001",
        title: "Cinematic Motion Design",
        description: "Master the art of motion in dark interfaces. From spring physics to orchestrated sequences.",
        duration: "4h 30m",
        difficulty: "ADVANCED",
        lessons: 12,
        instructor: "CIPHER-7",
        tags: ["MOTION", "FRAMER", "ANIMATION"],
    },
    {
        id: "A-002",
        title: "Scroll Physics & Parallax",
        description: "Deep dive into Lenis, scroll-linked animations, and creating the 'heavy' scroll feel.",
        duration: "3h 15m",
        difficulty: "INTERMEDIATE",
        lessons: 8,
        instructor: "VOID-ARCHITECT",
        tags: ["SCROLL", "LENIS", "PARALLAX"],
    },
    {
        id: "A-003",
        title: "Glassmorphism Mastery",
        description: "Production-ready glassmorphism. Performance pitfalls, z-depth stacking, and cross-browser solutions.",
        duration: "2h 00m",
        difficulty: "BEGINNER",
        lessons: 6,
        instructor: "CRYSTAL-NODE",
        tags: ["CSS", "GLASS", "BLUR"],
    },
    {
        id: "A-004",
        title: "Next.js Performance Patterns",
        description: "SSR, ISR, and parallel routes. Building fast-loading cinematic experiences with App Router.",
        duration: "5h 45m",
        difficulty: "ADVANCED",
        lessons: 15,
        instructor: "ARCHITECT-X",
        tags: ["NEXTJS", "SSR", "ROUTING"],
    },
    {
        id: "A-005",
        title: "Typography for Dark Interfaces",
        description: "Font pairing, optical sizing, and ensuring readability at every contrast level.",
        duration: "2h 30m",
        difficulty: "INTERMEDIATE",
        lessons: 7,
        instructor: "GOLD-STANDARD",
        tags: ["TYPOGRAPHY", "DESIGN", "A11Y"],
    },
    {
        id: "A-006",
        title: "The Void & Gold Design System",
        description: "Building a complete design system from scratch. Tokens, components, and documentation.",
        duration: "3h 00m",
        difficulty: "ADVANCED",
        lessons: 10,
        instructor: "GOLD-STANDARD",
        tags: ["DESIGN", "SYSTEM", "TOKENS"],
    },
];

// ── System Updates (for Feed) ────────────────────
export const SYSTEM_UPDATES = [
    { id: "U-001", type: "RELEASE", message: "Registry v2.4.0 — 3 new components added", time: "1h ago" },
    { id: "U-002", type: "NODE", message: "CIPHER-7 posted a new thread on scroll physics", time: "2h ago" },
    { id: "U-003", type: "SYSTEM", message: "Infrastructure upgrade complete — 12ms avg latency", time: "4h ago" },
    { id: "U-004", type: "RELEASE", message: "Academy: 'Motion Design' course updated to v3", time: "6h ago" },
    { id: "U-005", type: "ALERT", message: "NODE-256 (OBSIDIAN CORE) entering maintenance window", time: "8h ago" },
];
