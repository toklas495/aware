import type { DayData } from '../day/day.types';
import { localStorageAdapter } from './localStorage.adapter';
import  { createNewDay } from '../day/day.factory';

const DAY_PREFIX = 'day:';

function dayKey(date: string): string {
  return `${DAY_PREFIX}${date}`;
}
export function loadDay(date: string): DayData {
  const stored = localStorageAdapter.get<DayData>(dayKey(date));
  return stored ?? createNewDay(date);
}
export function saveDay(day: DayData): void {
  localStorageAdapter.set(dayKey(day.date), day);
}
export function removeDay(date: string): void {
  localStorageAdapter.remove(dayKey(date));
}
