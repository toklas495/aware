import type { DayData } from '../day/day.types';
import { loadDay } from './day.repository';
import { calculateDayEnergy } from '../day/day.energy';
import { calculateDayPoints } from '../day/day.points'; // For backward compatibility
import { getTodayDateString } from '../../utils/date';
import { loadUserActivities } from '../activity/activity.storage';

/**
 * Get all days from storage (limited to reasonable range)
 */
export function getAllDays(): DayData[] {
  const days: DayData[] = [];
  const today = new Date();
  
  // Load last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = getTodayDateString(date);
    const day = loadDay(dateString);
    
    // Only include days that have been started (have activity counts or are completed)
    const hasCounts = day.activityCounts && Object.keys(day.activityCounts).length > 0;
    if (hasCounts || day.completed || day.activityPoints) {
      days.push(day);
    }
  }
  
  return days;
}

/**
 * Calculate weekly energy summary
 */
export function getWeeklyEnergy(): { week: string; energy: number }[] {
  const days = getAllDays();
  const activities = loadUserActivities();
  const weeks: Map<string, { energy: number }> = new Map();

  days.forEach(day => {
    const date = new Date(day.date + 'T00:00:00');
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Sunday
    const weekKey = getTodayDateString(weekStart);
    
    const existing = weeks.get(weekKey) ?? { energy: 0 };
    existing.energy += calculateDayEnergy(day, activities);
    weeks.set(weekKey, existing);
  });

  return Array.from(weeks.entries())
    .map(([week, data]) => ({ week, ...data }))
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 12); // Last 12 weeks
}

/**
 * Calculate monthly energy summary
 */
export function getMonthlyEnergy(): { month: string; energy: number }[] {
  const days = getAllDays();
  const activities = loadUserActivities();
  const months: Map<string, { energy: number }> = new Map();

  days.forEach(day => {
    const monthKey = day.date.substring(0, 7); // YYYY-MM
    
    const existing = months.get(monthKey) ?? { energy: 0 };
    existing.energy += calculateDayEnergy(day, activities);
    months.set(monthKey, existing);
  });

  return Array.from(months.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12); // Last 12 months
}

/**
 * @deprecated Use getWeeklyEnergy instead
 */
export function getWeeklyPoints(): { week: string; points: number; days: number }[] {
  const days = getAllDays();
  const activities = loadUserActivities();
  const weeks: Map<string, { points: number; days: number }> = new Map();

  days.forEach(day => {
    const date = new Date(day.date + 'T00:00:00');
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Sunday
    const weekKey = getTodayDateString(weekStart);
    
    const existing = weeks.get(weekKey) ?? { points: 0, days: 0 };
    existing.points += calculateDayPoints(day, activities);
    existing.days += 1;
    weeks.set(weekKey, existing);
  });

  return Array.from(weeks.entries())
    .map(([week, data]) => ({ week, ...data }))
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 12);
}

/**
 * @deprecated Use getMonthlyEnergy instead
 */
export function getMonthlyPoints(): { month: string; points: number; days: number }[] {
  const days = getAllDays();
  const activities = loadUserActivities();
  const months: Map<string, { points: number; days: number }> = new Map();

  days.forEach(day => {
    const monthKey = day.date.substring(0, 7);
    
    const existing = months.get(monthKey) ?? { points: 0, days: 0 };
    existing.points += calculateDayPoints(day, activities);
    existing.days += 1;
    months.set(monthKey, existing);
  });

  return Array.from(months.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);
}

