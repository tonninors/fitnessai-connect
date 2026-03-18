# Componentes pendientes para llevar FitnessAI Connect a producción

> Ordenado por prioridad (P1 = bloqueante para lanzar, P2 = importante, P3 = nice-to-have).
> Actualizado: Marzo 2026

---

## Completado
- [x] Login / Registro (email + password)
- [x] Onboarding (4 pasos: bienvenida → goals → disponibilidad → nivel/equipo)
- [x] Generador de plan IA en cliente (Groq / LLaMA 4 Scout)
- [x] Home con workout del día, anillos de actividad, HRV, insight IA
- [x] Planes con ejercicios marcables y próximas sesiones
- [x] Progreso con streak, stats grid, gráfico semanal, análisis IA
- [x] Perfil con wearables (toggle), configuración, logout
- [x] Chat entrenador ↔ usuario (Supabase Realtime)
- [x] Dashboard Coach (stats, clientes, streaks)
- [x] WorkoutModal (FC condicional a wearable, calorías, timer, insight IA)
- [x] Base de datos completa en Supabase (11 tablas + 1 vista + RLS)
- [x] Backend con 20+ endpoints (Express + Supabase + Groq)
- [x] Auto-archive de planes anteriores al generar nuevo

---

## P1 — Bloqueantes para el primer lanzamiento

### Autenticación con Google / Apple (OAuth)
- Supabase ya soporta OAuth providers, solo configurar en dashboard
- Código: `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Necesario para reducir fricción en el signup (CAC más bajo)

### Semanas 2-12 del plan
- El backend actualmente solo crea la semana 1
- Agregar endpoint `POST /api/workouts/plans/:id/generate-weeks`
- Usar Groq para generar progresión de carga semana a semana

### Logger de series en vivo (SetLogger)
- WorkoutModal muestra el ejercicio actual pero no registra series
- Agregar UI para "Serie completada" que llama a `POST /api/workouts/sessions/:s/exercises/:e/sets`
- Mostrar historial de las últimas series del mismo ejercicio para referencia
- El endpoint backend ya existe

### Notificaciones push
- Servicio: **OneSignal** (free tier: 10K suscriptores)
- Triggers: recordatorio 1h antes del entrenamiento, logros, insights IA matutinos
- En React Native: `expo-notifications`

---

## P2 — Importantes para retención

### Wearables — OAuth real
- **Apple HealthKit**: solo disponible en React Native con `react-native-health`
- **Garmin Health API**: OAuth 2.0, webhook para sync automático
- **Google Fit API**: OAuth 2.0 con Google Cloud Console
- El endpoint backend ya existe (`POST /profile/wearables`), falta el flujo OAuth

### Marketplace de planes
- Tabla: `marketplace_plans(id, plan_id, price_usd, trainer_id, rating, purchases_count)`
- Entrenadores pueden publicar sus planes con precio
- Pago: **Stripe Checkout** para planes de pago

### Progreso de fuerza por ejercicio
- Agregar gráfica de `session_sets.weight_actual_kg` por ejercicio
- Cálculo automático de 1RM estimado (fórmula de Epley)
- Requiere completar el logger de series primero

### Edición de planes por entrenador
- Dashboard Coach puede ver clientes pero no editar sus planes
- Agregar UI para modificar ejercicios, sets, reps de un cliente

---

## P3 — Nice-to-have / post-lanzamiento

### Comunidad / Feed social
- Posts de logros, PRs, fotos de progreso
- Tabla: `posts(id, user_id, content, media_url, likes_count, created_at)`
- Servicio de imágenes: Supabase Storage o Cloudinary

### Videos de ejercicios
- Tabla `exercises.video_url` ya existe en el schema
- Reproductor en modal con instrucciones paso a paso

### Nutrición y macros
- Tablas nuevas: `meals`, `food_items`, `daily_nutrition`
- Integración: **Nutritionix API** (free: 500 req/día)
- IA: generación de plan nutricional con Groq

### Gamificación completa
- Sistema de badges/logros (tabla `achievements`)
- Triggers: primer workout, 7-day streak, PR en benchpress, etc.
- Animación confetti al desbloquear

### Rate limiting por usuario (Redis)
- Servicio: **Upstash Redis** (free: 10K cmds/día)
- Limitar llamadas IA a 10/día en plan free

### Analytics
- Servicio: **PostHog** (free: 1M eventos/mes)
- Eventos: `workout_started`, `workout_completed`, `plan_generated`

### App móvil (React Native + Expo)
- Reutilizar lógica de `frontend/src/api/client.js`
- Push notifications nativas con `expo-notifications`
- HealthKit/Google Fit con `react-native-health`
- Deploy: **Expo EAS Build** (free tier: 30 builds/mes)

---

## Servicios gratuitos — resumen

| Servicio      | Uso                          | Límite free                      |
|---------------|------------------------------|-----------------------------------|
| Supabase      | DB + Auth + Storage + RT     | 500MB DB, 50K MAU, 1GB storage   |
| Railway       | Backend Node.js              | $5 crédito/mes (~500h)           |
| Vercel        | Frontend React               | Ilimitado (proyectos hobby)      |
| Groq          | IA LLaMA 4 Scout             | 30K tokens/min, 500K tokens/día  |
| Upstash       | Redis cache                  | 10K cmds/día, 256MB              |
| Cloudinary    | Imágenes / videos            | 25 créditos/mes, 25GB storage    |
| OneSignal     | Push notifications           | 10,000 suscriptores              |
| PostHog       | Analytics                    | 1M eventos/mes                   |
| Expo EAS      | Mobile builds                | 30 builds/mes                    |
