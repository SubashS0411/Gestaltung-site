
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  TEAMS = 'teams'
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  company_name?: string;
  
  subscription_tier: SubscriptionTier;
  subscription_status: string;
  
  monthly_transfers: number;
  monthly_analyses: number;
  transfer_limit: number;
  analysis_limit: number;
  
  created_at: string;
}

export interface DesignerStats {
  id: string;
  user_id: string;
  total_transfers: number;
  total_analyses: number;
  designs_uploaded: number;
  templates_created: number;
  templates_sold: number;
  avg_ux_score: number;
  avg_color_score: number;
  designs_featured: number;
  feedback_given: number;
  feedback_received: number;
  helpful_votes: number;
  mentorship_sessions: number;
  total_points: number;
  rank_level: string;
  rank_position?: number;
  badges: string[]; 
  streak_days: number;
  last_activity: string;
}

export interface FeedbackRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  title: string;
  description: string;
  figma_url: string;
  status: 'open' | 'closed';
  urgency: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface CommunityQuestion {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  replies_count: number;
  is_resolved: boolean;
  created_at: string;
}

export interface LiveReview {
  id: string;
  title: string;
  description: string;
  host_name: string;
  host_avatar?: string;
  scheduled_at: string;
  duration_minutes: number;
  current_participants: number;
  max_participants: number;
  status: 'upcoming' | 'live' | 'completed';
  recording_url?: string;
  stream_url?: string;
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  mentor_name: string;
  mentor_rank: string;
  mentor_avatar?: string;
  topic: string;
  price_inr: number;
  availability: string;
  description: string;
  session_type?: string;
}

export interface MentorAnalytics {
  id: string;
  mentor_id: string;
  date: string;
  sessions_completed: number;
  sessions_cancelled: number;
  total_session_minutes: number;
  revenue_earned_inr: number;
  sessions_paid: number;
  sessions_free: number;
  profile_views: number;
  booking_requests: number;
  avg_rating: number;
  total_reviews: number;
  avg_response_time_hours: number;
  created_at: string;
}

export interface SessionFeedback {
  id: string;
  session_id: string;
  mentee_id: string;
  mentee_name: string;
  mentor_id: string;
  overall_rating: number;
  helpfulness_rating: number;
  expertise_rating: number;
  communication_rating: number;
  feedback_text: string;
  would_recommend: boolean;
  helpful_areas: string[];
  created_at: string;
}

export interface MentorGoal {
  id: string;
  mentor_id: string;
  goal_type: 'monthly_sessions' | 'monthly_revenue' | 'rating_target';
  title: string;
  target_value: number;
  current_value: number;
  month: string;
  status: 'in_progress' | 'completed' | 'failed';
  created_at: string;
}

export interface Template {
  id: string;
  creator_id: string;
  creator_name: string;
  name: string;
  description: string;
  category: 'landing-page' | 'dashboard' | 'mobile-app' | 'component-library';
  tags: string[];
  preview_image_url: string;
  figma_file_url?: string;
  framer_code?: string;
  is_free: boolean;
  price_inr: number;
  downloads: number;
  sales: number;
  rating: number;
  reviews_count: number;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  total_points: number;
  rank_level: string;
  designs_uploaded: number;
  templates_sold: number;
  avg_ux_score: number;
  badges: any[];
  rank_position: number;
}

export interface DesignValidation {
  overall_ux_score: number;
  visual_hierarchy_score: number;
  navigation_score: number;
  accessibility_score: number;
  interaction_score: number;
  color_psychology_score: number;
  issues: {
    severity: 'critical' | 'major' | 'minor';
    category: string;
    description: string;
    fix: string;
  }[];
  suggestions: {
    priority: 'high' | 'medium' | 'low';
    impact: string;
    effort: string;
    description: string;
  }[];
  color_analysis: {
    palette: string[];
    psychology: { [key: string]: string };
    cultural_notes: string;
    accessibility_grade: 'AAA' | 'AA' | 'Fail';
  };
  interaction_analysis: {
    suggested_timing: string;
    complexity_score: number;
    gesture_recommendations: string[];
  };
  market_research?: {
    summary: string;
    sources: { web?: { uri: string; title: string } }[];
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Fix: Added missing TransferOptions and Transfer interfaces
export interface TransferOptions {
  includeAnimations: boolean;
  includeInteractions: boolean;
  optimizePerformance: boolean;
  enableMarketResearch?: boolean;
}

export interface Transfer {
  id: string;
  user_id: string;
  figma_file_url: string;
  figma_file_key: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  design_name: string;
  created_at: string;
  validation_data?: DesignValidation;
  color_palette?: string[];
  framer_code?: string;
  error_message?: string;
}
