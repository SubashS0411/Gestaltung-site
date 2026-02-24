
import { analyzeDesign, AIProvider } from "../lib/ai/unified-client";
import { getMarketResearch } from "../lib/ai/providers";
import { DesignValidation } from "../types";

export async function analyzeDesignIntelligence(
  colors: string[],
  context: { projectType: string; projectName: string; targetAudience?: string; enableMarketResearch?: boolean },
  provider: AIProvider = 'gemini'
): Promise<DesignValidation> {
  const prompt = `Act as a world-class Design Engineer and UX Researcher. Analyze this design:
    Project: ${context.projectName}
    Type: ${context.projectType}
    Audience: ${context.targetAudience || 'General Professionals'}
    Extracted Palette: ${colors.join(', ')}

    Provide a professional JSON audit. Use the following keys:
    overall_ux_score (0-100), visual_hierarchy_score, navigation_score, accessibility_score, interaction_score, color_psychology_score.
    Also include "issues" (array of {severity, category, description, fix}), "suggestions", "color_analysis", and "interaction_analysis".
    The response MUST be valid JSON.`;

  try {
    const result = await analyzeDesign(prompt, provider, true);
    const cleanedResult = result.trim().replace(/^```json/, '').replace(/```$/, '');
    const baseAudit: DesignValidation = JSON.parse(cleanedResult || "{}");

    if (context.enableMarketResearch) {
      const research = await getMarketResearch(`${context.projectName} ${context.projectType}`);
      baseAudit.market_research = {
        summary: research.text,
        sources: research.sources as any
      };
    }

    return baseAudit;
  } catch (error) {
    console.error("Design Intelligence Fault:", error);
    throw new Error("Neural synthesis engine failed to return valid audit data.");
  }
}
