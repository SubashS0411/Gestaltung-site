
import React, { useState, useEffect, useRef } from 'react';
// Fix: Use standard Latin characters for react-router-dom imports to resolve "no exported member" errors
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Transfer, User } from '../types';
import { supabase, isDemoMode, getAuthenticatedSession } from '../lib/supabase';
import { createLiveConsultant } from '../lib/ai/providers';
import { 
  ArrowLeft, Copy, Code, Brain, Layout, 
  Loader2, XCircle, CheckCircle, AlertCircle, RefreshCw,
  Zap, Clock, ShieldCheck, Lock, Globe, MessageSquare, Mic, MicOff, ExternalLink, Terminal, Eye
} from 'lucide-react';

interface ExportDetailProps {
  user: User;
}

const ExportDetail: React.FC<ExportDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'code' | 'market' | 'preview'>('audit');
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{ type: 'user' | 'model'; text: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const pollingInterval = useRef<number | null>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  const fetchTransfer = async () => {
    try {
      await getAuthenticatedSession();
      if (isDemoMode) {
        const stored = localStorage.getItem(`gestaltung_transfers_${user.id}`);
        if (stored) {
          const all: Transfer[] = JSON.parse(stored);
          const found = all.find(t => t.id === id);
          if (found) setData(found);
        }
      } else {
        const { data: transfer, error } = await supabase
          .from('transfers')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (transfer) setData(transfer);
      }
    } catch (err) {
      console.error("[Integrity Fault] Desynchronized:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfer();
    pollingInterval.current = window.setInterval(() => {
      if (data && (data.status === 'processing' || data.status === 'queued')) {
        fetchTransfer();
      }
    }, 3000);
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      if (liveSessionRef.current) liveSessionRef.current.close();
    };
  }, [id, user.id, data?.status]);

  const handleCopyCode = () => {
    if (data?.framer_code) {
      navigator.clipboard.writeText(data.framer_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper for robust base64 encoding without stack limits
  const encodeAudioData = (data: Int16Array) => {
    const bytes = new Uint8Array(data.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const toggleLiveConsultant = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = createLiveConsultant({
        onopen: () => {
          setIsLiveActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { 
                data: encodeAudioData(int16), 
                mimeType: 'audio/pcm;rate=16000' 
              }
            }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.inputTranscription) {
            setTranscriptions(prev => [...prev, { type: 'user', text: msg.serverContent.inputTranscription.text }]);
          }
          if (msg.serverContent?.outputTranscription) {
            setTranscriptions(prev => [...prev, { type: 'model', text: msg.serverContent.outputTranscription.text }]);
          }
          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            const binary = atob(audio);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const int16 = new Int16Array(bytes.buffer);
            const buffer = outputCtx.createBuffer(1, int16.length, 24000);
            const channel = buffer.getChannelData(0);
            for (let i = 0; i < int16.length; i++) channel[i] = int16[i] / 32768;
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            const start = Math.max(outputCtx.currentTime, nextStartTimeRef.current);
            source.start(start);
            nextStartTimeRef.current = start + buffer.duration;
          }
        },
        onclose: () => setIsLiveActive(false),
        onerror: () => setIsLiveActive(false)
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) {
      alert("Microphone access is required for the Neural Consultant.");
    }
  };

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  if (!data) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center text-white">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-8" />
      <h2 className="text-4xl font-black mb-4">Neural Hub Desync</h2>
      <Link to="/dashboard" className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Return to Workstation</Link>
    </div>
  );

  const v = data.validation_data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16 border-b border-white/5 pb-12">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-6">
             <Link to="/dashboard" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#3B82F6] flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Dashboard</Link>
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-500" /><span className="text-[8px] font-black text-blue-500 uppercase">Neural Audit v3</span>
             </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white mb-6 leading-[0.9]">{data.design_name}</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={toggleLiveConsultant} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isLiveActive ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-[#1E293B] text-blue-400 border border-blue-500/20 hover:border-blue-500/50'}`}>
            {isLiveActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isLiveActive ? 'Kill Connection' : 'Voice Consultant'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
           <div className="flex gap-10 mb-12 border-b border-white/5 overflow-x-auto scrollbar-hide">
              {[
                { id: 'audit', label: 'Neural Intel', icon: Brain },
                { id: 'preview', label: 'Virtual View', icon: Eye },
                { id: 'market', label: 'Market Trends', icon: Globe },
                { id: 'code', label: 'Export Block', icon: Terminal },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-6 transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-[#3B82F6]' : 'text-slate-500 hover:text-white'}`}>
                  <tab.icon className="w-3.5 h-3.5" />{tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]"></div>}
                </button>
              ))}
           </div>

           {isLiveActive && (
             <div className="mb-12 bg-blue-600/5 border border-blue-600/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Consultant Processing Audio...</span>
                </div>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-4 scrollbar-hide">
                   {transcriptions.map((t, i) => (
                     <div key={i} className={`flex gap-3 ${t.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-xl text-xs max-w-[85%] leading-relaxed ${t.type === 'user' ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20' : 'bg-slate-800 text-slate-300 border border-white/5'}`}>
                           {t.text}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           <div className="min-h-[600px]">
             {activeTab === 'preview' && (
               <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                 <div className="bg-[#1E293B] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                   <div className="scanning-line opacity-10"></div>
                   <div className="bg-[#0F172A] border-b border-white/5 p-4 flex items-center justify-between">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                     </div>
                     <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Render Engine v3.0</div>
                     <div className="w-10"></div>
                   </div>
                   <div className="p-16 flex items-center justify-center bg-slate-900/50">
                      <div 
                        className="w-full max-w-lg p-12 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/5 backdrop-blur-3xl transform transition-transform hover:scale-[1.01]"
                        style={{ backgroundColor: data.color_palette?.[0] || '#3B82F6' }}
                      >
                         <h2 className="text-5xl font-black text-white tracking-tighter mb-6">{data.design_name}</h2>
                         <p className="text-white/80 text-lg font-medium mb-12 leading-relaxed">
                           Synthesized primitive node verified via Gestaltung Neural Audit. 
                           Ready for React deployment.
                         </p>
                         <div className="flex gap-4">
                           <div className="px-8 py-4 bg-white/10 rounded-2xl text-white font-bold text-sm border border-white/20">Primary Action</div>
                           <div className="px-8 py-4 bg-black/30 rounded-2xl text-white font-bold text-sm">Ghost State</div>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'market' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {v?.market_research ? (
                   <>
                     <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-12">
                        <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">
                          <Globe className="w-4 h-4" /> Global Trend Grounding
                        </div>
                        <div className="prose prose-invert max-w-none text-slate-300 text-base leading-loose font-medium">
                          {v.market_research.summary.split('\n').map((line, i) => <p key={i} className="mb-6">{line}</p>)}
                        </div>
                     </div>
                     {/* MANDATORY: List Google Search grounding chunks URLs */}
                     {v.market_research.sources && v.market_research.sources.length > 0 && (
                        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-10 mt-8">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Verified Grounding Sources</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {v.market_research.sources.map((source: any, idx: number) => (
                                 source.web && (
                                    <a 
                                       key={idx} 
                                       href={source.web.uri} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-between group"
                                    >
                                       <div className="flex flex-col gap-1 overflow-hidden">
                                          <span className="text-[10px] font-bold text-white truncate">{source.web.title || 'Market Source'}</span>
                                          <span className="text-[8px] text-slate-500 truncate">{source.web.uri}</span>
                                       </div>
                                       <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                    </a>
                                 )
                              ))}
                           </div>
                        </div>
                     )}
                   </>
                 ) : (
                   <div className="bg-slate-800/10 border border-dashed border-white/10 rounded-3xl p-32 text-center">
                      <Globe className="w-16 h-16 text-slate-800 mx-auto mb-8" />
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Market Research not toggled for this node.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'code' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-blue-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Framer Module v3 Synthesis</span>
                    </div>
                    <button 
                      onClick={handleCopyCode}
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all"
                    >
                      {copied ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy Block'}
                    </button>
                  </div>
                  <pre className="relative bg-[#0F172A] border border-white/10 rounded-2xl p-10 overflow-x-auto text-xs font-mono text-blue-400 leading-relaxed scrollbar-hide shadow-inner">
                    <code>{data.framer_code || '// Neural pipeline idle...'}</code>
                  </pre>
               </div>
             )}

             {activeTab === 'audit' && v && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {[
                       { l: 'UX Grid', v: v.overall_ux_score, c: '#3B82F6' }, 
                       { l: 'Visual Flow', v: v.visual_hierarchy_score, c: '#8B5CF6' }, 
                       { l: 'A11y Grade', v: v.accessibility_score, c: '#10B981' }, 
                       { l: 'Complexity', v: v.interaction_analysis.complexity_score * 10, c: '#F59E0B' }
                     ].map((s, i) => (
                       <div key={i} className="bg-[#1E293B] border border-white/5 p-8 rounded-2xl shadow-xl hover:border-white/10 transition-all group">
                          <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">{s.l}</div>
                          <div className="text-5xl font-black text-white tracking-tighter">{s.v}%</div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full mt-8 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.v}%`, backgroundColor: s.c }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Diagnostic Logs</h3>
                    {v.issues.map((issue, i) => (
                      <div key={i} className="bg-[#1E293B] border border-white/5 rounded-2xl p-12 hover:border-white/10 transition-all group relative overflow-hidden">
                         <div className={`absolute top-0 left-0 w-1 h-full ${issue.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                               <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${issue.severity === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{issue.severity}</span>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{issue.category}</span>
                            </div>
                         </div>
                         <h4 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight">{issue.description}</h4>
                         <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mt-10">
                            <div className="text-[10px] font-black text-[#10B981] uppercase mb-4 tracking-widest flex items-center gap-2"><Zap className="w-4 h-4" /> Neural Correction</div>
                            <p className="text-base text-slate-300 leading-relaxed font-medium">{issue.fix}</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}
           </div>
        </div>
        
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-12">Cluster Timing</h3>
              <div className="space-y-12">
                 <div>
                    <div className="text-[10px] font-black text-[#3B82F6] uppercase mb-4 tracking-widest">Synthesis Speed</div>
                    <div className="text-5xl font-black text-white tracking-tighter">{v?.interaction_analysis.suggested_timing || 'Optimal'}</div>
                 </div>
              </div>
           </div>
           
           <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-10 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10">Design Tokens</h3>
              <div className="grid grid-cols-4 gap-6 mb-12">
                 {data.color_palette?.map((c, i) => (
                   <div key={i} className="group relative">
                     <div className="w-full aspect-square rounded-2xl border border-white/10 shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: c }}></div>
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-black text-[9px] text-white rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity uppercase">{c}</div>
                   </div>
                 ))}
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">A11y Rating</div>
                 <div className="text-emerald-500 font-black uppercase text-2xl tracking-tighter">{v?.color_analysis.accessibility_grade || 'AA Verified'}</div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/10 rounded-2xl p-12 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-3">
                <Brain className="w-5 h-5" /> Design Intent
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                "{v?.color_analysis.cultural_notes || 'Analyzing design primitives for maximal professional reliability and aesthetic optimism.'}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDetail;
