/**
 * Fertility, Ovulation, and Conception Window Calculations
 */

import { addDays, diffDays } from './date-utils';

export interface FertilityWindow {
  ovulationDate: Date;
  fertileStartDate: Date; // 5 days before ovulation
  fertileEndDate: Date;   // day of ovulation
}

/**
 * Calculates estimated ovulation and fertile window dates based on
 * the expected next period start date and user luteal phase length.
 */
export function calculateFertilityWindow(
  nextPeriodStartDate: Date,
  lutealPhaseDays: number = 14
): FertilityWindow {
  // Clinically, ovulation occurs (lutealPhaseDays) before the subsequent period
  const ovulationDate = addDays(nextPeriodStartDate, -lutealPhaseDays);

  // Fertile window: 5 days before ovulation + ovulation day = 6-day fertile window
  const fertileStartDate = addDays(ovulationDate, -5);
  const fertileEndDate = ovulationDate;

  return {
    ovulationDate,
    fertileStartDate,
    fertileEndDate,
  };
}

/**
 * Determines pregnancy chance for a given cycle day index
 */
export function getPregnancyChance(
  targetDate: Date,
  ovulationDate: Date
): 'Low' | 'Medium' | 'High' {
  const daysToOvulation = diffDays(ovulationDate, targetDate);

  // Peak fertility: 2 days before ovulation up to ovulation day
  if (daysToOvulation >= 0 && daysToOvulation <= 2) {
    return 'High';
  }

  // Moderate fertility: 3 to 5 days before ovulation
  if (daysToOvulation >= 3 && daysToOvulation <= 5) {
    return 'Medium';
  }

  return 'Low';
}
