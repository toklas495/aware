import type { DayData } from './day.types';
import type { ActivityId } from '../activity/activity.types';

/**
 * Calculate total points for a day based on activity counts and their assigned points
 * Points = count * points_per_activity
 */
export function calculateDayPoints(day: DayData): number {
  if (!day.activityPoints || !day.activityCounts) return 0;

  return Object.entries(day.activityCounts).reduce((total, [activityId, count]) => {
    const pointsPerActivity = day.activityPoints![activityId] ?? 0;
    return total + (count * pointsPerActivity);
  }, 0);
}

/**
 * Get points per activity (not total, just the point value)
 */
export function getActivityPointValue(day: DayData, activityId: ActivityId): number {
  return day.activityPoints?.[activityId] ?? 0;
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
export function getGoodHabitsPoints(day: DayData, activities: Array<{ id: ActivityId; type: string }>): number {
  if (!day.activityPoints || !day.activityCounts) return 0;
  
  return activities
    .filter(a => a.type === 'good')
    .reduce((total, activity) => {
      const count = day.activityCounts[activity.id] ?? 0;
      const pointsPerActivity = day.activityPoints![activity.id] ?? 0;
      return total + (count * pointsPerActivity);
    }, 0);
}

/**
 * Get total points from bad habits only (will be negative)
 */
export function getBadHabitsPoints(day: DayData, activities: Array<{ id: ActivityId; type: string }>): number {
  if (!day.activityPoints || !day.activityCounts) return 0;
  
  return activities
    .filter(a => a.type === 'bad')
    .reduce((total, activity) => {
      const count = day.activityCounts[activity.id] ?? 0;
      const pointsPerActivity = day.activityPoints![activity.id] ?? 0;
      return total + (count * pointsPerActivity);
    }, 0);
}

