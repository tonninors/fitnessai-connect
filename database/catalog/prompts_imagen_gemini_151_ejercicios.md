# Prompts de imagen para Gemini — catálogo de 151 ejercicios

> Versión de prueba optimizada para **imágenes estáticas**, derivada del catálogo original de prompts de video. No reemplaza el archivo generado automáticamente por el script original.

## Flujo recomendado para mantener consistencia

1. Genera primero una **imagen de referencia del instructor** con el prompt maestro de abajo.
2. Mantén esa imagen en la misma conversación de Gemini o adjúntala como referencia al generar cada ejercicio.
3. Genera 2–3 variantes de cada ejercicio y conserva la que tenga mejor anatomía, agarre, geometría del equipo y alineación articular.
4. Para un catálogo móvil, estos prompts usan **vertical 9:16** y una sola pose representativa. La imagen no pretende explicar por sí sola todo el recorrido del movimiento.

### Prompt maestro — instructor de referencia

```text
Create a photorealistic full-body reference image of one adult fitness instructor for a premium workout app. Athletic, natural and realistic physique; neutral confident expression; fitted slate-gray training shirt, black shorts and neutral training shoes, no logos. Standing relaxed in a neutral anatomical pose, arms naturally at the sides, feet hip-width apart. Minimalist professional gym studio with matte charcoal-gray background, black rubber flooring, soft diffused studio lighting and subtle separation light. Vertical 9:16, front three-quarter view, full body visible with comfortable margin, natural 50 mm perspective. Clean commercial fitness photography, realistic skin and anatomy. No text, labels, logos, watermarks, mirrors, clutter, other people, exaggerated muscles, extra fingers or distorted limbs.
```

## Reglas aplicadas a todos los prompts

- Una sola imagen y **una sola fase** claramente identificable del ejercicio.
- Técnica y geometría del equipo priorizadas sobre una pose “dramática”.
- Sin texto, flechas, resaltado muscular ni elementos de interfaz para que la imagen pueda integrarse limpia en la app.
- Los ejercicios con máquinas describen puntos de contacto y posición del cuerpo para reducir alucinaciones de geometría.
- Los ejercicios unilaterales muestran un lado de forma explícita cuando ayuda a evitar ambigüedad.


## Calentamiento

### 1. Balanceo de Pierna Anterior-Posterior

Archivo sugerido: `balanceo-de-pierna-anterior-posterior.webp` · id `cc380b2e-0dbc-463c-a19a-5cb8de020373`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Leg Swing Front-to-Back (Balanceo de Pierna Anterior-Posterior)
Freeze ONE single representative moment of the exercise: Standing tall beside a simple support, weight on the left leg, right leg straight and swung forward to about 40–50 degrees of hip flexion; pelvis level, torso completely upright, support hand used lightly for balance.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 2. Dislocación de Hombro con Banda

Archivo sugerido: `dislocacion-de-hombro-con-banda.webp` · id `55f1deec-af72-4966-8cd7-eecb10aa707c`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Band Shoulder Dislocate (Dislocación de Hombro con Banda)
Freeze ONE single representative moment of the exercise: Standing upright with a wide grip on a resistance band, elbows fully straight, band passing just above and slightly behind the head during the overhead arc; ribs down and shoulders moving smoothly without forcing end range.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 3. Dorsiflexión de Tobillo Rodilla a Pared

Archivo sugerido: `dorsiflexion-de-tobillo-rodilla-a-pared.webp` · id `b272e048-a002-43a6-aa04-353c314f7f23`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Knee-to-Wall Ankle Dorsiflexion (Dorsiflexión de Tobillo Rodilla a Pared)
Freeze ONE single representative moment of the exercise: Right foot flat a short distance from a wall, right knee driven forward until it nearly touches the wall while tracking over the second toe; right heel firmly planted, rear leg behind for balance.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 4. Gato-Camello

Archivo sugerido: `gato-camello.webp` · id `1f50eedc-85d7-4fe3-9551-7e63d3b41fcb`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cat-Cow (Gato-Camello)
Freeze ONE single representative moment of the exercise: On hands and knees in the rounded 'cat' phase: hands under shoulders, knees under hips, entire spine gently flexed upward, pelvis tucked, head following the curve of the spine without forcing the neck.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 5. Movilidad de Cadera 90/90

Archivo sugerido: `movilidad-de-cadera-90-90.webp` · id `d5d773b9-f0ca-42a0-a06b-e058e54176d5`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: 90/90 Hip Mobility (Movilidad de Cadera 90/90)
Freeze ONE single representative moment of the exercise: Seated in a clean 90/90 hip position: front and rear knees each bent about 90 degrees, both hips rotated, torso tall and centered, hands lightly on the floor only if needed for balance.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 6. Rotación Externa de Hombro con Banda

Archivo sugerido: `rotacion-externa-de-hombro-con-banda.webp` · id `7b280a92-9ed0-4a07-bbb0-34a2ec650391`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Band Shoulder External Rotation (Rotación Externa de Hombro con Banda)
Freeze ONE single representative moment of the exercise: Standing with the right elbow bent 90 degrees and pinned to the right ribs, resistance band anchored to the left side; right forearm rotated outward while upper arm stays fixed, wrist neutral and torso square.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```


## Entrenamiento

### 7. Abducción de Cadera con Banda

Archivo sugerido: `abduccion-de-cadera-con-banda.webp` · id `d378ec19-b416-49d4-8089-66103900f3be`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Banded Hip Abduction (Abducción de Cadera con Banda)
Freeze ONE single representative moment of the exercise: Standing with a resistance mini-band around the ankles, weight on the left leg, right leg abducted laterally 20–30 degrees with toes facing forward; pelvis level and torso still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 8. Abducción de Cadera en Cable

Archivo sugerido: `abduccion-de-cadera-en-cable.webp` · id `741f16b8-463a-456c-a940-df62d9ab3c3e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hip height, with the cable stack and ankle line clearly visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Hip Abduction (Abducción de Cadera en Cable)
Freeze ONE single representative moment of the exercise: Standing next to a low cable stack, ankle strap on the right ankle and cable pulling from the left; right leg moved laterally away from the machine, knee nearly straight, pelvis level, one hand lightly holding the machine for balance.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 9. Abducción de Cadera en Máquina

Archivo sugerido: `abduccion-de-cadera-en-maquina.webp` · id `a300846c-0b71-4c03-bf53-b2e8068289f8`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Hip Abduction (Abducción de Cadera en Máquina)
Freeze ONE single representative moment of the exercise: Seated correctly in a hip-abduction machine with back against the pad, feet on supports and outer knees against the pads; knees opened outward near the end of the comfortable range while torso stays still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 10. Aducción de Cadera en Cable

Archivo sugerido: `aduccion-de-cadera-en-cable.webp` · id `dfb699d4-b628-470c-aa40-4cbfd200e0b3`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hip height, with the cable stack and ankle line clearly visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Hip Adduction (Aducción de Cadera en Cable)
Freeze ONE single representative moment of the exercise: Standing beside a low cable stack with an ankle strap on the right ankle and the machine to the right; right leg drawn inward across the midline under control, pelvis square and torso upright, one hand lightly holding support.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 11. Aducción de Cadera en Máquina

Archivo sugerido: `aduccion-de-cadera-en-maquina.webp` · id `3c5c02cb-f66c-4783-99c7-7f0aabd4bc5a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Hip Adduction (Aducción de Cadera en Máquina)
Freeze ONE single representative moment of the exercise: Seated correctly in a hip-adduction machine with back against the pad and inner knees against the pads; legs brought toward each other near the contracted position, feet and knees aligned.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 12. Apertura Posterior en Cable

Archivo sugerido: `apertura-posterior-en-cable.webp` · id `a62b4457-cf81-49ed-852e-cf7d81d2e263`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Rear Delt Fly (Apertura Posterior en Cable)
Freeze ONE single representative moment of the exercise: Standing centered between two cable columns, each hand holding the opposite cable so the cables cross in front; arms opened out at shoulder height with a small fixed elbow bend, shoulder blades controlled and torso motionless.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 13. Aperturas con Mancuernas

Archivo sugerido: `aperturas-con-mancuernas.webp` · id `1300e6fa-a661-4b9b-837e-2eafad622d5e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at bench/chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Chest Fly (Aperturas con Mancuernas)
Freeze ONE single representative moment of the exercise: Lying face up on a flat bench with one dumbbell in each hand; arms opened wide at chest level with a soft fixed elbow bend, palms facing inward, dumbbells aligned over the chest arc and shoulders stable on the bench.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 14. Aperturas en Cable a Media Altura

Archivo sugerido: `aperturas-en-cable-a-media-altura.webp` · id `8a11f8da-5b8e-4a38-a665-3597c7fcdb90`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Mid Cable Fly (Aperturas en Cable a Media Altura)
Freeze ONE single representative moment of the exercise: Standing in a slight staggered stance between two mid-height pulleys, one D-handle in each hand; hands brought toward each other in front of mid-chest with elbows softly bent and cables taut, torso still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 15. Aperturas en Cable Bajo-Alto

Archivo sugerido: `aperturas-en-cable-bajo-alto.webp` · id `125ff8e8-e90e-4635-9641-76a612d80363`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, both low pulleys visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Low-to-High Cable Fly (Aperturas en Cable Bajo-Alto)
Freeze ONE single representative moment of the exercise: Standing between two low pulleys in a stable staggered stance; both D-handles travel upward and inward so the hands meet in front of the upper chest, elbows softly bent, cables forming a clear low-to-high diagonal.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 16. Belt Squat

Archivo sugerido: `belt-squat.webp` · id `51aff22a-547b-44fb-99de-ec4715a01aa7`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Belt Squat
Freeze ONE single representative moment of the exercise: At the bottom of a belt squat: belt secured around the hips and attached vertically beneath the body, hands lightly on support handles, feet flat, knees tracking over toes, thighs about parallel or slightly below, torso upright and spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 17. Bird Dog

Archivo sugerido: `bird-dog.webp` · id `6fcf9d80-eee0-4851-bdcc-0db284ff2020`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view from low hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bird Dog
Freeze ONE single representative moment of the exercise: On hands and knees with hips and shoulders square; right arm extended straight forward and left leg extended straight backward at about torso height, abdomen braced, spine neutral, no pelvic rotation.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 18. Buenos Días con Barra

Archivo sugerido: `buenos-dias-con-barra.webp` · id `3df173fc-8143-4836-b669-dd26d8939137`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Good Morning (Buenos Días con Barra)
Freeze ONE single representative moment of the exercise: Standing with an Olympic bar resting securely across the upper back, hands gripping the bar outside shoulder width; hips pushed back into a controlled hip hinge, knees softly bent, torso inclined forward about 45 degrees, spine neutral and bar staying on the back.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 19. Caminata del Granjero

Archivo sugerido: `caminata-del-granjero.webp` · id `eb721a60-8d51-4563-ad16-6402b70e5223`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Farmer Carry (Caminata del Granjero)
Freeze ONE single representative moment of the exercise: Walking mid-stride while holding one heavy dumbbell in each hand at the sides; arms straight, shoulders level and slightly packed, ribs stacked over pelvis, short controlled step and tall posture.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 20. Colgado Pasivo

Archivo sugerido: `colgado-pasivo.webp` · id `f442e7de-870f-4273-babc-8ff115d9e94d`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at shoulder height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Passive Dead Hang (Colgado Pasivo)
Freeze ONE single representative moment of the exercise: Hanging freely from a pull-up bar with a shoulder-width overhand grip; elbows straight, body vertical and still, shoulders naturally elevated in a relaxed passive hang rather than actively depressed, legs together.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 21. Crunch en Cable

Archivo sugerido: `crunch-en-cable.webp` · id `42da5eaf-f504-42d7-a725-965fcc4c9538`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Crunch (Crunch en Cable)
Freeze ONE single representative moment of the exercise: Kneeling in front of a high cable with a rope held beside the temples; spine flexed so ribs move toward pelvis, elbows pointing down, hips relatively fixed above the knees and cable taut.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 22. Crunch en Máquina

Archivo sugerido: `crunch-en-maquina.webp` · id `ba3e7f98-394c-4b28-90b7-73ff0f0f94af`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Crunch (Crunch en Máquina)
Freeze ONE single representative moment of the exercise: Seated correctly in an abdominal crunch machine with pelvis and back aligned to the pads; torso flexed forward near the contracted position through the spine, hands/arms on the machine handles or pads as designed.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 23. Crunch en Suelo

Archivo sugerido: `crunch-en-suelo.webp` · id `6ace6474-a8ef-47d5-8e93-588fb4647891`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Floor Crunch (Crunch en Suelo)
Freeze ONE single representative moment of the exercise: Lying face up with knees bent and feet flat; shoulder blades lifted a few centimeters from the floor by spinal flexion, ribs moving toward pelvis, chin gently tucked, lower back staying in contact with the floor.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 24. Crunch Inverso

Archivo sugerido: `crunch-inverso.webp` · id `2cea3d86-bf06-48c5-be1e-fa5b0e710ea1`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view near floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Reverse Crunch (Crunch Inverso)
Freeze ONE single representative moment of the exercise: Lying face up with hips and knees bent; knees drawn toward the chest while the pelvis curls upward so the tailbone and lower hips lift slightly off the floor, lower back flexing under control rather than swinging the legs.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 25. Curl Bayesiano

Archivo sugerido: `curl-bayesiano.webp` · id `dc5b9b1b-a768-4f12-b877-dba600f6601d`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height, cable stack visible behind the working arm. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bayesian Cable Curl (Curl Bayesiano)
Freeze ONE single representative moment of the exercise: Standing facing away from a low cable stack, right hand holding a single handle with the right upper arm slightly behind the torso; elbow flexed near the top of the curl while the shoulder remains extended, torso still and cable taut behind the body.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 26. Curl con Barra

Archivo sugerido: `curl-con-barra.webp` · id `c78072fa-afa9-4ba9-ba9d-c8ef07cfbea5`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Curl (Curl con Barra)
Freeze ONE single representative moment of the exercise: Standing upright holding a straight Olympic bar with a shoulder-width underhand grip; elbows flexed so the bar is near the lower chest, elbows close to the ribs, wrists neutral and torso completely still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 27. Curl con Barra EZ

Archivo sugerido: `curl-con-barra-ez.webp` · id `7c93e078-b7ef-486e-967c-a6b1c44d4b98`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: EZ-Bar Curl (Curl con Barra EZ)
Freeze ONE single representative moment of the exercise: Standing upright holding an EZ curl bar with a comfortable semi-supinated grip; elbows flexed near the top of the curl, upper arms close to the torso, wrists aligned with the angled bar.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 28. Curl con Mancuernas

Archivo sugerido: `curl-con-mancuernas.webp` · id `f865c70b-ffef-48a3-9b84-71dc4f6d8ea4`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Curl (Curl con Mancuernas)
Freeze ONE single representative moment of the exercise: Standing upright with one dumbbell in each hand, palms supinated; both elbows flexed near the top of a simultaneous curl, upper arms vertical and close to the torso, no shoulder swing.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 29. Curl de Muñeca

Archivo sugerido: `curl-de-muneca.webp` · id `4725d1a3-c06d-471d-a64f-ede815eeed11`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view close at forearm height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Wrist Curl (Curl de Muñeca)
Freeze ONE single representative moment of the exercise: Seated with forearms supported on the thighs or a flat bench, palms facing upward and hands extending just beyond the support; barbell held securely while only the wrists are flexed upward, forearms remaining still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 30. Curl en Cable de Pie

Archivo sugerido: `curl-en-cable-de-pie.webp` · id `8cdf4ee3-5054-4434-9cb8-69a8f497b3cd`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Standing Cable Curl (Curl en Cable de Pie)
Freeze ONE single representative moment of the exercise: Standing in front of a low cable pulley holding a straight bar with an underhand shoulder-width grip; cable taut and bar curled toward the lower chest, elbows pinned near the sides and torso upright.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 31. Curl Femoral de Pie Unilateral

Archivo sugerido: `curl-femoral-de-pie-unilateral.webp` · id `9d30c744-649e-467b-9434-b381c24a2170`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Standing Single-Leg Curl (Curl Femoral de Pie Unilateral)
Freeze ONE single representative moment of the exercise: Standing in a single-leg curl machine with torso supported as designed; right ankle positioned behind the roller pad and right knee flexed to roughly 90 degrees, thighs parallel and hips fixed against the support.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 32. Curl Femoral Sentado

Archivo sugerido: `curl-femoral-sentado.webp` · id `6559c25f-ce10-4198-91d0-fa730c5385cf`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Leg Curl (Curl Femoral Sentado)
Freeze ONE single representative moment of the exercise: Seated in a leg-curl machine with hips and back firmly against the seat, thigh restraint secured above the knees; knees flexed so the ankle roller is pulled down and back beneath the seat, pelvis staying still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 33. Curl Femoral Tumbado

Archivo sugerido: `curl-femoral-tumbado.webp` · id `ff3ad98e-0e09-49ed-9033-1c6a30d2e2fb`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Lying Leg Curl (Curl Femoral Tumbado)
Freeze ONE single representative moment of the exercise: Lying face down in a prone leg-curl machine with hips against the pad; knees flexed to roughly 90 degrees and ankle roller drawn toward the glutes, thighs remaining on the bench.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 34. Curl Inclinado con Mancuernas

Archivo sugerido: `curl-inclinado-con-mancuernas.webp` · id `f4c17e38-727a-4084-898e-67ee63b1c65e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Dumbbell Curl (Curl Inclinado con Mancuernas)
Freeze ONE single representative moment of the exercise: Seated against a 45-degree incline bench with arms hanging slightly behind the torso; dumbbells curled upward with palms supinated, upper arms staying back and shoulders against the pad.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 35. Curl Inverso

Archivo sugerido: `curl-inverso.webp` · id `cf98995b-503a-4027-a2ee-f9ba67d2c597`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Reverse Curl (Curl Inverso)
Freeze ONE single representative moment of the exercise: Standing with an EZ bar in a shoulder-width pronated grip; elbows flexed near 90–110 degrees, palms facing down, wrists neutral and upper arms fixed near the torso.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 36. Curl Martillo

Archivo sugerido: `curl-martillo.webp` · id `b63f833c-4b52-419d-91ce-7bf3ffe53a99`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Hammer Curl (Curl Martillo)
Freeze ONE single representative moment of the exercise: Standing upright with one dumbbell in each hand using a neutral hammer grip; elbows flexed near the top while palms continue facing each other, shoulders quiet and upper arms vertical.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 37. Curl Nórdico

Archivo sugerido: `curl-nordico.webp` · id `3f49b87c-ea59-42aa-a503-8c2c4c839657`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Nordic Hamstring Curl (Curl Nórdico)
Freeze ONE single representative moment of the exercise: Kneeling on a padded surface with ankles firmly anchored under a stable support; body kept in one straight line from knees through hips to head while leaning forward about 35–45 degrees, hips fully extended and arms ready in front for safety.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 38. Curl Predicador

Archivo sugerido: `curl-predicador.webp` · id `8956a4a9-7095-446c-8b28-c846b871a12b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at preacher-pad height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Preacher Curl (Curl Predicador)
Freeze ONE single representative moment of the exercise: Seated at a preacher bench with upper arms fully supported on the angled pad; EZ bar held with a semi-supinated grip and elbows flexed around 90 degrees, shoulders staying down.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 39. Curl Spider

Archivo sugerido: `curl-spider.webp` · id `7f25a6bf-0af0-4c86-bf6a-8c12d0045b8a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Spider Curl (Curl Spider)
Freeze ONE single representative moment of the exercise: Chest supported face down on a 45-degree incline bench, arms hanging toward the floor; dumbbells curled upward with palms supinated while upper arms remain nearly vertical and fixed.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 40. Dead Bug

Archivo sugerido: `dead-bug.webp` · id `452fdf9d-7fe0-4421-9e63-d8d174dbb0b9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dead Bug
Freeze ONE single representative moment of the exercise: Lying face up with lower back gently pressed into the floor; right arm extended overhead and left leg extended forward just above the floor, while left arm and right hip/knee remain bent about 90 degrees; ribs down and pelvis stable.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 41. Dominada Prona

Archivo sugerido: `dominada-prona.webp` · id `1606de75-aba9-4ed7-8510-d5f7c5a93c83`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at shoulder height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Pull-Up (Dominada Prona)
Freeze ONE single representative moment of the exercise: At the top of a strict pronated pull-up: slightly wider-than-shoulder overhand grip, chin clearly above the bar, elbows driven down toward the ribs, chest lifted without excessive lumbar arch and body controlled.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 42. Dominada Supina

Archivo sugerido: `dominada-supina.webp` · id `93706ac3-0674-4414-a2aa-11538df4fe0f`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at shoulder height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Chin-Up (Dominada Supina)
Freeze ONE single representative moment of the exercise: At the top of a strict chin-up: shoulder-width underhand grip, chin above the bar, elbows pulled down and back, torso controlled and no swinging.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 43. Elevación de Piernas Colgado

Archivo sugerido: `elevacion-de-piernas-colgado.webp` · id `718bb923-1e1a-4f3d-a5b9-aee9046c6a8f`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at shoulder height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Hanging Leg Raise (Elevación de Piernas Colgado)
Freeze ONE single representative moment of the exercise: Hanging from a pull-up bar with elbows straight and shoulders controlled; both legs kept straight and raised to roughly horizontal or slightly above, pelvis posteriorly tilted and no visible swing.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 44. Elevación de Talón Unilateral

Archivo sugerido: `elevacion-de-talon-unilateral.webp` · id `6f0ec6db-9181-4c49-a2ee-5810d9728321`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Single-Leg Standing Calf Raise (Elevación de Talón Unilateral)
Freeze ONE single representative moment of the exercise: Standing on the ball of the right foot at the edge of a small step, left foot off the step and one hand lightly holding support; right heel raised high in plantar flexion, knee straight but not locked and body tall.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 45. Elevación de Talones de Pie

Archivo sugerido: `elevacion-de-talones-de-pie.webp` · id `96c66297-261c-43ca-ac5d-8edb0c9e3564`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Standing Calf Raise (Elevación de Talones de Pie)
Freeze ONE single representative moment of the exercise: Standing correctly in a commercial standing calf-raise machine with shoulders under the pads and forefeet on the platform edge; heels raised high, knees nearly straight and torso upright.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 46. Elevación de Talones Sentado

Archivo sugerido: `elevacion-de-talones-sentado.webp` · id `2c460fb3-a359-4c57-90c6-c8cccc931e0c`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at knee/seat height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Calf Raise (Elevación de Talones Sentado)
Freeze ONE single representative moment of the exercise: Seated in a commercial seated calf-raise machine with knees bent about 90 degrees and thigh pads resting above the knees; forefeet on the platform and heels raised high at the top of the calf raise.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 47. Elevación de Tibial Anterior

Archivo sugerido: `elevacion-de-tibial-anterior.webp` · id `2d0fc2fc-8d6d-4ab0-b612-5a814f0d27d3`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at lower-leg height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Tibialis Raise (Elevación de Tibial Anterior)
Freeze ONE single representative moment of the exercise: Standing with heels planted on the floor and body supported lightly against a wall or upright support; both forefeet and toes lifted upward as high as comfortable through ankle dorsiflexion while knees remain nearly straight.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 48. Elevación Donkey

Archivo sugerido: `elevacion-donkey.webp` · id `a158e809-8413-404e-aff5-1be5b99572f9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Donkey Calf Raise (Elevación Donkey)
Freeze ONE single representative moment of the exercise: Positioned in a donkey calf-raise machine with torso hinged forward and supported, forefeet on a platform and the machine pad/load contacting the pelvis or lower back as designed; heels raised high while knees remain nearly straight.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 49. Elevación Frontal

Archivo sugerido: `elevacion-frontal.webp` · id `ee529b53-57a1-4303-ba1b-bc593f79f33b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Front Raise (Elevación Frontal)
Freeze ONE single representative moment of the exercise: Standing with one dumbbell in each hand; both arms raised forward to about shoulder height with elbows softly bent, palms neutral or slightly pronated, ribs down and no torso lean.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 50. Elevación Lateral con Mancuernas

Archivo sugerido: `elevacion-lateral-con-mancuernas.webp` · id `af3f41ce-7c03-413f-a430-94a5f1e41498`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Lateral Raise (Elevación Lateral con Mancuernas)
Freeze ONE single representative moment of the exercise: Standing with dumbbells raised out to the sides in the scapular plane to about shoulder height, elbows softly bent and hands slightly below or level with elbows; torso upright and shoulders not shrugged.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 51. Elevación Lateral en Cable

Archivo sugerido: `elevacion-lateral-en-cable.webp` · id `1acdf16d-8b46-4809-ad36-5df539e0f76c`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Lateral Raise (Elevación Lateral en Cable)
Freeze ONE single representative moment of the exercise: Standing beside a low cable stack with the right hand holding a single D-handle; right arm raised laterally in the scapular plane to about shoulder height, cable taut and torso square.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 52. Elevación Lateral en Cable Inclinado

Archivo sugerido: `elevacion-lateral-en-cable-inclinado.webp` · id `d34bfa0c-125e-4c1b-acc6-de431a0b8da2`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Lean-Away Cable Lateral Raise (Elevación Lateral en Cable Inclinado)
Freeze ONE single representative moment of the exercise: Standing beside a low cable stack while leaning slightly away from the machine with the support hand; working arm raised laterally to about shoulder height, body forming a stable lean and cable staying taut.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 53. Elevación Lateral en Máquina

Archivo sugerido: `elevacion-lateral-en-maquina.webp` · id `a06e928c-c247-4de0-878c-0a130412513b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Lateral Raise (Elevación Lateral en Máquina)
Freeze ONE single representative moment of the exercise: Seated in a lateral-raise machine with back against the pad and elbows/upper arms correctly contacting the pads; arms elevated to about shoulder height without shrugging.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 54. Encogimientos con Barra

Archivo sugerido: `encogimientos-con-barra.webp` · id `843392f0-a76d-424b-aad8-d4437d5bd312`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Shrug (Encogimientos con Barra)
Freeze ONE single representative moment of the exercise: Standing tall holding an Olympic bar in front of the thighs with straight arms; shoulders elevated vertically toward the ears at the top of a shrug while head and torso remain neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 55. Extensión Cruzada de Tríceps en Cable

Archivo sugerido: `extension-cruzada-de-triceps-en-cable.webp` · id `0f8e081a-5147-4b61-a02c-c53fea847643`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, cable origin visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cross-Body Cable Triceps Extension (Extensión Cruzada de Tríceps en Cable)
Freeze ONE single representative moment of the exercise: Standing side-on to a high cable pulley, using the far hand so the working forearm starts across the front of the torso; elbow kept fixed while the arm is extended diagonally down and across toward the opposite hip, cable taut and torso not rotating.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 56. Extensión de Muñeca

Archivo sugerido: `extension-de-muneca.webp` · id `3c1c4ce8-b088-4842-a8a7-ddead9b09840`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front view close at forearm height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Wrist Extension (Extensión de Muñeca)
Freeze ONE single representative moment of the exercise: Seated with forearms supported on the thighs or a bench, palms facing downward and hands extending beyond the support; barbell held securely while only the wrists are extended upward, forearms staying still.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 57. Extensión de Rodilla en Máquina

Archivo sugerido: `extension-de-rodilla-en-maquina.webp` · id `39d57e35-2e04-48a7-b95b-319096d79105`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Leg Extension (Extensión de Rodilla en Máquina)
Freeze ONE single representative moment of the exercise: Seated in a leg-extension machine with back against the pad and roller positioned above the ankles on the lower shins; knees extended to near straight without hyperextension, thighs remaining against the seat.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 58. Extensión de Tríceps en Polea con Barra

Archivo sugerido: `extension-de-triceps-en-polea-con-barra.webp` · id `b0e29d93-2a1d-4a37-859b-69c56eaf14b8`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Straight-Bar Triceps Pushdown (Extensión de Tríceps en Polea con Barra)
Freeze ONE single representative moment of the exercise: Standing in front of a high cable pulley holding a straight bar; elbows pinned beside the ribs and fully extended so the bar is near the upper thighs, wrists neutral and torso upright.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 59. Extensión de Tríceps en Polea con Cuerda

Archivo sugerido: `extension-de-triceps-en-polea-con-cuerda.webp` · id `d5641ec0-c730-4116-813f-18841eb49f41`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Rope Triceps Pushdown (Extensión de Tríceps en Polea con Cuerda)
Freeze ONE single representative moment of the exercise: Standing in front of a high cable pulley holding a rope; elbows pinned beside the ribs and arms extended, rope ends separated slightly outward beside the thighs, shoulders quiet.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 60. Extensión de Tríceps sobre Cabeza con Cuerda

Archivo sugerido: `extension-de-triceps-sobre-cabeza-con-cuerda.webp` · id `68109383-6ce4-47ab-ab85-66d1813b4c90`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height, cable visible behind the body. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Overhead Rope Triceps Extension (Extensión de Tríceps sobre Cabeza con Cuerda)
Freeze ONE single representative moment of the exercise: Standing facing away from a cable stack with a rope coming from behind the head; upper arms beside the ears and elbows nearly fully extended overhead, ribs down and cable taut.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 61. Extensión Unilateral sobre Cabeza en Cable

Archivo sugerido: `extension-unilateral-sobre-cabeza-en-cable.webp` · id `f895ca7e-0b81-4c79-9564-4aa4214bffb5`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height, cable visible behind the body. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Single-Arm Overhead Cable Triceps Extension (Extensión Unilateral sobre Cabeza en Cable)
Freeze ONE single representative moment of the exercise: Standing facing away from a cable stack, right arm overhead holding a single handle with the cable coming from behind; right elbow nearly fully extended while upper arm stays beside the ear, torso braced.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 62. Face Pull

Archivo sugerido: `face-pull.webp` · id `ad529f8d-45cd-4b99-aea8-cdb2e09ff0d0`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Face Pull
Freeze ONE single representative moment of the exercise: Standing in front of a high cable with a rope; rope pulled toward the face at eyebrow/nose level, elbows high and wide, forearms externally rotated so the hands separate near the sides of the head, chest tall.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 63. Flexiones de Brazos

Archivo sugerido: `flexiones-de-brazos.webp` · id `02d0e74a-7e08-40eb-acb3-ba0d182dfaa1`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Push-Up (Flexiones de Brazos)
Freeze ONE single representative moment of the exercise: In a strict push-up bottom position on the hands and toes: hands slightly wider than shoulders, body straight from head to heels, chest just above the floor, elbows about 30–45 degrees from the torso and forearms nearly vertical.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 64. Fondos con Sesgo a Pecho

Archivo sugerido: `fondos-con-sesgo-a-pecho.webp` · id `fdf31671-948e-4483-820d-c4f763b20b5e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Chest-Biased Dip (Fondos con Sesgo a Pecho)
Freeze ONE single representative moment of the exercise: Supporting the body on parallel dip bars in the lower controlled phase with a deliberate forward torso lean, chest open and elbows bent; shoulders remain stable, legs tucked slightly behind and no excessive depth.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 65. Fondos con Sesgo a Tríceps

Archivo sugerido: `fondos-con-sesgo-a-triceps.webp` · id `20d82cc8-60d0-4b45-8495-7325fd74831b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Triceps-Biased Dip (Fondos con Sesgo a Tríceps)
Freeze ONE single representative moment of the exercise: Supporting the body on parallel dip bars in the lower controlled phase with torso more upright than the chest-biased version, elbows tracking back close to the body and shoulders stable.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 66. Fondos en Máquina

Archivo sugerido: `fondos-en-maquina.webp` · id `57727d37-5894-49b0-8ce5-d85ab6a64ed8`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Dip (Fondos en Máquina)
Freeze ONE single representative moment of the exercise: Seated correctly in a dip machine with back against the pad and hands on the handles; handles pressed downward near full elbow extension, shoulders down and torso stable.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 67. Gemelos en Prensa

Archivo sugerido: `gemelos-en-prensa.webp` · id `1792e1b2-ab65-4340-972c-f56a645f6311`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at lower-leg height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Leg Press Calf Raise (Gemelos en Prensa)
Freeze ONE single representative moment of the exercise: Reclined in a 45-degree leg press with knees nearly straight but not locked; only the forefeet are on the lower edge of the platform and the heels are pushed away from the platform in a strong plantar-flexed calf-raise position.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 68. Hack Squat

Archivo sugerido: `hack-squat.webp` · id `1ad8c755-a020-4852-b76e-12360186ae4a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Hack Squat
Freeze ONE single representative moment of the exercise: At the bottom of a hack squat in a commercial sled machine: back and shoulders firmly against the pads, feet flat on the platform, knees flexed deeply and tracking over the toes, hips staying against the pad and spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 69. Hip Thrust con Barra

Archivo sugerido: `hip-thrust-con-barra.webp` · id `de10e766-24e1-4449-b4c6-823dc9ae1861`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Hip Thrust (Hip Thrust con Barra)
Freeze ONE single representative moment of the exercise: At the top of a barbell hip thrust with upper back supported on a flat bench, feet flat and knees near 90 degrees; padded barbell centered across the hip crease, hips fully extended, torso roughly parallel to the floor, chin gently tucked.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 70. Hip Thrust en Smith

Archivo sugerido: `hip-thrust-en-smith.webp` · id `a5ba5528-bc93-4e0b-9180-8ea6c0ea7f6a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Smith Machine Hip Thrust (Hip Thrust en Smith)
Freeze ONE single representative moment of the exercise: At the top of a Smith-machine hip thrust with upper back on a flat bench, feet flat and knees near 90 degrees; padded Smith bar centered across the hips, pelvis neutral at lockout and ribs down.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 71. Hiperextensión 45° con Sesgo Femoral

Archivo sugerido: `hiperextension-45-con-sesgo-femoral.webp` · id `7cee799e-ba83-4e99-b402-4523f0cce464`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip/bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: 45-Degree Back Extension - Hamstring Bias (Hiperextensión 45° con Sesgo Femoral)
Freeze ONE single representative moment of the exercise: On a 45-degree back-extension bench with hips supported and ankles secured; body near the top in a straight line from head through heels, knees only slightly bent, spine neutral and movement clearly coming from the hips rather than lumbar hyperextension.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 72. Hiperextensión 45° con Sesgo Glúteo

Archivo sugerido: `hiperextension-45-con-sesgo-gluteo.webp` · id `8adcef0f-73b8-4a4d-879d-526ea63746d6`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip/bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: 45-Degree Back Extension - Glute Bias (Hiperextensión 45° con Sesgo Glúteo)
Freeze ONE single representative moment of the exercise: On a 45-degree back-extension bench with ankles secured; at the top with glutes squeezed, slight upper-back rounding allowed, ribs down and pelvis gently posteriorly tilted, hips extended without overextending the lower back.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 73. Hiperextensión Inversa

Archivo sugerido: `hiperextension-inversa.webp` · id `487d3af7-d412-4626-b3ae-3ceb403f1234`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Reverse Hyperextension (Hiperextensión Inversa)
Freeze ONE single representative moment of the exercise: Lying face down on a reverse-hyperextension machine with torso firmly supported and hands gripping the handles; both legs extended backward to about torso height through hip extension, knees softly straight and lower back neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 74. Hollow Body Hold

Archivo sugerido: `hollow-body-hold.webp` · id `16ec6401-2912-4ffa-8b2f-665a3184960b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Hollow Body Hold
Freeze ONE single representative moment of the exercise: Lying face up in a hollow-body hold with lower back pressed firmly into the floor; shoulders and straight legs lifted off the floor, arms extended overhead alongside the ears, ribs pulled down and body forming a shallow hollow curve.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 75. Jalón al Pecho Agarre Neutro

Archivo sugerido: `jalon-al-pecho-agarre-neutro.webp` · id `5be5e696-a231-4b34-99cf-315df501e190`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Neutral-Grip Lat Pulldown (Jalón al Pecho Agarre Neutro)
Freeze ONE single representative moment of the exercise: Seated at a lat-pulldown station holding a neutral-grip handle; handle pulled to the upper chest, elbows driven down beside the torso, chest tall with only a slight controlled lean back and thighs secured under pads.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 76. Jalón al Pecho Prono

Archivo sugerido: `jalon-al-pecho-prono.webp` · id `606d171b-b870-4d24-ab03-142ec1ce845e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Lat Pulldown Pronated Grip (Jalón al Pecho Prono)
Freeze ONE single representative moment of the exercise: Seated at a lat-pulldown station holding a wide pronated bar; bar pulled toward the upper chest, elbows moving down and slightly back, torso tall with a small controlled lean and thighs secured.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 77. Jalón con Brazos Rectos

Archivo sugerido: `jalon-con-brazos-rectos.webp` · id `ffb308be-7d1c-4209-8475-4272b8b3e320`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Straight-Arm Cable Pulldown (Jalón con Brazos Rectos)
Freeze ONE single representative moment of the exercise: Standing facing a high cable pulley, holding a straight bar with arms nearly straight; bar pulled down to the thighs through shoulder extension, slight hip hinge, ribs down and elbows only softly bent.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 78. Pájaros con Mancuernas

Archivo sugerido: `pajaros-con-mancuernas.webp` · id `ef4eb8db-9aa2-4298-b27c-8f171a6ea19d`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view (45 degrees) at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bent-Over Dumbbell Rear Delt Raise (Pájaros con Mancuernas)
Freeze ONE single representative moment of the exercise: Standing in a stable hip hinge with torso about 30–45 degrees above horizontal; dumbbells raised out to the sides at shoulder level with a small elbow bend, spine neutral and no torso swing.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 79. Patada de Glúteo en Cable

Archivo sugerido: `patada-de-gluteo-en-cable.webp` · id `fcff6525-7267-47a9-b126-323c78fbcbd3`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Glute Kickback (Patada de Glúteo en Cable)
Freeze ONE single representative moment of the exercise: Standing facing a cable stack with an ankle strap on the right ankle; right leg extended backward through the hip with a small knee bend, pelvis square, torso braced and lumbar spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 80. Pec Deck

Archivo sugerido: `pec-deck.webp` · id `9974ee58-c8ad-4f1b-9a13-3d90157c1478`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Pec Deck Fly (Pec Deck)
Freeze ONE single representative moment of the exercise: Seated in a pec-deck machine with back and head supported; handles or forearm pads brought together in front of the chest with elbows softly bent, shoulders remaining down and back.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 81. Pec Deck Inverso

Archivo sugerido: `pec-deck-inverso.webp` · id `2bc6b044-5126-46b6-bc9c-fbbb4f49036b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, three-quarter rear view at chest height, clearly showing both arms and chest support. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Reverse Pec Deck (Pec Deck Inverso)
Freeze ONE single representative moment of the exercise: Seated facing the pad of a reverse pec-deck machine with chest supported; arms opened out to the sides near shoulder height, elbows softly bent and shoulder blades controlled without torso movement.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 82. Pendulum Squat

Archivo sugerido: `pendulum-squat.webp` · id `bd3495fe-c51e-443f-a77a-3963f8d8d805`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Pendulum Squat
Freeze ONE single representative moment of the exercise: At the bottom of a commercial pendulum squat: upper back and shoulders firmly against the machine pad, feet flat on the angled platform, knees deeply flexed and tracking over toes, torso supported and machine lever geometry realistic.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 83. Peso Muerto Piernas Rígidas

Archivo sugerido: `peso-muerto-piernas-rigidas.webp` · id `d20ef09d-908e-4bb0-bfb1-49125637def4`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Stiff-Leg Deadlift (Peso Muerto Piernas Rígidas)
Freeze ONE single representative moment of the exercise: Standing with an Olympic bar close to the shins in a deep stiff-leg hip hinge; knees almost straight but not locked, hips pushed far back, spine neutral and torso near horizontal without rounding.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 84. Peso Muerto Rumano con Barra

Archivo sugerido: `peso-muerto-rumano-con-barra.webp` · id `24c152ee-2f2c-4edc-9868-c1fd53ea8e61`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Romanian Deadlift (Peso Muerto Rumano con Barra)
Freeze ONE single representative moment of the exercise: Standing with an Olympic bar close to the legs at the bottom of a Romanian deadlift around mid-shin level; hips pushed back, knees softly bent, shins nearly vertical and spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 85. Peso Muerto Rumano con Mancuernas

Archivo sugerido: `peso-muerto-rumano-con-mancuernas.webp` · id `da07fe35-f695-412e-81f9-e0a255ee4560`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Romanian Deadlift (Peso Muerto Rumano con Mancuernas)
Freeze ONE single representative moment of the exercise: Standing with dumbbells beside the shins at the bottom of a Romanian deadlift; hips pushed back, knees softly bent, shins nearly vertical, dumbbells close to the body and spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 86. Pinza de Discos

Archivo sugerido: `pinza-de-discos.webp` · id `fe7252e1-7598-44f5-8a9f-72e3178f0fd2`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hand/hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Plate Pinch Hold (Pinza de Discos)
Freeze ONE single representative moment of the exercise: Standing tall while pinching two smooth-sided weight plates together in each hand at the sides using only fingers and thumbs; arms straight, wrists neutral and plate faces visibly compressed together without straps.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 87. Plancha

Archivo sugerido: `plancha.webp` · id `cccd7aa0-03a3-4e23-a074-d3be81604ab4`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Front Plank (Plancha)
Freeze ONE single representative moment of the exercise: Holding a strict forearm plank: elbows under shoulders, forearms parallel, body in one straight line from head through heels, glutes lightly engaged, ribs down and lower back neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 88. Plancha Copenhagen

Archivo sugerido: `plancha-copenhagen.webp` · id `524308e7-bc4a-4bb1-a89b-c7c90b35cae5`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view near floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Copenhagen Plank (Plancha Copenhagen)
Freeze ONE single representative moment of the exercise: Holding a long-lever Copenhagen plank with the upper ankle/foot supported on a flat bench, lower leg suspended beneath it, bottom forearm on the floor under the shoulder and body forming a straight horizontal line.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 89. Plancha Lateral

Archivo sugerido: `plancha-lateral.webp` · id `6f0f1a19-c3a3-4b8f-a534-f9d5a04deb63`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view near floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Side Plank (Plancha Lateral)
Freeze ONE single representative moment of the exercise: Holding a strict side plank on one forearm with elbow under shoulder, feet stacked, hips lifted so head, shoulders, hips and ankles form one straight line; top arm relaxed along the side or raised.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 90. Prensa 45 Grados

Archivo sugerido: `prensa-45-grados.webp` · id `36b3c617-1166-4d62-9150-fc31cca02d59`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip/knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: 45-Degree Leg Press (Prensa 45 Grados)
Freeze ONE single representative moment of the exercise: Reclined in a 45-degree leg-press machine at the controlled bottom position: feet shoulder-width on the platform, knees flexed around 90–110 degrees and tracking over toes, entire back and pelvis staying against the pad.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 91. Prensa Horizontal

Archivo sugerido: `prensa-horizontal.webp` · id `1fb2a980-b997-4607-bce3-ad78ae45210c`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip/knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Horizontal Leg Press (Prensa Horizontal)
Freeze ONE single representative moment of the exercise: Seated in a horizontal leg-press machine at the controlled bottom position with feet flat on the platform and knees flexed around 90 degrees; hips and lower back remain against the seat.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 92. Press Arnold

Archivo sugerido: `press-arnold.webp` · id `413c005d-bf7a-4076-8024-c48302ae8268`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Arnold Press (Press Arnold)
Freeze ONE single representative moment of the exercise: Seated against a high-back bench during the distinctive lower-to-middle phase of an Arnold press: dumbbells in front of the shoulders, elbows forward, palms initially facing the face and visibly rotating outward as the weights begin to rise.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 93. Press Banca Agarre Cerrado

Archivo sugerido: `press-banca-agarre-cerrado.webp` · id `a5874d29-f507-4b84-b24f-9b0f4cc76975`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Close-Grip Bench Press (Press Banca Agarre Cerrado)
Freeze ONE single representative moment of the exercise: Lying on a flat bench with feet planted and shoulder blades set; straight bar held with a close roughly shoulder-width grip just above the lower-to-mid chest in the bottom phase, elbows tucked about 30–45 degrees.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 94. Press Banca con Barra

Archivo sugerido: `press-banca-con-barra.webp` · id `702f1a51-3956-4d90-af7d-00af67b2f1de`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Bench Press (Press Banca con Barra)
Freeze ONE single representative moment of the exercise: Lying on a flat bench with feet firmly planted, shoulder blades retracted and a natural small upper-back arch; Olympic bar paused just above the mid-chest, forearms vertical and wrists stacked over elbows.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 95. Press Banca con Mancuernas

Archivo sugerido: `press-banca-con-mancuernas.webp` · id `b825c8a7-eb6b-4071-9712-ca5a63daa7b2`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Bench Press (Press Banca con Mancuernas)
Freeze ONE single representative moment of the exercise: Lying on a flat bench with feet planted and shoulder blades set; dumbbells lowered beside the chest with elbows about 45–60 degrees from the torso, forearms vertical and wrists neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 96. Press Banca en Smith

Archivo sugerido: `press-banca-en-smith.webp` · id `0f985a6b-40d9-4bb5-a2f3-c6acab3d67bc`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Smith Machine Bench Press (Press Banca en Smith)
Freeze ONE single representative moment of the exercise: Lying on a flat bench under a Smith machine with feet planted and shoulder blades set; Smith bar lowered just above mid-chest, forearms vertical and bar path aligned with the fixed rails.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 97. Press de Hombro con Mancuernas Sentado

Archivo sugerido: `press-de-hombro-con-mancuernas-sentado.webp` · id `463f907b-64d1-4bab-8e4d-e3f7dd4e77bf`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Dumbbell Shoulder Press (Press de Hombro con Mancuernas Sentado)
Freeze ONE single representative moment of the exercise: Seated against a high-back bench with dumbbells at shoulder/ear level, forearms nearly vertical and elbows slightly forward in the scapular plane; torso braced and ready to press overhead.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 98. Press de Hombro en Máquina

Archivo sugerido: `press-de-hombro-en-maquina.webp` · id `5fdec4b4-0b41-4d5e-a79b-7826484ee145`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Shoulder Press (Press de Hombro en Máquina)
Freeze ONE single representative moment of the exercise: Seated in a shoulder-press machine with back against the pad; handles pressed upward to near full elbow extension while shoulders remain controlled and forearms align with the machine path.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 99. Press de Pecho en Máquina

Archivo sugerido: `press-de-pecho-en-maquina.webp` · id `b38ce993-8481-42ee-8bee-bb3dfbe27c1f`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Chest Press (Press de Pecho en Máquina)
Freeze ONE single representative moment of the exercise: Seated in a chest-press machine with back and head against the pad; handles pressed forward to near full elbow extension at mid-chest height, shoulder blades controlled and wrists stacked.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 100. Press Declinado con Barra

Archivo sugerido: `press-declinado-con-barra.webp` · id `06ab2272-e2df-48af-95b7-e4b382605e85`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Decline Barbell Bench Press (Press Declinado con Barra)
Freeze ONE single representative moment of the exercise: Secured on a decline bench with feet/legs anchored; Olympic bar lowered just above the lower chest, forearms vertical, elbows controlled and shoulders retracted against the bench.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 101. Press Francés con Mancuerna

Archivo sugerido: `press-frances-con-mancuerna.webp` · id `5fefd583-67a8-4261-9665-429fb39975f9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest/head height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Dumbbell Overhead Triceps Extension / French Press (Press Francés con Mancuerna)
Freeze ONE single representative moment of the exercise: Seated upright holding one dumbbell with both hands overhead in a French press/overhead triceps extension; elbows flexed so the dumbbell is lowered behind the head, upper arms mostly vertical and elbows pointing forward rather than flaring widely.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 102. Press Inclinado con Barra

Archivo sugerido: `press-inclinado-con-barra.webp` · id `74360acc-8fdb-49ca-bfc2-cf11c0cc4f21`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Barbell Bench Press (Press Inclinado con Barra)
Freeze ONE single representative moment of the exercise: Lying on a 30-degree incline bench with feet planted and shoulder blades set; Olympic bar lowered toward the upper chest/clavicular region, forearms vertical and wrists stacked.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 103. Press Inclinado con Mancuernas

Archivo sugerido: `press-inclinado-con-mancuernas.webp` · id `e870d89d-6b0c-4ed5-9d7f-627ad52b9d7b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Dumbbell Bench Press (Press Inclinado con Mancuernas)
Freeze ONE single representative moment of the exercise: Lying on a 30-degree incline bench with feet planted; dumbbells lowered beside the upper chest with elbows about 45–60 degrees from the torso, forearms vertical and shoulders stable.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 104. Press Inclinado en Máquina

Archivo sugerido: `press-inclinado-en-maquina.webp` · id `7c2d632a-6b3d-4399-924a-324769ca6a19`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Machine Chest Press (Press Inclinado en Máquina)
Freeze ONE single representative moment of the exercise: Seated in a plate-loaded incline chest-press machine with torso supported on the angled back pad; handles near the upper chest in the bottom phase, elbows controlled and machine arms aligned symmetrically.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 105. Press Inclinado en Smith

Archivo sugerido: `press-inclinado-en-smith.webp` · id `c5aa1c54-2702-4256-b993-7c11eff22fd0`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Smith Machine Press (Press Inclinado en Smith)
Freeze ONE single representative moment of the exercise: Lying on a 30-degree incline bench under a Smith machine; Smith bar lowered toward the upper chest, forearms vertical and bar path aligned with the rails.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 106. Press Militar con Barra

Archivo sugerido: `press-militar-con-barra.webp` · id `c750b038-e824-4d08-b6f0-b23aadfe84af`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Overhead Press (Press Militar con Barra)
Freeze ONE single representative moment of the exercise: Standing with an Olympic bar pressed overhead to a controlled lockout: elbows straight, bar stacked over shoulders and mid-foot, head neutral after moving slightly through the arms, ribs down and no excessive back lean.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 107. Press Pallof

Archivo sugerido: `press-pallof.webp` · id `e280dfd0-48d9-478a-a318-7a53c3564f73`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, cable stack visible to the side. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Pallof Press (Press Pallof)
Freeze ONE single representative moment of the exercise: Standing perpendicular to a cable stack with the pulley at chest height on the model's left; both hands hold a single handle and arms are fully extended straight in front of the sternum while resisting rotation, hips and shoulders perfectly square and cable taut sideways.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 108. Pronación y Supinación con Mancuerna

Archivo sugerido: `pronacion-y-supinacion-con-mancuerna.webp` · id `a7477c0d-6f0c-437f-8bbf-a8678cdf78fd`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter close view at forearm height while keeping the full seated setup readable. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Forearm Pronation-Supination (Pronación y Supinación con Mancuerna)
Freeze ONE single representative moment of the exercise: Seated with the right elbow bent about 90 degrees and right forearm supported on the thigh or a bench; holding one light dumbbell as a lever while the forearm is rotated into a clear palm-up supinated position, elbow and upper arm staying fixed.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 109. Puente de Glúteos

Archivo sugerido: `puente-de-gluteos.webp` · id `e194b6d9-429e-4347-ae6a-80d82c9f93d7`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view from low floor level. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Glute Bridge (Puente de Glúteos)
Freeze ONE single representative moment of the exercise: Lying face up on the floor with knees bent and feet flat; hips lifted until shoulders, hips and knees form a straight diagonal line, glutes squeezed, ribs down and no bench or external load.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 110. Pull-Through en Cable

Archivo sugerido: `pull-through-en-cable.webp` · id `d604ac72-a49d-4194-accb-76277880801b`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height, low pulley visible behind. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Pull-Through (Pull-Through en Cable)
Freeze ONE single representative moment of the exercise: Standing facing away from a low cable stack with a rope attachment passing between the legs; at the hip-hinged stretch position with hips pushed back, knees softly bent, spine neutral, arms long and cable taut behind the body.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 111. Pullover con Mancuerna

Archivo sugerido: `pullover-con-mancuerna.webp` · id `7c5cb314-6c09-4632-8a9f-ed8ba9bd976a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Dumbbell Pullover (Pullover con Mancuerna)
Freeze ONE single representative moment of the exercise: Lying lengthwise on a flat bench holding one dumbbell with both hands; arms extended back behind the head with elbows softly bent, upper arms near ear level, ribs controlled and shoulders staying on the bench.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 112. Pullover en Máquina

Archivo sugerido: `pullover-en-maquina.webp` · id `a1f6f03b-f7b7-4c56-b0fa-e8389e6ae192`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Machine Pullover (Pullover en Máquina)
Freeze ONE single representative moment of the exercise: Seated correctly in a pullover machine with torso against the pad; elbows/upper arms contacting the lever pads or handles as designed and the machine arm pulled down toward the torso through shoulder extension, without turning it into a triceps press.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 113. Remo Alto Iso-Lateral

Archivo sugerido: `remo-alto-iso-lateral.webp` · id `5723718b-6600-4f71-8df8-9ca1828d33e2`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest/hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Iso-Lateral High Row (Remo Alto Iso-Lateral)
Freeze ONE single representative moment of the exercise: Seated in a plate-loaded iso-lateral high-row machine with chest supported; handles pulled down and back toward the upper ribs, elbows traveling on a high-to-low diagonal and both machine arms moving symmetrically.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 114. Remo con Barra

Archivo sugerido: `remo-con-barra.webp` · id `5a5d4f1c-5733-4009-a025-3dedf219ac07`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Bent-Over Row (Remo con Barra)
Freeze ONE single representative moment of the exercise: Standing in a stable hip hinge with torso about 45 degrees above horizontal; Olympic bar pulled close to the lower ribs/upper abdomen, elbows behind the torso, spine neutral and knees softly bent.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 115. Remo con Mancuerna a una Mano

Archivo sugerido: `remo-con-mancuerna-a-una-mano.webp` · id `79dc56ff-4564-4868-b656-3f17eed2e068`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: One-Arm Dumbbell Row (Remo con Mancuerna a una Mano)
Freeze ONE single representative moment of the exercise: With left knee and left hand supported on a flat bench and right foot on the floor, right hand rows a dumbbell toward the right hip/lower ribs; spine neutral, shoulders square and elbow close to the body.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 116. Remo con Mancuernas Pecho Apoyado

Archivo sugerido: `remo-con-mancuernas-pecho-apoyado.webp` · id `91d0615e-81d2-4206-a7c8-26ecf38d2b67`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Chest-Supported Dumbbell Row (Remo con Mancuernas Pecho Apoyado)
Freeze ONE single representative moment of the exercise: Chest down on a 30-degree incline bench with feet braced; dumbbells pulled toward the lower ribs with elbows traveling back about 30–45 degrees from the torso, chest remaining firmly on the pad.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 117. Remo en Máquina con Pecho Apoyado

Archivo sugerido: `remo-en-maquina-con-pecho-apoyado.webp` · id `6d62de90-9327-4c94-b3d9-179abad74062`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Chest-Supported Machine Row (Remo en Máquina con Pecho Apoyado)
Freeze ONE single representative moment of the exercise: Seated in a chest-supported row machine with sternum against the pad; handles pulled toward the lower ribs, elbows behind the torso and wrists aligned with the machine handles.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 118. Remo Meadows

Archivo sugerido: `remo-meadows.webp` · id `ddd455c5-d759-46c1-87ae-4242b740d857`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height, landmine anchor and loaded sleeve visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Meadows Row (Remo Meadows)
Freeze ONE single representative moment of the exercise: Standing perpendicular to a landmine bar in a staggered hip-hinged stance; right hand grips the thick end/sleeve of the anchored bar and rows it toward the right hip/lower ribs, left hand braced on the thigh if needed, spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 119. Remo Pendlay

Archivo sugerido: `remo-pendlay.webp` · id `16c2306b-534c-423a-862d-e9ee7858e3c0`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Pendlay Row (Remo Pendlay)
Freeze ONE single representative moment of the exercise: In a Pendlay row with torso nearly parallel to the floor, knees softly bent and spine neutral; Olympic bar pulled explosively but cleanly from the floor to the lower chest/upper abdomen, elbows behind the torso and bar kept level.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 120. Remo Sentado en Cable Agarre Amplio

Archivo sugerido: `remo-sentado-en-cable-agarre-amplio.webp` · id `a5074968-2414-42e5-a0e4-f47fa69bafdd`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest/hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Cable Row Wide Grip (Remo Sentado en Cable Agarre Amplio)
Freeze ONE single representative moment of the exercise: Seated at a low cable row with legs braced and torso upright; wide straight/lat bar pulled toward the upper abdomen with a wide pronated grip, elbows traveling out and back while shoulders stay down.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 121. Remo Sentado en Cable Agarre Neutro

Archivo sugerido: `remo-sentado-en-cable-agarre-neutro.webp` · id `f8f0a37d-ca01-4ac6-945b-21f6199f1b32`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at chest/hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Seated Cable Row Neutral Grip (Remo Sentado en Cable Agarre Neutro)
Freeze ONE single representative moment of the exercise: Seated at a low cable row with torso upright and knees softly bent; close neutral-grip handle pulled toward the lower ribs/upper abdomen, elbows tucked close to the body and cable horizontal.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 122. Remo T-Bar

Archivo sugerido: `remo-t-bar.webp` · id `5081ae59-9021-45c7-bb67-194d5b934692`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height, landmine anchor visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: T-Bar Row (Remo T-Bar)
Freeze ONE single representative moment of the exercise: Standing over a landmine/T-bar setup in a strong hip hinge; close neutral T-bar handle pulled toward the lower chest/upper abdomen, elbows traveling back, spine neutral and plates visible on the bar end.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 123. Remo T-Bar con Pecho Apoyado

Archivo sugerido: `remo-t-bar-con-pecho-apoyado.webp` · id `eb5d83ed-952e-45c8-a50a-634be7293fdc`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Chest-Supported T-Bar Row (Remo T-Bar con Pecho Apoyado)
Freeze ONE single representative moment of the exercise: Chest supported on the angled pad of a plate-loaded T-bar row machine; neutral handles pulled toward the lower chest/ribs, elbows behind the torso and body firmly supported.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 124. Rodillo de Muñeca

Archivo sugerido: `rodillo-de-muneca.webp` · id `e7f6a2d9-cad1-4916-84c7-3c6539f15165`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at forearm height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Wrist Roller (Rodillo de Muñeca)
Freeze ONE single representative moment of the exercise: Standing holding a wrist roller with both arms extended forward around shoulder height; a rope with a small weight plate hangs from the center and is partially wound around the roller, wrists actively turning while elbows stay nearly straight.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 125. Rompecráneos con Barra EZ

Archivo sugerido: `rompecraneos-con-barra-ez.webp` · id `cd041515-c7a1-4b33-9190-880c019808d6`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at bench/head height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: EZ-Bar Skull Crusher (Rompecráneos con Barra EZ)
Freeze ONE single representative moment of the exercise: Lying face up on a flat bench holding an EZ bar above the head; upper arms angled slightly back from vertical and elbows flexed so the bar is lowered near the forehead/top of the head, shoulders stable and elbows pointing mostly upward.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 126. Rotación de Tronco en Cable

Archivo sugerido: `rotacion-de-tronco-en-cable.webp` · id `8c92e9bb-aa28-42b9-8e3b-1cd767bafa8f`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, cable direction clearly visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Cable Trunk Rotation (Rotación de Tronco en Cable)
Freeze ONE single representative moment of the exercise: Standing perpendicular to a cable stack with the pulley at chest height, both hands holding one handle and arms extended; torso rotated horizontally away from the stack through the hips and upper back while pelvis and feet pivot naturally, cable taut and lower back neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 127. Rueda Abdominal

Archivo sugerido: `rueda-abdominal.webp` · id `eaeb8f46-b21f-4a14-977d-84fccae59656`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at knee height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Ab Wheel Rollout (Rueda Abdominal)
Freeze ONE single representative moment of the exercise: Kneeling on a pad with both hands on an ab wheel rolled far forward; arms extended, shoulders and hips forming a long straight line toward the knees, ribs down, pelvis slightly tucked and lower back neutral without sagging.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 128. Sentadilla Búlgara - Sesgo Cuádriceps

Archivo sugerido: `sentadilla-bulgara-sesgo-cuadriceps.webp` · id `112bda40-c1fc-4c62-a72a-a1f2c33e15f7`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bulgarian Split Squat - Quad Bias (Sentadilla Búlgara - Sesgo Cuádriceps)
Freeze ONE single representative moment of the exercise: At the bottom of a Bulgarian split squat with rear foot elevated on a bench, dumbbells at the sides; front foot placed relatively closer, torso upright and front knee allowed to travel forward over the toes while heel stays down, emphasizing knee flexion.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 129. Sentadilla Búlgara - Sesgo Glúteo

Archivo sugerido: `sentadilla-bulgara-sesgo-gluteo.webp` · id `7410f3a3-d899-4fa0-8084-b1d99b3aa971`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bulgarian Split Squat - Glute Bias (Sentadilla Búlgara - Sesgo Glúteo)
Freeze ONE single representative moment of the exercise: At the bottom of a Bulgarian split squat with rear foot elevated on a bench, dumbbells at the sides; front foot placed farther forward, torso leaning slightly forward from the hips, front shin more vertical and hips sitting back to emphasize the glutes.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 130. Sentadilla en Smith

Archivo sugerido: `sentadilla-en-smith.webp` · id `c5f5ab48-ca8e-4887-98b3-6fcd57f0816a`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Smith Machine Squat (Sentadilla en Smith)
Freeze ONE single representative moment of the exercise: At the bottom of a Smith-machine squat with bar across the upper back, feet placed slightly forward of the bar path, knees tracking over toes and hips lowered to around parallel; torso braced and Smith rails perfectly vertical.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 131. Sentadilla Frontal

Archivo sugerido: `sentadilla-frontal.webp` · id `af842bf3-37c4-4252-90dc-c8acb3d79873`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Front Squat (Sentadilla Frontal)
Freeze ONE single representative moment of the exercise: At the bottom of a front squat with Olympic bar in a secure front-rack position across the front shoulders, elbows high, feet flat, knees tracking over toes and torso very upright.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 132. Sentadilla Goblet

Archivo sugerido: `sentadilla-goblet.webp` · id `c181333a-8fc6-403f-a707-c36056759a3f`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Goblet Squat (Sentadilla Goblet)
Freeze ONE single representative moment of the exercise: At the bottom of a goblet squat holding one dumbbell vertically against the chest with both hands; feet flat, knees tracking over toes, elbows inside or just in front of the knees, torso upright.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 133. Sentadilla Trasera

Archivo sugerido: `sentadilla-trasera.webp` · id `4f54d023-d529-416f-8faf-7a5c8791d172`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Barbell Back Squat (Sentadilla Trasera)
Freeze ONE single representative moment of the exercise: At the bottom of a back squat with Olympic bar securely across the upper back, feet flat, knees tracking over toes, hips around or slightly below parallel and spine neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 134. Split Squat

Archivo sugerido: `split-squat.webp` · id `92001e5e-6a5e-4464-8eb8-d550861a0b54`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Split Squat
Freeze ONE single representative moment of the exercise: At the bottom of a stationary split squat with one foot forward and one foot back, dumbbells hanging at the sides; both knees flexed, front foot fully planted and rear heel raised, torso controlled with no stepping motion.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 135. Step-Up Alto con Sesgo Glúteo

Archivo sugerido: `step-up-alto-con-sesgo-gluteo.webp` · id `3ffb5c23-21b7-4d38-9768-c3ab9c297cb4`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height, box height clearly visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: High Step-Up - Glute Bias (Step-Up Alto con Sesgo Glúteo)
Freeze ONE single representative moment of the exercise: Midway through a high step-up onto a sturdy box: right foot fully planted on a box high enough that the starting right knee is around hip height, torso leaning slightly forward, right leg driving the body upward while the left foot is clearly off the floor and not pushing.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 136. Woodchop Alto-Bajo

Archivo sugerido: `woodchop-alto-bajo.webp` · id `06ac38a1-6b6d-46d9-9471-8870ad45e5c9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, high cable origin visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: High-to-Low Cable Woodchop (Woodchop Alto-Bajo)
Freeze ONE single representative moment of the exercise: Standing with a cable anchored high on the left, both hands holding one handle; arms travel diagonally from high-left to low-right and finish near the right hip while torso and hips rotate together, cable taut and spine controlled.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 137. Zancada Inversa

Archivo sugerido: `zancada-inversa.webp` · id `211cb236-151e-44a0-8430-9dccce7bd0a3`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Reverse Lunge (Zancada Inversa)
Freeze ONE single representative moment of the exercise: At the bottom of a reverse lunge after stepping the right foot backward, left foot fully planted in front, both knees flexed and dumbbells at the sides; torso stable with a slight natural forward lean and front knee tracking over toes.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```


## Cardio

### 138. Air Bike

Archivo sugerido: `air-bike.webp` · id `d476f58e-149a-4535-aff4-63874dbb057e`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Air Bike
Freeze ONE single representative moment of the exercise: Seated on a fan/air bike in active mid-cycle: right leg pushing the pedal down while left arm pushes one moving handle forward and right arm pulls the opposite handle back; torso upright and fan wheel clearly visible.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 139. Bicicleta Estática

Archivo sugerido: `bicicleta-estatica.webp` · id `0fc5392c-ddac-4505-9f07-3ce9fea1c0bf`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Stationary Bike (Bicicleta Estática)
Freeze ONE single representative moment of the exercise: Seated correctly on a stationary bike with saddle adjusted appropriately; one pedal near the bottom with a slight knee bend, hands resting naturally on the handlebars and torso in a comfortable neutral cycling posture.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 140. Caminata en Cinta

Archivo sugerido: `caminata-en-cinta.webp` · id `d781fbfe-de0b-4282-a5eb-1136cc4e7350`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Treadmill Walking (Caminata en Cinta)
Freeze ONE single representative moment of the exercise: Walking naturally on a flat treadmill in mid-stride, one heel approaching contact and opposite arm swinging forward; torso tall, eyes forward and hands not holding the rails.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 141. Caminata Inclinada en Cinta

Archivo sugerido: `caminata-inclinada-en-cinta.webp` · id `0fa983b1-160a-419d-b508-8d5cae4f6ebd`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height, treadmill incline clearly visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Incline Treadmill Walking (Caminata Inclinada en Cinta)
Freeze ONE single representative moment of the exercise: Walking on a visibly inclined treadmill deck in mid-stride with a slight whole-body forward angle from the ankles, not the waist; hands free from the rails and posture controlled.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 142. Carrera en Cinta

Archivo sugerido: `carrera-en-cinta.webp` · id `eda832b9-5a7a-49a3-a18e-1662913c97c9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Treadmill Running (Carrera en Cinta)
Freeze ONE single representative moment of the exercise: Running on a treadmill in a natural mid-stride with one foot under the center of mass, opposite leg in swing and elbows bent around 90 degrees; torso tall and hands not touching the rails.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 143. Elíptica

Archivo sugerido: `eliptica.webp` · id `b0dead4b-ca38-4903-b294-6bc1cefc4aaa`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Elliptical Trainer (Elíptica)
Freeze ONE single representative moment of the exercise: Standing on an elliptical trainer with one foot forward and the opposite foot back while the reciprocal handles move in the opposite pattern; torso upright, knees aligned and heels supported on the pedals.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 144. Escaladora

Archivo sugerido: `escaladora.webp` · id `290778aa-949f-4af6-ad42-25df0d2f92bf`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Stair Climber (Escaladora)
Freeze ONE single representative moment of the exercise: Using a stair-climber with one foot firmly on a higher rotating step and the other transitioning to the next step; torso upright, hips level and hands either free or only lightly touching the rails.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 145. Remo Ergómetro

Archivo sugerido: `remo-ergometro.webp` · id `22f7fbe9-15f5-4ee8-8336-1d68e52bd8b0`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Rowing Ergometer (Remo Ergómetro)
Freeze ONE single representative moment of the exercise: Seated on a rowing ergometer in the finish position: legs nearly straight, torso leaned back only slightly from the hips, handle drawn to the lower ribs, elbows back, shoulders relaxed and chain aligned straight into the flywheel.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```


## Estiramiento

### 146. Estiramiento de Cuádriceps

Archivo sugerido: `estiramiento-de-cuadriceps.webp` · id `bff71b29-c365-4b44-ab49-d1b735f36ea0`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Standing Quadriceps Stretch (Estiramiento de Cuádriceps)
Freeze ONE single representative moment of the exercise: Standing tall while lightly holding a support with the left hand; right knee bent so the right heel is drawn toward the glute and the right ankle/foot is held with the right hand, knees close together and pelvis neutral.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 147. Estiramiento de Dorsal en Banco

Archivo sugerido: `estiramiento-de-dorsal-en-banco.webp` · id `065ea689-b5ea-427e-afd5-dbb8c611d8d9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at knee/bench height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Bench Lat Stretch (Estiramiento de Dorsal en Banco)
Freeze ONE single representative moment of the exercise: Kneeling in front of a flat bench with elbows/forearms resting on the bench and hands together; hips pushed back while chest sinks gently between the arms, spine long and shoulders flexed to create a lat stretch without lumbar overextension.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 148. Estiramiento de Flexor de Cadera

Archivo sugerido: `estiramiento-de-flexor-de-cadera.webp` · id `22816682-d48c-4d01-911b-171716547b12`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Half-Kneeling Hip Flexor Stretch (Estiramiento de Flexor de Cadera)
Freeze ONE single representative moment of the exercise: Half-kneeling with the right knee on a pad behind and left foot forward; pelvis gently posteriorly tilted, glutes engaged on the kneeling side, torso upright and body shifted slightly forward without arching the lower back.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 149. Estiramiento de Gemelo en Pared

Archivo sugerido: `estiramiento-de-gemelo-en-pared.webp` · id `a4d39464-5ac8-47f0-89de-c90a788378a9`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side profile view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Wall Calf Stretch (Estiramiento de Gemelo en Pared)
Freeze ONE single representative moment of the exercise: Facing a wall in a split stance with both hands on the wall; rear leg straight, rear heel firmly on the floor and toes pointing forward while front knee bends toward the wall, torso aligned and pelvis square.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 150. Estiramiento de Isquiotibiales

Archivo sugerido: `estiramiento-de-isquiotibiales.webp` · id `1ba90014-f510-4a90-9e9b-a478b7fb9398`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, side three-quarter view at hip height. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Hamstring Stretch (Estiramiento de Isquiotibiales)
Freeze ONE single representative moment of the exercise: Seated on the floor for a single-leg hamstring stretch with the right leg extended and left knee comfortably bent; torso hinges forward from the hips toward the right leg with a long neutral spine rather than rounding aggressively.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```

### 151. Estiramiento de Pectoral en Marco

Archivo sugerido: `estiramiento-de-pectoral-en-marco.webp` · id `71a43f01-b08a-4fb2-a6e5-33167c416fbf`

```text
Create a photorealistic instructional fitness image for a premium workout app.
Use the same adult fitness instructor from the supplied reference image if one is provided; preserve the face, body proportions, hairstyle, skin tone and outfit. If no reference is provided, use one adult athletic instructor with a natural, realistic physique. Outfit: fitted slate-gray training shirt, black shorts and neutral training shoes, no logos.
Environment: minimalist professional gym studio, matte charcoal-gray background, black rubber flooring, soft diffused studio lighting, subtle separation light, no mirrors, no clutter and no other people.
Composition: vertical 9:16, front three-quarter view at chest height, doorway frame visible. Keep the full body and all exercise-relevant equipment visible, centered, with safe margin around hands, feet, weights, cables and machine parts. Natural perspective, approximately 50 mm full-frame equivalent, no wide-angle distortion.
Exercise: Doorway Chest Stretch (Estiramiento de Pectoral en Marco)
Freeze ONE single representative moment of the exercise: Standing beside a doorway with the right forearm placed vertically on the frame, elbow bent about 90 degrees at shoulder height; torso gently turned away from the right arm, shoulder down and chest open without forcing the joint.
Technical accuracy is more important than drama: anatomically plausible joints, realistic grip, correct body-to-equipment contact, physically plausible machine geometry and cable/bar path, stable posture and no exaggerated range of motion.
One still frame only. Do not show multiple phases, ghost limbs or a motion sequence. Do not include text, arrows, labels, app UI, logos, watermarks, motion blur, extra limbs or fingers, duplicated weights, bent bars, broken cables or impossible equipment geometry.
```
