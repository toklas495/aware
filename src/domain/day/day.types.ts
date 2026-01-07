export interface DayReflection {
  presence?: string;
  energy?: string;
  closingNote?: string;
}

/**
 * Points assigned to each activity for this day (set in morning)
 * Positive for good habits, negative for bad habits
 */
export interface ActivityPoints {
  [activityId: string]: number;
}

/**
 * Activity counts - how many times each activity was done today
 */
export interface ActivityCounts {
  [activityId: string]: number;
}

export interface DayData {
  date: string; // YYYY-MM-DD (local, human time)
  intention?: string;
  activityPoints?: ActivityPoints; // Points per activity (set in morning)
  activityCounts: ActivityCounts; // Count of times each activity was done
  reflection?: DayReflection;
  completed: boolean;
}
