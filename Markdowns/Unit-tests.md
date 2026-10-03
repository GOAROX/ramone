# 🧪 Ramone: Unit Tests & Regression Verification

This document is the official testing and regression guide for Ramone. Whenever changes are made to the codebase, refer to this document to run tests and ensure zero regressions.

---

## 🚀 Quick Command Reference

Run these commands from the project root:

```bash
# 1. Run the Prediction Engine Test Suite (all 5 personas)
npx tsx scripts/test-algorithm.ts

# 2. Run TypeScript Typechecking
npx tsc --noEmit

# 3. Run ESLint
npx expo lint
```

> **Target Standard:** All 3 commands must complete with **zero errors** and **zero warnings** before declaring any task done.

---

## 📊 Test Suite Overview

* **Test Runner:** [`scripts/test-algorithm.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/scripts/test-algorithm.ts)
* **Dataset Source:** [`sample-test-data/cycles.csv`](file:///c:/Users/GOA/Documents/Projects/ramone/sample-test-data/cycles.csv)
* **Target Module:** [`src/engine/`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine)

The test suite validates the prediction engine against **5 real-world clinical archetypes** representing diverse menstrual biology.

---

## 👥 Personas & Verification Criteria

### 1. Sarah — Classic Regular Clockwork
* **Scenario:** Clockwork menstrual cycle with standard 28-day rhythm and 5-day bleeding.
* **Input Data:** 6 cycles: `[28, 28, 29, 28, 28, 28]` days.
* **Verification Criteria:**
  * Predicted cycle length = **28 days**.
  * Predicted period flow = **5 days**.
  * Cycle Regularity = **`Regular`** ($\sigma \le 1.5$ days).
  * Confidence range = **$\pm 1$ day**.
* **Status:** ✅ **PASS**

---

### 2. Maya — Consistent Short Cycles
* **Scenario:** Shorter follicular/luteal phase resulting in recurring 24–25 day cycles and 4-day bleeding.
* **Input Data:** 6 cycles: `[24, 25, 24, 25, 24, 25]` days.
* **Verification Criteria:**
  * Engine must not blindly default to 28 days.
  * Predicted cycle length = **25 days**.
  * Predicted period flow = **4 days**.
  * Cycle Regularity = **`Regular`**.
  * Ovulation dynamically recalculated to Day 11 (Cycle Length 25 minus 14 luteal days).
* **Status:** ✅ **PASS**

---

### 3. Elena — Naturally Irregular / Variable Cycles
* **Scenario:** High biological variability ranging from 27 to 35 days, with 6-day flow.
* **Input Data:** 6 cycles: `[32, 27, 34, 29, 35, 30]` days.
* **Verification Criteria:**
  * Standard deviation $\sigma \ge 2.0$ days.
  * Regularity classification = **`Slightly Irregular`** or **`Irregular`**.
  * Dynamic confidence margin reflects variability ($\pm 3$ days).
  * Weighted Moving Average prioritizes recent cycles over older cycles.
* **Status:** ✅ **PASS**

---

### 4. Chloe — Anomaly & Outlier Spike Isolation
* **Scenario:** Baseline 29–30 day cycles, but experienced a single 48-day spike caused by severe illness/international travel.
* **Input Data:** 6 cycles: `[29, 30, 48, 29, 30, 29]` days.
* **Verification Criteria:**
  * The 48-day cycle must be detected and isolated as an outlier (`outlierCount: 1`).
  * The outlier must **not** distort future predictions (without isolation, prediction would skew to $\approx 33$ days).
  * Predicted cycle length must remain at true baseline (**29 days**).
  * Confidence range stays tight at **$\pm 1$ day**.
* **Status:** ✅ **PASS**

---

### 5. Aria — Cold-Start / New User
* **Scenario:** Brand new user who has only logged their first period start date (no completed cycle intervals yet).
* **Input Data:** 1 cycle entry with start and end dates only (`validCyclesCount: 0`).
* **Verification Criteria:**
  * Engine must not crash or produce `NaN` values.
  * Gracefully falls back to population standard (**28-day cycle, 5-day flow**).
  * Regularity classification = **`Insufficient Data`**.
  * `isBasedOnPopulationDefault` flag set to `true`.
  * Confidence margin defaults safely to $\pm 3$ days.
* **Status:** ✅ **PASS**

---

## 🛡️ Regression Checklist for Future Sessions

When modifying the engine, adding SQLite database queries, or updating UI screens, follow this 4-step checklist:

1. [ ] **Run Algorithm Tests:**
   ```bash
   npx tsx scripts/test-algorithm.ts
   ```
   *Verify that all 5 personas display `✅ PASS`.*

2. [ ] **Verify TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   *Verify 0 compilation errors.*

3. [ ] **Run Linter:**
   ```bash
   npx expo lint
   ```
   *Verify 0 lint errors and 0 warnings.*

4. [ ] **Check UI Backwards Compatibility:**
   * Ensure [`src/utils/cycle-calculator.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/utils/cycle-calculator.ts) exports remain compatible with [`src/app/calendar.tsx`](file:///c:/Users/GOA/Documents/Projects/ramone/src/app/calendar.tsx) and all UI components.
