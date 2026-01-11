export interface DayReflection {
  presence?: string;
  energy?: string;
  closingNote?: string;
  energized?: string; // What energized me today
  drained?: string; // What drained me today
  observed?: string; // What did I observe about myself
}

/**
 * Energy magnitude overrides assigned during morning setup (per activity, per day)
 */
export interface ActivityEnergyOverrides {
  [activityId: string]: number; // Always positive magnitude
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
  activityEnergyOverrides?: ActivityEnergyOverrides; // Day-specific magnitudes set in the morning
  activityUnits?: ActivityUnits; // Units per activity (optional, set in morning)
  activityCounts: ActivityCounts; // Count of times each activity was done
  activityIntentionality?: ActivityIntentionality; // Intentional/automatic tracking
  reflection?: DayReflection;
  completed: boolean;
}
