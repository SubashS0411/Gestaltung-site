
import React, { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { MentorshipSession } from '../types';
import { awardPoints } from '../lib/ranking/points-system';
import { 
  Trophy, Calendar as CalendarIcon, Clock, Star, 
  ArrowRight, Loader2, Zap, Layout, 
  UserCheck, ShieldCheck, Globe, CreditCard,
  ChevronLeft, X, MessageSquare, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Import BrandLogo from the correct UI component path instead of App.tsx which does not export it.
import { BrandLogo } from '../components/ui/BrandLogo';

const Mentorship: React.FC = () => {
  const [mentors, setMentors] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<MentorshipSession | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [formData, setFormData] = useState({
    session_type: 'design-review',
    duration_minutes: 30,
    description: ''
  });

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      const { data } = await supabase.from('mentors').select('*');
      if (data) setMentors(data);
      setLoading(false);
    };
    fetchMentors();
  }, []);

  const handleOpenBooking = (mentor: MentorshipSession) => {
    setSelectedMentor(mentor);
    setIsBooking(true);
    setBookingStep(1);
  };

  const handleFinalizeBooking = async () => {
    if (!selectedMentor || !bookingDate || !bookingTime) return;
    
    setLoading(true);
    // Simulate API logic
    await new Promise(r => setTimeout(r, 2500));
    
    const session = await supabase.auth.getSession();
    const userId = session.data?.session?.user?.id || 'demo-user-123';
    
    // Award points
    await awardPoints(selectedMentor.mentor_id, 'MENTORSHIP_SESSION');
    
    alert(`Success. Session synchronized for ${bookingDate} at ${bookingTime}. Check your neural feed for the meeting protocols.`);
    
    setIsBooking(false);
    setSelectedMentor(null);
    setLoading(false);
  };

  if (loading && mentors.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
      <p className="font-luxury text-[6px] text-neutral-600 uppercase tracking-[0.6em]">Scanning Authority Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-luxury text-5xl text-white tracking-tight leading-[0.9] mb-6">
            Mentorship <span className="text-[#C5A059]">Program</span>
          </h1>
          <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.3em] leading-loose max-w-md">
            Direct transmission of elite design knowledge. Verified Legend and Master rank operators within the cluster.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-full">
           <UserCheck className="w-3 h-3 text-[#C5A059]" />
           <span className="text-[7px] font-black text-[#C5A059] uppercase tracking-widest">Neural Mentors Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {mentors.map((m, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            key={m.id} 
            className="bg-[#0A0A0A] border border-white/5 p-10 hover:border-[#C5A059]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
               <Trophy className="w-24 h-24 text-[#C5A059]" />
            </div>
            
            <div className="flex items-center gap-6 mb-10">
               <div className="w-16 h-16 bg-[#0F0F0F] border border-[#C5A059]/20 flex items-center justify-center text-xl font-luxury text-neutral-700 overflow-hidden relative shadow-inner">
                  {m.mentor_avatar ? <img src={m.mentor_avatar} className="w-full h-full object-cover" /> : m.mentor_name[0]}
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-luxury text-lg text-white tracking-tight">{m.mentor_name}</h3>
                    <span className="px-1.5 py-0.5 border border-[#C5A059]/30 text-[6px] font-black text-[#C5A059] uppercase rounded-sm">{m.mentor_rank}</span>
                  </div>
                  <div className="text-[7px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-2.5 h-2.5" /> Verified Expert Node
                  </div>
               </div>
            </div>

            <div className="space-y-8 mb-12">
               <div>
                 <h4 className="text-[7px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                    <Zap className="w-2.5 h-2.5 fill-current" /> Mastery Domain
                 </h4>
                 <div className="font-luxury text-base text-white leading-tight tracking-wider">{m.topic}</div>
               </div>
               <p className="text-[11px] text-neutral-500 font-medium leading-relaxed opacity-80">
                 {m.description}
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5">
                     <div className="text-[6px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <CalendarIcon className="w-2.5 h-2.5" /> Window
                     </div>
                     <div className="text-[9px] font-bold text-neutral-300">{m.availability}</div>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5">
                     <div className="text-[6px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <CreditCard className="w-2.5 h-2.5" /> Fee
                     </div>
                     <div className="text-[9px] font-bold text-[#C5A059]">₹{m.price_inr.toLocaleString()} <span className="text-neutral-600 font-black">/ hr</span></div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => handleOpenBooking(m)}
              className="w-full py-5 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/5 active:scale-95"
            >
              <Clock className="w-3.5 h-3.5" /> Commence Handoff
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 p-16 bg-[#0A0A0A] border border-white/5 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"></div>
         <ShieldCheck className="w-10 h-10 text-[#C5A059] mx-auto mb-8 opacity-40" />
         <h2 className="font-luxury text-3xl text-white mb-4 tracking-wider">Elite Professional Network</h2>
         <p className="font-luxury text-[8px] text-neutral-600 uppercase tracking-[0.6em] mb-12">Verified Synthesis Consultation Suite</p>
         <div className="flex flex-wrap justify-center gap-16">
            {[
              { l: 'Expert Verification', v: 'Rank 100%' },
              { l: 'Knowledge Density', v: 'High Frequency' },
              { l: 'Network Latency', v: '< 50ms (Global)' }
            ].map((stat, i) => (
              <div key={i} className="text-left">
                <div className="text-[6px] font-black text-neutral-600 uppercase tracking-widest mb-2">{stat.l}</div>
                <div className="font-luxury text-lg text-white tracking-widest">{stat.v}</div>
              </div>
            ))}
         </div>
      </div>

      {/* Booking Modal Integration */}
      <AnimatePresence>
        {isBooking && selectedMentor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
              onClick={() => setIsBooking(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl bg-[#0F0F0F] border border-[#C5A059]/20 shadow-3xl overflow-hidden"
            >
              <div className="flex h-[550px]">
                {/* Progress Sidebar */}
                <div className="w-48 border-r border-white/5 p-8 flex flex-col justify-between bg-black/40">
                  <div className="space-y-10">
                    <div className="flex flex-col gap-2">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[7px] font-black ${bookingStep >= 1 ? 'border-[#C5A059] text-[#C5A059]' : 'border-neutral-800 text-neutral-800'}`}>1</div>
                       <span className={`text-[7px] font-black uppercase tracking-widest ${bookingStep === 1 ? 'text-white' : 'text-neutral-600'}`}>Protocol</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[7px] font-black ${bookingStep >= 2 ? 'border-[#C5A059] text-[#C5A059]' : 'border-neutral-800 text-neutral-800'}`}>2</div>
                       <span className={`text-[7px] font-black uppercase tracking-widest ${bookingStep === 2 ? 'text-white' : 'text-neutral-600'}`}>Schedule</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[7px] font-black ${bookingStep >= 3 ? 'border-[#C5A059] text-[#C5A059]' : 'border-neutral-800 text-neutral-800'}`}>3</div>
                       <span className={`text-[7px] font-black uppercase tracking-widest ${bookingStep === 3 ? 'text-white' : 'text-neutral-600'}`}>Briefing</span>
                    </div>
                  </div>
                  <BrandLogo size={32} className="opacity-20" />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-12 relative flex flex-col">
                  <button onClick={() => setIsBooking(false)} className="absolute top-8 right-8 text-neutral-600 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex-grow">
                    {bookingStep === 1 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="font-luxury text-xl text-white mb-2">Select Protocol</h2>
                        <p className="text-[7px] font-black uppercase text-neutral-600 tracking-[0.4em] mb-12">Initialize session parameters</p>
                        
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-6">
                              <div className="flex flex-col gap-2">
                                <label className="text-[7px] font-black uppercase text-neutral-500 tracking-widest">Type</label>
                                <select 
                                  value={formData.session_type}
                                  onChange={e => setFormData({...formData, session_type: e.target.value})}
                                  className="bg-black border border-white/10 p-4 text-[9px] font-luxury text-white focus:border-[#C5A059] outline-none"
                                >
                                  <SelectItem value="design-review">Design Review</SelectItem>
                                  <SelectItem value="portfolio-review">Portfolio Review</SelectItem>
                                  <SelectItem value="career-advice">Career Strategy</SelectItem>
                                  <SelectItem value="technical-help">Node Debugging</SelectItem>
                                </select>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="text-[7px] font-black uppercase text-neutral-500 tracking-widest">Duration</label>
                                <select 
                                  value={formData.duration_minutes.toString()}
                                  onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                                  className="bg-black border border-white/10 p-4 text-[9px] font-luxury text-white focus:border-[#C5A059] outline-none"
                                >
                                  <option value="15">15 Minutes</option>
                                  <option value="30">30 Minutes</option>
                                  <option value="60">60 Minutes</option>
                                </select>
                              </div>
                           </div>
                           <div className="pt-10 border-t border-white/5">
                              <div className="flex items-center gap-4">
                                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                                <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest">Consultant rank verified: {selectedMentor.mentor_rank}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {bookingStep === 2 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="font-luxury text-xl text-white mb-2">Temporal Window</h2>
                        <p className="text-[7px] font-black uppercase text-neutral-600 tracking-[0.4em] mb-12">Synchronize with mentor availability</p>
                        
                        <div className="space-y-8">
                           <div className="flex flex-col gap-3">
                              <label className="text-[7px] font-black uppercase text-neutral-500 tracking-widest">Atelier Date</label>
                              <input 
                                type="date" 
                                value={bookingDate}
                                onChange={e => setBookingDate(e.target.value)}
                                className="bg-black border border-white/10 p-4 text-[9px] font-luxury text-white focus:border-[#C5A059] outline-none invert" 
                              />
                           </div>
                           <div className="flex flex-col gap-3">
                              <label className="text-[7px] font-black uppercase text-neutral-500 tracking-widest">Time Slot</label>
                              <div className="grid grid-cols-3 gap-3">
                                {['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => setBookingTime(time)}
                                    className={`px-3 py-3 border text-[8px] font-black uppercase tracking-widest transition-all ${
                                      bookingTime === time
                                        ? 'bg-[#C5A059] text-black border-[#C5A059]'
                                        : 'bg-black border-white/5 text-neutral-600 hover:border-white/20'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {bookingStep === 3 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="font-luxury text-xl text-white mb-2">Session Briefing</h2>
                        <p className="text-[7px] font-black uppercase text-neutral-600 tracking-[0.4em] mb-12">Define objectives for transmission</p>
                        
                        <div className="space-y-6">
                           <div className="flex flex-col gap-3">
                              <label className="text-[7px] font-black uppercase text-neutral-500 tracking-widest">Inquiry Details</label>
                              <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="State your technical requirements, goals, or design hurdles for this session..."
                                className="bg-black border border-white/10 p-5 text-[10px] text-white focus:border-[#C5A059] outline-none h-40 resize-none font-medium leading-relaxed"
                              />
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-10 border-t border-white/5">
                    {bookingStep > 1 && (
                      <button onClick={() => setBookingStep(prev => prev - 1)} className="flex-1 py-4 bg-white/5 text-neutral-500 font-luxury text-[8px] uppercase tracking-[0.4em] hover:text-white transition-all">Back</button>
                    )}
                    {bookingStep < 3 ? (
                      <button 
                        onClick={() => setBookingStep(prev => prev + 1)}
                        disabled={bookingStep === 2 && (!bookingDate || !bookingTime)}
                        className="flex-2 py-4 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] disabled:opacity-30"
                      >
                        Continue Phase
                      </button>
                    ) : (
                      <button 
                        onClick={handleFinalizeBooking}
                        disabled={loading}
                        className="flex-2 py-4 bg-[#C5A059] text-black font-luxury text-[8px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] disabled:opacity-30 flex items-center justify-center gap-3"
                      >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Finalize Sync
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper components for Select
const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value} className="bg-neutral-900 text-white p-2">
    {children}
  </option>
);

export default Mentorship;
