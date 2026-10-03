# 🧪 Sample Test Data & Database Schema Roadmap

This folder contains mock datasets representing realistic clinical cycles to test our cycle prediction algorithms before setting up SQLite.

---

## 📁 Datasets

1. **[`cycles.csv`](./cycles.csv):** Macro-level cycle boundaries and calculated cycle lengths. Used directly by the prediction algorithm.
2. **[`daily_logs.csv`](./daily_logs.csv):** Micro-level daily symptoms, bleeding intensity, and mood logs.

---

## 👥 Personas & Edge Cases Tested

| Persona | Archetype | Characteristics | Test Objective |
| :--- | :--- | :--- | :--- |
| **Sarah** | Classic Regular | 28 days $\pm 1$, 5-day flow | Baseline validation for moving average |
| **Maya** | Consistent Short | 24–25 days, 4-day flow | Custom cycle lengths (not defaulting to 28) |
| **Elena** | Irregular / Variable | 27–35 days, 6-day flow | Weighted average & confidence interval window ($\pm X$ days) |
| **Chloe** | Outlier Spike | Baseline 29–30 days, one 48-day spike | Outlier filtering (illness/travel shouldn't distort next prediction) |
| **Aria** | Cold Start | 1 cycle logged | Fallback to population averages when history is low |

---

## 🗄️ Database Structure: Two-Table Relational Model

For SQLite, we will follow a clean **Two-Table Relational Structure** (with an optional settings table):

```
┌─────────────────────────────────┐
│         User Settings           │
│  (default_cycle, default_period)│
└─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│                        cycles                          │
├────────────────────────────────────────────────────────┤
│ id (PK)                                                │
│ start_date (TEXT, YYYY-MM-DD, UNIQUE)                  │
│ end_date   (TEXT, YYYY-MM-DD)                          │
│ cycle_length_days (INTEGER)                            │
│ period_duration_days (INTEGER)                         │
│ is_outlier (BOOLEAN / INTEGER: 0 or 1)                 │
│ notes (TEXT)                                           │
└────────────────────────────────────────────────────────┘
                 │ 1
                 │
                 │ N
                 ▼
┌────────────────────────────────────────────────────────┐
│                      daily_logs                        │
├────────────────────────────────────────────────────────┤
│ id (PK)                                                │
│ cycle_id (FK -> cycles.id, NULLABLE)                  │
│ log_date (TEXT, YYYY-MM-DD, UNIQUE)                   │
│ flow_intensity ('none' | 'spotting' | 'light' | ...)   │
│ cramps_intensity ('none' | 'mild' | 'moderate' | ...)  │
│ mood (TEXT)                                            │
│ energy_level (TEXT)                                    │
│ notes (TEXT)                                           │
└────────────────────────────────────────────────────────┘
```

### Why this structure?
1. **The Prediction Algorithm only needs `cycles`:** Fast query (`SELECT * FROM cycles ORDER BY start_date DESC LIMIT 6`) to calculate the next cycle start, ovulation, and fertile windows.
2. **Daily logging is non-blocking:** Users can log mood, symptoms, or spotting on any day without altering historical cycle math unless flow reaches a period start threshold.
3. **Decoupled & Local-First:** Everything queries SQLite locally in milliseconds with zero network requests.
