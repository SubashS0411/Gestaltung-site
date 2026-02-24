import React from 'react';
import { Hero } from '../components/marketing/hero';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Landmark, Award, Fingerprint, Target, Cpu, Hexagon } from 'lucide-react';

const ParallaxSection = ({ children, title, subtitle, bgImage, reverse = false }: any) => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-black border-y border-white/[0.02]">
      <motion.div style={{ scale, opacity: 0.2 }} className="absolute inset-0 z-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 bg-black/60"></div>
      </motion.div>
      
      <div className={`relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
        <motion.div style={{ y: y1, opacity }} className="flex-1 space-y-12">
           <div className="space-y-4">
              <span className="text-[8px] font-black text-[#C5A059] uppercase tracking-[1em]">{subtitle}</span>
              <h2 className="font-luxury text-5xl md:text-7xl text-white tracking-[0.2em] uppercase leading-tight">{title}</h2>
           </div>
           <div className="h-px w-24 bg-[#C5A059]/30"></div>
           <p className="text-[12px] text-neutral-500 font-bold uppercase tracking-[0.4em] leading-[2.5] max-w-md">
             Experience the absolute precision of our neural synthesis protocol. 
             Engineered for the elite design architect.
           </p>
           {children}
        </motion.div>
        
        <motion.div style={{ y: y2 }} className="flex-1 hidden lg:block">
           <div className="aspect-[4/5] bg-black/40 border border-white/5 backdrop-blur-3xl p-1 relative group">
              <div className="absolute -inset-4 border border-[#C5A059]/5 group-hover:border-[#C5A059]/20 transition-all duration-700"></div>
              <img src={bgImage} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute bottom-10 left-10 p-6 bg-black/80 backdrop-blur-md border border-white/5">
                 <span className="font-luxury text-[8px] text-white tracking-[0.5em]">System Status: Verified</span>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesGrid = () => (
  <section className="py-40 bg-black px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/5">
        {[
          { icon: Landmark, name: 'Neural Foundry', desc: 'Atomic synthesis of Figma primitives.' },
          { icon: Award, name: 'Aesthetic Logic', desc: 'Mathematical validation of visual hierarchy.' },
          { icon: Hexagon, name: 'Precision Sync', desc: 'Zero-latency transmission to production code.' }
        ].map((f, i) => (
          <div key={i} className="bg-black p-20 hover:bg-[#050505] transition-colors group">
            <f.icon className="w-10 h-10 text-[#C5A059] mb-12 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-luxury text-[14px] text-white tracking-[0.4em] mb-6 uppercase">{f.name}</h3>
            <p className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.3em] leading-loose">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HorizontalGallery = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ["20%", "-60%"]);

  return (
    <div ref={containerRef} className="h-[300vh] bg-black relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 max-w-7xl mx-auto mb-20 w-full">
           <span className="text-[8px] font-black text-[#C5A059] uppercase tracking-[1em]">The Gallery</span>
           <h2 className="font-luxury text-4xl text-white tracking-[0.3em] uppercase mt-4">Registry of Precision</h2>
        </div>
        <motion.div style={{ x }} className="flex gap-20 pl-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-none w-[600px] aspect-[16/10] bg-[#050505] border border-white/5 p-1 group">
               <div className="w-full h-full relative overflow-hidden">
                 <img 
                    src={`https://images.unsplash.com/photo-${1600000000000 + i * 100000}?q=80&w=2670&auto=format&fit=crop`} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                 <div className="absolute bottom-8 left-8">
                    <span className="font-luxury text-[9px] text-white tracking-[0.8em] uppercase">Node Instance 00{i}</span>
                 </div>
               </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => (
  <div className="flex flex-col bg-black">
    <Hero />
    <ParallaxSection 
       subtitle="Phase I" 
       title="Neural Synthesis" 
       bgImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
    >
       <div className="flex items-center gap-6 pt-10">
          <Target className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-neutral-600">Calibration: 100% Verified</span>
       </div>
    </ParallaxSection>
    
    <HorizontalGallery />

    <ParallaxSection 
       subtitle="Phase II" 
       title="Atomic Export" 
       bgImage="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2560&auto=format&fit=crop"
       reverse
    >
       <div className="flex items-center gap-6 pt-10">
          <Cpu className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-neutral-600">Throughput: 12GB/s Porting</span>
       </div>
    </ParallaxSection>

    <FeaturesGrid />

    <section className="py-60 px-6 text-center border-t border-white/5 bg-black relative">
       <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
       <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-luxury text-6xl text-white mb-10 tracking-[0.4em] uppercase">Enter the Atelier</h2>
          <p className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.8em] mb-20 leading-loose">Access is limited to verified professional nodes.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-24 py-10 border border-[#C5A059] text-[#C5A059] font-luxury text-[10px] tracking-[1em] hover:bg-[#C5A059] hover:text-black transition-all"
          >
            Request Token
          </motion.button>
       </div>
    </section>
  </div>
);

export default LandingPage;