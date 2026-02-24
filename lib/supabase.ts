
import { createClient } from '@supabase/supabase-js';
import { Profile, DesignerStats, LeaderboardEntry, Template, CommunityQuestion, MentorshipSession, LiveReview, MentorAnalytics, SessionFeedback, MentorGoal, FeedbackRequest } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isDemoMode = supabaseUrl.includes('placeholder') || supabaseAnonKey === 'placeholder-key';

export const getAuthenticatedSession = async () => {
  if (isDemoMode) return { user: { id: 'demo-user-123', email: 'designer@gestaltung.ai' } };
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) throw new Error('Unauthorized session state detected.');
  return session;
};

const MOCK_FEEDBACK_REQUESTS: FeedbackRequest[] = [
  { id: 'fr1', requester_id: '1', requester_name: 'Elena Vance', title: 'Fintech Dashboard Feedback', description: 'Need feedback on the balance between high-density data and visual breathing room.', figma_url: 'https://figma.com/file/123', status: 'open', urgency: 'high', created_at: new Date().toISOString() },
  { id: 'fr2', requester_id: '2', requester_name: 'Mark S.', title: 'Bespoke Iconography Audit', description: 'Seeking thoughts on the line-weight consistency across the core suite.', figma_url: 'https://figma.com/file/456', status: 'open', urgency: 'medium', created_at: new Date().toISOString() }
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { user_id: '1', full_name: 'Elena Vance', total_points: 12500, rank_level: 'Legend', designs_uploaded: 142, templates_sold: 28, avg_ux_score: 96, badges: ['top_10', 'mentor_master'], rank_position: 1 },
  { user_id: '2', full_name: 'Mark S.', total_points: 9800, rank_level: 'Master', designs_uploaded: 89, templates_sold: 15, avg_ux_score: 94, badges: ['top_10'], rank_position: 2 },
  { user_id: '3', full_name: 'Helly R.', total_points: 8400, rank_level: 'Expert', designs_uploaded: 65, templates_sold: 12, avg_ux_score: 92, badges: ['first_transfer'], rank_position: 3 },
  { user_id: '4', full_name: 'Irving B.', total_points: 7200, rank_level: 'Expert', designs_uploaded: 54, templates_sold: 8, avg_ux_score: 89, badges: [], rank_position: 4 },
  { user_id: '5', full_name: 'Burt G.', total_points: 6100, rank_level: 'Intermediate', designs_uploaded: 42, templates_sold: 5, avg_ux_score: 88, badges: [], rank_position: 5 },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: 't1',
    creator_id: '1',
    creator_name: 'Elena Vance',
    name: 'SaaS Dashboard Pro',
    description: 'High-fidelity dashboard for complex B2B platforms.',
    category: 'dashboard',
    tags: ['admin', 'charts', 'saas'],
    preview_image_url: 'https://images.unsplash.com/photo-1551288049-bbda3865c670?q=80&w=2670&auto=format&fit=crop',
    is_free: false,
    price_inr: 1499,
    downloads: 120,
    sales: 45,
    rating: 4.8,
    reviews_count: 12,
    status: 'approved',
    featured: true,
    created_at: new Date().toISOString()
  }
];

const MOCK_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q1',
    user_id: '1',
    user_name: 'Elena Vance',
    title: 'Optimizing Framer motion for mobile 120Hz displays?',
    content: 'Has anyone cracked the best layoutId strategy for complex shared element transitions without drop in frame rate on newer iPhones?',
    tags: ['framer-motion', 'performance', 'ios'],
    upvotes: 42,
    replies_count: 12,
    is_resolved: true,
    created_at: new Date().toISOString()
  }
];

const MOCK_LIVE_REVIEWS: LiveReview[] = [
  {
    id: 'lr1',
    title: 'Q1 Dashboard Audit: FinTech Tier',
    description: 'Real-time analysis of high-density financial interfaces. Focus on visual hierarchy and decimal precision.',
    host_name: 'Elena Vance',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
    duration_minutes: 60,
    current_participants: 12,
    max_participants: 50,
    status: 'live',
    stream_url: 'https://example.com/live/cluster-1'
  },
  {
    id: 'lr2',
    title: 'Atelier Workshop: Micro-Interactions',
    description: 'Bespoke implementation of layout transition protocols in Framer.',
    host_name: 'Mark S.',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    duration_minutes: 45,
    current_participants: 8,
    max_participants: 20,
    status: 'upcoming'
  },
  {
    id: 'lr3',
    title: 'Retrospective: Luxury E-commerce',
    description: 'Deconstructing the aesthetic logic of premium digital retail.',
    host_name: 'Irving B.',
    scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    duration_minutes: 30,
    current_participants: 45,
    max_participants: 100,
    status: 'completed',
    recording_url: 'https://example.com/archive/lr3'
  }
];

const MOCK_MENTORS: MentorshipSession[] = [
  {
    id: 'm1',
    mentor_id: '1',
    mentor_name: 'Elena Vance',
    mentor_rank: 'Legend',
    topic: 'Advanced Framer Logic & Multi-variant Systems',
    price_inr: 2999,
    availability: 'Mon, Wed 10AM - 12PM',
    description: 'Deep dive into complex component architecture and production handoff.'
  }
];

// MENTOR ANALYTICS DATA
const MOCK_MENTOR_ANALYTICS_PAYLOAD = {
  overview: {
    total_revenue: 124500,
    revenue_change: 12,
    sessions_completed: 42,
    sessions_change: 8,
    avg_rating: 4.9,
    rating_change: 2,
    total_mentees: 28,
    mentees_change: 15
  },
  revenue_trend: [
    { date: 'Jan', revenue: 15000 },
    { date: 'Feb', revenue: 18000 },
    { date: 'Mar', revenue: 22000 },
    { date: 'Apr', revenue: 21000 },
    { date: 'May', revenue: 25000 },
    { date: 'Jun', revenue: 23500 }
  ],
  revenue_breakdown: {
    paid_sessions: 95000,
    paid_percentage: 76,
    free_sessions_value: 29500,
    free_percentage: 24
  },
  earnings: {
    total_earned: 124500,
    available_balance: 12000,
    withdrawn: 112500
  },
  sessions_trend: [
    { date: 'Mon', completed: 3, cancelled: 0 },
    { date: 'Tue', completed: 5, cancelled: 1 },
    { date: 'Wed', completed: 2, cancelled: 0 },
    { date: 'Thu', completed: 4, cancelled: 0 },
    { date: 'Fri', completed: 6, cancelled: 1 }
  ],
  session_types: [
    { name: 'Design Review', value: 45 },
    { name: 'Portfolio', value: 25 },
    { name: 'Career', value: 20 },
    { name: 'Technical', value: 10 }
  ],
  avg_duration: 45,
  avg_response_time: 1.2,
  rating_trend: [
    { date: 'Day 1', rating: 4.8 },
    { date: 'Day 5', rating: 4.9 },
    { date: 'Day 10', rating: 4.85 },
    { date: 'Day 15', rating: 5.0 },
    { date: 'Day 20', rating: 4.9 }
  ],
  detailed_ratings: {
    overall: 4.9,
    helpfulness: 5.0,
    expertise: 4.8,
    communication: 4.9
  },
  recent_feedback: [
    { id: 'f1', rating: 5, created_at: new Date().toISOString(), feedback_text: 'Absolutely exceptional technical insights into Framer motion.', mentee_name: 'Alice Cooper' },
    { id: 'f2', rating: 4, created_at: new Date().toISOString(), feedback_text: 'Very helpful session on visual hierarchy. Highly recommended.', mentee_name: 'Bob Marley' }
  ],
  goals: [
    { id: 'g1', title: 'Monthly Sessions', target_value: 50, current_value: 42, status: 'in_progress' },
    { id: 'g2', title: 'Revenue Target', target_value: 30000, current_value: 30000, status: 'completed' },
    { id: 'g3', title: 'Rating Target', target_value: 5, current_value: 4, status: 'in_progress' }
  ]
};

const createSupabaseClient = () => {
  if (isDemoMode) {
    return {
      auth: {
        getSession: async () => ({ data: { session: { user: { id: 'demo-user-123' } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: { user: { id: 'demo-user-123', email: 'designer@gestaltung.ai' } }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: (table: string) => ({
        select: (query?: string) => ({
          eq: (col: string, val: any) => ({
            single: async () => {
              if (table === 'profiles') return { data: JSON.parse(localStorage.getItem('gestaltung_demo_profile') || 'null'), error: null };
              if (table === 'mentor_analytics') return { data: MOCK_MENTOR_ANALYTICS_PAYLOAD, error: null };
              return { data: null, error: null };
            },
            async then(resolve: any) {
              if (table === 'feedback_requests') resolve({ data: MOCK_FEEDBACK_REQUESTS, error: null });
              resolve({ data: [], error: null });
            }
          }),
          single: async () => {
             if (table === 'mentor_analytics') return { data: MOCK_MENTOR_ANALYTICS_PAYLOAD, error: null };
             return { data: null, error: null };
          },
          order: (col: string, opt: any) => ({
            async then(resolve: any) {
              if (table === 'questions') resolve({ data: MOCK_QUESTIONS, error: null });
              if (table === 'live_reviews') resolve({ data: MOCK_LIVE_REVIEWS, error: null });
              if (table === 'feedback_requests') resolve({ data: MOCK_FEEDBACK_REQUESTS, error: null });
              resolve({ data: [], error: null });
            }
          }),
          async then(resolve: any) {
            if (table === 'leaderboard') resolve({ data: MOCK_LEADERBOARD, error: null });
            if (table === 'templates') resolve({ data: MOCK_TEMPLATES, error: null });
            if (table === 'mentors') resolve({ data: MOCK_MENTORS, error: null });
            if (table === 'live_reviews') resolve({ data: MOCK_LIVE_REVIEWS, error: null });
            if (table === 'feedback_requests') resolve({ data: MOCK_FEEDBACK_REQUESTS, error: null });
            resolve({ data: [], error: null });
          }
        }),
        insert: async (data: any) => {
          if (table === 'feedback_requests') MOCK_FEEDBACK_REQUESTS.unshift({ ...data, id: Math.random().toString(), status: 'open', urgency: 'medium', created_at: new Date().toISOString() });
          return { data, error: null };
        }
      })
    } as any;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
export async function consumeTransferQuota(userId: string) {}
