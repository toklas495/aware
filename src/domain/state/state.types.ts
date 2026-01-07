import type { DayData } from '../day/day.types';

export interface DayState {
  day: DayData;
  isLoaded: boolean;
}

export interface AppState {
  today: string; // YYYY-MM-DD
}
