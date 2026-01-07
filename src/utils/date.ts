/**
 * Returns today's date as YYYY-MM-DD
 * Based on user's local time.
 */
export function getTodayDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}
