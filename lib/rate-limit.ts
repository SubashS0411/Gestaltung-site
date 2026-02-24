
import { Profile, SubscriptionTier } from '../types';

/**
 * GESTALTUNG RATE LIMIT ENGINE
 * Mimics server-side rate limiting for the SPA environment.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

const LIMITS = {
  [SubscriptionTier.FREE]: { transfers: 5, rate: 2 }, // 2 per minute
  [SubscriptionTier.PRO]: { transfers: 50, rate: 10 },
  [SubscriptionTier.TEAMS]: { transfers: 500, rate: 100 }
};

class QuotaManager {
  private lastRequestTimes: { [userId: string]: number[] } = {};

  /**
   * Checks if a user is within their subscription and rate limits
   */
  async checkLimit(profile: Profile): Promise<RateLimitResult> {
    const tier = profile.subscription_tier || SubscriptionTier.FREE;
    const config = LIMITS[tier];
    const userId = profile.id;

    // 1. Check Monthly Transfer Quota
    if (profile.monthly_transfers >= profile.transfer_limit) {
      return {
        success: false,
        remaining: 0,
        limit: profile.transfer_limit
      };
    }

    // 2. Check Burst Rate Limit (Sliding Window simulation)
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    if (!this.lastRequestTimes[userId]) {
      this.lastRequestTimes[userId] = [];
    }

    // Clean up old timestamps
    this.lastRequestTimes[userId] = this.lastRequestTimes[userId].filter(
      t => now - t < windowMs
    );

    if (this.lastRequestTimes[userId].length >= config.rate) {
      const oldest = this.lastRequestTimes[userId][0];
      const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
      
      return {
        success: false,
        remaining: 0,
        limit: config.rate,
        retryAfter
      };
    }

    // Success - logically "consume" a temporary rate slot
    this.lastRequestTimes[userId].push(now);
    
    return {
      success: true,
      remaining: profile.transfer_limit - profile.monthly_transfers - 1,
      limit: profile.transfer_limit
    };
  }
}

export const quotaManager = new QuotaManager();

// Mock limiters for the production-ready route code consistency
export const freeUserLimit = {
  limit: async (id: string) => ({ success: true }) // Simplified for middleware use
};

export const proUserLimit = {
  limit: async (id: string) => ({ success: true })
};
