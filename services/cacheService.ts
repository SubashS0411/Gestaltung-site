
/**
 * Local implementation of the Redis-like cache provided in the spec.
 * Mimics the Upstash Redis behavior for the browser environment.
 */

export async function getCachedFigmaFile(fileKey: string) {
  const cached = localStorage.getItem(`figma:${fileKey}`);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheFigmaFile(fileKey: string, data: any) {
  // Simulating 1 hour expiration in metadata if needed, 
  // but for simplicity we just store the JSON string.
  localStorage.setItem(`figma:${fileKey}`, JSON.stringify(data));
}

export async function getCachedAnalysis(designUrl: string) {
  const cached = localStorage.getItem(`analysis:${designUrl}`);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheAnalysis(designUrl: string, analysis: any) {
  localStorage.setItem(`analysis:${designUrl}`, JSON.stringify(analysis));
}
