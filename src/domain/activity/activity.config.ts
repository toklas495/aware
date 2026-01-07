import type { ActivityDefinition } from './activity.types';
import { loadUserActivities } from './activity.storage';

/**
 * Get user's activities (dynamic, loaded from storage)
 */
export function getUserActivities(): ActivityDefinition[] {
  return loadUserActivities();
}
