import type { DayData } from './day.types';

export function hasAnyActivity(day: DayData): boolean {
  if (!day.activityCounts) return false;
  return Object.values(day.activityCounts).some(count => count > 0);
}

export function isDayComplete(day: DayData): boolean {
  return day.completed;
}

export function totalActivityCount(day: DayData): number {
  if (!day.activityCounts) return 0;
  return Object.values(day.activityCounts).reduce((sum, count) => sum + count, 0);
}
