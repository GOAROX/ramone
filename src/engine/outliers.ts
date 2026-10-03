/**
 * Anomaly and Outlier Detection for Menstrual Cycle Tracking
 */

import { UserCycleSettings } from './types';

export interface OutlierEvaluation {
  isOutlier: boolean;
  reason?: string;
}

/**
 * Evaluates whether a cycle length is biologically or statistically anomalous.
 */
export function evaluateCycleOutlier(
  cycleLength: number | null,
  isManualOutlier: boolean | undefined,
  settings: UserCycleSettings,
  historicalLengths: number[] = []
): OutlierEvaluation {
  if (isManualOutlier) {
    return { isOutlier: true, reason: 'Manually marked as irregular / outlier' };
  }

  if (cycleLength === null) {
    return { isOutlier: false };
  }

  // 1. Biological thresholds (ACOG / FIGO clinical guidelines)
  if (cycleLength < settings.outlierMinDays) {
    return {
      isOutlier: true,
      reason: `Shorter than clinical threshold (< ${settings.outlierMinDays} days)`,
    };
  }

  if (cycleLength > settings.outlierMaxDays) {
    return {
      isOutlier: true,
      reason: `Exceeds clinical threshold (> ${settings.outlierMaxDays} days)`,
    };
  }

  // 2. Statistical IQR filter if we have enough historical cycles (>= 4)
  if (historicalLengths.length >= 4) {
    const sorted = [...historicalLengths].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerFence = Math.max(settings.outlierMinDays, q1 - 1.5 * iqr);
    const upperFence = Math.min(settings.outlierMaxDays, q3 + 1.5 * iqr);

    if (cycleLength < lowerFence || cycleLength > upperFence) {
      return {
        isOutlier: true,
        reason: `Statistical anomaly outside personal IQR bounds (${Math.round(lowerFence)}-${Math.round(upperFence)} days)`,
      };
    }
  }

  return { isOutlier: false };
}

function quantile(sortedArr: number[], q: number): number {
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArr[base + 1] !== undefined) {
    return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
  }
  return sortedArr[base];
}
