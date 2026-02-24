
import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Sparkles, ChevronDown, ShieldCheck, Target } from 'lucide-react';
// Fix: Use standard Latin characters for react-router-dom imports to ensure compatibility with the build environment
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrandLogo } from '../ui/BrandLogo';

export function Hero() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const textY = useTransform(scrollY, [0, 500], [0, 150]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const bgOpacity = useTransform(scrollY, [0, 800], [0.4, 0.1]);

  return (
    <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Cinematic Background Layer */}
      <motion.div 
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop" 
          alt="Technical Background" 
          className="w-full h-full object-cover grayscale opacity-50"
        />
        <div className="scan-line"></div>
      </motion.div>

      {/* Atmospheric Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] bg-[#C5A059]/5 blur-[200px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* Animated HUD Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-32 hidden lg:flex items-center gap-12 text-[7px] font-black uppercase tracking-[1em] text-neutral-700"
        >
          <span className="flex items-center gap-2"><Target className="w-2 h-2" /> X: 42.091</span>
          <span className="flex items-center gap-2"><Target className="w-2 h-2" /> Y: 11.234</span>
          <span className="flex items-center gap-2"><Target className="w-2 h-2" /> Z: 0.001</span>
        </motion.div>

        {/* The Floating Logo Node */}
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="mb-16 flex justify-center"
        >
          <div className="relative p-10 border border-[#C5A059]/10 bg-black/40 backdrop-blur-xl group">
             <div className="absolute -inset-2 border border-[#C5A059]/5 opacity-30 group-hover:opacity-100 transition-opacity"></div>
             <BrandLogo size={80} idSuffix="hero-black-edition" />
             <div className="absolute top-0 right-0 p-2 text-[6px] font-black text-[#C5A059] tracking-widest opacity-40">VER. 4.1.0</div>
          </div>
        </motion.div>

        <motion.div style={{ y: textY }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-luxury text-7xl md:text-9xl text-white tracking-[0.6em] uppercase mb-6 leading-none"
          >
            Gestaltung
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="font-luxury text-[10px] md:text-[12px] tracking-[1.2em] uppercase bg-gradient-to-r from-neutral-500 via-[#C5A059] to-neutral-500 bg-clip-text text-transparent mb-20"
          >
            The Black Edition Protocol
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-12"
          >
            <Button 
              size="lg" 
              variant="primary"
              className="px-24 py-8 bg-transparent border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all shadow-[0_0_50px_rgba(197,160,89,0.05)]"
              onClick={() => navigate('/signup')}
            >
              INITIALIZE ENTRY
              <ArrowRight className="ml-8 h-4 w-4" />
            </Button>
            
            <LinkToGallery />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[7px] font-black uppercase tracking-[1em] text-neutral-600">Explore Synthesis</span>
          <ChevronDown className="w-4 h-4 text-[#C5A059]/50" />
        </motion.div>
      </div>
    </section>
  );
}

function LinkToGallery() {
  return (
    <button className="group flex flex-col items-start gap-2 text-left">
      <span className="text-[7px] font-black uppercase tracking-[0.5em] text-neutral-600 group-hover:text-[#C5A059] transition-colors">Digital Registry</span>
      <span className="font-luxury text-[10px] text-white tracking-[0.3em] uppercase">The Archive v.3</span>
    </button>
  );
}
