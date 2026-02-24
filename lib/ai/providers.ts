
import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * GESTALTUNG NEURAL ENGINE - GEMINI PROVIDER
 * Optimized for high-precision design auditing using gemini-3-pro-preview.
 */
export async function analyzeWithGemini(prompt: string, model: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' = 'gemini-3-pro-preview', schema?: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: schema ? "application/json" : "text/plain",
      responseSchema: schema,
      temperature: 0.2,
      topP: 0.8,
      thinkingConfig: model.includes('pro') ? { thinkingBudget: 4096 } : undefined
    },
  });

  return response.text;
}

/**
 * MARKET RESEARCH PROVIDER
 * Uses Google Search grounding to find real-world design trends.
 */
export async function getMarketResearch(topic: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find current 2024-2025 UI/UX design trends, color palettes, and competitive benchmarks for: ${topic}. Focus on technical implementation details.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { text, sources };
}

/**
 * LIVE CONSULTANT FACTORY
 * Creates a connection to the Live API for voice-based design consultation.
 */
export function createLiveConsultant(callbacks: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      // Use Modality.AUDIO instead of raw string
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: 'You are a senior Design Engineer. You help users refine their Figma-to-Framer transfers. Be technical, helpful, and concise.',
      outputAudioTranscription: {},
      inputAudioTranscription: {},
    },
  });
}

/**
 * OPENAI GPT-4 TURBO (STUB)
 */
export async function analyzeWithOpenAI(prompt: string) {
  await new Promise(r => setTimeout(r, 1500));
  return JSON.stringify({
    overall_ux_score: 92,
    issues: [{ severity: 'minor', category: 'Contrast', description: 'Simulated OpenAI result.', fix: 'Adjust color tokens.' }],
    color_analysis: { palette: [], psychology: {}, cultural_notes: 'Optimistic.', accessibility_grade: 'AA' },
    interaction_analysis: { suggested_timing: '200ms', complexity_score: 3, gesture_recommendations: [] }
  });
}

/**
 * ANTHROPIC CLAUDE (STUB)
 */
export async function analyzeWithClaude(prompt: string) {
  await new Promise(r => setTimeout(r, 1800));
  return JSON.stringify({
    overall_ux_score: 94,
    issues: [],
    color_analysis: { palette: [], psychology: {}, cultural_notes: 'Professional.', accessibility_grade: 'AAA' },
    interaction_analysis: { suggested_timing: '150ms', complexity_score: 2, gesture_recommendations: [] }
  });
}

/**
 * TOGETHER AI (STUB)
 */
export async function analyzeWithTogether(prompt: string) {
  await new Promise(r => setTimeout(r, 1200));
  return JSON.stringify({
    overall_ux_score: 85,
    issues: [],
    color_analysis: { palette: [], psychology: {}, cultural_notes: 'Vibrant.', accessibility_grade: 'AA' },
    interaction_analysis: { suggested_timing: '300ms', complexity_score: 4, gesture_recommendations: [] }
  });
}
