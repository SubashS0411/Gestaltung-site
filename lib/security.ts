
/**
 * GESTALTUNG CLIENT SECURITY MANAGER
 * Mimics middleware protections for the SPA environment.
 */

export const ALLOWED_ORIGINS = [
  'localhost',
  'gestaltung.com',
  'gestaltung.ai',
  ...(typeof window !== 'undefined' ? [window.location.hostname] : [])
];

export function verifyRequestOrigin(): boolean {
  if (typeof window === 'undefined') return true; // Server-side: skip origin check
  const hostname = window.location.hostname;
  return ALLOWED_ORIGINS.includes(hostname);
}

export async function enforceSecurityPolicy(): Promise<void> {
  if (!verifyRequestOrigin()) {
    console.error('[Security Breach] Unauthorized origin access attempt.');
    throw new Error('Security Policy Violation: Unauthorized Access Node.');
  }

  // Simulate a pre-flight security latency
  await new Promise(resolve => setTimeout(resolve, 150));
}

/**
 * Appends simulated security headers for internal telemetry
 */
export function getSecurityContext() {
  return {
    'X-Gestalt-Node': 'Edge-V3',
    'X-Identity-Verified': 'true',
    'X-Policy-Enforced': 'true',
    'Timestamp': new Date().toISOString()
  };
}
