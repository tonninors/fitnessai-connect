# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Web app mobile-first (diseñada a 390×844; bajo 460 px el marco de teléfono pasa a pantalla completa). No hay app nativa; las menciones a React Native/Expo en `COMPONENTES-PENDIENTES.md` son planes, no producto.

## Users

Dos audiencias, ambas primarias:

- **Quien entrena.** Persona hispanohablante en México, Argentina o Colombia que sigue un plan de entrenamiento. Puede ser principiante o avanzado. Su trabajo: abrir la app, saber qué toca hoy y hacerlo sin pensar en la programación. Entrena con el teléfono en la mano, en el gimnasio o en casa, entre series.
- **El entrenador personal (coach).** Supervisa a sus clientes, ve rachas y progreso, y les escribe por chat. Hoy existe `DashboardCoach` y el rol `trainer_profiles`, pero el flujo coach es mayormente futuro: el diseño debe dejarle sitio sin que la experiencia de quien entrena dependa de tener coach.

## Product Purpose

FitnessAI Connect genera un plan de entrenamiento personalizado y guía cada sesión en vivo, ejercicio por ejercicio. El plan lo arma la IA (Groq, LLaMA 4 Scout), pero se apoya en valores deterministas de la base de datos: catálogo de ejercicios con tipo, duración, orden y bloque (`warmup → strength → cardio → cooldown`), reglas de descanso y series. La IA propone; la base de datos acota.

Éxito: la persona completa sus sesiones, mantiene la racha y ve progreso real a lo largo de las 12 semanas del plan.

## Positioning

**Hecha para LATAM.** Español nativo de punta a punta (copy, contenido de ejercicios, mensajes de error), pensada para el contexto de México, Argentina y Colombia, frente a apps estadounidenses traducidas como Nike Training Club, Strong o Fitbod.

## Operating Context

- Flujo principal: onboarding (objetivos → disponibilidad → nivel/equipo) → plan de la semana generado por IA → Home con la sesión de hoy → modal de entrenamiento en vivo (bloques, serie a serie, descansos, cronómetro persistente) → progreso y racha.
- La sesión en vivo se usa con una mano, de pie, entre esfuerzos: el tiempo entrenado sobrevive recargas y cambios de dispositivo; el modal se puede minimizar a una barra "En vivo".
- Wearables opcionales; sin wearable la frecuencia cardiaca se muestra como `—`, nunca simulada.
- Chat coach↔usuario en tiempo real (Supabase Realtime).
- "Hoy" depende de la zona horaria configurada en el servidor (`APP_TIMEZONE`).

## Capabilities and Constraints

- Stack existente: React 18 + Vite 5 + Tailwind v4, Express, Supabase, Groq. Sin React Router; navegación por estado en `App.jsx`.
- Solo se genera la semana 1 del plan; semanas 2–12 pendientes.
- Pendientes P1: OAuth Google/Apple, notificaciones push, inputs de reps/peso por serie, fuente de media para ejercicios (`image_url`/`video_url` quedan NULL a propósito hasta decidir la fuente).
- Terminología fija: "sesión", "bloque", "serie", "racha", "Siguiente fase", "Serie N lista", "Finalizar sesión", "Continuar entrenamiento", "En vivo".

## Brand Commitments

- Nombre: **FitnessAI Connect**.
- Todo el copy visible en español; contenido de ejercicios y usuarios realista, nunca texto de relleno.
- Iconos de lucide-react; sin emoji en la UI.
- Referencia existente declarada en CLAUDE.md: "Nike Training Club meets Strong app".

## Evidence on Hand

Ninguna evidencia pública. El producto es un MVP en pruebas: no hay usuarios reales, coaches reales, testimonios, métricas ni prensa. No inventar ninguno. El catálogo de ejercicios (56 en español) es dato real del producto; sus imágenes/videos aún no existen.

## Product Principles

1. **La app decide, no ofrece menús.** Un paso visible a la vez; el ejercicio que toca, no una lista para elegir. La flexibilidad llega como escape ("no puedo hacer esto" → sustituto equivalente), no como catálogo.
2. **IA solo donde resuelve algo.** Generar el plan, proponer un sustituto real. Nada de texto de IA decorativo que no cambie una decisión.
3. **Determinismo bajo la IA.** Lo que puede venir de datos (tipo, orden, descansos, calorías estimadas) viene de datos; la IA no inventa estructura.
4. **Nunca fingir datos.** Sin wearable no hay FC; sin media no hay imagen inventada; sin usuarios no hay prueba social.
5. **El coach suma, no condiciona.** Quien entrena solo tiene una experiencia completa; el coach es una capa adicional.

## Accessibility & Inclusion

Requisitos ya vinculantes en el código: todo lo clicable es `<button type="button">`; toggles con `role="switch"`, chips con `aria-pressed`, radios con `role="radiogroup"`; cada input con `<label htmlFor>`; modales con `role="dialog"` + `aria-modal` y cierre con Escape; iconos decorativos `aria-hidden`, botones de solo icono con `aria-label`.
