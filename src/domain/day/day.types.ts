export interface DayReflection {
  presence?: string;
  energy?: string;
  closingNote?: string;
  energized?: string; // What energized me today
  drained?: string; // What drained me today
  observed?: string; // What did I observe about myself
}

/**
 * Energy values assigned to each activity for this day (set in morning)
 * Positive for activities that gain energy, negative for activities that drain energy
 * (Still called "activityPoints" in the data model for backward compatibility)
 */
export interface ActivityPoints {
  [activityId: string]: number;
}

/**
 * Units for each activity on this day (optional, e.g., 'km', 'minutes')
 */
export interface ActivityUnits {
  [activityId: string]: string;
}

/**
 * Activity counts - how many times each activity was done today
 */
export interface ActivityCounts {
  [activityId: string]: number;
}

/**
 * Intentionality tracking - whether each activity instance was intentional or automatic
 * Maps activityId to array of intentionality values (one per count)
 */
export interface ActivityIntentionality {
  [activityId: string]: Array<'intentional' | 'automatic'>;
}

export interface DayData {
  date: string; // YYYY-MM-DD (local, human time)
  intention?: string;
  activityPoints?: ActivityPoints; // Energy values per activity (set in morning)
  activityUnits?: ActivityUnits; // Units per activity (optional, set in morning)
  activityCounts: ActivityCounts; // Count of times each activity was done
  activityIntentionality?: ActivityIntentionality; // Intentional/automatic tracking
  reflection?: DayReflection;
  completed: boolean;
}
