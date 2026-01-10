import type { DayData } from './day.types';
import type { ActivityId, ActivityDefinition } from '../activity/activity.types';

/**
 * Energy calculation that considers:
 * - Simple multiplication: count * baseEnergy per instance
 * - Intentionality: Intentional actions have slightly more positive impact (optional)
 * 
 * Aim for high correctness and simplicity.
 */

/**
 * Calculate total energy for an activity on a given day
 * Simple calculation: count * baseEnergy, with optional intentionality modifier
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

  // Simple calculation: count * baseEnergy
  let totalEnergy = count * baseEnergyPerInstance;

  // Apply intentionality modifier if tracking intentionality
  // Intentional actions get 5% boost (if we have intentionality data)
  const intentionalityArray = day.activityIntentionality?.[activityId];
  if (intentionalityArray && intentionalityArray.length === count && intentionalityArray.length > 0) {
    // Count how many were intentional
    const intentionalCount = intentionalityArray.filter(i => i === 'intentional').length;
    const automaticCount = count - intentionalCount;
    
    if (intentionalCount > 0) {
      if (baseEnergyPerInstance > 0) {
        // For positive energy, intentional gets 5% boost
        const intentionalEnergy = intentionalCount * baseEnergyPerInstance * 1.05;
        const automaticEnergy = automaticCount * baseEnergyPerInstance;
        totalEnergy = intentionalEnergy + automaticEnergy;
      } else if (baseEnergyPerInstance < 0) {
        // For negative energy (draining), intentional reduces the drain by 5%
        const intentionalEnergy = intentionalCount * baseEnergyPerInstance * 0.95;
        const automaticEnergy = automaticCount * baseEnergyPerInstance;
        totalEnergy = intentionalEnergy + automaticEnergy;
      }
    }
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
