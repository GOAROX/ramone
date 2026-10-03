# 🌸 Ramone: Future Development & Pending Tasks

This document outlines the architectural roadmap, planned features, and pending implementation tasks for Ramone as a clean, privacy-first alternative to Flo.

---

## 🚦 Current Progress Snapshot

* [x] **Core Prediction Engine (`src/engine/`):** Pure TypeScript mathematical engine implementing Weighted Moving Averages, clinical & IQR outlier isolation, dynamic luteal-phase ovulation calculations, variability confidence intervals ($\pm X$ days), and cold-start fallbacks.
* [x] **Sample Persona Test Dataset (`sample-test-data/`):** Tested against 5 realistic clinical personas (Regular, Short, Irregular, Outlier Spike, Cold Start) with 100% test pass rate.
* [ ] **Local SQLite Database Layer (`expo-sqlite`):** Pending setup.
* [ ] **Engine-to-UI Integration:** Pending database hydration into screens.
* [ ] **Daily Symptom & Flow Logging Persistence:** Pending database storage.

---

## 🗄️ 1. Local Data Storage & Persistence (Next Immediate Priority)

To fulfill **Option A (Local-First Architecture)**, Ramone must store all cycle and daily health data locally on the user's device using `expo-sqlite`.

### Tasks:
* **Install and Configure `expo-sqlite`:**
  * Install SDK-compatible `expo-sqlite` via `npx expo install expo-sqlite`.
  * Set up asynchronous database initialization hook/provider (`useDatabase` / `DatabaseContext`).
* **Database Schema Implementation:**
  * **`user_settings` table:** Stores user preferences (custom baseline cycle length, period duration, discreet mode toggle, theme).
  * **`cycles` table (Macro level):** Stores cycle start dates, end dates, computed lengths, period duration, outlier flags, and notes.
  * **`daily_logs` table (Micro level):** Stores date-specific flow intensity, cramps, mood, energy levels, and symptom tags linked to cycles via foreign key (`cycle_id`).
* **Repository & Data Access Layer (`src/db/` or `src/services/`):**
  * `CycleRepository`: `getRecentCycles(limit = 6)`, `insertCycle()`, `updateCycle()`, `deleteCycle()`.
  * `DailyLogRepository`: `getLogForDate(dateKey)`, `upsertDailyLog()`, `getLogsForCycle(cycleId)`.
* **Database Hydration to Prediction Engine:**
  * Wire the `CycleRepository.getRecentCycles()` query directly into `predictNextCycle()` to power the calendar, home screen countdown, and milestone projections dynamically.

---

## 🔄 2. Automated Cycle Ingestion & Transition Logic

* **Auto-Cycle Creation on Period Start:** When a user logs a day of `light`, `medium`, or `heavy` bleeding after non-bleeding days, the app should prompt or automatically register the start of a new cycle.
* **Period Duration Calculation:** Automatically set `period_duration_days` based on consecutive bleeding days.
* **Continuous Recalibration:** When a new period is confirmed, immediately close the preceding cycle, calculate the completed cycle length, rerun `predictNextCycle()`, and update calendar forecasts.

---

## 💡 3. Predictive Symptom & Daily Insight Engine

* **Localized Pattern Recognition:** Compute statistical correlations from local history (e.g., *"In 4 of your last 5 cycles, you reported headaches 2 days before your period"*).
* **Phase-Aware Daily Advice:** Expand [`daily-insight-card.tsx`](file:///c:/Users/GOA/Documents/Projects/ramone/src/components/ramone/daily-insight-card.tsx) with a contextual dictionary:
  * *Menstruation (Days 1–5):* Recovery tips, magnesium, hydration, gentle movement over high-impact training.
  * *Follicular & Ovulation (Days 6–14):* Estrogen elevation, athletic energy peaks, strength training optimization.
  * *Luteal Phase (Days 15–28):* Progesterone shifts, psychological PMS management, complex carbs, rest optimization.

---

## 🔒 4. Privacy, Security & Discreet Mode

* **Discreet Mode Toggle:** A quick settings switch that masks sensitive clinical terms (replacing "Period" with subtle color accents or custom labels) so users can view the app comfortably in public.
* **Biometric App Lock:** Optional FaceID / Fingerprint / PIN authentication using `expo-local-authentication` before opening the app.
* **Zero Telemetry:** Ensure no third-party analytics or tracking SDKs touch health inputs.

---

## 📤 5. Local Data Export & Backup

* **Medical PDF / CSV Export:** Generate clinical cycle history summaries directly on the device using `expo-print` or `expo-sharing` for doctor or gynecologist visits.
* **Local JSON Backup & Restore:** Allow users to export an encrypted backup file to device files/iCloud Drive/Google Drive and restore it on demand without central servers.

---

## ☁️ 6. Version 2 Consideration: Optional Cloud Functions

* As defined in [Development-Options.md](file:///c:/Users/GOA/Documents/Projects/ramone/Markdowns/Development-Options.md), evaluate opt-in multi-device synchronization (via Supabase or Firebase) strictly as a secondary phase after Version 1 local-first is fully shipped.