/**
 * Cycle prediction engine and date calculation helpers
 */

export interface DayCycleInfo {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  cycleDay: number;
  phase: 'Menstrual Phase' | 'Follicular Phase' | 'Ovulation Phase' | 'Luteal Phase';
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  pregnancyChance: 'Low' | 'Medium' | 'High';
}

export interface PredictedCycleMilestone {
  cycleIndex: number;
  periodStartDate: Date;
  periodEndDate: Date;
  fertileStartDate: Date;
  fertileEndDate: Date;
  ovulationDate: Date;
  daysUntilPeriod: number;
}

// Default reference: Cycle day 14 is today (Sep 26, 2026), so period started 13 days ago
export function getReferencePeriodStart(today: Date = new Date(), currentCycleDay: number = 14): Date {
  const ref = new Date(today);
  ref.setHours(0, 0, 0, 0);
  ref.setDate(ref.getDate() - (currentCycleDay - 1));
  return ref;
}

/**
 * Calculates cycle details for a specific calendar date
 */
export function getCycleInfoForDate(
  date: Date,
  refPeriodStart: Date,
  cycleLength: number = 28,
  periodLength: number = 5
): DayCycleInfo {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - refPeriodStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Modulo calculation that handles negative offsets correctly
  let cycleDayIndex = diffDays % cycleLength;
  if (cycleDayIndex < 0) {
    cycleDayIndex += cycleLength;
  }
  const cycleDay = cycleDayIndex + 1; // 1-indexed (1..28)

  const isPeriod = cycleDay >= 1 && cycleDay <= periodLength;
  const isOvulation = cycleDay === 14;
  const isFertile = cycleDay >= 10 && cycleDay <= 15;

  let phase: DayCycleInfo['phase'] = 'Follicular Phase';
  let pregnancyChance: DayCycleInfo['pregnancyChance'] = 'Low';

  if (isPeriod) {
    phase = 'Menstrual Phase';
    pregnancyChance = 'Low';
  } else if (isOvulation) {
    phase = 'Ovulation Phase';
    pregnancyChance = 'High';
  } else if (isFertile) {
    phase = 'Follicular Phase';
    pregnancyChance = cycleDay >= 12 ? 'High' : 'Medium';
  } else if (cycleDay > 15) {
    phase = 'Luteal Phase';
    pregnancyChance = 'Low';
  } else {
    phase = 'Follicular Phase';
    pregnancyChance = cycleDay >= 8 ? 'Medium' : 'Low';
  }

  const isToday = target.toDateString() === today.toDateString();
  const dateKey = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;

  return {
    date: target,
    dateKey,
    dayOfMonth: target.getDate(),
    isCurrentMonth: true,
    isToday,
    cycleDay,
    phase,
    isPeriod,
    isFertile,
    isOvulation,
    pregnancyChance,
  };
}

/**
 * Builds calendar grid for a given year & month (0-indexed month)
 */
export function getMonthCalendarGrid(
  year: number,
  month: number,
  refPeriodStart: Date,
  cycleLength: number = 28,
  periodLength: number = 5
): DayCycleInfo[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Sunday = 0, Monday = 1, etc.
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const grid: DayCycleInfo[] = [];

  // Previous month padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const padDate = new Date(year, month, -i);
    const info = getCycleInfoForDate(padDate, refPeriodStart, cycleLength, periodLength);
    info.isCurrentMonth = false;
    grid.push(info);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const info = getCycleInfoForDate(curDate, refPeriodStart, cycleLength, periodLength);
    info.isCurrentMonth = true;
    grid.push(info);
  }

  // Next month padding days to complete 7-column rows (up to 35 or 42 cells)
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextDate = new Date(year, month + 1, n);
    const info = getCycleInfoForDate(nextDate, refPeriodStart, cycleLength, periodLength);
    info.isCurrentMonth = false;
    grid.push(info);
  }

  return grid;
}

/**
 * Calculates future cycle milestones (e.g. next 6 cycles)
 */
export function getFuturePredictedCycles(
  refPeriodStart: Date,
  cycleLength: number = 28,
  periodLength: number = 5,
  count: number = 6
): PredictedCycleMilestone[] {
  const milestones: PredictedCycleMilestone[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const periodStart = new Date(refPeriodStart);
    periodStart.setDate(periodStart.getDate() + i * cycleLength);

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + periodLength - 1);

    const fertileStart = new Date(periodStart);
    fertileStart.setDate(fertileStart.getDate() + 9); // Day 10

    const fertileEnd = new Date(periodStart);
    fertileEnd.setDate(fertileEnd.getDate() + 14); // Day 15

    const ovulation = new Date(periodStart);
    ovulation.setDate(ovulation.getDate() + 13); // Day 14

    const diffDays = Math.ceil((periodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    milestones.push({
      cycleIndex: i + 1,
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      fertileStartDate: fertileStart,
      fertileEndDate: fertileEnd,
      ovulationDate: ovulation,
      daysUntilPeriod: diffDays,
    });
  }

  return milestones;
}
