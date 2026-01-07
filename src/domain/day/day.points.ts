import type { DayData } from './day.types';
import type { ActivityId, ActivityDefinition } from '../activity/activity.types';

/**
 * Get points per activity (not total, just the point value)
 * Checks day-specific points first, then falls back to activity default
 */
export function getActivityPointValue(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): number {
  // Day-specific points take precedence
  if (day.activityPoints?.[activityId] !== undefined) {
    return day.activityPoints[activityId];
  }
  // Fall back to activity default
  if (activity?.points !== undefined) {
    return activity.points;
  }
  return 0;
}

/**
 * Calculate total points for a day based on activity counts and their assigned points
 * Points = count * points_per_activity
 */
export function calculateDayPoints(
  day: DayData,
  activities: ActivityDefinition[] = []
): number {
  if (!day.activityCounts) return 0;

  const activityMap = new Map(activities.map(a => [a.id, a]));

  return Object.entries(day.activityCounts).reduce((total, [activityId, count]) => {
    const activity = activityMap.get(activityId);
    const pointsPerActivity = getActivityPointValue(day, activityId, activity);
    return total + (count * pointsPerActivity);
  }, 0);
}

/**
 * Get count of times an activity was done today
 */
export function getActivityCount(day: DayData, activityId: ActivityId): number {
  return day.activityCounts?.[activityId] ?? 0;
}

/**
 * Check if morning setup is complete (all activities have points assigned)
 */
export function isMorningSetupComplete(
  day: DayData,
  activityIds: ActivityId[]
): boolean {
  if (!day.activityPoints) return false;
  return activityIds.every(id => day.activityPoints![id] !== undefined);
}

/**
 * Get total points from good habits only
 */
export function getGoodHabitsPoints(day: DayData, activities: ActivityDefinition[]): number {
  if (!day.activityCounts) return 0;
  
  return activities
    .filter(a => a.type === 'good')
    .reduce((total, activity) => {
      const count = day.activityCounts![activity.id] ?? 0;
      const pointsPerActivity = getActivityPointValue(day, activity.id, activity);
      return total + (count * pointsPerActivity);
    }, 0);
}

/**
 * Get total points from bad habits only (will be negative)
 */
export function getBadHabitsPoints(day: DayData, activities: ActivityDefinition[]): number {
  if (!day.activityCounts) return 0;
  
  return activities
    .filter(a => a.type === 'bad')
    .reduce((total, activity) => {
      const count = day.activityCounts![activity.id] ?? 0;
      const pointsPerActivity = getActivityPointValue(day, activity.id, activity);
      return total + (count * pointsPerActivity);
    }, 0);
}

