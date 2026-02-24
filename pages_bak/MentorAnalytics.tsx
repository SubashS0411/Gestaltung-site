
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Star, 
  Users, Clock, Target, Loader2, ChevronRight, Activity, 
  Download, Globe, Zap, Medal, ChevronDown, Award, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#C5A059', '#E5E7EB', '#8A6D3B', '#4A4A4A', '#FFFFFF'];

const MentorAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'revenue' | 'sessions' | 'feedback' | 'goals'>('revenue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  async function fetchAnalytics() {
    setLoading(true);
    const { data } = await supabase.from('mentor_analytics').select('*').single();
    if (data) setAnalytics(data);
    setLoading(false);
  }

  if (loading || !analytics) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
      <p className="font-luxury text-[6px] text-neutral-600 uppercase tracking-[0.6em]">Synchronizing Analytics Node...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-luxury text-4xl text-white tracking-tight leading-[0.9] mb-6 uppercase">
            Performance <span className="text-[#C5A059]">Registry</span>
          </h1>
          <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm">
            High-density synthesis tracking for Atelier mentors. Monitoring revenue velocity and engagement protocols.
          </p>
        </div>
        <div className="flex bg-[#0A0A0A] border border-white/5 p-1">
          {['7d', '30d', '90d', '1y'].map((tf) => (
            <button key={tf} onClick={() => setTimeframe(tf as any)} className={`px-4 py-2 text-[6px] font-black uppercase tracking-[0.4em] transition-all ${timeframe === tf ? 'bg-[#C5A059] text-black' : 'text-neutral-600 hover:text-white'}`}>{tf}</button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard title="Total Revenue" value={`₹${analytics.overview.total_revenue.toLocaleString()}`} change={analytics.overview.revenue_change} icon={DollarSign} />
        <StatCard title="Sessions Finalized" value={analytics.overview.sessions_completed} change={analytics.overview.sessions_change} icon={Zap} />
        <StatCard title="Atelier Grade" value={analytics.overview.avg_rating.toFixed(1)} change={analytics.overview.rating_change} icon={Star} />
        <StatCard title="Unique Nodes" value={analytics.overview.total_mentees} change={analytics.overview.mentees_change} icon={Users} />
      </div>

      <div className="flex gap-8 border-b border-white/5 pb-1 mb-12">
        {['revenue', 'sessions', 'feedback', 'goals'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[8px] font-black uppercase tracking-[0.4em] pb-4 transition-all relative ${activeTab === tab ? 'text-white' : 'text-neutral-600'}`}>
            {tab.toUpperCase()}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]"></div>}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-8 p-10 bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A059]/40 via-[#C5A059]/5 to-transparent"></div>
              <h3 className="font-luxury text-[8px] text-[#C5A059] mb-12 tracking-[0.5em]">Revenue Propagation</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.revenue_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                    <XAxis dataKey="date" stroke="#444" fontSize={6} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 900 }} />
                    <YAxis stroke="#444" fontSize={6} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 900 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #C5A059', fontSize: '8px' }} 
                      itemStyle={{ color: '#C5A059' }}
                      cursor={{ stroke: '#C5A059', strokeWidth: 1 }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#C5A059" strokeWidth={1.5} dot={{ fill: '#C5A059', r: 2 }} activeDot={{ r: 4, stroke: '#FFF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className="p-10 bg-[#0A0A0A] border border-white/5">
                <h3 className="font-luxury text-[8px] text-[#C5A059] mb-8 tracking-[0.5em]">Breakdown</h3>
                <div className="space-y-6">
                   <RevenueItem label="Paid Transmission" amount={analytics.revenue_breakdown.paid_sessions} percentage={analytics.revenue_breakdown.paid_percentage} />
                   <RevenueItem label="Bespoke Value" amount={analytics.revenue_breakdown.free_sessions_value} percentage={analytics.revenue_breakdown.free_percentage} isFree />
                </div>
              </div>
              <div className="p-10 bg-[#C5A059]/5 border border-[#C5A059]/20 shadow-[0_0_50px_rgba(197,160,89,0.05)]">
                <h3 className="font-luxury text-[8px] text-[#C5A059] mb-8 tracking-[0.5em]">Synthesized Balance</h3>
                <div className="text-3xl font-luxury text-white mb-8">₹{analytics.earnings.available_balance.toLocaleString()}</div>
                <button className="w-full py-4 bg-[#C5A059] text-black font-luxury text-[7px] uppercase tracking-[0.5em] shadow-xl shadow-yellow-500/5 hover:bg-white transition-all active:scale-95">Execute Withdrawal Protocol</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-8 p-10 bg-[#0A0A0A] border border-white/5">
                <h3 className="font-luxury text-[8px] text-[#C5A059] mb-12 tracking-[0.5em]">Session Density</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.sessions_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                      <XAxis dataKey="date" stroke="#444" fontSize={6} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 900 }} />
                      <YAxis stroke="#444" fontSize={6} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 900 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #C5A059', fontSize: '8px' }}
                        cursor={{ fill: 'rgba(197, 160, 89, 0.05)' }}
                      />
                      <Bar dataKey="completed" fill="#C5A059" name="Finalized" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="cancelled" fill="#EF4444" name="Aborted" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="lg:col-span-4 grid grid-cols-1 gap-8">
                <div className="p-10 bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center text-center">
                   <Clock className="w-8 h-8 text-[#C5A059] mb-6 opacity-40" />
                   <div className="text-3xl font-luxury text-white mb-2">{analytics.avg_duration}</div>
                   <div className="text-[6px] font-black text-neutral-600 uppercase tracking-widest">Minutes Avg Latency</div>
                </div>
                <div className="p-10 bg-[#0A0A0A] border border-white/5">
                   <h3 className="font-luxury text-[8px] text-[#C5A059] mb-10 tracking-[0.5em]">Node Distribution</h3>
                   <div className="h-[150px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={analytics.session_types} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                           {analytics.session_types.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                         </Pie>
                         <Tooltip />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-6 p-10 bg-[#0A0A0A] border border-white/5">
                <h3 className="font-luxury text-[8px] text-[#C5A059] mb-12 tracking-[0.5em]">Rating Trends</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.rating_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                      <XAxis dataKey="date" stroke="#444" fontSize={6} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 5]} stroke="#444" fontSize={6} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#C5A059" strokeWidth={1.5} dot={{ fill: '#C5A059', r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-12 space-y-6">
                   <QualityBar label="Overall Logic" rating={analytics.detailed_ratings.overall} />
                   <QualityBar label="Transmission" rating={analytics.detailed_ratings.helpfulness} />
                   <QualityBar label="Expertise Rank" rating={analytics.detailed_ratings.expertise} />
                </div>
             </div>
             <div className="lg:col-span-6 p-10 bg-[#0A0A0A] border border-white/5">
                <h3 className="font-luxury text-[8px] text-[#C5A059] mb-12 tracking-[0.5em]">Transmission Feed</h3>
                <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                   {analytics.recent_feedback.map((f: any) => (
                     <div key={f.id} className="border-b border-white/5 pb-8 last:border-0 group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 transition-colors ${i < f.rating ? 'text-[#C5A059] fill-current' : 'text-neutral-800'}`} />)}
                           </div>
                           <span className="text-[6px] font-black text-neutral-600 uppercase tracking-widest">{new Date(f.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-medium leading-relaxed italic mb-4 group-hover:text-white transition-colors">"{f.feedback_text}"</p>
                        <div className="text-[7px] font-black text-neutral-700 uppercase tracking-widest">— Operator: {f.mentee_name}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             {analytics.goals.map((goal: any) => (
               <div key={goal.id} className="p-10 bg-[#0A0A0A] border border-white/5 relative overflow-hidden group hover:border-[#C5A059]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                     <Target className="w-12 h-12 text-[#C5A059]" />
                  </div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <Target className="w-5 h-5 text-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity" />
                     <span className={`px-2 py-0.5 text-[5px] font-black uppercase border tracking-widest ${goal.status === 'completed' ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>{goal.status}</span>
                  </div>
                  <h4 className="font-luxury text-[10px] text-white mb-10 tracking-[0.2em] relative z-10">{goal.title}</h4>
                  <div className="space-y-4 relative z-10">
                     <div className="flex justify-between text-[7px] font-black uppercase tracking-widest">
                        <span className="text-neutral-600">Sync Level</span>
                        <span className="text-white">{goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}</span>
                     </div>
                     <div className="w-full h-[1px] bg-white/5 relative">
                        <div className="h-full bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.3)] transition-all duration-1000" style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }} />
                     </div>
                     <div className="text-[6px] font-black text-neutral-600 uppercase tracking-[0.2em]">{((goal.current_value / goal.target_value) * 100).toFixed(0)}% Propagation complete</div>
                  </div>
               </div>
             ))}
             <button className="p-10 bg-black border border-dashed border-white/10 flex flex-col items-center justify-center text-center group hover:border-[#C5A059]/30 transition-all active:scale-95">
                <Plus className="w-6 h-6 text-neutral-800 mb-4 group-hover:text-[#C5A059] transition-colors" />
                <span className="text-[7px] font-black text-neutral-600 uppercase tracking-[0.4em] group-hover:text-[#C5A059]">Initialize Directive</span>
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

function StatCard({ title, value, change, icon: Icon }: any) {
  const isPositive = change >= 0;
  return (
    <div className="p-8 bg-[#0A0A0A] border border-white/5 hover:border-[#C5A059]/20 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-white/[0.02] border border-white/5 group-hover:border-[#C5A059]/20 transition-all">
          <Icon className="w-4 h-4 text-[#C5A059]" />
        </div>
        <div className={`flex items-center gap-1.5 text-[8px] font-black tracking-widest ${isPositive ? 'text-[#C5A059]' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="text-[7px] font-black text-neutral-600 uppercase tracking-[0.5em] mb-3">{title}</div>
      <div className="text-3xl font-luxury text-white tracking-tighter group-hover:text-[#C5A059] transition-colors">{value}</div>
    </div>
  );
}

function RevenueItem({ label, amount, percentage, isFree = false }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150 ${isFree ? 'bg-neutral-800' : 'bg-[#C5A059]'}`} />
        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest group-hover:text-neutral-300 transition-colors">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-luxury text-white">₹{amount.toLocaleString()}</div>
        <div className="text-[6px] font-black text-neutral-800 uppercase tracking-widest">{percentage}%</div>
      </div>
    </div>
  );
}

function QualityBar({ label, rating }: { label: string; rating: number }) {
  const percentage = (rating / 5) * 100;
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest group-hover:text-neutral-400 transition-colors">{label}</span>
        <span className="text-[9px] font-luxury text-white">{rating.toFixed(1)}<span className="text-[7px] text-neutral-800 ml-1">/ 5.0</span></span>
      </div>
      <div className="w-full h-[1px] bg-white/5 overflow-hidden">
        <div className="h-full bg-[#C5A059] shadow-[0_0_5px_rgba(197,160,89,0.3)] transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default MentorAnalytics;
