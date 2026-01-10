import type { DayData } from './day.types';
import type { ActivityId, ActivityDefinition } from '../activity/activity.types';

/**
 * Energy calculation that considers:
 * - Repetition: Multiple instances have different effects (first vs subsequent)
 * - Intentionality: Intentional actions have slightly more positive impact
 * - Time: Energy effects vary based on when activities occur (future enhancement)
 * 
 * Aim for high correctness, not fake precision.
 */

/**
 * Calculate energy per activity instance with diminishing returns for repetition
 * First instance has full effect, subsequent ones have slightly less (but still meaningful)
 */
function calculateInstanceEnergy(
  instanceIndex: number, // 0-based index
  baseEnergy: number
): number {
  if (instanceIndex === 0) {
    return baseEnergy;
  }
  
  // Diminishing returns: each subsequent instance has 85% of previous effect
  // This models real human energy patterns where repetition has less impact
  const multiplier = Math.pow(0.85, instanceIndex);
  return baseEnergy * multiplier;
}

/**
 * Intentionality modifier
 * Intentional actions tend to have slightly more positive impact (or less negative)
 */
function getIntentionalityModifier(
  intentionality: 'intentional' | 'automatic' | undefined
): number {
  if (intentionality === 'intentional') return 1.05; // 5% more positive effect
  return 1.0;
}

/**
 * Calculate total energy for an activity on a given day
 * Takes into account repetition, timing, and intentionality
 */
export function calculateActivityEnergy(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): number {
  const count = day.activityCounts?.[activityId] ?? 0;
  if (count === 0) return 0;

  // Get base energy per instance (still called "points" in data model for backward compatibility)
  const baseEnergyPerInstance = getActivityEnergyValue(day, activityId, activity);
  if (baseEnergyPerInstance === 0) return 0;

  const intentionalityArray = day.activityIntentionality?.[activityId] ?? [];

  let totalEnergy = 0;
  
  // Calculate energy for each instance
  for (let i = 0; i < count; i++) {
    const instanceEnergy = calculateInstanceEnergy(i, baseEnergyPerInstance);
    const intentionality = intentionalityArray[i];
    const intentionalityMod = getIntentionalityModifier(intentionality);
    
    // Time modifier would require storing timestamps - future enhancement
    // When implemented, could use activity type to adjust energy based on time of day
    
    totalEnergy += instanceEnergy * intentionalityMod;
  }

  return totalEnergy;
}

/**
 * Get energy value per activity instance
 * Checks day-specific energy first, then falls back to activity default
 */
export function getActivityEnergyValue(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): number {
  // Day-specific energy takes precedence (still using activityPoints for backward compatibility)
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
 * Calculate total energy for a day
 * Positive = energy gained, Negative = energy drained
 */
export function calculateDayEnergy(
  day: DayData,
  activities: ActivityDefinition[] = []
): number {
  if (!day.activityCounts) return 0;

  const activityMap = new Map(activities.map(a => [a.id, a]));

  return Object.entries(day.activityCounts).reduce((total, [activityId, count]) => {
    if (count === 0) return total;
    const activity = activityMap.get(activityId);
    const activityEnergy = calculateActivityEnergy(day, activityId, activity);
    return total + activityEnergy;
  }, 0);
}

/**
 * Get energy gained from good activities only
 */
export function getEnergyGained(day: DayData, activities: ActivityDefinition[]): number {
  if (!day.activityCounts) return 0;
  
  return activities
    .filter(a => a.type === 'good')
    .reduce((total, activity) => {
      const energy = calculateActivityEnergy(day, activity.id, activity);
      return total + Math.max(0, energy); // Only positive energy
    }, 0);
}

/**
 * Get energy drained from bad activities only (returns positive number)
 */
export function getEnergyDrained(day: DayData, activities: ActivityDefinition[]): number {
  if (!day.activityCounts) return 0;
  
  const drained = activities
    .filter(a => a.type === 'bad')
    .reduce((total, activity) => {
      const energy = calculateActivityEnergy(day, activity.id, activity);
      return total + Math.min(0, energy); // Only negative energy
    }, 0);
  
  return Math.abs(drained); // Return as positive number for display
}

/**
 * Get count of times an activity was done today
 */
export function getActivityCount(day: DayData, activityId: ActivityId): number {
  return day.activityCounts?.[activityId] ?? 0;
}

/**
 * Check if morning setup is complete (all activities have energy assigned)
 */
export function isMorningSetupComplete(
  day: DayData,
  activityIds: ActivityId[]
): boolean {
  if (!day.activityPoints) return false;
  return activityIds.every(id => day.activityPoints![id] !== undefined);
}
