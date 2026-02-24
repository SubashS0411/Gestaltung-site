
import { z } from 'zod';

export const transferSchema = z.object({
  projectName: z.string()
    .min(3, 'Label must be at least 3 characters')
    .max(50, 'Label too long for design cluster')
    .trim(),
  figmaUrl: z.string()
    .url('Invalid URL format')
    .refine(
      (url) => url.includes('figma.com'),
      'Must be a Figma URL'
    )
    .refine(
      (url) => {
        const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
        return match !== null;
      },
      'Invalid Figma resource key (ensure /file/ or /design/ is present)'
    ),
  includeAnimations: z.boolean().default(true),
  includeInteractions: z.boolean().default(true),
  optimizePerformance: z.boolean().default(true),
  enableMarketResearch: z.boolean().default(false)
});

export const analysisSchema = z.object({
  designUrl: z.string().url(),
  analysisType: z.enum(['full', 'quick', 'color_only']),
  projectContext: z.object({
    industry: z.string().max(50).optional(),
    targetAudience: z.string().max(100).optional(),
    goals: z.array(z.string()).max(5).optional()
  }).optional()
});

/**
 * Sanitize user input to prevent injection
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length for neural safety
}
