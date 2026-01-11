/**
 * Activity ID is now a string to support dynamic user-created activities
 */
export type ActivityId = string;

/**
 * Energy direction: deposit (gain) or withdrawal (drain)
 */
export type EnergyDirection = 'gain' | 'drain';

/**
 * Activity type mirrors the energy direction for clarity
 */
export type ActivityType = EnergyDirection;

/**
 * Optional descriptor for how intense an activity feels
 */
export type ActivityIntensity = 'light' | 'steady' | 'deep';

/**
 * Whether an activity instance was intentional or automatic
 */
export type ActivityIntentionality = 'intentional' | 'automatic';

/**
 * Activity pair - good habit vs bad habit
 */
export interface ActivityPair {
  good: ActivityId;
  bad: ActivityId;
}

/**
 * Activity definition with type and optional pair
 * Extended to support energy values, intentionality awareness, and units
 */
export interface ActivityDefinition {
  id: ActivityId;
  label: string;
  type: ActivityType;
  pairId?: ActivityId; // ID of the opposite activity (gain <-> drain)
  energyMagnitude?: number; // Positive magnitude per instance (direction handled by `type`)
  intensity?: ActivityIntensity; // Optional feel/scaling descriptor
  unit?: string; // Optional unit (e.g., 'km', 'minutes', 'sessions')
  /** @deprecated - legacy signed value retained for migration */
  points?: number;
}
