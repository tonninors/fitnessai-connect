---
name: FitnessAI Connect
description: Entrenamiento guiado por IA para LATAM, oscuro, directo y de una sola instrucción a la vez.
colors:
  accent: "#FF5733"
  accent-dim: "rgba(255,87,51,0.12)"
  green: "#4CAF50"
  green-dim: "rgba(76,175,80,0.12)"
  blue: "#60a5fa"
  blue-dim: "rgba(96,165,250,0.12)"
  live-red: "#ef4444"
  bg: "#0D0D0D"
  backdrop: "#080808"
  surface: "#1A1A1A"
  surface2: "#222222"
  border: "#2A2A2A"
  border-hover: "#3a3a3a"
  txt: "#FFFFFF"
  txt2: "#888888"
  txt3: "#555555"
typography:
  display:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "'Inter', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  pill: "6px"
  sm: "10px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  sheet: "20px"
  card-hero: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  gutter-tight: "10px"
  md: "12px"
  lg: "16px"
  gutter: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.txt}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "14px"
    width: "100%"
  button-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.txt2}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "14px"
  button-surface-hover:
    backgroundColor: "{colors.surface2}"
  button-sm:
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.surface2}"
    textColor: "{colors.txt}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  chip-selected:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.txt}"
  metric-card:
    backgroundColor: "{colors.surface2}"
    rounded: "{rounded.lg}"
    padding: "12px 6px"
  pill:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  live-badge:
    backgroundColor: "rgba(239,68,68,0.12)"
    textColor: "{colors.live-red}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  bottom-nav:
    backgroundColor: "rgba(13,13,13,0.95)"
    height: "80px"
  modal-sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sheet}"
    padding: "20px 24px"
  toggle:
    backgroundColor: "#333333"
    rounded: "13px"
    width: "44px"
    height: "26px"
  toggle-on:
    backgroundColor: "{colors.green}"
---

# Design System: FitnessAI Connect

## Overview

**Creative North Star: "El Gimnasio de Noche"**

Un gimnasio vacío a las once de la noche: piso negro mate, paredes que apenas se distinguen del piso y una sola luz encendida sobre la estación donde toca trabajar. La interfaz es esa sala. Las superficies son casi negras y se separan entre sí por un borde de 1px, no por luz ni sombra. El naranja (#FF5733) es la lámpara: aparece donde está la siguiente acción y en ningún otro sitio que compita con ella. Las cifras (tiempo, series, racha, kcal) se leen como el marcador de pared del gimnasio: Barlow Condensed, enormes, en negrita, legibles a un brazo de distancia.

La densidad es de app de entrenamiento, no de panel de control: una columna, márgenes de 20px, tarjetas apiladas, una instrucción dominante por pantalla. Los controles son firmes y táctiles: objetivos anchos para usarse con una mano, sudado y entre series; cada toque responde con una compresión física (escala 0.98). El movimiento es de hoja que sube y de indicador que se desliza con resorte, nunca decorativo.

El sistema es oscuro por diseño, sin tema claro. La referencia declarada es "Nike Training Club meets Strong app": la presencia de la primera, la precisión de registro de la segunda.

**Key Characteristics:**
- Fondo casi negro (#0D0D0D) con superficies en dos escalones y bordes de 1px.
- Un único acento cálido, reservado para la acción actual y el estado activo.
- Cifras en Barlow Condensed condensada y negrita; todo lo demás en Inter.
- Plano en reposo; el único brillo del sistema pertenece al botón principal.
- Etiquetas de sección diminutas en mayúsculas y gris, para que la cifra mande.

## Colors

Una sala oscura neutra con una sola luz cálida y dos señales funcionales (verde, azul) que nunca compiten con ella.

### Primary
- **Naranja Lámpara** (accent): la acción actual. Botón principal, ítem activo de la navegación, chip seleccionado, barra de progreso, foco de teclado, enlaces de texto. Su versión tenue **Halo Naranja** (accent-dim) rellena el fondo de lo seleccionado.

### Secondary
- **Verde Serie Lista** (green, con green-dim): estado completado y encendido. Ejercicio terminado, interruptor activo, confirmaciones.
- **Azul Descanso** (blue, con blue-dim): el tiempo de descanso entre series y sus cifras. Es el único momento en que el acento cede la pantalla.

### Tertiary
- **Rojo En Vivo** (live-red): exclusivo de la insignia "En vivo" con su punto que pulsa. No se usa para errores decorativos ni para destacar.

### Neutral
- **Piso Mate** (bg): fondo de toda pantalla y de la barra de estado.
- **Fuera de Sala** (backdrop): el lienzo de escritorio alrededor del marco de teléfono; nunca dentro de la app.
- **Banco** (surface): tarjetas, hojas modales, tarjeta de login, botón secundario.
- **Banco Alto** (surface2): elementos dentro de una tarjeta o una hoja: chips, tarjetas de métrica, fondo de barra de progreso, esqueletos.
- **Junta** (border): el borde de 1px que separa todo. **Junta Iluminada** (border-hover) al pasar el cursor.
- **Tiza** (txt): texto principal y cifras.
- **Gris Pizarra** (txt2): texto secundario, texto del botón secundario.
- **Gris Sombra** (txt3): etiquetas en mayúsculas, iconos inactivos de la navegación, texto de ayuda.

### Named Rules
**La Regla de la Única Lámpara.** En cada pantalla el naranja marca una sola cosa por hacer. Si dos elementos compiten en naranja, uno de ellos pasa a superficie.

**La Regla del Color con Oficio.** El verde significa "hecho", el azul "descansa", el rojo "en vivo". Ninguno se usa como adorno ni intercambia su significado.

## Typography

**Display Font:** Barlow Condensed (con sans-serif)
**Body Font:** Inter (con sans-serif)

**Character:** Barlow Condensed es el marcador de pared: estrecha, alta y en negrita, hace que un "12:47" o un "8" llene la tarjeta sin ocupar el ancho. Inter es la voz del entrenador: neutra, clara, y en segundo plano frente a las cifras.

### Hierarchy
- **Display** (Barlow Condensed 700, 48px como base, de 30px a 72px según el peso de la cifra, interlineado 1, cifras tabulares): solo números. Cronómetro de sesión (72px), contador de descanso, racha, kcal y métricas de tarjeta (30–40px).
- **Headline** (Inter 700, 20px, 1.3): título de paso en onboarding y encabezados de pantalla.
- **Title** (Inter 600, 14px, 1.4): nombre del ejercicio, texto de botón (con 0.02em de tracking), títulos de tarjeta.
- **Body** (Inter 400, 14px, 1.5): descripciones, mensajes de chat, texto de formulario. En móvil los campos suben a 16px para evitar el zoom de iOS.
- **Caption** (Inter 400, 12px, 1.4): datos secundarios, subtítulos, cambio de login/registro.
- **Label** (Inter 600, 10–11px, 0.05em, MAYÚSCULAS, Gris Sombra): rótulos de sección ("ACTIVIDAD DE HOY"), píldoras y etiquetas de la navegación inferior (estas sin mayúsculas).

### Named Rules
**La Regla del Marcador.** Toda cifra que la persona consulta durante el entrenamiento va en Barlow Condensed negrita con cifras tabulares. Inter nunca muestra un tiempo, una serie o una racha protagonista.

**La Regla del Rótulo Callado.** Los rótulos de sección son pequeños, grises y en mayúsculas para que la cifra o la acción debajo de ellos domine. Un rótulo nunca es más brillante que su contenido.

## Layout

Columna única pensada para 390×844. En escritorio la app vive dentro de un marco de teléfono de 390×844 centrado sobre el lienzo Fuera de Sala; con menos de 460px de ancho o 900px de alto el marco desaparece y la app ocupa el viewport completo (`100dvh`), y bajo 460px también se ocultan el notch y la barra de estado simulados.

Cada pantalla se desplaza dentro de sí misma, sin barra de scroll visible, con espacio arriba para la barra de estado (56px en el marco, 16px en móvil real) y 92px abajo para la navegación. Las secciones llevan un margen horizontal de 20px; las tarjetas se apilan con 10px entre sí y 20px de relleno interior. Las rejillas internas son pequeñas y fijas: tres columnas para métricas con 8px de separación, fila de chips numéricos de ancho igual.

La navegación inferior es fija (80px), siempre visible salvo en el panel del coach. Cuando hay un entrenamiento minimizado, una barra "En vivo" aparece justo encima de ella.

## Elevation & Depth

El sistema es plano. La profundidad se construye con escalones de superficie (Piso Mate → Banco → Banco Alto) y bordes de 1px en Junta, no con sombras. Las capas superiores (hojas modales) se separan por un velo negro al 70% y por su posición, no por sombra propia. La navegación inferior usa un fondo casi opaco con desenfoque de 20px para que el contenido pase por debajo sin perder legibilidad.

### Shadow Vocabulary
- **Brillo de Lámpara** (`box-shadow: 0 4px 20px rgba(255,87,51,0.3)`, en hover `0 4px 28px rgba(255,87,51,0.45)`): exclusivo del botón principal. Se apaga cuando el botón está deshabilitado.
- **Pomo del interruptor** (`box-shadow: 0 1px 4px rgba(0,0,0,0.3)`): el círculo blanco del toggle, para que se lea como pieza física.
- **Marco de escritorio** (`0 0 0 8px #111, 0 0 0 9px #2A2A2A, 0 40px 80px rgba(0,0,0,0.6)`): pertenece al decorado del teléfono, no a la UI. Desaparece en móvil.

### Named Rules
**La Regla del Piso Plano.** Ninguna tarjeta, chip, hoja ni panel lleva sombra. Si algo necesita destacarse, sube un escalón de superficie o toma el borde naranja. El único brillo de la sala es el del botón principal.

## Shapes

Formas redondeadas pero firmes, con el radio creciendo con el tamaño del objeto: píldoras de estado a 6px, botones pequeños a 10px, botones a 12px, chips y tarjetas de métrica a 14px, tarjetas a 16px, hojas modales a 20px solo arriba, tarjeta de login a 24px. Lo circular (avatares, puntos, insignia "En vivo", indicador de navegación) usa radio completo. Todo contenedor lleva borde de 1px en Junta; el borde es la forma, no un adorno.

El indicador de progreso del onboarding cambia de forma con el estado: un punto de 6px que se estira a una barra de 20px cuando es el paso actual.

## Components

### Buttons
Firmes y táctiles: ocupan todo el ancho y responden al toque comprimiéndose.
- **Shape:** esquinas suavemente curvas (12px); la variante pequeña baja a 10px y ancho automático.
- **Primary:** Naranja Lámpara con texto blanco, Inter 600 14px con 0.02em de tracking, 14px de relleno, ancho completo, con el Brillo de Lámpara. Uno por pantalla.
- **Hover / Active:** el brillo se amplía en hover; al pulsar, escala a 0.98. Deshabilitado: 40% de opacidad y sin brillo.
- **Surface (secundario):** Banco con borde Junta y texto Gris Pizarra; en hover sube a Banco Alto con Junta Iluminada.
- **Focus:** contorno naranja de 2px separado 2px del control, en todos los elementos interactivos.

### Chips
- **Style:** filas de selección grandes (Banco Alto, borde Junta, 14px de radio, 14×16px de relleno) con icono a la izquierda; o chips numéricos compactos de ancho igual en fila.
- **State:** seleccionado = fondo Halo Naranja + borde naranja (y texto naranja en los numéricos); hover = borde Gris Sombra. Usan `aria-pressed` o `role="radio"` según el caso.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Banco; los elementos interiores en Banco Alto.
- **Shadow Strategy:** ninguna (ver La Regla del Piso Plano).
- **Border:** 1px Junta, que pasa a Junta Iluminada en hover.
- **Internal Padding:** 20px, con 10px entre tarjetas.

### Inputs / Fields
- **Style:** dentro de grupos con 14px de separación, cada uno con su `<label>` visible. Sin iconos nativos del navegador (revelar contraseña, autocompletar).
- **Focus:** el contorno naranja global de 2px.
- **Mobile:** 16px de texto bajo 460px de ancho.

### Navigation
- **Style:** barra inferior de 80px, fondo Piso Mate al 95% con desenfoque, borde superior Junta. Cuatro destinos con icono de 20px sobre etiqueta Inter 10px.
- **States:** inactivo en Gris Sombra con trazo de 1.5; activo en Naranja Lámpara con trazo de 2.2 y una barra de 32×3px encima que se desliza entre destinos con resorte (rigidez 400, amortiguación 30).

### Modal Sheet
- Hoja inferior en Banco con borde Junta, 20px de radio arriba, asa de 36×4px, hasta 90% de alto. Sube con `cubic-bezier(.32,.72,0,1)` en 0.35s sobre un velo negro al 70%. La hoja es fija y el desplazamiento vive dentro de su cuerpo.

### Live Metrics (componente característico)
El tablero del modal de entrenamiento: tres tarjetas de métrica en Banco Alto (14px de radio) con cifras en Barlow Condensed, sobre una insignia roja "En vivo" con punto que pulsa. Sin wearable, la frecuencia cardiaca se muestra como "—".

### Toggle
Interruptor de 44×26px: carril gris (#333) que pasa a Verde Serie Lista al encenderse, con pomo blanco de 20px que se desliza 18px.

### Skeleton
Bloques en Banco Alto con un barrido de luz de 1.8s mientras carga una pantalla; con movimiento reducido quedan estáticos.

## Do's and Don'ts

### Do:
- **Do** reservar el Naranja Lámpara (#FF5733) para la siguiente acción, el estado activo y el foco; una sola lámpara por pantalla.
- **Do** separar superficies con borde de 1px #2A2A2A y escalones de superficie (#0D0D0D → #1A1A1A → #222222).
- **Do** poner toda cifra protagonista en Barlow Condensed 700 con cifras tabulares e interlineado 1.
- **Do** rotular secciones con Inter 600 de 10–11px en mayúsculas, tracking 0.05em, color #555555.
- **Do** hacer los botones de ancho completo con 14px de relleno y respuesta de escala 0.98 al pulsar.
- **Do** usar iconos de lucide-react a 20px, con `aria-hidden` cuando son decorativos.
- **Do** respetar `prefers-reduced-motion`: sin pulso, sin barrido de esqueleto, transiciones instantáneas.

### Don't:
- **Don't** poner sombras en tarjetas, chips, hojas o paneles; el único brillo es el del botón principal.
- **Don't** usar verde, azul o rojo fuera de su oficio (hecho, descanso, en vivo).
- **Don't** mostrar tiempos, series o rachas protagonistas en Inter.
- **Don't** introducir un tema claro ni fondos de color saturado detrás de bloques de contenido.
- **Don't** usar emoji en la UI.
- **Don't** mostrar una cifra de frecuencia cardiaca sin wearable conectado; se muestra "—".
