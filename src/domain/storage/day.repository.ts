import type { DayData } from '../day/day.types';
import { localStorageAdapter } from './localStorage.adapter';
import  { createNewDay } from '../day/day.factory';
import { migrateDayData, type LegacyDayData } from '../day/day.migrations';

const DAY_PREFIX = 'day:';

function dayKey(date: string): string {
  return `${DAY_PREFIX}${date}`;
}
export function loadDay(date: string): DayData {
  const stored = localStorageAdapter.get<LegacyDayData>(dayKey(date));
  const migrated = migrateDayData(stored);
  return migrated ?? createNewDay(date);
}
export function saveDay(day: DayData): void {
  localStorageAdapter.set(dayKey(day.date), day);
}
export function removeDay(date: string): void {
  localStorageAdapter.remove(dayKey(date));
}
