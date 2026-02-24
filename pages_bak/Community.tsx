
import React, { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { CommunityQuestion, LiveReview, FeedbackRequest } from '../types';
import { awardPoints } from '../lib/ranking/points-system';
import { analyzeWithGemini } from '../lib/ai/providers';
import { 
  MessageSquare, Search, Plus, Loader2, Sparkles, 
  ChevronRight, ArrowUpCircle, Tag, CheckCircle2,
  Video, Calendar, Clock, Users, Globe, ExternalLink, Activity,
  Filter, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Community: React.FC = () => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [liveReviews, setLiveReviews] = useState<LiveReview[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'registry' | 'transmissions' | 'feedback'>('registry');
  const [reviewFilter, setReviewFilter] = useState<'upcoming' | 'live' | 'past'>('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' });
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, reviewFilter]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'registry') {
      const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (data) setQuestions(data);
    } else if (activeTab === 'transmissions') {
      const { data } = await supabase.from('live_reviews').select('*').order('scheduled_at', { ascending: true });
      if (data) setLiveReviews(data);
    } else {
      const { data } = await supabase.from('feedback_requests').select('*').order('created_at', { ascending: false });
      if (data) setFeedbackRequests(data);
    }
    setLoading(false);
  };

  const handleAskAI = async (q: string) => {
    setAiThinking(true);
    try {
      const response = await analyzeWithGemini(`Act as a senior Design Engineer. Answer: ${q}`, 'gemini-3-flash-preview');
      alert(`Gestaltung AI Consultant: \n\n${response}`);
    } catch (e) {
      alert("Neural Consultant is currently balancing clusters.");
    } finally {
      setAiThinking(false);
    }
  };

  const handleJoinReview = (review: LiveReview) => {
    if (review.status === 'live' && review.stream_url) {
      window.open(review.stream_url, '_blank');
    } else if (review.status === 'completed' && review.recording_url) {
      window.open(review.recording_url, '_blank');
    } else {
      alert("Protocol registration confirmed.");
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await supabase.auth.getSession();
    const userId = session.data?.session?.user?.id || 'demo-user-123';
    await supabase.from('questions').insert({ user_id: userId, user_name: 'Operator', title: newQuestion.title, content: newQuestion.content, tags: newQuestion.tags.split(',').map(t => t.trim()) });
    setIsModalOpen(false);
    fetchData();
  };

  const filteredQuestions = questions.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredReviews = liveReviews.filter(r => r.status === (reviewFilter === 'past' ? 'completed' : reviewFilter));

  if (loading && questions.length === 0 && liveReviews.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
      <p className="font-luxury text-[6px] text-neutral-600 uppercase tracking-[0.6em]">Node Hub Syncing...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
        <div className="max-w-xl">
          <h1 className="font-luxury text-3xl text-white tracking-tight mb-4">Neural <span className="text-[#C5A059]">Hub</span></h1>
          <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.3em]">Collaborative Design Engineering protocols. Knowledge transmission registry.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all flex items-center gap-2"><Plus className="w-3 h-3" /> New Query</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-9 space-y-8">
          <div className="flex gap-8 border-b border-white/5 pb-1">
            {['registry', 'transmissions', 'feedback'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[8px] font-black uppercase tracking-[0.4em] pb-4 transition-all relative ${activeTab === tab ? 'text-white' : 'text-neutral-600'}`}>
                {tab === 'registry' ? 'Conversations' : tab === 'transmissions' ? 'Live_Transmissions' : 'Bespoke_Feedback'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'transmissions' && (
            <div className="flex gap-2 mb-6 animate-in fade-in duration-300">
               {[
                 { value: 'upcoming', label: 'Upcoming' },
                 { value: 'live', label: 'Live Now' },
                 { value: 'past', label: 'Recordings' }
               ].map((f) => (
                 <button key={f.value} onClick={() => setReviewFilter(f.value as any)} className={`px-4 py-2 text-[7px] font-black uppercase tracking-widest transition-all ${reviewFilter === f.value ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-neutral-500 hover:text-white border border-white/5'}`}>
                   {f.label}
                 </button>
               ))}
            </div>
          )}

          {activeTab === 'registry' && (
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="p-6 bg-[#0A0A0A] border border-white/[0.03] hover:border-[#C5A059]/20 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black border border-white/5 flex items-center justify-center text-[10px] font-luxury text-neutral-700">{q.user_name[0]}</div>
                      <div>
                        <h3 className="text-xs font-luxury text-white group-hover:text-[#C5A059] transition-colors">{q.title}</h3>
                        <div className="text-[6px] font-black text-neutral-600 uppercase tracking-widest mt-1">{q.user_name} • NODE_{new Date(q.created_at).getTime().toString().slice(-6)}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-relaxed mb-6 line-clamp-2">{q.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">{q.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-white/[0.02] text-[6px] font-black uppercase text-neutral-600 border border-white/5">#{tag}</span>)}</div>
                    <button onClick={() => handleAskAI(q.title)} className="p-1.5 border border-[#C5A059]/20 hover:bg-[#C5A059] hover:text-black transition-all text-[#C5A059]"><Sparkles className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transmissions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
               {filteredReviews.map((review) => (
                 <div key={review.id} className="p-8 bg-[#0A0A0A] border border-white/[0.03] hover:border-[#C5A059]/20 transition-all group relative">
                    {review.status === 'live' && <div className="absolute top-6 right-6 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div><span className="text-[6px] font-black text-red-500 uppercase tracking-widest">Active_Feed</span></div>}
                    <h3 className="text-sm font-luxury text-white mb-2">{review.title}</h3>
                    <p className="text-[9px] text-neutral-600 mb-8 line-clamp-2 uppercase">{review.description}</p>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-7 h-7 bg-black border border-white/10 flex items-center justify-center text-[8px] font-luxury text-neutral-700">{review.host_name[0]}</div>
                       <div><div className="text-[7px] font-black text-white uppercase tracking-widest">{review.host_name}</div></div>
                    </div>
                    <div className="space-y-3 mb-10 text-neutral-600 text-[7px] font-black uppercase tracking-widest">
                       <div className="flex items-center gap-2"><Calendar className="w-2.5 h-2.5" /><span>{new Date(review.scheduled_at).toLocaleDateString()}</span></div>
                       <div className="flex items-center gap-2"><Users className="w-2.5 h-2.5" /><span>{review.current_participants} / {review.max_participants} Participants</span></div>
                    </div>
                    <button onClick={() => handleJoinReview(review)} className={`w-full py-4 text-[7px] font-black uppercase tracking-[0.4em] transition-all border ${review.status === 'live' ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-white/5 border-white/10 text-neutral-500 hover:border-[#C5A059]'}`}>
                      {review.status === 'live' ? 'Join_Live' : review.status === 'completed' ? 'Watch_Archive' : 'Register_Entry'}
                    </button>
                 </div>
               ))}
               {filteredReviews.length === 0 && <div className="col-span-full py-20 text-center opacity-40"><p className="text-[7px] font-black uppercase tracking-[0.4em]">No matching transmissions in current quadrant.</p></div>}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {feedbackRequests.map((req) => (
                 <div key={req.id} className="p-8 bg-[#0A0A0A] border border-white/[0.03] hover:border-[#C5A059]/20 transition-all flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                       <div className="flex items-center gap-4 mb-4">
                          <span className={`px-2 py-0.5 text-[6px] font-black uppercase border tracking-widest ${req.urgency === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>{req.urgency} Urgency</span>
                          <span className="text-[6px] font-black text-neutral-600 uppercase tracking-widest">By {req.requester_name}</span>
                       </div>
                       <h3 className="text-sm font-luxury text-white mb-2">{req.title}</h3>
                       <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">{req.description}</p>
                    </div>
                    <div className="flex items-center">
                       <button className="px-6 py-4 border border-[#C5A059]/30 text-[#C5A059] font-luxury text-[8px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all">Audit_Now</button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-10">
           <div className="p-8 bg-black border border-[#C5A059]/20 group">
              <h3 className="text-[6px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-8 flex items-center gap-2"><Sparkles className="w-2.5 h-2.5" /> Neural Assistant</h3>
              <p className="text-neutral-500 text-[8px] font-medium leading-relaxed mb-10 uppercase">Real-time technical design consultation. High-frequency synthesis support.</p>
              <button disabled={aiThinking} onClick={() => handleAskAI("Optimal color tokens for B2B?")} className="w-full text-left p-4 bg-white/[0.01] border border-white/5 hover:border-[#C5A059]/30 transition-all group/btn">
                 <div className="text-[6px] font-black text-white uppercase tracking-widest mb-2 flex items-center justify-between">Sample Query <ChevronRight className="w-2 h-2" /></div>
                 <div className="text-[7px] text-neutral-600 font-bold uppercase tracking-widest">"Color Protocols?"</div>
              </button>
              {aiThinking && <div className="mt-4 flex items-center gap-2 p-3 border border-[#C5A059]/20 animate-pulse"><Loader2 className="w-2.5 h-2.5 text-[#C5A059] animate-spin" /><span className="text-[6px] font-black text-[#C5A059] uppercase">Processing...</span></div>}
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-xl bg-[#0F0F0F] border border-[#C5A059]/30 p-10 shadow-3xl">
              <h2 className="font-luxury text-xl text-white mb-2">Neural Query</h2>
              <form onSubmit={handleCreateQuestion} className="space-y-8">
                <input type="text" required value={newQuestion.title} onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 outline-none text-[9px] font-luxury text-white" placeholder="QUERY_TITLE" />
                <textarea required value={newQuestion.content} onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})} rows={4} className="w-full bg-black border border-white/10 p-4 outline-none text-[10px] text-white leading-relaxed resize-none" placeholder="DESCRIBE_HURDLE" />
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white/5 text-[7px] font-black text-neutral-500 uppercase tracking-widest">Abort</button>
                   <button type="submit" className="flex-2 py-4 bg-[#C5A059] text-black font-luxury text-[7px] uppercase tracking-widest">Synchronize</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
