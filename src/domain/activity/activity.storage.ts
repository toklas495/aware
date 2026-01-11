import type { ActivityDefinition, ActivityType } from './activity.types';
import { localStorageAdapter } from '../storage/localStorage.adapter';

const ACTIVITIES_KEY = 'user:activities';

/**
 * Default activity pairs for new users
 * Each pair has a good habit and a bad habit
 */
const DEFAULT_ACTIVITIES: ActivityDefinition[] = [
  { id: 'meditation', label: 'Meditation', type: 'gain', pairId: 'masturbation', energyMagnitude: 5 },
  { id: 'masturbation', label: 'Masturbation', type: 'drain', pairId: 'meditation', energyMagnitude: 5 },
  { id: 'walking', label: 'Walking', type: 'gain', pairId: 'sitting-idle', energyMagnitude: 5 },
  { id: 'sitting-idle', label: 'Sitting Idle', type: 'drain', pairId: 'walking', energyMagnitude: 5 },
  { id: 'workout', label: 'Workout', type: 'gain', pairId: 'masturbation', energyMagnitude: 6 },
  { id: 'reading', label: 'Reading', type: 'gain', pairId: 'scrolling', energyMagnitude: 4 },
  { id: 'scrolling', label: 'Scrolling', type: 'drain', pairId: 'reading', energyMagnitude: 4 },
];

/**
 * Load user's custom activities from storage
 */
export function loadUserActivities(): ActivityDefinition[] {
  const stored = localStorageAdapter.get<ActivityDefinition[]>(ACTIVITIES_KEY);
  const source = stored ?? DEFAULT_ACTIVITIES;
  const { normalized, mutated } = normalizeActivities(source);

  if (stored && mutated) {
    localStorageAdapter.set(ACTIVITIES_KEY, normalized);
  }

  return normalized;
}

/**
 * Save user's custom activities to storage
 */
export function saveUserActivities(activities: ActivityDefinition[]): void {
  const { normalized } = normalizeActivities(activities);
  localStorageAdapter.set(ACTIVITIES_KEY, normalized);
}

/**
 * Add a new activity
 */
export function addActivity(label: string, type: ActivityType, pairId?: string, energyMagnitude = 5): ActivityDefinition {
  const activities = loadUserActivities();
  const id = generateActivityId(label);
  
  // Check if ID already exists, make it unique
  let uniqueId = id;
  let counter = 1;
  while (activities.some(a => a.id === uniqueId)) {
    uniqueId = `${id}-${counter}`;
    counter++;
  }
  
  const newActivity: ActivityDefinition = { 
    id: uniqueId, 
    label: label.trim(),
    type,
    pairId,
    energyMagnitude,
  };
  activities.push(newActivity);
  saveUserActivities(activities);
  return newActivity;
}

/**
 * Remove an activity by ID
 */
export function removeActivity(activityId: string): void {
  const activities = loadUserActivities();
  const filtered = activities.filter(a => a.id !== activityId);
  saveUserActivities(filtered);
}

/**
 * Update an activity's label
 */
export function updateActivity(activityId: string, newLabel: string, type?: ActivityType, pairId?: string, energyMagnitude?: number): void {
  const activities = loadUserActivities();
  const updated = activities.map(a => {
    if (a.id === activityId) {
      return {
        ...a,
        label: newLabel.trim(),
        ...(type !== undefined && { type }),
        ...(pairId !== undefined && { pairId }),
        ...(energyMagnitude !== undefined && { energyMagnitude }),
      };
    }
    return a;
  });
  saveUserActivities(updated);
}

/**
 * Generate a URL-friendly ID from a label
 */
function generateActivityId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) || 'activity';
}

function normalizeActivities(activities: ActivityDefinition[]): {
  normalized: ActivityDefinition[];
  mutated: boolean;
} {
  let mutated = false;

  const normalized = activities.map(activity => {
    const normalizedType = normalizeDirection(activity.type);
    const normalizedMagnitude =
      activity.energyMagnitude !== undefined
        ? activity.energyMagnitude
        : activity.points !== undefined
          ? Math.abs(activity.points)
          : undefined;

    const { points, ...rest } = activity;
    const next: ActivityDefinition = {
      ...rest,
      type: normalizedType,
      ...(normalizedMagnitude !== undefined ? { energyMagnitude: normalizedMagnitude } : {}),
    };

    if (
      activity.type !== normalizedType ||
      activity.energyMagnitude !== normalizedMagnitude ||
      points !== undefined
    ) {
      mutated = true;
    }

    return next;
  });

  return { normalized, mutated };
}

function normalizeDirection(type: ActivityDefinition['type'] | 'good' | 'bad' | undefined): ActivityType {
  if (type === 'drain' || type === 'gain') return type;
  if (type === 'bad') return 'drain';
  return 'gain';
}

