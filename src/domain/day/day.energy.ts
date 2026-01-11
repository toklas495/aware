import type { DayData } from './day.types';
import type { ActivityId, ActivityDefinition, EnergyDirection } from '../activity/activity.types';

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

  const { magnitude, direction } = getActivityEnergyDescriptor(day, activityId, activity);
  if (magnitude === 0) return 0;

  let totalMagnitude = count * magnitude;

  const intentionalityArray = day.activityIntentionality?.[activityId];
  if (intentionalityArray && intentionalityArray.length === count && intentionalityArray.length > 0) {
    const intentionalCount = intentionalityArray.filter(i => i === 'intentional').length;
    const automaticCount = count - intentionalCount;

    if (intentionalCount > 0) {
      const intentionalMultiplier = direction === 'gain' ? 1.05 : 0.95;
      const automaticMultiplier = 1;

      const intentionalEnergy = intentionalCount * magnitude * intentionalMultiplier;
      const automaticEnergy = automaticCount * magnitude * automaticMultiplier;
      totalMagnitude = intentionalEnergy + automaticEnergy;
    }
  }

  const directionMultiplier = direction === 'gain' ? 1 : -1;
  return totalMagnitude * directionMultiplier;
}

/**
 * Get energy magnitude per activity instance (always positive)
 * Checks day-specific energy first, then falls back to activity default
 */
export function getActivityEnergyMagnitude(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): number {
  if (day.activityEnergyOverrides?.[activityId] !== undefined) {
    return Math.abs(day.activityEnergyOverrides[activityId]);
  }

  if (activity?.energyMagnitude !== undefined) {
    return Math.abs(activity.energyMagnitude);
  }

  if (activity?.points !== undefined) {
    return Math.abs(activity.points);
  }

  return 0;
}

export interface ActivityEnergyDescriptor {
  magnitude: number;
  direction: EnergyDirection;
}

export function getActivityEnergyDescriptor(
  day: DayData,
  activityId: ActivityId,
  activity?: ActivityDefinition
): ActivityEnergyDescriptor {
  const magnitude = getActivityEnergyMagnitude(day, activityId, activity);
  return {
    magnitude,
    direction: determineDirection(activity),
  };
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
    .filter(a => a.type === 'gain')
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
    .filter(a => a.type === 'drain')
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
  activities: ActivityDefinition[]
): boolean {
  if (activities.length === 0) return false;

  return activities.every(activity => {
    const override = day.activityEnergyOverrides?.[activity.id];
    const defaultMagnitude = activity.energyMagnitude ?? activity.points;
    return override !== undefined || defaultMagnitude !== undefined;
  });
}

function determineDirection(activity?: ActivityDefinition): EnergyDirection {
  if (activity?.type === 'drain') return 'drain';
  return 'gain';
}
