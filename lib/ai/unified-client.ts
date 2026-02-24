
import { 
  analyzeWithGemini, 
  analyzeWithOpenAI, 
  analyzeWithClaude, 
  analyzeWithTogether 
} from './providers';
import { enforceSecurityPolicy } from '../security';
import logger from '../logger';

export type AIProvider = 'openai' | 'claude' | 'gemini' | 'together';

/**
 * UNIFIED AI CLIENT
 * Handles intelligent fallback and multi-provider routing with a hardened security layer.
 */
export async function analyzeDesign(
  prompt: string,
  provider: AIProvider = 'gemini',
  fallback: boolean = true
): Promise<string> {
  
  // 1. HARDENED SECURITY PRE-FLIGHT
  await enforceSecurityPolicy();

  const providers: AIProvider[] = fallback
    ? [provider, 'gemini', 'openai', 'claude', 'together']
    : [provider];

  // Remove duplicates while maintaining order
  const uniqueProviders = Array.from(new Set(providers));

  for (const p of uniqueProviders) {
    try {
      logger.info({ action: 'ai_synthesis_attempt', provider: p });
      
      switch (p) {
        case 'gemini':
          return await analyzeWithGemini(prompt, 'gemini-3-pro-preview');
        case 'openai':
          return await analyzeWithOpenAI(prompt);
        case 'claude':
          return await analyzeWithClaude(prompt);
        case 'together':
          return await analyzeWithTogether(prompt);
        default:
          throw new Error(`Unknown provider: ${p}`);
      }
    } catch (error: any) {
      logger.error({ 
        action: 'ai_synthesis_fault', 
        provider: p, 
        error: error.message 
      });
      
      if (p === uniqueProviders[uniqueProviders.length - 1]) {
        throw new Error('Critical: All design intelligence clusters are offline.');
      }
      
      // Continue to next provider in the fallback chain
      continue;
    }
  }

  throw new Error('No AI providers available');
}
