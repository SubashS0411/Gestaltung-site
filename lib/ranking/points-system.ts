
import { supabase, isDemoMode } from '../supabase';

export const POINTS_CONFIG = {
  // Design Activity
  TRANSFER_COMPLETED: 10,
  UX_ANALYSIS_COMPLETED: 15,
  HIGH_UX_SCORE: 50, // Score > 90
  DESIGN_FEATURED: 100,
  
  // Template Marketplace
  TEMPLATE_UPLOADED: 25,
  TEMPLATE_APPROVED: 50,
  TEMPLATE_SOLD: 30,
  TEMPLATE_BESTSELLER: 200, // 100+ sales
  
  // Community Engagement
  FEEDBACK_GIVEN: 5,
  FEEDBACK_HELPFUL_VOTE: 10,
  MENTORSHIP_SESSION: 40,
  QUESTION_ANSWERED: 15,
  
  // Achievements
  DAILY_STREAK_BONUS: 5, // Per day
  WEEKLY_ACTIVE: 20,
  BADGE_UNLOCKED: 25
};

export const RANK_LEVELS = [
  { name: 'Beginner', minPoints: 0, color: '#94A3B8', icon: '🌱' },
  { name: 'Intermediate', minPoints: 500, color: '#3B82F6', icon: '⭐' },
  { name: 'Expert', minPoints: 2000, color: '#8B5CF6', icon: '💎' },
  { name: 'Master', minPoints: 5000, color: '#F59E0B', icon: '👑' },
  { name: 'Legend', minPoints: 10000, color: '#EF4444', icon: '🏆' }
];

export const INITIAL_BADGES = [
  {
    id: 'b1',
    code: 'first_transfer',
    name: 'First Port',
    description: 'Completed your first Figma to Framer transfer',
    rarity: 'common',
    points_value: 25,
    criteria: { type: 'transfers_count', threshold: 1 }
  },
  {
    id: 'b2',
    code: 'ux_master',
    name: 'UX Visionary',
    description: 'Achieve a UX score of 95% or higher',
    rarity: 'rare',
    points_value: 50,
    criteria: { type: 'ux_score', threshold: 95 }
  },
  {
    id: 'b3',
    code: 'streak_3',
    name: 'Consistent Designer',
    description: 'Maintain a 3-day activity streak',
    rarity: 'common',
    points_value: 30,
    criteria: { type: 'streak_days', threshold: 3 }
  },
  {
    id: 'b4',
    code: 'elite_rank',
    name: 'Elite Architect',
    description: 'Reach Expert rank level',
    rarity: 'epic',
    points_value: 100,
    criteria: { type: 'rank_level', value: 'Expert' }
  },
  {
    id: 'b5',
    code: 'transfer_master',
    name: 'Transfer Master',
    description: 'Completed 100 transfers',
    rarity: 'rare',
    points_value: 100,
    criteria: { type: 'transfers_count', threshold: 100 }
  },
  {
    id: 'b6',
    code: 'streak_master',
    name: 'Streak Master',
    description: '30 day activity streak',
    rarity: 'legendary',
    points_value: 300,
    criteria: { type: 'streak_days', threshold: 30 }
  },
  {
    id: 'b7',
    code: 'legend',
    name: 'Gestaltung Legend',
    description: 'Reached Legend rank',
    rarity: 'legendary',
    points_value: 1000,
    criteria: { type: 'rank_level', value: 'Legend' }
  }
];

/**
 * Calculate user's rank level based on points
 */
export function calculateRankLevel(points: number): string {
  for (let i = RANK_LEVELS.length - 1; i >= 0; i--) {
    if (points >= RANK_LEVELS[i].minPoints) {
      return RANK_LEVELS[i].name;
    }
  }
  return 'Beginner';
}

/**
 * Award points to user and handle ranking/badges
 */
export async function awardPoints(
  userId: string,
  action: keyof typeof POINTS_CONFIG,
  metadata?: any
) {
  const points = POINTS_CONFIG[action];
  if (!points) throw new Error(`Invalid action: ${action}`);

  if (isDemoMode) {
    const statsKey = `stats:${userId}`;
    const stats = JSON.parse(localStorage.getItem(statsKey) || '{"total_points": 0, "badges": [], "total_transfers": 0, "streak_days": 1, "points_history": []}');
    
    const newTotalPoints = (stats.total_points || 0) + points;
    const newRankLevel = calculateRankLevel(newTotalPoints);
    
    if (action === 'TRANSFER_COMPLETED') {
      stats.total_transfers = (stats.total_transfers || 0) + 1;
    }

    // Update history
    if (!stats.points_history) stats.points_history = [];
    stats.points_history.unshift({
      id: Math.random().toString(36).substr(2, 9),
      action,
      points_earned: points,
      description: `Earned ${points} points for ${action}`,
      created_at: new Date().toISOString()
    });
    stats.points_history = stats.points_history.slice(0, 20);

    const updatedStats = {
      ...stats,
      total_points: newTotalPoints,
      rank_level: newRankLevel,
      last_activity: new Date().toISOString()
    };
    
    localStorage.setItem(statsKey, JSON.stringify(updatedStats));
    await checkBadgeUnlocks(userId, updatedStats);
    return { points, newTotalPoints, newRankLevel };
  }

  // Real Supabase Implementation
  await supabase.from('points_log').insert({
    user_id: userId,
    action,
    points_earned: points,
    description: `Earned ${points} points for ${action}`,
    metadata
  });

  const { data: stats } = await supabase
    .from('designer_stats')
    .select('total_points')
    .eq('user_id', userId)
    .single();

  const newTotalPoints = (stats?.total_points || 0) + points;
  const newRankLevel = calculateRankLevel(newTotalPoints);

  await supabase
    .from('designer_stats')
    .upsert({
      user_id: userId,
      total_points: newTotalPoints,
      rank_level: newRankLevel,
      updated_at: new Date().toISOString()
    });

  await checkBadgeUnlocks(userId);
  return { points, newTotalPoints, newRankLevel };
}

/**
 * Check and unlock badges based on criteria
 */
async function checkBadgeUnlocks(userId: string, demoStats?: any) {
  let stats: any;
  let badges: any[] = INITIAL_BADGES;
  let unlockedBadgeIds: Set<string>;

  if (isDemoMode) {
    stats = demoStats || JSON.parse(localStorage.getItem(`stats:${userId}`) || '{}');
    unlockedBadgeIds = new Set(stats.badges || []);
  } else {
    const { data: s } = await supabase.from('designer_stats').select('*').eq('user_id', userId).single();
    const { data: b } = await supabase.from('badges').select('*');
    const { data: ub } = await supabase.from('user_badges').select('badge_id').eq('user_id', userId);
    
    stats = s;
    if (b) badges = b;
    unlockedBadgeIds = new Set(ub?.map(u => u.badge_id) || []);
  }

  if (!stats) return;

  for (const badge of badges) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    const criteria = badge.criteria as any;
    let unlocked = false;

    switch (criteria.type) {
      case 'transfers_count':
        unlocked = (stats.total_transfers || 0) >= criteria.threshold;
        break;
      case 'total_points':
        unlocked = (stats.total_points || 0) >= criteria.threshold;
        break;
      case 'streak_days':
        unlocked = (stats.streak_days || 0) >= criteria.threshold;
        break;
      case 'ux_score':
        unlocked = (stats.last_ux_score || 0) >= criteria.threshold;
        break;
      case 'rank_level':
        unlocked = stats.rank_level === criteria.value;
        break;
    }

    if (unlocked) {
      if (isDemoMode) {
        if (!stats.badges) stats.badges = [];
        stats.badges.push(badge.id);
        stats.total_points += POINTS_CONFIG.BADGE_UNLOCKED;
        localStorage.setItem(`stats:${userId}`, JSON.stringify(stats));
      } else {
        await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id });
        await awardPoints(userId, 'BADGE_UNLOCKED', { badge_id: badge.id });
      }
    }
  }
}
