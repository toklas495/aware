import type { ActivityId } from './activity.types';
import { getUserActivities } from './activity.config';

export function isValidActivity(id: string): id is ActivityId {
  const activities = getUserActivities();
  return activities.some(a => a.id === id);
}

export function getActivityLabel(id: ActivityId): string {
  const activities = getUserActivities();
  return activities.find(a => a.id === id)?.label ?? id;
}
