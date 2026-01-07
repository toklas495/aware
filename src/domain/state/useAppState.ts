import { useState } from 'react';
import type { AppState } from './state.types';
import { getTodayDateString } from '../../utils/date';

export function useAppState(): AppState {
  const [today] = useState(() => getTodayDateString());

  return { today };
}
