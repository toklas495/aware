import type { DayData } from './day.types';

export function createNewDay(date: string): DayData {
  return {
    date,
    activityCounts: {},
    completed: false,
  };
}
