
import React from 'react';
import { motion } from 'framer-motion';
import { BrandLogo } from '../components/ui/BrandLogo';
import { ShieldCheck, Cpu, Fingerprint, Globe, Award, TrendingUp, BarChart, Landmark, Terminal, Hexagon } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-12 border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BrandLogo size={60} idSuffix="about-hero" className="mx-auto mb-10 opacity-80" />
            <h1 className="font-luxury text-4xl sm:text-6xl text-white mb-6 tracking-tight">
              The <span className="text-[#C5A059]">Foundry</span>
            </h1>
            <p className="font-luxury text-[8px] text-neutral-600 uppercase tracking-[0.8em] mb-12">The Architects of Synthesis</p>
            <div className="w-20 h-[1px] bg-[#C5A059] mx-auto mb-12"></div>
            <p className="text-neutral-500 text-sm sm:text-base leading-loose max-w-2xl mx-auto italic font-serif-luxury">
              "Gestaltung was born from a singular obsession: the absolute synchronization of human aesthetic vision and machine-precise code. We don't just port designs; we synthesize digital architecture."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Founder Profile - Updated to Technical Product Role */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-[#0A0A0A] border border-white/5 group hover:border-[#C5A059]/30 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-black border border-[#C5A059]/20 mb-8 flex items-center justify-center relative overflow-hidden group-hover:border-[#C5A059]/50 transition-all">
                  <span className="font-luxury text-5xl text-neutral-800">S</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent"></div>
                </div>
                <h2 className="font-luxury text-3xl text-white mb-2 tracking-tighter">Shanmathi</h2>
                <span className="text-[#C5A059] font-luxury text-[8px] tracking-[0.5em] uppercase mb-8">Founder / Chief Product Engineer</span>
                <p className="text-neutral-600 text-[10px] uppercase font-black tracking-widest leading-relaxed mb-10">
                  The primary architect of the Gestaltung product suite and the lead designer of the core synthesis source engine. Shanmathi engineered the fundamental technical logic that powers high-fidelity design-to-code transmissions.
                </p>
                <div className="flex gap-4 border-t border-white/5 pt-10 w-full justify-center">
                   <Terminal className="w-4 h-4 text-neutral-800" title="Source Architect" />
                   <Cpu className="w-4 h-4 text-neutral-800" title="Core Engine Logic" />
                   <Hexagon className="w-4 h-4 text-neutral-800" title="Product Synthesis" />
                </div>
              </div>
            </motion.div>

            {/* Co-Founder Profile - CFO role */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-[#0A0A0A] border border-white/5 group hover:border-[#C5A059]/30 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-black border border-[#C5A059]/20 mb-8 flex items-center justify-center relative overflow-hidden group-hover:border-[#C5A059]/50 transition-all">
                  <span className="font-luxury text-5xl text-neutral-800">A</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent"></div>
                </div>
                <h2 className="font-luxury text-3xl text-white mb-2 tracking-tighter">Aravind</h2>
                <span className="text-[#C5A059] font-luxury text-[8px] tracking-[0.5em] uppercase mb-8">Co-Founder / Chief Financial Officer</span>
                <p className="text-neutral-600 text-[10px] uppercase font-black tracking-widest leading-relaxed mb-10">
                  Orchestrating the fiscal architecture and economic scaling protocols. Aravind ensures the long-term sustainability and capital growth of the Gestaltung ecosystem through high-precision financial modeling.
                </p>
                <div className="flex gap-4 border-t border-white/5 pt-10 w-full justify-center">
                   <TrendingUp className="w-4 h-4 text-neutral-800" title="Growth Strategy" />
                   <BarChart className="w-4 h-4 text-neutral-800" title="Market Analytics" />
                   <Landmark className="w-4 h-4 text-neutral-800" title="Fiscal Integrity" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Ethos Grid */}
      <section className="py-24 px-6 lg:px-12 bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-8 p-6 border border-white/5 group-hover:border-[#C5A059]/20 transition-all bg-white/[0.01]">
                <Fingerprint className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="font-luxury text-sm text-white mb-3 tracking-[0.2em]">Bespoke Logic</h3>
              <p className="text-[9px] uppercase font-black tracking-[0.3em] text-neutral-600">Tailored synthesis nodes</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="mb-8 p-6 border border-white/5 group-hover:border-[#C5A059]/20 transition-all bg-white/[0.01]">
                <Cpu className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="font-luxury text-sm text-white mb-3 tracking-[0.2em]">Hardware Acceleration</h3>
              <p className="text-[9px] uppercase font-black tracking-[0.3em] text-neutral-600">Optimized rendering pipeline</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="mb-8 p-6 border border-white/5 group-hover:border-[#C5A059]/20 transition-all bg-white/[0.01]">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="font-luxury text-sm text-white mb-3 tracking-[0.2em]">Verified Integrity</h3>
              <p className="text-[9px] uppercase font-black tracking-[0.3em] text-neutral-600">Enterprise grade protocols</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
