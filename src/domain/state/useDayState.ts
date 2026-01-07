import { useEffect, useState } from 'react';
import type { DayData } from '../day/day.types';
import { createNewDay } from '../day/day.factory';
import { loadDay, saveDay } from '../storage/day.repository';

export function useDayState(date: string) {
  const [day, setDay] = useState<DayData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load once per date
  useEffect(() => {
    const existingDay = loadDay(date);
    setDay(existingDay ?? createNewDay(date));
    setIsLoaded(true);
  }, [date]);

  // Persist on change
  useEffect(() => {
    if (!day) return;
    saveDay(day);
  }, [day]);

  return {
    day,
    isLoaded,
    setDay,
  };
}
