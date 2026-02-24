
/**
 * GESTALTUNG FIGMA ENGINE - CORE API
 * Ported from server-side patterns to the client environment.
 * In a real environment, this logic would be behind an API route to protect FIGMA_ACCESS_TOKEN.
 */

export async function fetchFigmaFile(fileKey: string) {
  // Use environment variable if available, otherwise fallback to platform provided token
  const token = (process.env as any).FIGMA_ACCESS_TOKEN || (process.env as any).API_KEY;
  
  if (!token) {
    console.warn('[FigmaEngine] No FIGMA_ACCESS_TOKEN detected. Falling back to Demo Cluster.');
    return simulateFigmaFetch(fileKey);
  }

  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': token
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Figma API Desynchronization' }));
      throw new Error(errorData.message || 'Failed to fetch Figma file');
    }

    return response.json();
  } catch (error: any) {
    console.error('[FigmaEngine] Cluster Fault:', error);
    throw new Error(`Connection to Figma Cluster Failed: ${error.message}`);
  }
}

async function simulateFigmaFetch(fileKey: string) {
  await new Promise(r => setTimeout(r, 1500));
  return {
    name: "GESTALT_CORE_PROJECT",
    lastModified: new Date().toISOString(),
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    document: {
      id: "0:0",
      name: "Document",
      type: "DOCUMENT",
      children: [
        {
          id: "0:1",
          name: "Landing Page",
          type: "CANVAS",
          children: [
            {
              id: "1:2",
              name: "Hero Section",
              type: "FRAME",
              fills: [{ type: 'SOLID', color: { r: 0.06, g: 0.09, b: 0.16 } }],
              children: [
                { id: "1:3", name: "Headline", type: "TEXT", fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] },
                { id: "1:4", name: "CTA", type: "RECTANGLE", fills: [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.96 } }] }
              ]
            }
          ]
        }
      ]
    }
  };
}
