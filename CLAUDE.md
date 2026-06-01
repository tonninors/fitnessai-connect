# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FitnessAI Connect: a LATAM fitness-tech platform connecting personal trainers with users. Features AI-generated workout plans (Groq/LLaMA), real-time coach↔user chat (Supabase Realtime), wearable integration, and a live workout session modal. Target market: Spanish-speaking users in Mexico, Argentina, Colombia.

---

## Development commands

```bash
# Both servers at once — from repo root
npm run dev        # concurrently runs backend (port 3000) + frontend (port 5173)

# Backend only — from /backend
npm run dev        # nodemon + --env-file=.env on http://localhost:3000 (also loads via dotenv in server.js)

# Frontend only — from /frontend
npm run dev        # Vite on http://localhost:5173
# Vite proxies /api/* → localhost:3000 (see vite.config.js)

# On Windows: use cmd, not PowerShell (ExecutionPolicy may block npm)
```

No test runner or linter is configured in this project.

---

## Architecture

### Frontend routing (no React Router)
`App.jsx` manages all screen navigation via a single `activeScreen` state string. There is no URL-based routing — screens are conditionally rendered with a switch. The onboarding gate checks `profile?.onboarding_completed` and redirects before any screen renders.

Auth flow: `supabase.auth.onAuthStateChange()` → fetch profile → detect trainer role (`isTrainer`) → gate app render until profile loads. When `authEvent === 'PASSWORD_RECOVERY'` fires, `App.jsx` forces `activeScreen = 'resetPassword'` before the normal gate, rendering `ResetPassword.jsx` which handles the OTP confirmation and new-password submission.

Trainer role: `isTrainer` is set to `true` when the profile row has a matching entry in `trainer_profiles`. When `isTrainer=true`, `DashboardCoach.jsx` is accessible as `activeScreen === 'coach'`. It is not in the main nav array — navigation to it must be added conditionally. Regular users never see this screen.

**No custom hooks or utils layer** — all logic is inline in screen components (`frontend/src/screens/`). There is no `hooks/` or `utils/` directory. Extract only when a pattern repeats across ≥3 screens.

### API layer (`frontend/src/api/client.js`)
Every HTTP call goes through this wrapper. It fetches a fresh Supabase session token on **each request** (not cached) and injects it as `Authorization: Bearer <token>`. No request-level caching.

### Backend auth (`backend/middleware/auth.js`)
Uses `service_role` key to call `supabase.auth.getUser(token)`. Attaches `req.user` (Supabase user object) and `req.supabase` (client instance) to every request. No separate DB lookup for user identity — trusts the JWT.

### Supabase client instantiation
Each route file (`home.js`, `workouts.js`, etc.) creates its own Supabase client with `service_role`. There is no shared singleton.

### AI integration (`backend/routes/ai.js`)
Model: **Groq LLaMA 4 Scout** (id: `meta-llama/llama-4-scout-17b-16e-instruct`). Two endpoints:
- `POST /ai/insight` — type-based prompts (recovery, workout_ready, etc.), auto-retry on 429 with exponential backoff (2s → 5s)
- `POST /ai/generate-plan` — generates a 4-week plan as JSON; parses with regex (`text.match(/\{[\s\S]*\}/)`); archives previous active plan before creating new one. Session+exercise inserts run in parallel with `Promise.all`. Accepts `cardio_minutes` param (0 = no cardio block).

**Exercise structure generated:** 4 blocks per session — `warmup` (3 mobility exercises, `duration_seconds`, `sets:1`), `strength` (5-7 exercises, compound-first order), `cardio` (1 exercise, `duration_seconds`, skipped if `cardio_minutes=0`), `cooldown` (3 stretches, `duration_seconds`, `sets:1`). Rest times: heavy compounds (squat/deadlift/bench) → 180s, secondary compounds → 90-120s, isolations → 60s. Cardio intensity is periodized by goal (fat loss = moderate-intense, muscle gain = light).

Currently only generates week 1 — weeks 2–12 are a P1 pending feature. See `COMPONENTES-PENDIENTES.md` for the full roadmap.

After generating an insight, the DB insert happens **fire-and-forget** (async, after response is sent).

### Workout streak logic (`backend/routes/workouts.js`)
`updateStreak()` checks if the user completed a session **yesterday** (not today). Streak resets to 1 if no yesterday session. Level = `Math.floor(streak / 10) + 1`.

### Home dashboard (`backend/routes/home.js`)
Returns `today_session` (scheduled for today, not skipped) OR `next_session` (first pending session from active plan, if no today session). Uses `workout_plans!inner(status)` join to filter by active plans only. All queries run in a single `Promise.all`.

### Backend endpoint reference

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/health` | — | Status check |
| POST | `/auth/signup` | — | Email/password registration |
| POST | `/auth/signin` | — | Returns Supabase session |
| POST | `/auth/signout` | ✓ | Invalidates session |
| POST | `/auth/check-email` | — | Email existence check |
| POST | `/auth/reset-password` | — | Sends OTP via `resetPasswordForEmail()` |
| GET | `/home` | ✓ | Dashboard: today_session or next_session, activity rings, HRV, insights (single `Promise.all`) |
| GET | `/workouts/plan` | ✓ | Active plan with sessions + exercises |
| GET | `/workouts/upcoming` | ✓ | Next 5 pending sessions |
| POST | `/workouts/sessions/:id/start` | ✓ | Mark session `in_progress` |
| PATCH | `/workouts/sessions/:id/complete` | ✓ | Close session + update streak |
| PATCH | `/workouts/sessions/:sessionId/exercises/:exerciseId/toggle` | ✓ | Mark exercise done |
| POST | `/workouts/sessions/:sessionId/exercises/:exerciseId/sets` | ✓ | Upsert set (reps, weight) |
| GET | `/progress/stats` | ✓ | Monthly stats (sessions, volume kg, avg RPE, active days) |
| GET | `/progress/chart` | ✓ | Weekly volume for Recharts; `period` param: `4w`/`3m`/`1y` |
| POST | `/progress/metrics` | ✓ | Upsert daily body metrics (weight, HRV, sleep, body fat, etc.) |
| GET | `/progress/metrics` | ✓ | Metric history (default 30 days) |
| GET | `/profile` | ✓ | Full profile + wearable connections + session count |
| PATCH | `/profile` | ✓ | Update whitelisted fields only |
| POST | `/profile/wearables` | ✓ | Upsert wearable connection |
| DELETE | `/profile/wearables/:platform` | ✓ | Disconnect wearable |
| POST | `/ai/insight` | ✓ | Generate contextual insight; auto-retry on 429 (2s → 5s backoff) |
| POST | `/ai/generate-plan` | ✓ | Generate week-1 plan as JSON; archives previous active plan |

### Auth routes (`backend/routes/auth.js`)
Handles email/password sign-up, sign-in, sign-out, and password recovery (OTP flow). Delegates to Supabase Auth — no custom JWT minting. Password reset sends an OTP via `supabase.auth.resetPasswordForEmail()`.

### Progress (`backend/routes/progress.js`)
See endpoint table above. The `user_monthly_stats` DB view aggregates monthly workouts, calories, and volume.

### Rate limiting (`backend/server.js`)
`express-rate-limit`: 15-min window, max **100 req** in production / **1000 req** in development. Applied globally before all routes.

---

## Key patterns to follow

**Screen/modal patterns:**
- All screens use `.screen` CSS class; active screen controlled by `activeScreen` state in `App.jsx`
- Modals use `.modal-overlay` + `.modal-sheet` (bottom sheet pattern)
- Mobile-first: design for 390×844px (iPhone 14 Pro)
- WorkoutModal has two visibility states in `App.jsx`: `activeSession` (session object or null) + `modalVisible` (boolean). Minimizing sets `modalVisible=false` but keeps `activeSession` alive — the timer persists. A mini bar renders above the bottom nav when `activeSession && !modalVisible`; tapping it restores the modal.

**WorkoutModal exercise flow:**
- Exercises are grouped into 4 ordered blocks: `warmup → strength → cardio → cooldown`. Only the current block's exercises are shown; a "Siguiente fase" button advances to the next block when all exercises in the current block are done.
- Timer starts on first exercise interaction, not on modal open.
- Tapping an exercise row marks it as *active* (in-progress). A focus card appears showing: image placeholder (ready for `ex.image_url`), exercise name, weight, reps, set progress bars, and a CTA button.
- For strength exercises: each tap of "Serie lista" logs one set and starts the inter-set rest timer; the last set shows "Terminar ejercicio" and marks it complete.
- For timed exercises (warmup/cooldown/cardio): single "Terminar" tap — no set loop.
- `sets` fallback: `ex.sets ?? (exercise_type === 'strength' ? 3 : 1)` — never relies on a null sets field.
- Global metrics (FC/KCAL/TIME) collapse to a compact inline strip while an exercise is active; they expand back to full cards when no exercise is active.

**Style system (in `frontend/src/index.css`, Tailwind v4 `@theme` block):**
```css
--color-bg:        #0D0D0D   /* page background */
--color-surface:   #1A1A1A   /* card/panel background */
--color-surface2:  #222222   /* secondary surface */
--color-border:    #2A2A2A   /* subtle borders */
--color-accent:    #FF5733   /* orange — primary action color */
--color-accent-dim: rgba(255,87,51,0.12)
--color-green:     #4CAF50   /* success, streaks */
--color-green-dim: rgba(76,175,80,0.12)
--color-blue:      #60a5fa   /* info metrics */
--color-blue-dim:  rgba(96,165,250,0.12)
--color-txt:       #FFFFFF   /* primary text */
--color-txt2:      #888888   /* secondary text */
--color-txt3:      #555555   /* tertiary text */
--font-body:       'Inter'
--font-metric:     'Barlow Condensed'  /* large numbers, stats */
```
- Dark theme with `#1A1A1A` cards, `1px solid #2A2A2A` borders, no box-shadows
- Style reference: "Nike Training Club meets Strong app"
- Uses Tailwind CSS v4 via `@tailwindcss/vite` plugin + `@theme` block for custom tokens
- Framer-motion for page transitions (AnimatePresence), card entrances, ring fill, nav indicator
- Recharts for weekly volume chart (AreaChart with orange gradient)
- Lucide-react for all icons (no emoji icons in UI)

**Data patterns:**
- Use realistic Spanish-language data for any exercise/user content (not placeholder text)
- Supabase queries use nested selects for relationships: e.g., `trainer_profiles(full_name, rating)`
- Use upsert with `onConflict` for idempotent writes (see sets endpoint in `workouts.js`)

**WorkoutModal wearable detection:**
- If `hasWearable=true`: simulates HR with sine wave oscillation
- If false: HR displays as `—` (never simulate HR without wearable)
- Timer uses wall-clock (`Date.now() - startTimeRef.current`) to avoid drift when the tab is in background. Never use `setInterval` to increment a counter for elapsed time.

**Profile updates (`backend/routes/profile.js`):**
- Only a whitelisted set of fields is accepted in PATCH — do not bypass this

---

## Environment variables

**Backend (`backend/.env`):**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:3000/api
```

Note: `VITE_API_URL` is used in production; in dev, Vite's proxy handles `/api` routes so CORS is not needed.

---

## Database

Schema at `database/schema.sql`. 11 tables + 1 view, RLS enabled on all. Key notes:
- Trigger auto-creates a `profiles` row on signup
- 15 seed exercises in Spanish
- Backend enforces user scoping via `req.user.id` in queries (not via RLS on service_role calls)
