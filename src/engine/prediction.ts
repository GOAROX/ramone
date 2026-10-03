/**
 * Core Cycle Prediction Engine
 */

import {
  CycleInput,
  ProcessedCycle,
  CyclePredictionResult,
  UserCycleSettings,
  DEFAULT_CYCLE_SETTINGS,
} from './types';
import { parseDate, formatDateKey, addDays, diffDays, getToday } from './date-utils';
import { evaluateCycleOutlier } from './outliers';
import { calculateCycleStatistics } from './statistics';
import { calculateFertilityWindow } from './fertility';

/**
 * Sanitizes and normalizes raw cycle inputs into chronological ProcessedCycles,
 * calculating intervals and running outlier evaluations.
 */
export function processRawCycles(
  rawInputs: CycleInput[],
  settings: UserCycleSettings = DEFAULT_CYCLE_SETTINGS
): { all: ProcessedCycle[]; valid: ProcessedCycle[] } {
  if (!rawInputs || rawInputs.length === 0) {
    return { all: [], valid: [] };
  }

  // 1. Parse and sort chronologically by startDate
  const parsed = rawInputs.map((input) => {
    const startDate = parseDate(input.startDate);
    const duration = input.periodDurationDays ?? (input.endDate ? diffDays(parseDate(input.endDate), startDate) + 1 : settings.defaultPeriodDurationDays);
    const endDate = input.endDate ? parseDate(input.endDate) : addDays(startDate, duration - 1);

    return {
      id: input.id,
      startDate,
      startDateKey: formatDateKey(startDate),
      endDate,
      endDateKey: formatDateKey(endDate),
      periodDurationDays: Math.max(1, duration),
      providedCycleLength: input.cycleLengthDays,
      isManualOutlier: input.isOutlier,
      notes: input.notes,
    };
  }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // 2. Compute cycle intervals between consecutive start dates
  const processed: ProcessedCycle[] = [];
  const historicalLengthsForIqr: number[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const cur = parsed[i];
    let computedLength: number | null = null;

    if (i < parsed.length - 1) {
      // Completed cycle: interval to next start date
      computedLength = diffDays(parsed[i + 1].startDate, cur.startDate);
    } else if (cur.providedCycleLength) {
      // Most recent cycle might have an explicitly provided length (e.g. from historical CSV)
      computedLength = cur.providedCycleLength;
    }

    if (computedLength !== null && computedLength > 0 && !cur.isManualOutlier) {
      historicalLengthsForIqr.push(computedLength);
    }

    const outlierEval = evaluateCycleOutlier(
      computedLength,
      cur.isManualOutlier,
      settings,
      historicalLengthsForIqr
    );

    processed.push({
      id: cur.id,
      startDate: cur.startDate,
      startDateKey: cur.startDateKey,
      endDate: cur.endDate,
      endDateKey: cur.endDateKey,
      periodDurationDays: cur.periodDurationDays,
      cycleLengthDays: computedLength,
      isOutlier: outlierEval.isOutlier,
      outlierReason: outlierEval.reason,
      notes: cur.notes,
    });
  }

  const valid = processed.filter((c) => !c.isOutlier);
  return { all: processed, valid };
}

/**
 * Main prediction function: ingests cycle history and calculates the next cycle forecast.
 */
export function predictNextCycle(
  cycles: CycleInput[],
  customSettings?: Partial<UserCycleSettings>
): CyclePredictionResult {
  const settings: UserCycleSettings = {
    ...DEFAULT_CYCLE_SETTINGS,
    ...customSettings,
  };

  const { all, valid } = processRawCycles(cycles, settings);
  const statistics = calculateCycleStatistics(valid, all, settings);

  const isColdStart = statistics.validCyclesCount === 0;
  const predictedCycleLength = Math.round(statistics.weightedCycleLength);
  const predictedPeriodDuration = Math.round(statistics.averagePeriodDuration);

  // Confidence margin of error: ± max(1, round(stdDev))
  const confidenceRangeDays = isColdStart ? 3 : Math.max(1, Math.round(statistics.standardDeviation));

  // Determine baseline start date:
  // If we have logged cycles, base next period on the latest start date.
  // Otherwise, use today as anchor.
  const latestCycle = all.length > 0 ? all[all.length - 1] : null;
  const anchorDate = latestCycle ? latestCycle.startDate : getToday();

  const nextPeriodStartDate = addDays(anchorDate, predictedCycleLength);
  const nextPeriodEndDate = addDays(nextPeriodStartDate, predictedPeriodDuration - 1);

  // Calculate ovulation & fertility window
  const fertility = calculateFertilityWindow(nextPeriodStartDate, settings.lutealPhaseDays);

  return {
    predictedCycleLength,
    predictedPeriodDuration,
    nextPeriodStartDate,
    nextPeriodStartDateKey: formatDateKey(nextPeriodStartDate),
    nextPeriodEndDate,
    nextPeriodEndDateKey: formatDateKey(nextPeriodEndDate),
    estimatedOvulationDate: fertility.ovulationDate,
    estimatedOvulationDateKey: formatDateKey(fertility.ovulationDate),
    fertileWindowStartDate: fertility.fertileStartDate,
    fertileWindowStartDateKey: formatDateKey(fertility.fertileStartDate),
    fertileWindowEndDate: fertility.fertileEndDate,
    fertileWindowEndDateKey: formatDateKey(fertility.fertileEndDate),
    confidenceRangeDays,
    isBasedOnPopulationDefault: isColdStart,
    statistics,
  };
}
