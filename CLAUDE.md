# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FitnessAI Connect: a LATAM fitness-tech platform connecting personal trainers with users. Features AI-generated workout plans (Groq/LLaMA), real-time coach↔user chat (Supabase Realtime), wearable integration, and a live workout session modal. Target market: Spanish-speaking users in Mexico, Argentina, Colombia.

All user-facing copy is in Spanish. Code comments in this repo are in Spanish too — match that.

---

## Development commands

```bash
# Both servers at once — from repo root
npm run dev          # concurrently runs backend (port 3000) + frontend (port 5173)
npm run install:all  # installs root + backend + frontend deps

# Backend only — from /backend
npm run dev          # nodemon + --env-file=.env on http://localhost:3000

# Frontend only — from /frontend
npm run dev          # Vite on http://localhost:5173 (proxies /api/* → :3000)

# Build
npm run build        # vite build → frontend/dist

# Tests (from repo root)
npm test              # backend + frontend
npm run test:backend
npm run test:frontend
npm run test:unit         # pure logic on both sides
npm run test:integration  # supertest against the real Express app
npm run test:components   # React Testing Library
npm run test:coverage
npm run test:watch

# On Windows: use cmd, not PowerShell (ExecutionPolicy may block npm)
```

No linter or type-checker is configured.

---

## Testing

Vitest on both sides. **Every change to business logic must come with a test.** When refactoring untested code, write characterization tests first.

**Backend** (`backend/tests/`)
- `tests/unit/` — pure functions from `backend/lib/`.
- `tests/integration/` — Supertest against `createApp()`. Supabase and Groq are replaced by doubles via `setSupabaseClient()` / `setGroqClient()`; **no test touches a real service**.
- `tests/helpers/supabase-mock.js` reproduces the chainable PostgREST builder and records every query in `client.queries`, so tests can assert that a query filtered by `user_id`.
- `tests/helpers/test-app.js` — `createTestApp({ resolver, groqReply })` returns `{ app, supabase, groq, restore }`. Call `restore()` in `afterEach`.
- Coverage thresholds: 75% lines/functions/statements, 70% branches.

**Frontend** (`*.test.js(x)` next to the source)
- Mock the API layer with `vi.mock('../api/client.js', ...)` and then `await import()` the component (the real `client.js` calls `createClient` at module load).
- Test data comes from `src/tests/factories.js` — realistic Spanish content, never `foo`/`bar`.
- `AnimatePresence` delays mounts: use `findBy*` / `waitFor` after any step or block transition, not `getBy*`.
- Coverage thresholds: 60% lines/functions/statements, 65% branches.

---

## Architecture

### Backend

`server.js` only loads the env, validates that `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` exist and calls `listen`. The app itself is built by **`createApp()` in `app.js`** so tests can mount it without opening a port. Keep it that way.

`config/supabase.js` exposes a **single lazily-created `service_role` client** via `getSupabase()`. Do not call `createClient` inside a route file.

**`backend/lib/` holds all pure, testable logic.** Route handlers should read as: validate input → call `lib/` → query Supabase → respond.

| Module | Responsibility |
|--------|----------------|
| `dates.js` | ISO date arithmetic (UTC-based, deterministic), week ranges, `todayISO()` |
| `streak.js` | `computeStreak()`, level and level name |
| `progress.js` | `buildWeeklyChart()`, monthly totals, ring percentages |
| `plan.js` | AI plan prompt, `extractJsonObject()`, `validatePlan()`, row mappers |
| `insights.js` | Insight prompts and `toDbInsightType()` |
| `groq.js` | Lazy Groq client, retry on 429, error → `HttpError` |
| `validation.js` | Input validators that throw `HttpError(400)` |
| `http.js` | `HttpError`, `asyncHandler`, `throwOnSupabaseError` |

**Error handling contract:** every handler is wrapped in `asyncHandler`. Throw `HttpError` (or use `badRequest`/`forbidden`/`notFound`) instead of returning ad-hoc `res.status(...)`. `app.js` renders 4xx messages verbatim and hides 5xx details in production. Never `return res.status(400).json({ error: error.message })` with a raw Postgres message.

**Authorization:** any write that targets a session or exercise must go through `assertSessionOwnership()` / `assertExerciseInSession()` in `routes/workouts.js`. Because the backend uses `service_role`, RLS does **not** protect these endpoints — the explicit check is the only barrier.

**Timezone:** `APP_TIMEZONE` (default `UTC`) decides what "today" means server-side. All date math uses string arithmetic in `lib/dates.js`; never `new Date('YYYY-MM-DD').getDay()`.

### Frontend

**Navigation** — no React Router. `App.jsx` keeps `activeScreen` and conditionally renders. The onboarding gate (`profile?.onboarding_completed`) runs before anything else. `PASSWORD_RECOVERY` from `onAuthStateChange` forces `ResetPassword`.

`Progress` and `DashboardCoach` are `React.lazy` — Recharts is ~340 kB and must stay out of the initial bundle. Keep new heavy screens lazy too.

**Trainer role** — `isTrainer` is true when a `trainer_profiles` row matches the user id. `DashboardCoach` is reachable as `activeScreen === 'coach'`; it is not in the `NAV` array.

**`src/lib/`** holds pure logic shared by ≥3 screens:
- `dates.js` — parse/format `YYYY-MM-DD` **in local time**. Never pass those strings to `new Date()` directly: it parses as UTC midnight and shifts the weekday in every American timezone.
- `workout.js` — `BLOCK_ORDER`, `BLOCK_META`, `exerciseType()` (falls back to `strength`), `groupByBlock()`, `totalSets()`, `formatTimer()`, `estimateCalories()`.

**`src/hooks/useApiData.js`** — the standard way to load a screen: returns `{ data, setData, loading, error, reload }`. Screens render a skeleton while loading and `<ErrorState onRetry={reload} />` on failure. Never `.catch(console.error)` and render `null`.

### API layer (`frontend/src/api/client.js`)

Every HTTP call goes through this wrapper. It fetches a fresh Supabase session token on **each request** (never cached), applies a 30 s timeout, and turns network/timeout/non-JSON failures into Spanish `Error` messages carrying `.status`.

### AI integration (`backend/routes/ai.js`)

Model: **Groq LLaMA 4 Scout** (`meta-llama/llama-4-scout-17b-16e-instruct`).

- `POST /ai/insight` — type-based prompts; the DB insert is fire-and-forget but logs failures. `toDbInsightType()` maps prompt types to the values allowed by the `ai_insights.type` CHECK.
- `POST /ai/generate-plan` — generates week 1 as JSON. Order matters: **validate → insert the new plan → archive the old ones**. Archiving first left users with no active plan when the insert failed.

Generated session structure: 4 blocks — `warmup` (3 mobility, `duration_seconds`, `sets:1`), `strength` (compound-first), `cardio` (skipped when `cardio_minutes=0`), `cooldown` (3 stretches). Rest: heavy compounds 150-180 s, secondary 90-120 s, isolations 60 s.

Weeks 2–12 are still pending — see `COMPONENTES-PENDIENTES.md`.

### Backend endpoint reference

| Method | Path | Auth | Notes |
|--------|------|:----:|-------|
| GET | `/health` | — | Outside the rate limiter |
| POST | `/api/auth/check-email` | — | Paginated lookup; enumerates accounts by design (rate-limited) |
| GET | `/api/home` | ✓ | today_session or next_session, rings, HRV, insight, week strip |
| GET | `/api/workouts/plan` | ✓ | Active plan with sessions + exercises |
| GET | `/api/workouts/upcoming` | ✓ | Next 5 pending sessions |
| POST | `/api/workouts/sessions/:id/start` | ✓ | Mark `in_progress` |
| PATCH | `/api/workouts/sessions/:id/complete` | ✓ | Close session + recalc streak |
| PATCH | `/api/workouts/sessions/:sid/exercises/:eid/toggle` | ✓ | Mark exercise done |
| POST | `/api/workouts/sessions/:sid/exercises/:eid/sets` | ✓ | Upsert set (ownership-checked) |
| GET | `/api/progress/stats` | ✓ | Monthly stats + streak |
| GET | `/api/progress/chart` | ✓ | `period`: `4w`/`3m`/`1y` |
| POST/GET | `/api/progress/metrics` | ✓ | Daily body metrics; `days` is 1-365 |
| GET/PATCH | `/api/profile` | ✓ | PATCH honours a strict whitelist |
| POST/DELETE | `/api/profile/wearables[/:platform]` | ✓ | Platform validated against a closed set |
| POST | `/api/ai/insight` | ✓ | 429 with backoff, 502 on provider failure |
| POST | `/api/ai/generate-plan` | ✓ | Week-1 plan |

There are **no** `/auth/signup`, `/auth/signin`, `/auth/signout` or `/auth/reset-password` endpoints — the frontend talks to Supabase Auth directly.

---

## Key patterns to follow

**Screens and modals**
- Screens use `.screen`; modals use `.modal-overlay` + `.modal-sheet` (bottom sheet).
- Mobile-first at 390×844; under 460 px the phone frame collapses to full screen.
- `WorkoutModal` has two states in `App.jsx`: `activeSession` (object or null) and `modalVisible` (boolean). Minimizing sets `modalVisible=false` but keeps the component mounted so the timer survives. A mini "En vivo" bar renders above the bottom nav.

**WorkoutModal flow**
- Exercises are grouped into `warmup → strength → cardio → cooldown` via `groupByBlock()`. Only the current block is visible; "Siguiente fase" appears when the block is done.
- The timer starts on the first exercise interaction, not on open. It uses wall-clock (`Date.now() - startTimeRef.current`) — never increment a counter with `setInterval`.
- Strength: each "Serie N lista" logs a set and starts the rest timer; the last set completes the exercise. Timed exercises (warmup/cooldown/cardio): a single "Terminar".
- Calories come from `estimateCalories()` in `lib/workout.js` (RPE-scaled kcal/min), not an ad-hoc formula.
- If `hasWearable` is false, HR shows `—`. Never simulate HR without a wearable.

**Accessibility (non-negotiable)**
- Anything clickable is a `<button type="button">`, never a `<div onClick>`.
- Toggles use `role="switch"` + `aria-checked`; selectable chips use `aria-pressed`; radio groups use `role="radiogroup"`/`role="radio"`.
- Every input has a `<label htmlFor>`. Modals carry `role="dialog"` + `aria-modal` and close on Escape.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label`.
- Icons come from lucide-react. No emoji in the UI.

**Style system** (`frontend/src/index.css`, Tailwind v4 `@theme`)

```css
--color-bg:        #0D0D0D   --color-accent:     #FF5733
--color-surface:   #1A1A1A   --color-accent-dim: rgba(255,87,51,0.12)
--color-surface2:  #222222   --color-green:      #4CAF50
--color-border:    #2A2A2A   --color-blue:       #60a5fa
--color-txt:       #FFFFFF   --color-txt2:       #888888   --color-txt3: #555555
--font-body:       'Inter'   --font-metric:      'Barlow Condensed'
```

Dark theme, `1px solid #2A2A2A` borders, no box-shadows. Reference: "Nike Training Club meets Strong app". Framer Motion for transitions, Recharts for the weekly volume chart.

**Data**
- Use realistic Spanish content for exercises and users — never placeholder text.
- Nested selects for relationships: `trainer_profiles(full_name, rating)`.
- Idempotent writes use `upsert` with `onConflict` (see the sets endpoint).
- When selecting `session_exercises`, always include `exercise_type`, `duration_seconds` and `order_num` — the block flow breaks without them.

---

## Environment variables

**Backend (`backend/.env`)** — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `PORT`, `FRONTEND_URL` (comma-separated list allowed), `NODE_ENV`, optional `APP_TIMEZONE`, optional `GROQ_RETRY_DELAYS_MS`.

**Frontend (`frontend/.env`)** — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (production only; dev uses the Vite proxy).

---

## Database

Schema at `database/schema.sql`: 11 tables + 1 view, RLS on all, indexes on the hot paths, and an idempotent **MIGRACIONES** block at the end for existing installations.

- A trigger auto-creates a `profiles` row on signup; 15 seed exercises in Spanish.
- `session_exercises` carries `exercise_type` and `duration_seconds`.
- `session_sets` has `UNIQUE(session_exercise_id, set_number)` — the sets upsert depends on it.
- The backend scopes every query by `req.user.id`; RLS only guards direct client access, since the API uses `service_role`.
