/**
 * @deprecated Use day.energy.ts instead
 * This file is kept for backward compatibility but all new code should use energy calculations
 */
import type { DayData } from './day.types';
import type { ActivityId, ActivityDefinition } from '../activity/activity.types';
import {
  getActivityEnergyValue,
  calculateDayEnergy,
  getActivityCount,
  isMorningSetupComplete,
  getEnergyGained,
  getEnergyDrained,
} from './day.energy';

/**
 * @deprecated Use getActivityEnergyValue instead
 */
export function getActivityPointValue(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): number {
  return getActivityEnergyValue(day, activityId, activity);
}

/**
 * @deprecated Use calculateDayEnergy instead
 */
export function calculateDayPoints(
  day: DayData,
  activities: ActivityDefinition[] = []
): number {
  return calculateDayEnergy(day, activities);
}

/**
 * @deprecated Use getActivityCount instead
 */
export { getActivityCount };

/**
 * @deprecated Use isMorningSetupComplete instead
 */
export { isMorningSetupComplete };

/**
 * @deprecated Use getEnergyGained instead
 */
export function getGoodHabitsPoints(day: DayData, activities: ActivityDefinition[]): number {
  return getEnergyGained(day, activities);
}

/**
 * @deprecated Use getEnergyDrained instead
 */
export function getBadHabitsPoints(day: DayData, activities: ActivityDefinition[]): number {
  return -getEnergyDrained(day, activities); // Return negative for backward compatibility
}

