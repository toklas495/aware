/**
 * Activity ID is now a string to support dynamic user-created activities
 */
export type ActivityId = string;

/**
 * Activity type: gains energy (good) or drains energy (bad)
 */
export type ActivityType = 'good' | 'bad';

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
  pairId?: ActivityId; // ID of the opposite activity (good <-> bad)
  // New fields (backward compatible - optional)
  points?: number; // Default energy value per instance (can be overridden per day). Positive for good, negative for bad.
  unit?: string; // Optional unit (e.g., 'km', 'minutes', 'sessions')
}
