/**
 * Statistical calculations for menstrual cycle data
 */

import { ProcessedCycle, CycleStatistics, CycleRegularity, UserCycleSettings } from './types';

/**
 * Calculates statistical metrics (mean, weighted mean, standard deviation, regularity)
 * over valid, non-outlier historical cycles.
 */
export function calculateCycleStatistics(
  validCycles: ProcessedCycle[],
  allCycles: ProcessedCycle[],
  settings: UserCycleSettings
): CycleStatistics {
  const totalLogged = allCycles.length;
  const outlierCount = allCycles.filter((c) => c.isOutlier).length;

  // Extract recorded cycle lengths
  const validLengths = validCycles
    .map((c) => c.cycleLengthDays)
    .filter((len): len is number => len !== null && len > 0);

  // Extract recorded period durations
  const validDurations = validCycles
    .map((c) => c.periodDurationDays)
    .filter((dur) => dur > 0);

  // Cold-start fallback if no valid cycle intervals exist yet
  if (validLengths.length === 0) {
    const avgDuration =
      validDurations.length > 0
        ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length)
        : settings.defaultPeriodDurationDays;

    return {
      totalLoggedCycles: totalLogged,
      validCyclesCount: 0,
      outlierCount,
      averageCycleLength: settings.defaultCycleLengthDays,
      weightedCycleLength: settings.defaultCycleLengthDays,
      standardDeviation: 0,
      cycleRegularity: 'Insufficient Data',
      averagePeriodDuration: avgDuration,
      shortestCycleDays: null,
      longestCycleDays: null,
    };
  }

  // 1. Arithmetic mean
  const sumLengths = validLengths.reduce((acc, val) => acc + val, 0);
  const averageCycleLength = Math.round((sumLengths / validLengths.length) * 10) / 10;

  // 2. Weighted Moving Average (giving most recent cycles highest weight)
  // Take up to `settings.maxHistoryCycles` most recent cycles
  // validCycles is chronological (oldest to newest), so reverse to get newest first
  const recentLengths = [...validLengths].reverse().slice(0, settings.maxHistoryCycles);
  let weightedSum = 0;
  let totalWeight = 0;

  recentLengths.forEach((len, index) => {
    // Weight: e.g. for 4 items, weights are 4, 3, 2, 1
    const weight = recentLengths.length - index;
    weightedSum += len * weight;
    totalWeight += weight;
  });

  const weightedCycleLength =
    totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : averageCycleLength;

  // 3. Standard Deviation
  let standardDeviation = 0;
  if (validLengths.length > 1) {
    const variance =
      validLengths.reduce((acc, val) => acc + Math.pow(val - averageCycleLength, 2), 0) /
      (validLengths.length - 1);
    standardDeviation = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  // 4. Cycle Regularity
  let cycleRegularity: CycleRegularity = 'Regular';
  if (validLengths.length < 2) {
    cycleRegularity = 'Insufficient Data';
  } else if (standardDeviation <= 1.5) {
    cycleRegularity = 'Regular';
  } else if (standardDeviation <= 3.5) {
    cycleRegularity = 'Slightly Irregular';
  } else {
    cycleRegularity = 'Irregular';
  }

  // 5. Period duration average
  const avgDuration =
    validDurations.length > 0
      ? Math.round(
          (validDurations.reduce((a, b) => a + b, 0) / validDurations.length) * 10
        ) / 10
      : settings.defaultPeriodDurationDays;

  return {
    totalLoggedCycles: totalLogged,
    validCyclesCount: validLengths.length,
    outlierCount,
    averageCycleLength,
    weightedCycleLength,
    standardDeviation,
    cycleRegularity,
    averagePeriodDuration: avgDuration,
    shortestCycleDays: Math.min(...validLengths),
    longestCycleDays: Math.max(...validLengths),
  };
}
