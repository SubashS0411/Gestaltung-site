
import React, { useState, useEffect } from 'react';
// Fix: Use standard Latin characters for react-router-dom imports to ensure compatibility with the build environment
import { useNavigate, Link } from 'react-router-dom';
import { User, Transfer, Profile, SubscriptionTier, TransferOptions } from '../types';
import { extractFileKey, fetchFigmaFile, extractColors, generateFramerCode } from '../services/figmaService';
import { analyzeDesignIntelligence } from '../services/geminiService';
import { getCachedAnalysis, cacheAnalysis } from '../services/cacheService';
import { AIProvider } from '../lib/ai/unified-client';
import { supabase, isDemoMode, getAuthenticatedSession, consumeTransferQuota } from '../lib/supabase';
import { transferSchema, sanitizeInput } from '../lib/validators';
import { enforceSecurityPolicy } from '../lib/security';
import { awardPoints } from '../lib/ranking/points-system';
import { BrandLogo } from '../components/ui/BrandLogo';
import { cn } from '../lib/utils';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '../components/ui/card';
import { 
  Plus, ArrowRight, Loader2, Terminal, 
  Globe, Trophy, LayoutGrid, Activity, 
  ShieldCheck, Sparkles, Cpu, Hexagon,
  Zap, FileSearch, Palette, ArrowUpRight,
  ArrowDownRight, Bell, Search, Target
} from 'lucide-react';

interface DashboardProps { user: User; }

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedProvider] = useState<AIProvider>('gemini');
  const [isSessionVerified, setIsSessionVerified] = useState(false);
  const [enableResearch] = useState(false);
  const [options] = useState<TransferOptions>({
    includeAnimations: true,
    includeInteractions: true,
    optimizePerformance: true
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const session = await getAuthenticatedSession();
      setIsSessionVerified(!!session);

      if (isDemoMode) {
        let demoProfile = JSON.parse(localStorage.getItem('gestaltung_demo_profile') || 'null');
        if (!demoProfile) {
          demoProfile = {
            id: user.id,
            full_name: user.name || 'Anonymous Designer',
            subscription_tier: SubscriptionTier.FREE,
            subscription_status: 'active',
            monthly_transfers: 3,
            monthly_analyses: 2,
            transfer_limit: 5,
            analysis_limit: 5,
            created_at: new Date().toISOString()
          };
          localStorage.setItem('gestaltung_demo_profile', JSON.stringify(demoProfile));
        }
        setProfile(demoProfile);
        
        const s = {
          transfers: { total: 12, change: 12 },
          analyses: { total: 8, change: -5 },
          palettes: { total: 24, change: 18 },
          ranking: { 
            points: 1250, 
            change: 8, 
            level: 'Expert', 
            position: 42, 
            nextLevel: 'Master', 
            nextLevelPoints: 2000,
            recentBadges: [
              { id: '1', name: 'Fast Porter', icon: '⚡' },
              { id: '2', name: 'A11y King', icon: '👑' },
              { id: '3', name: 'Colorist', icon: '🎨' }
            ]
          },
          usage: {
            transfers: { used: 3, limit: 5 },
            analyses: { used: 2, limit: 5 }
          },
          subscription: { tier: 'free' },
          recentActivity: [
            { id: '1', type: 'transfer', title: 'Landing Page Synth', description: 'Figma to Framer sync completed', timestamp: '2 hours ago', status: 'completed' },
            { id: '2', type: 'analysis', title: 'Fintech Audit', description: 'Color psychology validation failed', timestamp: '5 hours ago', status: 'review' },
            { id: '3', type: 'palette', title: 'Brand Refresh', description: 'Extracted from Figma tokens', timestamp: 'Yesterday', status: 'completed' }
          ],
          community: [
            { id: '1', title: 'Best practices for 120Hz motion?', author: 'Elena V.', responses: 12, href: '#' },
            { id: '2', title: 'Shared element transitions in Framer', author: 'Mark S.', responses: 8, href: '#' }
          ]
        };
        setStats(s);

        const savedTransfers = JSON.parse(localStorage.getItem(`gestaltung_transfers_${user.id}`) || '[]');
        setTransfers(savedTransfers);
      } else {
        const { data: prof } = await supabase.from('profiles').select('*').single();
        const { data: trans } = await supabase.from('transfers').select('*').order('created_at', { ascending: false });
        const { data: s } = await supabase.from('designer_stats').select('*').eq('user_id', user.id).single();
        setProfile(prof);
        setTransfers(trans || []);
        setStats(s);
      }
    } catch (err) {
      console.error('[Identity Fault]', err);
    } finally {
      setLoading(false);
    }
  };

  const startTransferWorker = async (transferId: string, url: string, name: string, provider: AIProvider, researchEnabled: boolean) => {
    try {
      updateTransferInState(transferId, { status: 'queued', progress: 5 });
      const fileKey = extractFileKey(url);
      const figmaData = await fetchFigmaFile(fileKey);
      updateTransferInState(transferId, { status: 'processing', progress: 45, design_name: name || figmaData.name });
      
      let validationData = await getCachedAnalysis(url);
      if (!validationData || researchEnabled) {
        updateTransferInState(transferId, { progress: 60 });
        const colors = extractColors(figmaData);
        validationData = await analyzeDesignIntelligence(colors, { projectName: name || figmaData.name, projectType: 'Web Component', enableMarketResearch: researchEnabled }, provider);
        await cacheAnalysis(url, validationData);
      }
      
      updateTransferInState(transferId, { progress: 90, validation_data: validationData, color_palette: extractColors(figmaData) });
      const code = generateFramerCode(figmaData, options);
      updateTransferInState(transferId, { status: 'completed', progress: 100, framer_code: code });
      
      await consumeTransferQuota(user.id);
      await awardPoints(user.id, 'TRANSFER_COMPLETED');
      loadData();
    } catch (err: any) {
      updateTransferInState(transferId, { status: 'failed', error_message: err.message });
    }
  };

  const updateTransferInState = (id: string, updates: Partial<Transfer>) => {
    setTransfers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      if (isDemoMode) localStorage.setItem(`gestaltung_transfers_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleStartProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    try {
      await enforceSecurityPolicy();
      const validation = transferSchema.safeParse({ projectName: sanitizeInput(projectName), figmaUrl: sanitizeInput(figmaUrl), ...options, enableMarketResearch: enableResearch });
      if (!validation.success) {
        setIsSubmitting(false);
        return;
      }
      const transferId = crypto.randomUUID();
      const newTransfer: Transfer = { id: transferId, user_id: user.id, figma_file_url: figmaUrl, figma_file_key: extractFileKey(figmaUrl), status: 'queued', progress: 0, design_name: projectName || 'Curating...', created_at: new Date().toISOString() };
      
      if (isDemoMode) {
        const updated = [newTransfer, ...transfers];
        setTransfers(updated);
        localStorage.setItem(`gestaltung_transfers_${user.id}`, JSON.stringify(updated));
      } else {
        await supabase.from('transfers').insert({ id: transferId, user_id: user.id, figma_file_url: figmaUrl, figma_file_key: extractFileKey(figmaUrl), status: 'queued', design_name: projectName });
      }
      setIsModalOpen(false);
      startTransferWorker(transferId, figmaUrl, projectName, selectedProvider, enableResearch);
    } catch (err: any) {
      alert(`Synthesis Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <BrandLogo size={32} idSuffix="dash-loader" className="animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Background Symmetrical Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#C5A059]/5 blur-[160px] opacity-30 rounded-full glow-overlay"></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 border-b border-white/5 pb-12">
          <div>
            <h1 className="font-luxury text-4xl text-white tracking-[0.1em] mb-4 uppercase drop-shadow-lg">
              Workspace <span className="text-[#C5A059]">Dashboard</span>
            </h1>
            <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.4em] leading-loose max-w-sm">
              Operator: {user.name || user.email} <br />
              Status: <span className="text-[#C5A059]">{isSessionVerified ? 'NEURAL_LINKED' : 'OFFLINE'}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-[#C5A059] text-black font-luxury text-[9px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 hover:bg-white transition-all"
            >
              <Plus className="inline-block mr-2 w-3.5 h-3.5" />
              New Synthesis
            </button>
            <Link to="/community" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-luxury text-[9px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">
              <FileSearch className="inline-block mr-2 w-3.5 h-3.5" />
              New Audit
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <StatCard
            title="Transfers"
            value={stats.transfers.total}
            change={stats.transfers.change}
            icon={Zap}
            href="/dashboard"
          />
          <StatCard
            title="Analyses"
            value={stats.analyses.total}
            change={stats.analyses.change}
            icon={FileSearch}
            href="/dashboard"
          />
          <StatCard
            title="Color Palettes"
            value={stats.palettes.total}
            change={stats.palettes.change}
            icon={Palette}
            href="/dashboard"
          />
          <StatCard
            title="Rank Points"
            value={stats.ranking.points}
            change={stats.ranking.change}
            icon={Trophy}
            href="/leaderboard"
            highlight
          />
        </div>

        {/* Main Content Sections */}
        <div className="grid gap-10 lg:grid-cols-12 mb-10">
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle>Neural Registry Feed</CardTitle>
              <CardDescription>Your latest design transmissions and audits</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList activities={stats.recentActivity} />
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-10">
            <Card>
              <CardHeader>
                <CardTitle>Cluster Usage</CardTitle>
                <CardDescription>Plan limits and node utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <UsageBar
                  label="Transfers"
                  used={stats.usage.transfers.used}
                  limit={stats.usage.transfers.limit}
                />
                <UsageBar
                  label="Analyses"
                  used={stats.usage.analyses.used}
                  limit={stats.usage.analyses.limit}
                />
                {stats.subscription.tier === 'free' && (
                  <button className="w-full py-5 border border-[#C5A059]/30 text-[#C5A059] font-luxury text-[9px] uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-black transition-all mt-6">
                    Unlock Pro Protocol
                    <ArrowUpRight className="inline-block ml-2 w-3 h-3" />
                  </button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atelier Standing</CardTitle>
                <CardDescription>Ranking and validated badges</CardDescription>
              </CardHeader>
              <CardContent>
                <RankingProgress ranking={stats.ranking} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Neural Hub Highlights</CardTitle>
              <CardDescription>Latest community inquiries and transmissions</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityHighlights items={stats.community} />
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center p-12 text-center bg-black/40 border-dashed border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Hexagon className="w-16 h-16 text-[#C5A059] opacity-20 mb-8 animate-pulse" />
            <h3 className="font-luxury text-[14px] text-white tracking-[0.2em] mb-4">Neural Node Active</h3>
            <p className="text-[10px] font-black uppercase text-neutral-700 tracking-[0.4em] max-w-xs">
              System is primed for high-fidelity Figma-to-Framer porting. All safety protocols are green.
            </p>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#C5A059]/30 p-24 shadow-[0_0_300px_rgba(0,0,0,1)]">
            <div className="flex justify-center mb-16">
               <Sparkles className="w-12 h-12 text-[#C5A059] opacity-70 animate-pulse" />
            </div>
            <h2 className="font-luxury text-[18px] text-white mb-16 uppercase tracking-[0.8em] border-b border-white/5 pb-16 text-center">Protocol Synthesis</h2>
            <form onSubmit={handleStartProcess} className="space-y-14">
               <div className="flex flex-col gap-6">
                 <label className="text-[10px] font-black uppercase text-neutral-600 tracking-[1em] text-center">Node Identity</label>
                 <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="bg-black border border-white/10 p-8 outline-none font-luxury text-[16px] text-white focus:border-[#C5A059]/50 transition-all text-center placeholder:text-neutral-900" placeholder="LABEL_NODE_V3" />
               </div>
               <div className="flex flex-col gap-6">
                 <label className="text-[10px] font-black uppercase text-neutral-600 tracking-[1em] text-center">Figma Hub Resource</label>
                 <input type="text" value={figmaUrl} onChange={e => setFigmaUrl(e.target.value)} className="bg-black border border-white/10 p-8 outline-none font-luxury text-[16px] text-[#C5A059] focus:border-[#C5A059]/50 transition-all text-center placeholder:text-neutral-900" placeholder="FIGMA.COM/DESIGN/SOURCE" />
               </div>
               <div className="pt-20 flex gap-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-8 bg-white/5 text-[11px] font-black text-neutral-500 uppercase tracking-[1em] hover:text-white transition-all">Abort</button>
                  <button type="submit" className="flex-[2] py-8 bg-[#C5A059] text-black font-luxury text-[11px] uppercase tracking-[1em] shadow-2xl shadow-yellow-500/10 active:scale-95 transition-all">Commence Sync</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function StatCard({ title, value, change, icon: Icon, href, highlight = false }: any) {
  const isPositive = change >= 0;
  return (
    <Card className={cn("group transition-all hover:border-[#C5A059]/40", highlight ? "bg-[#C5A059]/5 border-[#C5A059]/20" : "")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-[10px] tracking-[0.1em]">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", highlight ? "text-[#C5A059]" : "text-neutral-700")} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-luxury text-white mb-3 tracking-tighter">{value}</div>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest mt-1">
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1.5" />
          )}
          <span className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
            {Math.abs(change)}%
          </span>
          <span className="ml-2 text-neutral-700">vs last cycle</span>
        </div>
        <Link to={href} className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C5A059] hover:underline mt-6 inline-block opacity-60 hover:opacity-100 transition-opacity">
          Scan All Records →
        </Link>
      </CardContent>
    </Card>
  );
}

function RecentActivityList({ activities }: { activities: any[] }) {
  return (
    <div className="space-y-10">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-8 border-b border-white/5 pb-10 last:border-0 last:pb-0 group">
          <div className={cn(
            'p-4 bg-white/[0.02] border border-white/5 transition-all group-hover:bg-[#C5A059]/5 group-hover:border-[#C5A059]/20',
            activity.type === 'transfer' && 'text-blue-500',
            activity.type === 'analysis' && 'text-purple-500',
            activity.type === 'palette' && 'text-pink-500'
          )}>
            {activity.type === 'transfer' && <Zap className="h-5 w-5" />}
            {activity.type === 'analysis' && <FileSearch className="h-5 w-5" />}
            {activity.type === 'palette' && <Palette className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-luxury text-white tracking-widest uppercase group-hover:text-[#C5A059] transition-colors">{activity.title}</p>
            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-3">{activity.description}</p>
            <p className="text-[7px] font-black text-neutral-800 uppercase tracking-[0.4em] mt-3">{activity.timestamp}</p>
          </div>
          <div className="px-5 py-2 bg-white/[0.02] border border-white/10 text-[7px] font-black text-neutral-500 uppercase tracking-widest">
            {activity.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number | string }) {
  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : (used / (limit as number)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.5em]">
        <span className="text-neutral-500">{label}</span>
        <span className="text-white">
          {used} / {isUnlimited ? '∞' : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-white/5 h-[1px] relative">
          <div
            className={cn(
              'h-full transition-all duration-[2000ms] ease-out',
              percentage < 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
              percentage < 90 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
              'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function CommunityHighlights({ items }: { items: any[] }) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className="flex flex-col p-8 border border-white/5 bg-black hover:border-[#C5A059]/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-luxury text-white group-hover:text-[#C5A059] transition-colors leading-relaxed tracking-wider">{item.title}</span>
            <span className="px-3 py-1 border border-white/10 text-[7px] font-black text-neutral-600 uppercase tracking-widest">{item.responses} feeds</span>
          </div>
          <p className="text-[8px] font-black text-neutral-700 uppercase tracking-[0.4em]">Operator: {item.author}</p>
        </Link>
      ))}
      <Link to="/community" className="block text-center py-6 text-[8px] font-black uppercase tracking-[0.6em] text-neutral-700 hover:text-[#C5A059] transition-all">
        Enter Neural Hub →
      </Link>
    </div>
  );
}

function RankingProgress({ ranking }: { ranking: any }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] font-black text-neutral-700 uppercase tracking-[0.4em] mb-4">Registry Rank</p>
          <p className="font-luxury text-[22px] text-white tracking-[0.1em]">{ranking.level}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-neutral-700 uppercase tracking-[0.4em] mb-4">Position</p>
          <p className="font-luxury text-[22px] text-[#C5A059] tracking-[0.1em]">#{ranking.position}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.5em]">
          <span className="text-neutral-500">Propagation to {ranking.nextLevel}</span>
          <span className="text-white">{ranking.points} / {ranking.nextLevelPoints} PTS</span>
        </div>
        <div className="w-full bg-white/5 h-[1px] relative">
          <div
            className="bg-[#C5A059] h-full shadow-[0_0_15px_rgba(197,160,89,0.4)] transition-all duration-[2500ms] ease-in-out"
            style={{ width: `${(ranking.points / ranking.nextLevelPoints) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 pt-8">
        {ranking.recentBadges.map((badge: any) => (
          <div
            key={badge.id}
            className="flex flex-col items-center p-6 bg-white/[0.01] border border-white/5 group hover:border-[#C5A059]/30 transition-all cursor-default"
            title={badge.name}
          >
            <span className="text-2xl mb-4 group-hover:scale-125 transition-transform duration-500 drop-shadow-lg">{badge.icon}</span>
            <span className="text-[7px] text-center font-black uppercase text-neutral-700 tracking-tighter group-hover:text-neutral-400 transition-colors">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
