import type { ActivityDefinition } from './activity.types';
import { localStorageAdapter } from '../storage/localStorage.adapter';

const ACTIVITIES_KEY = 'user:activities';

/**
 * Default activity pairs for new users
 * Each pair has a good habit and a bad habit
 */
const DEFAULT_ACTIVITIES: ActivityDefinition[] = [
  { id: 'meditation', label: 'Meditation', type: 'good', pairId: 'masturbation' },
  { id: 'masturbation', label: 'Masturbation', type: 'bad', pairId: 'meditation' },
  { id: 'walking', label: 'Walking', type: 'good', pairId: 'sitting-idle' },
  { id: 'sitting-idle', label: 'Sitting Idle', type: 'bad', pairId: 'walking' },
  { id: 'workout', label: 'Workout', type: 'good', pairId: 'masturbation' },
  { id: 'reading', label: 'Reading', type: 'good', pairId: 'scrolling' },
  { id: 'scrolling', label: 'Scrolling', type: 'bad', pairId: 'reading' },
];

/**
 * Load user's custom activities from storage
 */
export function loadUserActivities(): ActivityDefinition[] {
  const stored = localStorageAdapter.get<ActivityDefinition[]>(ACTIVITIES_KEY);
  return stored ?? DEFAULT_ACTIVITIES;
}

/**
 * Save user's custom activities to storage
 */
export function saveUserActivities(activities: ActivityDefinition[]): void {
  localStorageAdapter.set(ACTIVITIES_KEY, activities);
}

/**
 * Add a new activity
 */
export function addActivity(label: string, type: 'good' | 'bad', pairId?: string): ActivityDefinition {
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
    pairId
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
export function updateActivity(activityId: string, newLabel: string, type?: 'good' | 'bad', pairId?: string): void {
  const activities = loadUserActivities();
  const updated = activities.map(a => {
    if (a.id === activityId) {
      return {
        ...a,
        label: newLabel.trim(),
        ...(type !== undefined && { type }),
        ...(pairId !== undefined && { pairId }),
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

