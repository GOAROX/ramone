/**
 * Cycle Prediction Engine - Types and Interfaces
 */

export interface UserCycleSettings {
  defaultCycleLengthDays: number;    // Standard clinical population baseline (e.g., 28 days)
  defaultPeriodDurationDays: number; // Standard clinical population baseline (e.g., 5 days)
  lutealPhaseDays: number;           // Constant luteal phase duration (typically 14 days, clinically 12-16)
  outlierMinDays: number;            // Lower biological bound (clinically < 21 days is abnormal)
  outlierMaxDays: number;            // Upper biological bound (clinically > 45 days is abnormal)
  maxHistoryCycles: number;          // How many recent cycles to include in weighted moving average (default 6)
}

export const DEFAULT_CYCLE_SETTINGS: UserCycleSettings = {
  defaultCycleLengthDays: 28,
  defaultPeriodDurationDays: 5,
  lutealPhaseDays: 14,
  outlierMinDays: 21,
  outlierMaxDays: 45,
  maxHistoryCycles: 6,
};

export interface CycleInput {
  id?: string | number;
  startDate: string | Date;          // YYYY-MM-DD or Date
  endDate?: string | Date | null;    // YYYY-MM-DD or Date
  cycleLengthDays?: number;          // Length until next period start
  periodDurationDays?: number;       // Duration of bleeding
  isOutlier?: boolean;               // Manual user override or detected
  notes?: string;
}

export interface ProcessedCycle {
  id?: string | number;
  startDate: Date;
  startDateKey: string;              // YYYY-MM-DD
  endDate: Date;
  endDateKey: string;                // YYYY-MM-DD
  periodDurationDays: number;
  cycleLengthDays: number | null;    // null for the most current ongoing cycle
  isOutlier: boolean;
  outlierReason?: string;
  notes?: string;
}

export type CycleRegularity = 'Regular' | 'Slightly Irregular' | 'Irregular' | 'Insufficient Data';

export interface CycleStatistics {
  totalLoggedCycles: number;
  validCyclesCount: number;
  outlierCount: number;
  averageCycleLength: number;
  weightedCycleLength: number;
  standardDeviation: number;
  cycleRegularity: CycleRegularity;
  averagePeriodDuration: number;
  shortestCycleDays: number | null;
  longestCycleDays: number | null;
}

export interface CyclePredictionResult {
  predictedCycleLength: number;
  predictedPeriodDuration: number;
  nextPeriodStartDate: Date;
  nextPeriodStartDateKey: string;    // YYYY-MM-DD
  nextPeriodEndDate: Date;
  nextPeriodEndDateKey: string;      // YYYY-MM-DD
  estimatedOvulationDate: Date;
  estimatedOvulationDateKey: string; // YYYY-MM-DD
  fertileWindowStartDate: Date;
  fertileWindowStartDateKey: string; // YYYY-MM-DD
  fertileWindowEndDate: Date;
  fertileWindowEndDateKey: string;   // YYYY-MM-DD
  confidenceRangeDays: number;       // ± margin of error based on standard deviation
  isBasedOnPopulationDefault: boolean;
  statistics: CycleStatistics;
}

export type CyclePhase = 'Menstrual Phase' | 'Follicular Phase' | 'Ovulation Phase' | 'Luteal Phase';
export type PregnancyChance = 'Low' | 'Medium' | 'High';

export interface DayCycleInfo {
  date: Date;
  dateKey: string;                   // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  cycleDay: number;
  phase: CyclePhase;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  pregnancyChance: PregnancyChance;
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
