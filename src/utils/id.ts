/**
 * Generates a short, local-only ID.
 * Not meant for tracking or analytics.
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
