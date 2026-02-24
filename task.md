Project: GESTALTUNG // The Black Edition Protocol
Role: World-Class Creative Developer (Awwwards / FWA Level)
Objective: Build a high-performance, cinematic web experience that merges "Cyber-Noir Luxury" with "High-Precision Engineering."
Reference Benchmark: Porsche Cayenne Black Edition (specifically for scroll physics, parallax, and atmosphere).
1. The Tech Stack (Non-Negotiable)
To achieve the "Porsche" feel, the stack must handle heavy motion without lag.
Framework: Next.js 14+ (App Router).
Styling: Tailwind CSS (Strict usage for layout/colors).
Animation Engine: Framer Motion (Required for complex orchestrations).
Scroll Engine: React-Lenis (Essential for the "heavy/smooth" scroll feel).
Fonts: Playfair Display (Serif/Display) + JetBrains Mono (Technical/Data).
Icons: Lucide React (Gold stroke, thin weight).
2. The Design System (Strict Visual Adherence)
Do not deviate from the screenshot's theme.
Color Palette (The "Void & Gold" Theme)
Void Black (Bg): #030303 (Not pure black, slightly warmer).
Charcoal (Surface): #0F0F0F (For cards/panels).
Obsidian (Borders): #1A1A1A (Subtle separation lines).
Imperial Gold (Primary): #D4AF37 (Metallic, reflective).
Pale Gold (Light): #F3E5AB (For text highlights/glows).
Text Muted: #666666 (For technical specs).
Typography Hierarchy
Macro Headers (Hero): Playfair Display, All Caps, massive tracking (tracking-widest), font weight 400.
Micro Data (UI): JetBrains Mono, Uppercase, small size (text-xs), extensive spacing.
Atmosphere & Texture
Cinematic Noise: Apply a fixed pointer-events-none overlay with 4% opacity noise to the entire screen. This creates the "film grain" look found in the Porsche site.
Vignette: subtle radial gradient darkening the edges of the screen.
3. UX & Motion Physics (The "Porsche" Effect)
A. Smooth Scroll (Lenis)
Implement a global smooth scroll instance.
Feel: Heavy, damped, and luxurious. The user should feel like they are scrolling through "molten gold," not a standard webpage.
B. Parallax Depth
Background Elements: The large background text ("GESTALTUNG") and the hexagon logo must move at 0.5x speed relative to the scroll.
Foreground Elements: Content cards and buttons move at 1.0x speed.
Result: This creates the deep 3D space seen in the Porsche reference.
C. Micro-Interactions
Magnetic Buttons: Buttons (like "Initialize Entry") should slightly attract to the mouse cursor when hovered (using Framer Motion useSpring).
Borders: Grid lines should draw themselves (scaleX: 0 -> scaleX: 1) upon section entry.
4. Page-by-Page Implementation Guide
Section 1: The Hero (Screenshot: "Gestaltung Black Edition")
Layout: Full viewport height (h-screen).
Background:
A massive, centered text: "GESTALTUNG" in Playfair Display.
Opacity: 10% (Subtle watermark).
Animation: Parallax scroll (moves slower than the rest).
Foreground (Center):
The Hexagon Logo: Gold gradient, slightly spinning on scroll interaction.
Title: "GESTALTUNG" (Sharp, Solid White/Gold).
Subtitle: "THE BLACK EDITION PROTOCOL" (Monospace, tracking-[1em], Gold).
Action:
"Initialize Entry" Button: A minimalist outlined button. On hover, the background fills with Gold (#D4AF37) and text turns Black.
Section 2: The Neural Hub (Screenshot: Dashboard View)
Transition: As the user scrolls down, the Hero should fade out, and the "Neural Hub" interface should slide up from the bottom (staggered animation).
Navigation Bar (Top):
Items: REGISTRY // NODE HUB // ACADEMY // FOUNDRY.
Font: Monospace, Gold.
Effect: A thin gold line travels under the active item.
The Grid:
Create a CSS Grid layout for the "Conversations" and "Live Transmissions."
Cards: Dark glassmorphism (bg-black/40 backdrop-blur-md border border-white/10).
Content:
"OPTIMIZING FRAMER MOTION..." (White text).
Tag pills: #FRAMER-MOTION, #PERFORMANCE (Bordered pills, text-xs).
The Assistant (Right Panel):
A sticky sidebar.
Title: "NEURAL ASSISTANT" (Gold, Monospace).
Input Field: "Sample Query: Color Protocols?" -> The placeholder text should type itself out and delete (Typewriter effect).
5. Technical Directives for the AI
Component Structure:
Use components/ui/ for atomic elements (Buttons, Inputs).
Use components/sections/ for Hero, Dashboard.
Use layout/ for the Lenis Scroll wrapper.
Tailwind Configuration:
Extend the theme immediately. Do not use default Tailwind colors. Add colors.gold and colors.void.
Responsiveness:
While the reference is desktop-heavy, ensure the Grid collapses into a single column on Mobile, but keep the fonts large and impressive.

Final Instruction to AI:
"Generate the project structure and the core Landing Page code. Prioritize the atmosphere—it must look expensive. If a choice is between 'standard' and 'cinematic,' always choose cinematic."