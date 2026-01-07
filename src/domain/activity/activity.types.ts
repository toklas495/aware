/**
 * Activity ID is now a string to support dynamic user-created activities
 */
export type ActivityId = string;

/**
 * Activity type: good habit (increases points) or bad habit (decreases points)
 */
export type ActivityType = 'good' | 'bad';

/**
 * Activity pair - good habit vs bad habit
 */
export interface ActivityPair {
  good: ActivityId;
  bad: ActivityId;
}

/**
 * Activity definition with type and optional pair
 */
export interface ActivityDefinition {
  id: ActivityId;
  label: string;
  type: ActivityType;
  pairId?: ActivityId; // ID of the opposite activity (good <-> bad)
}
