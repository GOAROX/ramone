/**
 * Timezone-safe date utility helpers for menstrual cycle calculations.
 * Always normalizes time to midnight local time to prevent DST/time-drift issues.
 */

export function parseDate(input: string | Date): Date {
  if (input instanceof Date) {
    const d = new Date(input.getTime());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Handle 'YYYY-MM-DD' cleanly without UTC offset shifts
  const parts = input.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const d = new Date(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function diffDays(laterDate: Date, earlierDate: Date): number {
  const d1 = new Date(laterDate.getTime());
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(earlierDate.getTime());
  d2.setHours(0, 0, 0, 0);
  const diffMs = d1.getTime() - d2.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
