# 🤝 Ramone Project Handoff Document

> **Last Updated:** October 3, 2026  
> **Status:** Version 1 (Local-First MVP) — In Progress  
> **Git Status:** Commit `fa7bec5` ("engine first iteration") pushed to `main`  
> **Current Milestone:** Prediction Engine Complete & Tested $\rightarrow$ In-App Persona Preview & SQLite Storage Layer

---

## 📌 Executive Summary

**Ramone** is a privacy-first, ad-free alternative to mainstream period trackers like Flo. 
* **Core Philosophy:** All user health data remains strictly on the user's device. No mandatory logins, no tracking pixels, zero server infrastructure costs ($0 forever).
* **Tech Stack:** Expo SDK 57, React Native 0.86, React 19, TypeScript, Expo Router, Vanilla styling/reanimated, Local SQLite (`expo-sqlite`).

---

## 🎯 Architecture Decisions

As confirmed in [`Markdowns/Development-Options.md`](file:///c:/Users/GOA/Documents/Projects/ramone/Markdowns/Development-Options.md):
* **Version 1 (Current Focus):** **Option A (Local-First)** using local `expo-sqlite`. Prioritizes complete privacy, offline capability, zero cloud operational expenses, and clinical-grade cycle prediction.
* **Version 2 (Future):** Optional, opt-in cloud synchronization (Firebase / Supabase) for users who explicitly request cross-device sync.

---

## ✅ What Was Completed in the Current Session

1. **Architecture Decision Finalized:**
   * Updated [`Markdowns/Development-Options.md`](file:///c:/Users/GOA/Documents/Projects/ramone/Markdowns/Development-Options.md) documenting Option A as the V1 standard.

2. **Sample Test Data Created (`sample-test-data/`):**
   * [`sample-test-data/cycles.csv`](file:///c:/Users/GOA/Documents/Projects/ramone/sample-test-data/cycles.csv): Macro-level cycle boundaries across 5 clinical personas.
   * [`sample-test-data/daily_logs.csv`](file:///c:/Users/GOA/Documents/Projects/ramone/sample-test-data/daily_logs.csv): Micro-level daily flow, symptom, and mood entries demonstrating relational mapping.
   * [`sample-test-data/README.md`](file:///c:/Users/GOA/Documents/Projects/ramone/sample-test-data/README.md): Database schema roadmap and testing objectives.

3. **Core Prediction Engine Built (`src/engine/`):**
   * Separated business logic completely from storage into a pure, testable mathematical domain engine:
     * [`src/engine/types.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/types.ts): Strongly typed domain interfaces.
     * [`src/engine/date-utils.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/date-utils.ts): Timezone-safe date arithmetic avoiding UTC/daylight-saving drift.
     * [`src/engine/outliers.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/outliers.ts): Clinical thresholds ($<21$ and $>45$ days) and statistical IQR anomaly isolation.
     * [`src/engine/statistics.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/statistics.ts): Recency-Weighted Moving Average (WMA), standard deviation ($\sigma$), and regularity classification.
     * [`src/engine/fertility.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/fertility.ts): Luteal-phase backward calculation ($\text{Period Start} - 14\text{ days}$) and 6-day fertile window.
     * [`src/engine/prediction.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/prediction.ts): Main forecast orchestrator with cold-start fallback handling.
     * [`src/engine/calendar.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/calendar.ts): Dynamic calendar grid generation and multi-cycle milestone forecasting.
     * [`src/engine/index.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/engine/index.ts): Barrel export file.

4. **100% Backwards Compatibility:**
   * [`src/utils/cycle-calculator.ts`](file:///c:/Users/GOA/Documents/Projects/ramone/src/utils/cycle-calculator.ts) updated to re-export the engine so existing app screens and UI components continue functioning without broken imports.

5. **Automated Regression Suite (`scripts/test-algorithm.ts`):**
   * Validated against all 5 test personas in `cycles.csv` (Sarah, Maya, Elena, Chloe, Aria) with **100% pass rate**. Run via `npx tsx scripts/test-algorithm.ts`.

6. **Quality & Compliance Checks:**
   * `npx tsc --noEmit` passed with 0 errors.
   * `npx expo lint` passed with 0 errors and 0 warnings.

7. **Git Commit & Push:**
   * All work committed as `fa7bec5` (`"engine first iteration"`) and pushed to GitHub `origin/main`.

---

## 🧪 Current Algorithm Test Results

Ran via `npx tsx scripts/test-algorithm.ts`:

| Persona | Archetype | Inputs | Predicted Cycle | Regularity | Outliers Filtered | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sarah** | Classic Regular | 6 cycles (~28d, 5d flow) | **28 days** ($\pm 1$d) | Regular | 0 | ✅ **PASS** |
| **Maya** | Short Cycle | 6 cycles (24–25d, 4d flow) | **25 days** ($\pm 1$d) | Regular | 0 | ✅ **PASS** |
| **Elena** | Irregular / Variable | 6 cycles (27–35d, 6d flow) | **31 days** ($\pm 3$d) | Slightly Irregular | 0 | ✅ **PASS** |
| **Chloe** | Outlier Spike | 5 normal (29–30d) + 1 spike (48d) | **29 days** ($\pm 1$d) | Regular | **1 (48d spike)** | ✅ **PASS** |
| **Aria** | Cold Start | 1 cycle (start date only) | **28 days** (baseline) | Insufficient Data | 0 | ✅ **PASS** |

---

## 📂 Current Project Structure

```
ramone/
├── Markdowns/
│   ├── Development-Options.md    # Architecture evaluation & final decision
│   ├── Future-Developments.md     # Roadmap & pending tasks
│   ├── HANDOFF.md                 # Session handoff documentation (this file)
│   └── Unit-tests.md              # Test documentation & regression checklist
├── sample-test-data/
│   ├── README.md                  # Test dataset documentation & DB mapping
│   ├── cycles.csv                 # 5 persona cycle records
│   └── daily_logs.csv             # Daily symptom logs
├── scripts/
│   ├── reset-project.js
│   └── test-algorithm.ts          # Regression test runner for the prediction engine
├── src/
│   ├── app/                       # Expo Router screens (_layout, index, calendar, explore)
│   ├── components/                # UI components (HeroCircle, TodayHeader, CalendarView, etc.)
│   ├── context/                   # React context (ThemeContext)
│   ├── engine/                    # Pure domain prediction engine
│   └── utils/                     # Backward-compatible facades (cycle-calculator.ts)
└── tsconfig.json
```

---

## 📋 Immediate Next Steps for Next Session

1. **Optionally Wire In-App Persona Switcher:**
   * Add a quick toggle in the app so the user can switch between Sarah, Maya, Elena, Chloe, and Aria in the simulator/browser (`npx expo start`) and visually watch the `HeroCircle` and `Calendar` adapt live.
2. **Install `expo-sqlite`:**
   * Run `npx expo install expo-sqlite`.
3. **Implement SQLite Database Layer (`src/db/`):**
   * Create database connection initialization.
   * Create migration/schema script for `cycles`, `daily_logs`, and `user_settings` tables.
4. **Build Data Access Repositories:**
   * `CycleRepository`: Query the last 6 cycles ordered by start date to feed into `predictNextCycle()`.
   * `DailyLogRepository`: Record daily flow, cramps, mood, and symptoms.
5. **Connect SQLite Data into App State:**
   * Create a `CycleContext` / hook to supply real logged cycles to `TodayScreen` and `CalendarScreen`.
6. **Verify Regression Suite:**
   * Follow [`Markdowns/Unit-tests.md`](file:///c:/Users/GOA/Documents/Projects/ramone/Markdowns/Unit-tests.md) to ensure all tests, lint, and typechecks continue passing.
