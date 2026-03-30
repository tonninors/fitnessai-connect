# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FitnessAI Connect: a LATAM fitness-tech platform connecting personal trainers with users. Features AI-generated workout plans (Groq/LLaMA), real-time coach↔user chat (Supabase Realtime), wearable integration, and a live workout session modal. Target market: Spanish-speaking users in Mexico, Argentina, Colombia.

---

## Development commands

```bash
# Backend — from /backend
npm run dev        # nodemon + --env-file=.env on http://localhost:3000 (also loads via dotenv in server.js)

# Frontend — from /frontend
npm run dev        # Vite on http://localhost:5173
# Vite proxies /api/* → localhost:3000 (see vite.config.js)

# On Windows: use cmd, not PowerShell (ExecutionPolicy may block npm)
```

No test runner or linter is configured in this project.

---

## Architecture

### Frontend routing (no React Router)
`App.jsx` manages all screen navigation via a single `activeScreen` state string. There is no URL-based routing — screens are conditionally rendered with a switch. The onboarding gate checks `profile?.onboarding_completed` and redirects before any screen renders.

Auth flow: `supabase.auth.onAuthStateChange()` → fetch profile → detect trainer role (`isTrainer`) → gate app render until profile loads.

### API layer (`frontend/src/api/client.js`)
Every HTTP call goes through this wrapper. It fetches a fresh Supabase session token on **each request** (not cached) and injects it as `Authorization: Bearer <token>`. No request-level caching.

### Backend auth (`backend/middleware/auth.js`)
Uses `service_role` key to call `supabase.auth.getUser(token)`. Attaches `req.user` (Supabase user object) and `req.supabase` (client instance) to every request. No separate DB lookup for user identity — trusts the JWT.

### Supabase client instantiation
Each route file (`home.js`, `workouts.js`, etc.) creates its own Supabase client with `service_role`. There is no shared singleton.

### AI integration (`backend/routes/ai.js`)
Two endpoints:
- `POST /ai/insight` — type-based prompts (recovery, workout_ready, etc.), auto-retry on 429 with exponential backoff (2s → 5s)
- `POST /ai/generate-plan` — generates a 4-week plan as JSON; parses with regex (`text.match(/\{[\s\S]*\}/)`); archives previous active plan before creating new one. Session+exercise inserts run in parallel with `Promise.all`.

After generating an insight, the DB insert happens **fire-and-forget** (async, after response is sent).

### Workout streak logic (`backend/routes/workouts.js`)
`updateStreak()` checks if the user completed a session **yesterday** (not today). Streak resets to 1 if no yesterday session. Level = `Math.floor(streak / 10) + 1`.

### Home dashboard (`backend/routes/home.js`)
Returns `today_session` (scheduled for today, not skipped) OR `next_session` (first pending session from active plan, if no today session). Uses `workout_plans!inner(status)` join to filter by active plans only. All queries run in a single `Promise.all`.

---

## Key patterns to follow

**Screen/modal patterns:**
- All screens use `.screen` CSS class; active screen controlled by `activeScreen` state in `App.jsx`
- Modals use `.modal-overlay` + `.modal-sheet` (bottom sheet pattern)
- Mobile-first: design for 390×844px (iPhone 14 Pro)
- WorkoutModal has two visibility states in `App.jsx`: `activeSession` (session object or null) + `modalVisible` (boolean). Minimizing sets `modalVisible=false` but keeps `activeSession` alive — the timer persists. A mini bar renders above the bottom nav when `activeSession && !modalVisible`; tapping it restores the modal.

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
