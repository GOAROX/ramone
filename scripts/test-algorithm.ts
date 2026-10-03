import fs from 'fs';
import path from 'path';
import { predictNextCycle, CycleInput } from '../src/engine';

interface CsvRow {
  userName: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  periodDurationDays: number;
  cycleLengthDays?: number;
  notes?: string;
}

function parseCyclesCsv(filePath: string): Record<string, CycleInput[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const userMap: Record<string, CycleInput[]> = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('user_name')) {
      continue;
    }

    const [userName, cycleNum, startDate, endDate, duration, cycleLen, notes] = line.split(',');

    if (!userMap[userName]) {
      userMap[userName] = [];
    }

    userMap[userName].push({
      id: `${userName}-${cycleNum}`,
      startDate,
      endDate,
      periodDurationDays: parseInt(duration, 10),
      cycleLengthDays: cycleLen ? parseInt(cycleLen, 10) : undefined,
      notes,
    });
  }

  return userMap;
}

function runTests() {
  const csvPath = path.resolve(__dirname, '../sample-test-data/cycles.csv');
  console.log(`\n======================================================================`);
  console.log(`🌸 RAMONE CYCLE PREDICTION ENGINE TEST SUITE`);
  console.log(`Loading dataset from: ${csvPath}`);
  console.log(`======================================================================\n`);

  const personas = parseCyclesCsv(csvPath);

  for (const [name, cycles] of Object.entries(personas)) {
    console.log(`\n----------------------------------------------------------------------`);
    console.log(`👤 PERSONA: ${name.toUpperCase()} (${cycles.length} logged cycles)`);
    console.log(`----------------------------------------------------------------------`);

    const result = predictNextCycle(cycles);
    const stats = result.statistics;

    console.log(`📊 Statistics:`);
    console.log(`   - Logged Cycles:       ${stats.totalLoggedCycles} (Valid: ${stats.validCyclesCount}, Outliers: ${stats.outlierCount})`);
    console.log(`   - Regularity:          ${stats.cycleRegularity}`);
    console.log(`   - Average Cycle:       ${stats.averageCycleLength} days`);
    console.log(`   - Weighted Cycle:      ${stats.weightedCycleLength} days`);
    console.log(`   - Standard Deviation:  ±${stats.standardDeviation} days`);
    console.log(`   - Average Period:      ${stats.averagePeriodDuration} days`);
    console.log(`   - Range:               ${stats.shortestCycleDays ?? 'N/A'} to ${stats.longestCycleDays ?? 'N/A'} days`);

    console.log(`\n🔮 Forecast for Next Cycle:`);
    console.log(`   - Next Period Start:   ${result.nextPeriodStartDateKey} (±${result.confidenceRangeDays} days)`);
    console.log(`   - Next Period End:     ${result.nextPeriodEndDateKey}`);
    console.log(`   - Predicted Length:    ${result.predictedCycleLength} days`);
    console.log(`   - Predicted Flow:      ${result.predictedPeriodDuration} days`);
    console.log(`   - Estimated Ovulation: ${result.estimatedOvulationDateKey}`);
    console.log(`   - Fertile Window:      ${result.fertileWindowStartDateKey} -> ${result.fertileWindowEndDateKey}`);

    // Assertions based on persona archetype
    if (name === 'Sarah') {
      if (result.predictedCycleLength === 28 && stats.cycleRegularity === 'Regular') {
        console.log(`   ✅ PASS: Sarah predicted 28 days with Regular status.`);
      } else {
        console.error(`   ❌ FAIL: Sarah prediction mismatch.`);
      }
    } else if (name === 'Maya') {
      if ((result.predictedCycleLength === 24 || result.predictedCycleLength === 25) && stats.averagePeriodDuration === 4) {
        console.log(`   ✅ PASS: Maya short-cycle detected accurately (${result.predictedCycleLength}d cycle, 4d period).`);
      } else {
        console.error(`   ❌ FAIL: Maya prediction mismatch.`);
      }
    } else if (name === 'Elena') {
      if (stats.standardDeviation >= 2.0 && result.confidenceRangeDays >= 2) {
        console.log(`   ✅ PASS: Elena irregular cycle detected (stdDev ±${stats.standardDeviation}d, confidence ±${result.confidenceRangeDays}d).`);
      } else {
        console.error(`   ❌ FAIL: Elena irregularity detection mismatch.`);
      }
    } else if (name === 'Chloe') {
      if (stats.outlierCount === 1 && result.predictedCycleLength <= 30) {
        console.log(`   ✅ PASS: Chloe's 48-day spike was successfully isolated as an outlier! Baseline remained ${result.predictedCycleLength} days.`);
      } else {
        console.error(`   ❌ FAIL: Chloe outlier was not isolated properly.`);
      }
    } else if (name === 'Aria') {
      if (stats.validCyclesCount === 0 && result.isBasedOnPopulationDefault) {
        console.log(`   ✅ PASS: Aria cold-start handled gracefully with population default fallback.`);
      } else {
        console.error(`   ❌ FAIL: Aria cold start mismatch.`);
      }
    }
  }

  console.log(`\n======================================================================`);
  console.log(`🎉 ALL PERSONA TESTS COMPLETE`);
  console.log(`======================================================================\n`);
}

runTests();
