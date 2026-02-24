
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Star, Target, Zap, Loader2, Crown, TrendingUp, Award, Search, Calendar, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('leaderboard').select('*');
      if (error) console.error("Leaderboard Error:", error);
      else {
        let result = data || [];
        if (timeframe === 'weekly') {
          result = [...result].sort(() => Math.random() - 0.5);
        } else if (timeframe === 'monthly') {
          result = [...result].sort((a, b) => b.total_points / 2 - a.total_points / 2);
        }
        setEntries(result);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [timeframe]);

  const filteredEntries = entries.filter(e => 
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-[#C5A059]" />;
      case 2: return <Medal className="h-6 w-6 text-neutral-400" />;
      case 3: return <Award className="h-6 w-6 text-neutral-600" />;
      default: return <span className="text-[12px] font-luxury text-neutral-700">#{position}</span>;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
      <p className="font-luxury text-[6px] text-neutral-600 uppercase tracking-[0.6em]">Scanning Rank Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-luxury text-5xl text-white tracking-tight leading-[0.9] mb-6 uppercase">
            Global <span className="text-[#C5A059]">Archive</span>
          </h1>
          <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm">
            Professional design registry of verified synthesis operators. High-frequency performance tracking.
          </p>
        </div>
        
        <div className="flex bg-black border border-white/5 p-1 shadow-inner">
          {(['weekly', 'monthly', 'all-time'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-2.5 text-[8px] font-black uppercase tracking-[0.3em] transition-all ${
                timeframe === tf
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-yellow-500/5'
                  : 'text-neutral-600 hover:text-white'
              }`}
            >
              {tf.replace('-', '_')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 items-end">
        {entries.slice(0, 3).map((entry, i) => {
          const podiumOrder = i === 0 ? 'md:order-2 scale-105 z-10' : i === 1 ? 'md:order-1' : 'md:order-3';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={entry.user_id} 
              className={`relative p-12 bg-[#0A0A0A] border border-white/5 group hover:border-[#C5A059]/30 transition-all ${podiumOrder} ${i === 0 ? 'border-[#C5A059]/20 shadow-3xl' : ''}`}
            >
              {i === 0 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Crown className="w-12 h-12 text-[#C5A059] drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]" />
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-28 h-28 bg-black border-2 ${i === 0 ? 'border-[#C5A059]' : 'border-white/5'} mb-10 flex items-center justify-center overflow-hidden relative shadow-inner`}>
                   {entry.avatar_url ? (
                     <img src={entry.avatar_url} className="w-full h-full object-cover opacity-80" />
                   ) : (
                     <span className="font-luxury text-4xl text-neutral-800">{entry.full_name[0]}</span>
                   )}
                </div>
                <div className="mb-6">
                  <span className={`px-3 py-1 text-[7px] font-black uppercase tracking-widest border border-white/10 ${i === 0 ? 'text-[#C5A059] border-[#C5A059]/20' : 'text-neutral-600'}`}>
                    {entry.rank_level}
                  </span>
                </div>
                <h3 className="font-luxury text-2xl text-white mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors">{entry.full_name}</h3>
                <div className="flex items-center gap-3 text-[#C5A059] mb-12">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="font-luxury text-xl tracking-tighter">{entry.total_points.toLocaleString()} PTS</span>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-6 border-t border-white/5 pt-12">
                   <div className="text-left">
                      <div className="text-[7px] font-black text-neutral-600 uppercase mb-2 tracking-widest">UX_FACTOR</div>
                      <div className="font-luxury text-lg text-white">{entry.avg_ux_score}%</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[7px] font-black text-neutral-600 uppercase mb-2 tracking-widest">PORTS</div>
                      <div className="font-luxury text-lg text-white">{entry.designs_uploaded}</div>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="bg-[#0A0A0A] border border-white/5 shadow-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent"></div>
        <div className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black/40">
          <div className="flex items-center gap-5">
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="text-[10px] font-black uppercase text-white tracking-[0.5em]">Professional_Registry</h2>
              <div className="text-[7px] font-black text-neutral-600 uppercase tracking-widest mt-2">Verified Synthesis Operators</div>
            </div>
          </div>
          <div className="relative w-full md:w-[450px]">
             <input 
                type="text" 
                placeholder="SEARCH_OPERATOR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-none px-8 py-5 pl-14 text-[9px] font-black text-white uppercase tracking-[0.4em] outline-none focus:border-[#C5A059]/40 transition-all" 
             />
             <Search className="w-4 h-4 text-neutral-600 absolute left-6 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-12 py-10 text-[8px] font-black uppercase text-neutral-600 tracking-[0.5em]">Rank</th>
                <th className="px-12 py-10 text-[8px] font-black uppercase text-neutral-600 tracking-[0.5em]">Identity</th>
                <th className="px-12 py-10 text-[8px] font-black uppercase text-neutral-600 tracking-[0.5em]">Standing</th>
                <th className="px-12 py-10 text-[8px] font-black uppercase text-neutral-600 tracking-[0.5em] text-center">Efficiency</th>
                <th className="px-12 py-10 text-[8px] font-black uppercase text-neutral-600 tracking-[0.5em] text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr key={entry.user_id} className="group hover:bg-white/[0.01] transition-all border-b border-white/5 last:border-none">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-5">
                      {getRankIcon(entry.rank_position)}
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-8">
                       <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center text-[11px] font-luxury text-neutral-700 overflow-hidden shadow-inner">
                          {entry.avatar_url ? <img src={entry.avatar_url} className="w-full h-full object-cover opacity-80" /> : entry.full_name[0]}
                       </div>
                       <div>
                          <div className="font-luxury text-[15px] text-white group-hover:text-[#C5A059] transition-colors tracking-tight">{entry.full_name}</div>
                          <div className="text-[7px] font-black text-neutral-700 uppercase tracking-widest mt-2 flex items-center gap-2">
                             <Globe className="w-3 h-3" /> CLUSTER_ID: {entry.user_id.slice(0, 8)}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 border border-white/10 text-[7px] font-black uppercase tracking-widest text-neutral-500">{entry.rank_level}</span>
                       <div className="flex -space-x-2 opacity-30 group-hover:opacity-100 transition-opacity">
                          {entry.badges.map((b, i) => (
                             <div key={i} className="w-5 h-5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
                                <Star className="w-2.5 h-2.5 text-[#C5A059] fill-current" />
                             </div>
                          ))}
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.02] border border-white/5">
                       <Target className="w-4 h-4 text-[#C5A059]" />
                       <span className="font-luxury text-[14px] text-white tracking-tighter">{entry.avg_ux_score}%</span>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-luxury text-lg text-white group-hover:text-[#C5A059] transition-colors tracking-widest">{entry.total_points.toLocaleString()}</span>
                      <span className="text-[7px] font-black text-neutral-700 uppercase tracking-widest mt-1">Validated_Credits</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
