# FitnessAI Connect — Contexto del Proyecto

## ¿Qué es esto?
Una startup de fitness tech que conecta entrenadores personales con usuarios mediante:
- Entrenamientos 100% personalizados potenciados por IA
- Adquisición de usuarios a través de redes sociales de entrenadores e influencers
- Cobertura multideporte: gym, natación, ciclismo, running, yoga
- Integración con wearables: Apple Watch (HealthKit), Garmin, Google Fit

---

## Estado actual del proyecto (Marzo 2026)
MVP funcional con web app completa:

### Frontend (React + Vite)
- **Login/Registro** — Supabase Auth con email/password
- **Onboarding** — Wizard de 4 pasos: bienvenida → objetivos → disponibilidad → nivel/equipo
- **Home** — Saludo, workout del día, anillos de actividad, insight HRV, card del entrenador
- **Planes** — Plan activo, ejercicios marcables, próximas sesiones, generación con IA
- **Progreso** — Streak, stats grid, gráfico semanal (4s/3m/1a), análisis IA
- **Perfil** — Avatar, plan activo, wearables (toggle), configuración, logout
- **Chat** — Mensajería en tiempo real entrenador ↔ usuario (Supabase Realtime)
- **Dashboard Coach** — Vista de entrenador: stats, lista de clientes, streaks
- **WorkoutModal** — Sesión en vivo: FC (si wearable), calorías, cronómetro, progreso, insight IA

### Backend (Node.js + Express)
- `GET /api/home` — Datos de pantalla principal
- `GET/POST/PATCH /api/workouts/*` — Planes, sesiones, ejercicios, series
- `GET/POST /api/progress/*` — Stats, métricas, gráficos
- `GET/PATCH/POST/DELETE /api/profile/*` — Perfil, wearables
- `POST /api/ai/*` — Insights contextuales y generación de planes con IA
- Middleware auth con JWT de Supabase (service_role)

### Base de datos (Supabase / PostgreSQL)
- 11 tablas + 1 vista con RLS habilitado en todas
- Trigger auto-create profile al signup
- 15 ejercicios de seed en español
- Schema completo en `database/schema.sql`

### Archivo legacy
- `fitness-ai-mockup.html` — Mockup original HTML vanilla (ya no se usa)

---

## Stack tecnológico (implementado)
- **Frontend:** React 18 + Vite 5
- **Backend:** Node.js + Express 4
- **Base de datos:** Supabase (PostgreSQL + Auth + Realtime)
- **IA:** Groq SDK (LLaMA 4 Scout 17B) — free tier
- **Estilos:** CSS vanilla con design tokens
- **Dev tools:** nodemon, `--env-file` para variables de entorno

---

## Modelo de negocio
### Usuarios finales
| Plan | Precio | Features clave |
|------|--------|----------------|
| Free | $0 | 3 planes básicos, 1 sesión/mes con entrenador |
| Pro | $14.99/mes | IA ilimitada, wearables completos, chat con entrenador |
| Elite | $34.99/mes | Todo Pro + 4 sesiones 1:1/mes, nutrición |

### Entrenadores
| Plan | Precio | Features clave |
|------|--------|----------------|
| Starter | Gratis (6 meses) | Hasta 5 clientes |
| Pro | $49/mes | Clientes ilimitados, IA tools, 15% comisión |
| Elite | $99/mes | Sin comisiones, branded app, API access |

---

## Mercado objetivo inicial
- **Geografía:** México, Argentina, Colombia (LATAM hispanohablante)
- **Entrenadores:** digitales con 1K-50K seguidores en Instagram/TikTok
- **Usuarios:** 25-40 años, fitness intermedio, smartphone + wearable

---

## Métricas clave a lograr (Año 1)
- 15,000 usuarios registrados
- 500 entrenadores activos
- $110,000 MRR
- NPS > 55
- Churn mensual < 4%
- CAC blended < $10

---

## Diseño y estilos
```css
/* Paleta de colores */
--bg: #0a0a0f
--surface: #13131a
--primary: #6ee7b7      /* verde menta */
--accent: #f472b6       /* rosa/coral */
--blue: #60a5fa
--orange: #fb923c
--text: #f1f5f9
--text-2: #94a3b8

/* Tipografía */
--font-display: 'Syne'      /* títulos, números grandes */
--font-body: 'DM Sans'      /* texto general */
```

---

## Competidores a superar
- **Trainerize** — sin IA real, UX antigua
- **TrueCoach** — sin wearables ni comunidad
- **Future** — muy caro ($149-199/mes), no escala
- **Caliber** — solo gym/fuerza, solo USA

## Ventaja competitiva (moat)
1. Datos propietarios de entrenamiento en LATAM
2. Efecto red de dos lados (entrenadores + usuarios)
3. Comunidad local hispanohablante
4. Integración profunda con todos los wearables

---

## Comandos para desarrollo
```bash
# Backend (terminal 1) — desde /backend
npm install
npm run dev
# → http://localhost:3000

# Frontend (terminal 2) — desde /frontend
npm install
npm run dev
# → http://localhost:5173

# Usar cmd (no PowerShell) si npm falla por ExecutionPolicy
```

---

## Estructura del proyecto
```
dorcher/
├── CLAUDE.md
├── COMPONENTES-PENDIENTES.md
├── fitness-ai-mockup.html          (legacy, no se usa)
├── database/
│   └── schema.sql                  (PostgreSQL + RLS + seeds)
├── backend/
│   ├── server.js                   (Express entry point)
│   ├── package.json
│   ├── .env / .env.example
│   ├── middleware/auth.js          (JWT Supabase)
│   └── routes/
│       ├── home.js
│       ├── workouts.js
│       ├── progress.js
│       ├── profile.js
│       └── ai.js                   (Groq / LLaMA)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env / .env.example
│   └── src/
│       ├── App.jsx                 (Router + estado global)
│       ├── index.css               (Design system completo)
│       ├── main.jsx
│       ├── api/client.js           (Supabase + HTTP client)
│       ├── screens/
│       │   ├── Login.jsx
│       │   ├── Onboarding.jsx
│       │   ├── Home.jsx
│       │   ├── Plans.jsx
│       │   ├── Progress.jsx
│       │   ├── Profile.jsx
│       │   ├── Chat.jsx
│       │   └── DashboardCoach.jsx
│       └── components/
│           └── WorkoutModal.jsx
```

---

## Notas para Claude Code
- Mantener el estilo oscuro y la paleta de colores definida arriba
- Las pantallas usan el patrón `.screen` con estado `activeScreen` en App.jsx
- Priorizar mobile-first: todo debe verse bien en 390x844px (iPhone 14 Pro)
- Los modales usan la clase `.modal-overlay` + `.modal-sheet` (bottom sheet style)
- Cuando agregues ejercicios o datos, simularlos de forma realista (no "Lorem ipsum")
- El backend usa `--env-file=.env` en los scripts de package.json (ES modules)
- La IA usa Groq (LLaMA 4 Scout) — modelo: `meta-llama/llama-4-scout-17b-16e-instruct`
- Al generar un nuevo plan, el backend archiva el plan anterior automáticamente
- El WorkoutModal detecta si hay wearable conectado; sin wearable no simula FC
