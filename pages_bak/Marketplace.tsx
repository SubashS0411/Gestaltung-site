
import React, { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { Template } from '../types';
import { awardPoints } from '../lib/ranking/points-system';
import { 
  ShoppingBag, Star, Download, Search, Filter, 
  ArrowRight, Loader2, Plus, LayoutGrid, Check, 
  Tag, ExternalLink, Globe, Sparkles, Zap, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', name: 'All Primitives' },
  { id: 'landing-page', name: 'Landing Pages' },
  { id: 'dashboard', name: 'Dashboards' },
  { id: 'mobile-app', name: 'Mobile Apps' },
  { id: 'component-library', name: 'Components' }
];

const TemplateMarketplace: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('templates').select('*');
    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  const handlePurchase = async (template: Template) => {
    setPurchasingId(template.id);
    await new Promise(r => setTimeout(r, 2000));
    const session = await supabase.auth.getSession();
    const userId = session.data?.session?.user?.id || 'demo-user-123';
    if (template.creator_id !== userId) {
      await awardPoints(template.creator_id, 'TEMPLATE_SOLD');
    }
    alert(`Success. Asset "${template.name}" synthesized to your local registry.`);
    setPurchasingId(null);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
        <p className="font-luxury text-[6px] text-neutral-600 uppercase tracking-[0.6em]">Indexing Asset Matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-luxury text-5xl text-white tracking-tight leading-[0.9] mb-6">
            Curated <span className="text-[#C5A059]">Assets</span>
          </h1>
          <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm">
            High-fidelity Framer primitives verified by the Gestaltung Neural Engine. Precision nodes for elite architects.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="relative w-80">
              <input 
                type="text" 
                placeholder="SCAN REGISTRY..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-none px-6 py-4 pl-12 text-[8px] font-black text-white uppercase tracking-[0.4em] outline-none focus:border-[#C5A059]/40 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-neutral-600 absolute left-5 top-1/2 -translate-y-1/2" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-12">
          <div>
            <h3 className="text-[7px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-8 flex items-center gap-2">
              <Filter className="w-2.5 h-2.5" /> Filter_Matrix
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-5 py-4 text-[8px] font-black uppercase tracking-[0.3em] transition-all border ${
                    selectedCategory === cat.id 
                    ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-xl shadow-yellow-500/5' 
                    : 'bg-black border-white/5 text-neutral-600 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 bg-[#0A0A0A] border border-[#C5A059]/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity">
                <Sparkles className="w-16 h-16 text-[#C5A059]" />
             </div>
             <h4 className="font-luxury text-lg text-white mb-4 tracking-tight">Seller Program</h4>
             <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">
               Earn neural credits for every high-fidelity transmission.
             </p>
             <button className="w-full py-4 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl shadow-yellow-500/5">
               Apply_Protocol
             </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredTemplates.map((t, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={t.id}
                className="bg-[#0A0A0A] border border-white/[0.03] hover:border-[#C5A059]/20 transition-all group relative overflow-hidden"
              >
                {t.featured && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#C5A059] text-black text-[7px] font-black uppercase tracking-[0.2em] rounded-sm shadow-lg">
                    FEATURED_ASSET
                  </div>
                )}
                <div className="aspect-video relative overflow-hidden bg-[#050505]">
                  <img src={t.preview_image_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-50 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-luxury text-2xl text-white mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors">{t.name}</h3>
                      <div className="text-[7px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-2.5 h-2.5" /> AUTHOR: {t.creator_name}
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-luxury text-xl text-[#C5A059] tracking-tighter">
                         {t.is_free ? '0.00' : `₹${t.price_inr.toLocaleString()}`}
                       </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-neutral-500 font-medium leading-relaxed mb-10 line-clamp-2 opacity-80">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-10">
                    <div className="flex gap-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                        <span className="text-[9px] font-black text-white">{t.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="text-[9px] font-black text-white">{t.sales} PORTS</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handlePurchase(t)}
                      disabled={purchasingId === t.id}
                      className="px-8 py-4 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {purchasingId === t.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t.is_free ? 'SYNC_NODE' : 'Procom'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-40 bg-[#0A0A0A] border border-dashed border-white/5 text-center flex flex-col items-center justify-center">
               <LayoutGrid className="w-12 h-12 text-neutral-800 mb-8" />
               <p className="font-luxury text-[10px] text-neutral-600 uppercase tracking-[0.8em]">No matching primitives in current quadrant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMarketplace;
