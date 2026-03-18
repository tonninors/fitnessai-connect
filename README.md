# FitnessAI Connect

Plataforma de fitness que conecta entrenadores personales con usuarios mediante entrenamientos personalizados potenciados por IA.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 |
| Backend | Node.js 18+ + Express 4 |
| Base de datos | Supabase (PostgreSQL + Auth + Realtime) |
| IA | Groq SDK — LLaMA 4 Scout 17B |
| Estilos | CSS vanilla con design tokens |

---

## Estructura del proyecto

```
dorcher/
├── database/
│   └── schema.sql          # PostgreSQL + RLS + seeds (11 tablas, 1 vista)
├── backend/
│   ├── server.js            # Entry point Express
│   ├── middleware/auth.js   # JWT Supabase (service_role)
│   └── routes/
│       ├── home.js
│       ├── workouts.js
│       ├── progress.js
│       ├── profile.js
│       └── ai.js            # Endpoints Groq / LLaMA
└── frontend/
    └── src/
        ├── App.jsx           # Router + estado global
        ├── index.css         # Design system
        ├── api/client.js     # Supabase + HTTP client
        ├── screens/          # Login, Onboarding, Home, Plans, Progress, Profile, Chat, DashboardCoach
        └── components/
            └── WorkoutModal.jsx
```

---

## Instalación y desarrollo

### Requisitos
- Node.js >= 18
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Groq](https://console.groq.com) (free tier)

### Variables de entorno

**`backend/.env`**
```env
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
GROQ_API_KEY=<groq_api_key>
PORT=3000
```

**`frontend/.env`**
```env
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_API_URL=http://localhost:3000
```

### Correr en desarrollo

```bash
# Backend — terminal 1
cd backend
npm install
npm run dev
# → http://localhost:3000

# Frontend — terminal 2
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> En Windows, usar `cmd` en lugar de PowerShell si `npm` falla por ExecutionPolicy.

### Base de datos

Ejecutar `database/schema.sql` en el SQL Editor de Supabase. Incluye tablas, RLS, trigger de auto-creación de perfil y 15 ejercicios de seed en español.

---

## Pantallas implementadas

| Pantalla | Descripción |
|----------|-------------|
| Login / Registro | Supabase Auth con email + password |
| Onboarding | Wizard de 4 pasos: bienvenida → objetivos → disponibilidad → nivel/equipo |
| Home | Workout del día, anillos de actividad, insight HRV, card del entrenador |
| Planes | Plan activo, ejercicios marcables, próximas sesiones, generación con IA |
| Progreso | Streak, stats grid, gráfico semanal (4s / 3m / 1a), análisis IA |
| Perfil | Avatar, wearables (toggle), configuración, logout |
| Chat | Mensajería en tiempo real entrenador ↔ usuario (Supabase Realtime) |
| Dashboard Coach | Stats, lista de clientes, streaks |
| WorkoutModal | Sesión en vivo: FC (si wearable), calorías, cronómetro, progreso, insight IA |

---

## API endpoints

```
GET  /api/home

GET    /api/workouts/plans
POST   /api/workouts/plans
GET    /api/workouts/plans/:id
PATCH  /api/workouts/sessions/:id
POST   /api/workouts/sessions/:id/exercises/:eid/sets

GET  /api/progress/stats
GET  /api/progress/chart

GET    /api/profile
PATCH  /api/profile
POST   /api/profile/wearables
DELETE /api/profile/wearables/:id

POST /api/ai/insight
POST /api/ai/generate-plan
```

---

## Pendientes P1 (bloqueantes para lanzar)

- [ ] OAuth con Google / Apple
- [ ] Generación de semanas 2-12 del plan
- [ ] Logger de series en vivo (SetLogger en WorkoutModal)
- [ ] Notificaciones push (OneSignal)

Ver [`COMPONENTES-PENDIENTES.md`](./COMPONENTES-PENDIENTES.md) para el roadmap completo.

---

## Diseño

```css
--bg: #0a0a0f
--surface: #13131a
--primary: #6ee7b7   /* verde menta */
--accent: #f472b6    /* rosa/coral */
--text: #f1f5f9
--font-display: 'Syne'
--font-body: 'DM Sans'
```

Mobile-first — optimizado para 390×844px (iPhone 14 Pro).

---

## Deploy (producción)

| Servicio | Uso | Free tier |
|----------|-----|-----------|
| Vercel | Frontend | Ilimitado (hobby) |
| Railway | Backend Node.js | $5 crédito/mes |
| Supabase | DB + Auth + Realtime | 500MB DB, 50K MAU |
| Groq | IA LLaMA 4 Scout | 500K tokens/día |
