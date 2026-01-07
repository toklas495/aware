export type DayPhase =
  | 'morning'
  | 'day'
  | 'night'
  | 'done';

export interface DayLifecycle {
  phase: DayPhase;
  isComplete: boolean;
}

export function getCurrentPhase(now: Date = new Date()): DayPhase {
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 20) return 'day';
  if (hour >= 20 && hour < 24) return 'night';

  // after midnight: still part of "night reflection"
  return 'night';
}

export function nextPhase(current: DayPhase): DayPhase {
  switch (current) {
    case 'morning':
      return 'day';
    case 'day':
      return 'night';
    case 'night':
      return 'done';
    default:
      return 'done';
  }
}

