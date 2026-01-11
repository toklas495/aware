/**
 * Helpers to migrate persisted day data to the latest energy model.
 */
import type { DayData, ActivityEnergyOverrides } from './day.types';

export type LegacyDayData = DayData & {
  /** @deprecated Signed per-activity values */
  activityPoints?: Record<string, number>;
};

export function migrateDayData(day: LegacyDayData | null): DayData | null {
  if (!day) return day;

  if (!day.activityPoints) {
    return stripEmptyOverrides(day);
  }

  const overrides: ActivityEnergyOverrides = { ...(day.activityEnergyOverrides ?? {}) };

  Object.entries(day.activityPoints).forEach(([activityId, value]) => {
    if (overrides[activityId] === undefined) {
      overrides[activityId] = Math.abs(value);
    }
  });

  const next: DayData = {
    ...day,
    activityEnergyOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
  };

  delete (next as LegacyDayData).activityPoints;

  return stripEmptyOverrides(next);
}

function stripEmptyOverrides(day: DayData): DayData {
  if (day.activityEnergyOverrides && Object.keys(day.activityEnergyOverrides).length === 0) {
    const clone: DayData = { ...day };
    delete clone.activityEnergyOverrides;
    return clone;
  }
  return day;
}
