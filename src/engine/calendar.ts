/**
 * Calendar and Projection Helpers
 */

import { DayCycleInfo, PredictedCycleMilestone, CyclePhase, PregnancyChance } from './types';
import { parseDate, formatDateKey, addDays, diffDays, isSameDay, getToday } from './date-utils';

export function getReferencePeriodStart(
  today: Date = getToday(),
  currentCycleDay: number = 14
): Date {
  const ref = parseDate(today);
  ref.setDate(ref.getDate() - (currentCycleDay - 1));
  return ref;
}

/**
 * Calculates cycle details for a specific calendar date given a reference period start
 */
export function getCycleInfoForDate(
  date: Date,
  refPeriodStart: Date,
  cycleLength: number = 28,
  periodLength: number = 5,
  lutealPhaseDays: number = 14
): DayCycleInfo {
  const target = parseDate(date);
  const today = getToday();
  const refStart = parseDate(refPeriodStart);

  const diff = diffDays(target, refStart);

  // Modulo calculation that handles negative offsets correctly
  let cycleDayIndex = diff % cycleLength;
  if (cycleDayIndex < 0) {
    cycleDayIndex += cycleLength;
  }
  const cycleDay = cycleDayIndex + 1; // 1-indexed (1..cycleLength)

  const isPeriod = cycleDay >= 1 && cycleDay <= periodLength;
  const ovulationDay = Math.max(1, cycleLength - lutealPhaseDays);
  const isOvulation = cycleDay === ovulationDay;

  // Fertile window: 5 days prior to ovulation + ovulation day
  const fertileStartDay = Math.max(1, ovulationDay - 5);
  const fertileEndDay = ovulationDay;
  const isFertile = cycleDay >= fertileStartDay && cycleDay <= fertileEndDay;

  let phase: CyclePhase = 'Follicular Phase';
  let pregnancyChance: PregnancyChance = 'Low';

  if (isPeriod) {
    phase = 'Menstrual Phase';
    pregnancyChance = 'Low';
  } else if (isOvulation) {
    phase = 'Ovulation Phase';
    pregnancyChance = 'High';
  } else if (isFertile) {
    phase = 'Follicular Phase';
    pregnancyChance = cycleDay >= ovulationDay - 2 ? 'High' : 'Medium';
  } else if (cycleDay > ovulationDay) {
    phase = 'Luteal Phase';
    pregnancyChance = 'Low';
  } else {
    phase = 'Follicular Phase';
    pregnancyChance = cycleDay >= fertileStartDay - 2 ? 'Medium' : 'Low';
  }

  return {
    date: target,
    dateKey: formatDateKey(target),
    dayOfMonth: target.getDate(),
    isCurrentMonth: true,
    isToday: isSameDay(target, today),
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
  periodLength: number = 5,
  lutealPhaseDays: number = 14
): DayCycleInfo[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const grid: DayCycleInfo[] = [];

  // Previous month padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const padDate = new Date(year, month, -i);
    const info = getCycleInfoForDate(padDate, refPeriodStart, cycleLength, periodLength, lutealPhaseDays);
    info.isCurrentMonth = false;
    grid.push(info);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const info = getCycleInfoForDate(curDate, refPeriodStart, cycleLength, periodLength, lutealPhaseDays);
    info.isCurrentMonth = true;
    grid.push(info);
  }

  // Next month padding days to complete 7-column rows (up to 35 or 42 cells)
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextDate = new Date(year, month + 1, n);
    const info = getCycleInfoForDate(nextDate, refPeriodStart, cycleLength, periodLength, lutealPhaseDays);
    info.isCurrentMonth = false;
    grid.push(info);
  }

  return grid;
}

/**
 * Calculates future cycle milestones (e.g. next N cycles)
 */
export function getFuturePredictedCycles(
  refPeriodStart: Date,
  cycleLength: number = 28,
  periodLength: number = 5,
  count: number = 6,
  lutealPhaseDays: number = 14
): PredictedCycleMilestone[] {
  const milestones: PredictedCycleMilestone[] = [];
  const today = getToday();
  const refStart = parseDate(refPeriodStart);

  for (let i = 0; i < count; i++) {
    const periodStart = addDays(refStart, i * cycleLength);
    const periodEnd = addDays(periodStart, periodLength - 1);

    const ovulationDayOffset = Math.max(1, cycleLength - lutealPhaseDays);
    const ovulation = addDays(periodStart, ovulationDayOffset - 1);

    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = ovulation;

    const diffDaysUntil = diffDays(periodStart, today);

    milestones.push({
      cycleIndex: i + 1,
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      fertileStartDate: fertileStart,
      fertileEndDate: fertileEnd,
      ovulationDate: ovulation,
      daysUntilPeriod: diffDaysUntil,
    });
  }

  return milestones;
}
