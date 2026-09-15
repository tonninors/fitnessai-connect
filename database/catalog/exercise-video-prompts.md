# Prompts de vídeo del catálogo (151 ejercicios)

Generado por `node backend/scripts/generate-video-prompts.mjs` a partir de
`exercises_v2_science_based.csv` (datos del gesto) y `exercises-media.json`
(ids y slugs reales de Supabase). No editar a mano: regenerar.

## Cómo usarlos

1. **Un prompt por generación.** Los modelos de vídeo producen un clip por
   petición; copia el bloque completo, incluida la parte fija (es la que hace
   que los 151 clips parezcan una misma serie).
2. En Gemini: modo *Vídeos*, formato **vertical (9:16)** si lo ofrece, 8 s.
3. **Genera 2 variantes y quédate con la de mejor técnica.** Revisa a mano:
   articulaciones (codos, rodillas), trayectoria, que haga las repeticiones
   pedidas y que termine en la posición inicial (así el bucle no salta).
4. Guarda cada clip con el **nombre de archivo indicado** (`<slug>.mp4`) y
   súbelo al bucket `exercise-media`. El script de carga casa el archivo con
   su ejercicio por ese nombre.
5. Misma persona en todos los clips no está garantizada entre generaciones.
   Si la consistencia importa, genera primero una imagen de referencia del
   instructor en el estudio y usa *imagen → vídeo* con ella.
6. **Si Gemini rechaza un prompt** ("I can't generate that video"), casi
   siempre es el filtro de personas, no el ejercicio. Por este orden: quita
   la frase del ángulo de cámara que menciona "behind"; quita "in plain dark
   training clothes"; y como último recurso pega sólo el bloque del ejercicio
   (desde "Exercise:") precedido de "Instructional fitness video, vertical".

## Índice

**Calentamiento** (6)

- 1. [Balanceo de Pierna Anterior-Posterior](#ex-balanceo-de-pierna-anterior-posterior) · `balanceo-de-pierna-anterior-posterior.mp4`
- 2. [Dislocación de Hombro con Banda](#ex-dislocacion-de-hombro-con-banda) · `dislocacion-de-hombro-con-banda.mp4`
- 3. [Dorsiflexión de Tobillo Rodilla a Pared](#ex-dorsiflexion-de-tobillo-rodilla-a-pared) · `dorsiflexion-de-tobillo-rodilla-a-pared.mp4`
- 4. [Gato-Camello](#ex-gato-camello) · `gato-camello.mp4`
- 5. [Movilidad de Cadera 90/90](#ex-movilidad-de-cadera-90-90) · `movilidad-de-cadera-90-90.mp4`
- 6. [Rotación Externa de Hombro con Banda](#ex-rotacion-externa-de-hombro-con-banda) · `rotacion-externa-de-hombro-con-banda.mp4`

**Entrenamiento** (131)

- 7. [Abducción de Cadera con Banda](#ex-abduccion-de-cadera-con-banda) · `abduccion-de-cadera-con-banda.mp4`
- 8. [Abducción de Cadera en Cable](#ex-abduccion-de-cadera-en-cable) · `abduccion-de-cadera-en-cable.mp4`
- 9. [Abducción de Cadera en Máquina](#ex-abduccion-de-cadera-en-maquina) · `abduccion-de-cadera-en-maquina.mp4`
- 10. [Aducción de Cadera en Cable](#ex-aduccion-de-cadera-en-cable) · `aduccion-de-cadera-en-cable.mp4`
- 11. [Aducción de Cadera en Máquina](#ex-aduccion-de-cadera-en-maquina) · `aduccion-de-cadera-en-maquina.mp4`
- 12. [Apertura Posterior en Cable](#ex-apertura-posterior-en-cable) · `apertura-posterior-en-cable.mp4`
- 13. [Aperturas con Mancuernas](#ex-aperturas-con-mancuernas) · `aperturas-con-mancuernas.mp4`
- 14. [Aperturas en Cable a Media Altura](#ex-aperturas-en-cable-a-media-altura) · `aperturas-en-cable-a-media-altura.mp4`
- 15. [Aperturas en Cable Bajo-Alto](#ex-aperturas-en-cable-bajo-alto) · `aperturas-en-cable-bajo-alto.mp4`
- 16. [Belt Squat](#ex-belt-squat) · `belt-squat.mp4`
- 17. [Bird Dog](#ex-bird-dog) · `bird-dog.mp4`
- 18. [Buenos Días con Barra](#ex-buenos-dias-con-barra) · `buenos-dias-con-barra.mp4`
- 19. [Caminata del Granjero](#ex-caminata-del-granjero) · `caminata-del-granjero.mp4`
- 20. [Colgado Pasivo](#ex-colgado-pasivo) · `colgado-pasivo.mp4`
- 21. [Crunch en Cable](#ex-crunch-en-cable) · `crunch-en-cable.mp4`
- 22. [Crunch en Máquina](#ex-crunch-en-maquina) · `crunch-en-maquina.mp4`
- 23. [Crunch en Suelo](#ex-crunch-en-suelo) · `crunch-en-suelo.mp4`
- 24. [Crunch Inverso](#ex-crunch-inverso) · `crunch-inverso.mp4`
- 25. [Curl Bayesiano](#ex-curl-bayesiano) · `curl-bayesiano.mp4`
- 26. [Curl con Barra](#ex-curl-con-barra) · `curl-con-barra.mp4`
- 27. [Curl con Barra EZ](#ex-curl-con-barra-ez) · `curl-con-barra-ez.mp4`
- 28. [Curl con Mancuernas](#ex-curl-con-mancuernas) · `curl-con-mancuernas.mp4`
- 29. [Curl de Muñeca](#ex-curl-de-muneca) · `curl-de-muneca.mp4`
- 30. [Curl en Cable de Pie](#ex-curl-en-cable-de-pie) · `curl-en-cable-de-pie.mp4`
- 31. [Curl Femoral de Pie Unilateral](#ex-curl-femoral-de-pie-unilateral) · `curl-femoral-de-pie-unilateral.mp4`
- 32. [Curl Femoral Sentado](#ex-curl-femoral-sentado) · `curl-femoral-sentado.mp4`
- 33. [Curl Femoral Tumbado](#ex-curl-femoral-tumbado) · `curl-femoral-tumbado.mp4`
- 34. [Curl Inclinado con Mancuernas](#ex-curl-inclinado-con-mancuernas) · `curl-inclinado-con-mancuernas.mp4`
- 35. [Curl Inverso](#ex-curl-inverso) · `curl-inverso.mp4`
- 36. [Curl Martillo](#ex-curl-martillo) · `curl-martillo.mp4`
- 37. [Curl Nórdico](#ex-curl-nordico) · `curl-nordico.mp4`
- 38. [Curl Predicador](#ex-curl-predicador) · `curl-predicador.mp4`
- 39. [Curl Spider](#ex-curl-spider) · `curl-spider.mp4`
- 40. [Dead Bug](#ex-dead-bug) · `dead-bug.mp4`
- 41. [Dominada Prona](#ex-dominada-prona) · `dominada-prona.mp4`
- 42. [Dominada Supina](#ex-dominada-supina) · `dominada-supina.mp4`
- 43. [Elevación de Piernas Colgado](#ex-elevacion-de-piernas-colgado) · `elevacion-de-piernas-colgado.mp4`
- 44. [Elevación de Talón Unilateral](#ex-elevacion-de-talon-unilateral) · `elevacion-de-talon-unilateral.mp4`
- 45. [Elevación de Talones de Pie](#ex-elevacion-de-talones-de-pie) · `elevacion-de-talones-de-pie.mp4`
- 46. [Elevación de Talones Sentado](#ex-elevacion-de-talones-sentado) · `elevacion-de-talones-sentado.mp4`
- 47. [Elevación de Tibial Anterior](#ex-elevacion-de-tibial-anterior) · `elevacion-de-tibial-anterior.mp4`
- 48. [Elevación Donkey](#ex-elevacion-donkey) · `elevacion-donkey.mp4`
- 49. [Elevación Frontal](#ex-elevacion-frontal) · `elevacion-frontal.mp4`
- 50. [Elevación Lateral con Mancuernas](#ex-elevacion-lateral-con-mancuernas) · `elevacion-lateral-con-mancuernas.mp4`
- 51. [Elevación Lateral en Cable](#ex-elevacion-lateral-en-cable) · `elevacion-lateral-en-cable.mp4`
- 52. [Elevación Lateral en Cable Inclinado](#ex-elevacion-lateral-en-cable-inclinado) · `elevacion-lateral-en-cable-inclinado.mp4`
- 53. [Elevación Lateral en Máquina](#ex-elevacion-lateral-en-maquina) · `elevacion-lateral-en-maquina.mp4`
- 54. [Encogimientos con Barra](#ex-encogimientos-con-barra) · `encogimientos-con-barra.mp4`
- 55. [Extensión Cruzada de Tríceps en Cable](#ex-extension-cruzada-de-triceps-en-cable) · `extension-cruzada-de-triceps-en-cable.mp4`
- 56. [Extensión de Muñeca](#ex-extension-de-muneca) · `extension-de-muneca.mp4`
- 57. [Extensión de Rodilla en Máquina](#ex-extension-de-rodilla-en-maquina) · `extension-de-rodilla-en-maquina.mp4`
- 58. [Extensión de Tríceps en Polea con Barra](#ex-extension-de-triceps-en-polea-con-barra) · `extension-de-triceps-en-polea-con-barra.mp4`
- 59. [Extensión de Tríceps en Polea con Cuerda](#ex-extension-de-triceps-en-polea-con-cuerda) · `extension-de-triceps-en-polea-con-cuerda.mp4`
- 60. [Extensión de Tríceps sobre Cabeza con Cuerda](#ex-extension-de-triceps-sobre-cabeza-con-cuerda) · `extension-de-triceps-sobre-cabeza-con-cuerda.mp4`
- 61. [Extensión Unilateral sobre Cabeza en Cable](#ex-extension-unilateral-sobre-cabeza-en-cable) · `extension-unilateral-sobre-cabeza-en-cable.mp4`
- 62. [Face Pull](#ex-face-pull) · `face-pull.mp4`
- 63. [Flexiones de Brazos](#ex-flexiones-de-brazos) · `flexiones-de-brazos.mp4`
- 64. [Fondos con Sesgo a Pecho](#ex-fondos-con-sesgo-a-pecho) · `fondos-con-sesgo-a-pecho.mp4`
- 65. [Fondos con Sesgo a Tríceps](#ex-fondos-con-sesgo-a-triceps) · `fondos-con-sesgo-a-triceps.mp4`
- 66. [Fondos en Máquina](#ex-fondos-en-maquina) · `fondos-en-maquina.mp4`
- 67. [Gemelos en Prensa](#ex-gemelos-en-prensa) · `gemelos-en-prensa.mp4`
- 68. [Hack Squat](#ex-hack-squat) · `hack-squat.mp4`
- 69. [Hip Thrust con Barra](#ex-hip-thrust-con-barra) · `hip-thrust-con-barra.mp4`
- 70. [Hip Thrust en Smith](#ex-hip-thrust-en-smith) · `hip-thrust-en-smith.mp4`
- 71. [Hiperextensión 45° con Sesgo Femoral](#ex-hiperextension-45-con-sesgo-femoral) · `hiperextension-45-con-sesgo-femoral.mp4`
- 72. [Hiperextensión 45° con Sesgo Glúteo](#ex-hiperextension-45-con-sesgo-gluteo) · `hiperextension-45-con-sesgo-gluteo.mp4`
- 73. [Hiperextensión Inversa](#ex-hiperextension-inversa) · `hiperextension-inversa.mp4`
- 74. [Hollow Body Hold](#ex-hollow-body-hold) · `hollow-body-hold.mp4`
- 75. [Jalón al Pecho Agarre Neutro](#ex-jalon-al-pecho-agarre-neutro) · `jalon-al-pecho-agarre-neutro.mp4`
- 76. [Jalón al Pecho Prono](#ex-jalon-al-pecho-prono) · `jalon-al-pecho-prono.mp4`
- 77. [Jalón con Brazos Rectos](#ex-jalon-con-brazos-rectos) · `jalon-con-brazos-rectos.mp4`
- 78. [Pájaros con Mancuernas](#ex-pajaros-con-mancuernas) · `pajaros-con-mancuernas.mp4`
- 79. [Patada de Glúteo en Cable](#ex-patada-de-gluteo-en-cable) · `patada-de-gluteo-en-cable.mp4`
- 80. [Pec Deck](#ex-pec-deck) · `pec-deck.mp4`
- 81. [Pec Deck Inverso](#ex-pec-deck-inverso) · `pec-deck-inverso.mp4`
- 82. [Pendulum Squat](#ex-pendulum-squat) · `pendulum-squat.mp4`
- 83. [Peso Muerto Piernas Rígidas](#ex-peso-muerto-piernas-rigidas) · `peso-muerto-piernas-rigidas.mp4`
- 84. [Peso Muerto Rumano con Barra](#ex-peso-muerto-rumano-con-barra) · `peso-muerto-rumano-con-barra.mp4`
- 85. [Peso Muerto Rumano con Mancuernas](#ex-peso-muerto-rumano-con-mancuernas) · `peso-muerto-rumano-con-mancuernas.mp4`
- 86. [Pinza de Discos](#ex-pinza-de-discos) · `pinza-de-discos.mp4`
- 87. [Plancha](#ex-plancha) · `plancha.mp4`
- 88. [Plancha Copenhagen](#ex-plancha-copenhagen) · `plancha-copenhagen.mp4`
- 89. [Plancha Lateral](#ex-plancha-lateral) · `plancha-lateral.mp4`
- 90. [Prensa 45 Grados](#ex-prensa-45-grados) · `prensa-45-grados.mp4`
- 91. [Prensa Horizontal](#ex-prensa-horizontal) · `prensa-horizontal.mp4`
- 92. [Press Arnold](#ex-press-arnold) · `press-arnold.mp4`
- 93. [Press Banca Agarre Cerrado](#ex-press-banca-agarre-cerrado) · `press-banca-agarre-cerrado.mp4`
- 94. [Press Banca con Barra](#ex-press-banca-con-barra) · `press-banca-con-barra.mp4`
- 95. [Press Banca con Mancuernas](#ex-press-banca-con-mancuernas) · `press-banca-con-mancuernas.mp4`
- 96. [Press Banca en Smith](#ex-press-banca-en-smith) · `press-banca-en-smith.mp4`
- 97. [Press de Hombro con Mancuernas Sentado](#ex-press-de-hombro-con-mancuernas-sentado) · `press-de-hombro-con-mancuernas-sentado.mp4`
- 98. [Press de Hombro en Máquina](#ex-press-de-hombro-en-maquina) · `press-de-hombro-en-maquina.mp4`
- 99. [Press de Pecho en Máquina](#ex-press-de-pecho-en-maquina) · `press-de-pecho-en-maquina.mp4`
- 100. [Press Declinado con Barra](#ex-press-declinado-con-barra) · `press-declinado-con-barra.mp4`
- 101. [Press Francés con Mancuerna](#ex-press-frances-con-mancuerna) · `press-frances-con-mancuerna.mp4`
- 102. [Press Inclinado con Barra](#ex-press-inclinado-con-barra) · `press-inclinado-con-barra.mp4`
- 103. [Press Inclinado con Mancuernas](#ex-press-inclinado-con-mancuernas) · `press-inclinado-con-mancuernas.mp4`
- 104. [Press Inclinado en Máquina](#ex-press-inclinado-en-maquina) · `press-inclinado-en-maquina.mp4`
- 105. [Press Inclinado en Smith](#ex-press-inclinado-en-smith) · `press-inclinado-en-smith.mp4`
- 106. [Press Militar con Barra](#ex-press-militar-con-barra) · `press-militar-con-barra.mp4`
- 107. [Press Pallof](#ex-press-pallof) · `press-pallof.mp4`
- 108. [Pronación y Supinación con Mancuerna](#ex-pronacion-y-supinacion-con-mancuerna) · `pronacion-y-supinacion-con-mancuerna.mp4`
- 109. [Puente de Glúteos](#ex-puente-de-gluteos) · `puente-de-gluteos.mp4`
- 110. [Pull-Through en Cable](#ex-pull-through-en-cable) · `pull-through-en-cable.mp4`
- 111. [Pullover con Mancuerna](#ex-pullover-con-mancuerna) · `pullover-con-mancuerna.mp4`
- 112. [Pullover en Máquina](#ex-pullover-en-maquina) · `pullover-en-maquina.mp4`
- 113. [Remo Alto Iso-Lateral](#ex-remo-alto-iso-lateral) · `remo-alto-iso-lateral.mp4`
- 114. [Remo con Barra](#ex-remo-con-barra) · `remo-con-barra.mp4`
- 115. [Remo con Mancuerna a una Mano](#ex-remo-con-mancuerna-a-una-mano) · `remo-con-mancuerna-a-una-mano.mp4`
- 116. [Remo con Mancuernas Pecho Apoyado](#ex-remo-con-mancuernas-pecho-apoyado) · `remo-con-mancuernas-pecho-apoyado.mp4`
- 117. [Remo en Máquina con Pecho Apoyado](#ex-remo-en-maquina-con-pecho-apoyado) · `remo-en-maquina-con-pecho-apoyado.mp4`
- 118. [Remo Meadows](#ex-remo-meadows) · `remo-meadows.mp4`
- 119. [Remo Pendlay](#ex-remo-pendlay) · `remo-pendlay.mp4`
- 120. [Remo Sentado en Cable Agarre Amplio](#ex-remo-sentado-en-cable-agarre-amplio) · `remo-sentado-en-cable-agarre-amplio.mp4`
- 121. [Remo Sentado en Cable Agarre Neutro](#ex-remo-sentado-en-cable-agarre-neutro) · `remo-sentado-en-cable-agarre-neutro.mp4`
- 122. [Remo T-Bar](#ex-remo-t-bar) · `remo-t-bar.mp4`
- 123. [Remo T-Bar con Pecho Apoyado](#ex-remo-t-bar-con-pecho-apoyado) · `remo-t-bar-con-pecho-apoyado.mp4`
- 124. [Rodillo de Muñeca](#ex-rodillo-de-muneca) · `rodillo-de-muneca.mp4`
- 125. [Rompecráneos con Barra EZ](#ex-rompecraneos-con-barra-ez) · `rompecraneos-con-barra-ez.mp4`
- 126. [Rotación de Tronco en Cable](#ex-rotacion-de-tronco-en-cable) · `rotacion-de-tronco-en-cable.mp4`
- 127. [Rueda Abdominal](#ex-rueda-abdominal) · `rueda-abdominal.mp4`
- 128. [Sentadilla Búlgara - Sesgo Cuádriceps](#ex-sentadilla-bulgara-sesgo-cuadriceps) · `sentadilla-bulgara-sesgo-cuadriceps.mp4`
- 129. [Sentadilla Búlgara - Sesgo Glúteo](#ex-sentadilla-bulgara-sesgo-gluteo) · `sentadilla-bulgara-sesgo-gluteo.mp4`
- 130. [Sentadilla en Smith](#ex-sentadilla-en-smith) · `sentadilla-en-smith.mp4`
- 131. [Sentadilla Frontal](#ex-sentadilla-frontal) · `sentadilla-frontal.mp4`
- 132. [Sentadilla Goblet](#ex-sentadilla-goblet) · `sentadilla-goblet.mp4`
- 133. [Sentadilla Trasera](#ex-sentadilla-trasera) · `sentadilla-trasera.mp4`
- 134. [Split Squat](#ex-split-squat) · `split-squat.mp4`
- 135. [Step-Up Alto con Sesgo Glúteo](#ex-step-up-alto-con-sesgo-gluteo) · `step-up-alto-con-sesgo-gluteo.mp4`
- 136. [Woodchop Alto-Bajo](#ex-woodchop-alto-bajo) · `woodchop-alto-bajo.mp4`
- 137. [Zancada Inversa](#ex-zancada-inversa) · `zancada-inversa.mp4`

**Cardio** (8)

- 138. [Air Bike](#ex-air-bike) · `air-bike.mp4`
- 139. [Bicicleta Estática](#ex-bicicleta-estatica) · `bicicleta-estatica.mp4`
- 140. [Caminata en Cinta](#ex-caminata-en-cinta) · `caminata-en-cinta.mp4`
- 141. [Caminata Inclinada en Cinta](#ex-caminata-inclinada-en-cinta) · `caminata-inclinada-en-cinta.mp4`
- 142. [Carrera en Cinta](#ex-carrera-en-cinta) · `carrera-en-cinta.mp4`
- 143. [Elíptica](#ex-eliptica) · `eliptica.mp4`
- 144. [Escaladora](#ex-escaladora) · `escaladora.mp4`
- 145. [Remo Ergómetro](#ex-remo-ergometro) · `remo-ergometro.mp4`

**Estiramiento** (6)

- 146. [Estiramiento de Cuádriceps](#ex-estiramiento-de-cuadriceps) · `estiramiento-de-cuadriceps.mp4`
- 147. [Estiramiento de Dorsal en Banco](#ex-estiramiento-de-dorsal-en-banco) · `estiramiento-de-dorsal-en-banco.mp4`
- 148. [Estiramiento de Flexor de Cadera](#ex-estiramiento-de-flexor-de-cadera) · `estiramiento-de-flexor-de-cadera.mp4`
- 149. [Estiramiento de Gemelo en Pared](#ex-estiramiento-de-gemelo-en-pared) · `estiramiento-de-gemelo-en-pared.mp4`
- 150. [Estiramiento de Isquiotibiales](#ex-estiramiento-de-isquiotibiales) · `estiramiento-de-isquiotibiales.mp4`
- 151. [Estiramiento de Pectoral en Marco](#ex-estiramiento-de-pectoral-en-marco) · `estiramiento-de-pectoral-en-marco.mp4`

## Calentamiento (6)

<a id="ex-balanceo-de-pierna-anterior-posterior"></a>

### 1. Balanceo de Pierna Anterior-Posterior

Archivo: `balanceo-de-pierna-anterior-posterior.mp4` · id `cc380b2e-0dbc-463c-a19a-5cb8de020373` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Leg Swing Front-to-Back (Balanceo de Pierna Anterior-Posterior).
Equipment: no equipment, bodyweight only.
Position: standing, holding a support for balance.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: swing one straight leg forward and backward in a controlled arc, increasing the range gradually. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: torso stays tall and still; movement comes from the hip; controlled, not ballistic.
```

<a id="ex-dislocacion-de-hombro-con-banda"></a>

### 2. Dislocación de Hombro con Banda

Archivo: `dislocacion-de-hombro-con-banda.mp4` · id `55f1deec-af72-4966-8cd7-eecb10aa707c` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Band Shoulder Dislocate (Dislocación de Hombro con Banda).
Equipment: resistance band.
Position: standing.
Handling: The band stays under tension throughout the movement.
Camera: side profile view, camera at chest height.
Movement: holding the band wide, raise it overhead and behind the body in a full arc, then bring it back to the front. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: arms stay straight; grip wide enough that the shoulders do not pinch; slow and smooth.
```

<a id="ex-dorsiflexion-de-tobillo-rodilla-a-pared"></a>

### 3. Dorsiflexión de Tobillo Rodilla a Pared

Archivo: `dorsiflexion-de-tobillo-rodilla-a-pared.mp4` · id `b272e048-a002-43a6-aa04-353c314f7f23` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Knee-to-Wall Ankle Dorsiflexion (Dorsiflexión de Tobillo Rodilla a Pared).
Equipment: no equipment, bodyweight only.
Position: split stance, one foot forward.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: drive the knee forward over the toes as far as possible with the heel on the floor, then return. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: heel stays down; knee tracks straight over the second toe; slow and controlled.
```

<a id="ex-gato-camello"></a>

### 4. Gato-Camello

Archivo: `gato-camello.mp4` · id `1f50eedc-85d7-4fe3-9551-7e63d3b41fcb` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cat-Cow (Gato-Camello).
Equipment: no equipment, bodyweight only.
Position: on all fours (hands and knees).
Camera: side profile view, camera low, at floor level.
Movement: round the whole spine upwards segment by segment, then reverse into a gentle extension. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: move one vertebra at a time; breathe out while rounding; neck follows the spine.
```

<a id="ex-movilidad-de-cadera-90-90"></a>

### 5. Movilidad de Cadera 90/90

Archivo: `movilidad-de-cadera-90-90.mp4` · id `d5d773b9-f0ca-42a0-a06b-e058e54176d5` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: 90/90 Hip Mobility (Movilidad de Cadera 90/90).
Equipment: no equipment, bodyweight only.
Position: seated.
Camera: front view, camera at hip height.
Movement: move both knees from one side to the other keeping the feet on the floor, rotating at the hips. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: torso stays tall; movement only at the hips; slow, controlled range.
```

<a id="ex-rotacion-externa-de-hombro-con-banda"></a>

### 6. Rotación Externa de Hombro con Banda

Archivo: `rotacion-externa-de-hombro-con-banda.mp4` · id `7b280a92-9ed0-4a07-bbb0-34a2ec650391` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Band Shoulder External Rotation (Rotación Externa de Hombro con Banda).
Equipment: resistance band.
Position: standing.
Handling: The band stays under tension throughout the movement.
Camera: front view, camera at chest height.
Movement: rotate the forearm outwards against the band keeping the elbow pinned to the side, then return. Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.
Key form cues: elbow stays glued to the ribs; wrist neutral; slow, small range.
```

## Entrenamiento (131)

<a id="ex-abduccion-de-cadera-con-banda"></a>

### 7. Abducción de Cadera con Banda

Archivo: `abduccion-de-cadera-con-banda.mp4` · id `d378ec19-b416-49d4-8089-66103900f3be` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Banded Hip Abduction (Abducción de Cadera con Banda).
Equipment: resistance band.
Position: standing (seated is also valid).
Handling: The band stays under tension throughout the movement.
Camera: front view, camera at hip height.
Movement: move the legs apart against the resistance, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso still; pause at the widest point; controlled return.
```

<a id="ex-abduccion-de-cadera-en-cable"></a>

### 8. Abducción de Cadera en Cable

Archivo: `abduccion-de-cadera-en-cable.mp4` · id `741f16b8-463a-456c-a940-df62d9ab3c3e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Hip Abduction (Abducción de Cadera en Cable).
Equipment: cable machine with ankle strap.
Position: standing, holding a support for balance.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front view, camera at hip height.
Movement: move the legs apart against the resistance, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso still; pause at the widest point; controlled return.
```

<a id="ex-abduccion-de-cadera-en-maquina"></a>

### 9. Abducción de Cadera en Máquina

Archivo: `abduccion-de-cadera-en-maquina.mp4` · id `a300846c-0b71-4c03-bf53-b2e8068289f8` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Hip Abduction (Abducción de Cadera en Máquina).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front view, camera at hip height.
Movement: move the legs apart against the resistance, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso still; pause at the widest point; controlled return.
```

<a id="ex-aduccion-de-cadera-en-cable"></a>

### 10. Aducción de Cadera en Cable

Archivo: `aduccion-de-cadera-en-cable.mp4` · id `dfb699d4-b628-470c-aa40-4cbfd200e0b3` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Hip Adduction (Aducción de Cadera en Cable).
Equipment: cable machine with ankle strap.
Position: standing, holding a support for balance.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front view, camera at hip height.
Movement: bring the legs together against the resistance, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso still; squeeze at the closed position; controlled return.
```

<a id="ex-aduccion-de-cadera-en-maquina"></a>

### 11. Aducción de Cadera en Máquina

Archivo: `aduccion-de-cadera-en-maquina.mp4` · id `3c5c02cb-f66c-4783-99c7-7f0aabd4bc5a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Hip Adduction (Aducción de Cadera en Máquina).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front view, camera at hip height.
Movement: bring the legs together against the resistance, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso still; squeeze at the closed position; controlled return.
```

<a id="ex-apertura-posterior-en-cable"></a>

### 12. Apertura Posterior en Cable

Archivo: `apertura-posterior-en-cable.mp4` · id `a62b4457-cf81-49ed-852e-cf7d81d2e263` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Rear Delt Fly (Apertura Posterior en Cable).
Equipment: cable machine with single D-handles.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: open the arms out to the sides against the resistance with a slight elbow bend, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: squeeze the shoulder blades together; arms stay slightly bent; no torso movement.
```

<a id="ex-aperturas-con-mancuernas"></a>

### 13. Aperturas con Mancuernas

Archivo: `aperturas-con-mancuernas.mp4` · id `1300e6fa-a661-4b9b-837e-2eafad622d5e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Aperturas con Mancuernas.
Equipment: dumbbells.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: bring the arms together in front of the chest in a wide arc, then open them under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: slight, fixed elbow bend; stretch across the chest at the open position; squeeze at the closed position.
```

<a id="ex-aperturas-en-cable-a-media-altura"></a>

### 14. Aperturas en Cable a Media Altura

Archivo: `aperturas-en-cable-a-media-altura.mp4` · id `8a11f8da-5b8e-4a38-a665-3597c7fcdb90` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Mid Cable Fly (Aperturas en Cable a Media Altura).
Equipment: cable machine with single D-handles.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: bring the arms together in front of the chest in a wide arc, then open them under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: slight, fixed elbow bend; stretch across the chest at the open position; squeeze at the closed position.
```

<a id="ex-aperturas-en-cable-bajo-alto"></a>

### 15. Aperturas en Cable Bajo-Alto

Archivo: `aperturas-en-cable-bajo-alto.mp4` · id `125ff8e8-e90e-4635-9641-76a612d80363` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Low-to-High Cable Fly (Aperturas en Cable Bajo-Alto).
Equipment: cable machine with single D-handles.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: sweep the limb across the body along a diagonal against the cable, then return. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: torso stays square; controlled arc; squeeze at the end position.
```

<a id="ex-belt-squat"></a>

### 16. Belt Squat

Archivo: `belt-squat.mp4` · id `51aff22a-547b-44fb-99de-ec4715a01aa7` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Belt Squat.
Equipment: belt squat machine.
Position: standing.
Handling: Belt around the hips attached to the machine, hands on the support handles.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-bird-dog"></a>

### 17. Bird Dog

Archivo: `bird-dog.mp4` · id `6fcf9d80-eee0-4851-bdcc-0db284ff2020` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bird Dog.
Equipment: no equipment, bodyweight only.
Position: on all fours (hands and knees).
Alternate sides, one repetition each.
Camera: front view, camera low, at floor level.
Movement: hold the load in front of the chest and press it out to arm's length while resisting the pull to rotate, then bring it back. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips and shoulders stay square; no leaning; slow press out and back.
```

<a id="ex-buenos-dias-con-barra"></a>

### 18. Buenos Días con Barra

Archivo: `buenos-dias-con-barra.mp4` · id `3df173fc-8143-4836-b669-dd26d8939137` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Good Morning (Buenos Días con Barra).
Equipment: Olympic barbell.
Position: standing, hinged at the hips, torso at about 30 degrees from horizontal.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at hip height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-caminata-del-granjero"></a>

### 19. Caminata del Granjero

Archivo: `caminata-del-granjero.mp4` · id `eb721a60-8d51-4563-ad16-6402b70e5223` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Farmer Carry (Caminata del Granjero).
Equipment: dumbbells (or a trap bar).
Position: walking; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, arms hanging straight down at the sides.
Camera: side profile view, camera at hip height.
Movement: walk with the load at a steady pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: tall posture, ribs down; shoulders level; short, quick steps.
```

<a id="ex-colgado-pasivo"></a>

### 20. Colgado Pasivo

Archivo: `colgado-pasivo.mp4` · id `f442e7de-870f-4273-babc-8ff115d9e94d` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dead Hang (Colgado Pasivo).
Equipment: pull-up bar.
Position: hanging from the bar; medium-width overhand grip.
Handling: Hands on the bar overhead, body hanging freely.
Camera: front view, camera at shoulder height.
Movement: hold the load with a firm grip without moving. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: shoulders active, not shrugged; body still; steady breathing.
```

<a id="ex-crunch-en-cable"></a>

### 21. Crunch en Cable

Archivo: `crunch-en-cable.mp4` · id `42da5eaf-f504-42d7-a725-965fcc4c9538` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Crunch (Crunch en Cable).
Equipment: cable machine with rope attachment.
Position: kneeling; medium-width neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: side profile view, camera low, at knee height.
Movement: curl the trunk forward by flexing the spine, bringing the ribs towards the pelvis, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: movement from the spine, not the hips; chin slightly tucked; controlled lowering.
```

<a id="ex-crunch-en-maquina"></a>

### 22. Crunch en Máquina

Archivo: `crunch-en-maquina.mp4` · id `ba3e7f98-394c-4b28-90b7-73ff0f0f94af` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Crunch (Crunch en Máquina).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at hip height.
Movement: curl the trunk forward by flexing the spine, bringing the ribs towards the pelvis, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: movement from the spine, not the hips; chin slightly tucked; controlled lowering.
```

<a id="ex-crunch-en-suelo"></a>

### 23. Crunch en Suelo

Archivo: `crunch-en-suelo.mp4` · id `6ace6474-a8ef-47d5-8e93-588fb4647891` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Floor Crunch (Crunch en Suelo).
Equipment: no equipment, bodyweight only.
Position: lying face up.
Camera: side profile view, camera low, at floor level.
Movement: curl the trunk forward by flexing the spine, bringing the ribs towards the pelvis, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: movement from the spine, not the hips; chin slightly tucked; controlled lowering.
```

<a id="ex-crunch-inverso"></a>

### 24. Crunch Inverso

Archivo: `crunch-inverso.mp4` · id `2cea3d86-bf06-48c5-be1e-fa5b0e710ea1` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Reverse Crunch (Crunch Inverso).
Equipment: no equipment, bodyweight only.
Position: lying face up.
Camera: side profile view, camera low, at floor level.
Movement: tilt the pelvis backwards to flatten the lower back, hold briefly, then release. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lower back presses towards the floor; ribs stay down; small, precise movement.
```

<a id="ex-curl-bayesiano"></a>

### 25. Curl Bayesiano

Archivo: `curl-bayesiano.mp4` · id `dc5b9b1b-a768-4f12-b877-dba600f6601d` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bayesian Cable Curl (Curl Bayesiano).
Equipment: cable machine with single D-handle.
Position: standing; underhand grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-con-barra"></a>

### 26. Curl con Barra

Archivo: `curl-con-barra.mp4` · id `c78072fa-afa9-4ba9-ba9d-c8ef07cfbea5` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Curl (Curl con Barra).
Equipment: Olympic barbell.
Position: standing; medium-width underhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-con-barra-ez"></a>

### 27. Curl con Barra EZ

Archivo: `curl-con-barra-ez.mp4` · id `7c93e078-b7ef-486e-967c-a6b1c44d4b98` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: EZ-Bar Curl (Curl con Barra EZ).
Equipment: EZ curl bar.
Position: standing; medium-width semi-underhand grip.
Handling: Both hands on the EZ bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-con-mancuernas"></a>

### 28. Curl con Mancuernas

Archivo: `curl-con-mancuernas.mp4` · id `f865c70b-ffef-48a3-9b84-71dc4f6d8ea4` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Curl (Curl con Mancuernas).
Equipment: dumbbells.
Position: standing; underhand grip.
Handling: One dumbbell in each hand, wrists straight.
Both sides at the same time, each with its own implement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-de-muneca"></a>

### 29. Curl de Muñeca

Archivo: `curl-de-muneca.mp4` · id `4725d1a3-c06d-471d-a64f-ede815eeed11` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Wrist Curl (Curl de Muñeca).
Equipment: Olympic barbell (dumbbells are an alternative).
Position: seated with the back supported; medium-width underhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front view, camera close, at forearm height.
Movement: curl the wrists upwards, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: forearms stay on the support; full range; slow.
```

<a id="ex-curl-en-cable-de-pie"></a>

### 30. Curl en Cable de Pie

Archivo: `curl-en-cable-de-pie.mp4` · id `8cdf4ee3-5054-4434-9cb8-69a8f497b3cd` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Standing Cable Curl (Curl en Cable de Pie).
Equipment: cable machine with straight bar attachment.
Position: standing; medium-width underhand grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-femoral-de-pie-unilateral"></a>

### 31. Curl Femoral de Pie Unilateral

Archivo: `curl-femoral-de-pie-unilateral.mp4` · id `9d30c744-649e-467b-9434-b381c24a2170` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Standing Single-Leg Curl (Curl Femoral de Pie Unilateral).
Equipment: weight-stack machine.
Position: standing, holding a support for balance.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: curl the heels towards the glutes by bending the knees, then return under control to the extended position. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips stay pressed against the pad; full range without the hips lifting; slow, controlled lowering.
```

<a id="ex-curl-femoral-sentado"></a>

### 32. Curl Femoral Sentado

Archivo: `curl-femoral-sentado.mp4` · id `6559c25f-ce10-4198-91d0-fa730c5385cf` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Seated Leg Curl (Curl Femoral Sentado).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at hip height.
Movement: curl the heels towards the glutes by bending the knees, then return under control to the extended position. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips stay pressed against the pad; full range without the hips lifting; slow, controlled lowering.
```

<a id="ex-curl-femoral-tumbado"></a>

### 33. Curl Femoral Tumbado

Archivo: `curl-femoral-tumbado.mp4` · id `ff3ad98e-0e09-49ed-9033-1c6a30d2e2fb` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Lying Leg Curl (Curl Femoral Tumbado).
Equipment: weight-stack machine.
Position: lying face down.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera low, at floor level.
Movement: curl the heels towards the glutes by bending the knees, then return under control to the extended position. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips stay pressed against the pad; full range without the hips lifting; slow, controlled lowering.
```

<a id="ex-curl-inclinado-con-mancuernas"></a>

### 34. Curl Inclinado con Mancuernas

Archivo: `curl-inclinado-con-mancuernas.mp4` · id `f4c17e38-727a-4084-898e-67ee63b1c65e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Dumbbell Curl (Curl Inclinado con Mancuernas).
Equipment: dumbbells.
Position: seated on an incline bench, bench set to about 45 degrees; underhand grip.
Handling: One dumbbell in each hand, wrists straight.
Both sides at the same time, each with its own implement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-inverso"></a>

### 35. Curl Inverso

Archivo: `curl-inverso.mp4` · id `cf98995b-503a-4027-a2ee-f9ba67d2c597` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Reverse Curl (Curl Inverso).
Equipment: EZ curl bar.
Position: standing; medium-width overhand grip.
Handling: Both hands on the EZ bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-martillo"></a>

### 36. Curl Martillo

Archivo: `curl-martillo.mp4` · id `b63f833c-4b52-419d-91ce-7bf3ffe53a99` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Hammer Curl (Curl Martillo).
Equipment: dumbbells.
Position: standing; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Both sides at the same time, each with its own implement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-nordico"></a>

### 37. Curl Nórdico

Archivo: `curl-nordico.mp4` · id `3f49b87c-ea59-42aa-a503-8c2c4c839657` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Nordic Hamstring Curl (Curl Nórdico).
Equipment: no equipment, bodyweight only.
Position: kneeling.
Camera: side profile view, camera low, at knee height.
Movement: curl the heels towards the glutes by bending the knees, then return under control to the extended position. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips stay pressed against the pad; full range without the hips lifting; slow, controlled lowering.
```

<a id="ex-curl-predicador"></a>

### 38. Curl Predicador

Archivo: `curl-predicador.mp4` · id `8956a4a9-7095-446c-8b28-c846b871a12b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Preacher Curl (Curl Predicador).
Equipment: EZ curl bar.
Position: seated; medium-width semi-underhand grip.
Handling: Both hands on the EZ bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-curl-spider"></a>

### 39. Curl Spider

Archivo: `curl-spider.mp4` · id `7f25a6bf-0af0-4c86-bf6a-8c12d0045b8a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Spider Curl (Curl Spider).
Equipment: dumbbells.
Position: chest down on an incline bench, bench set to about 45 degrees; underhand grip.
Handling: One dumbbell in each hand, wrists straight.
Both sides at the same time, each with its own implement.
Camera: front three-quarter view (45 degrees), camera at bench height.
Movement: curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows pinned at the sides; no swinging from the hips; full extension at the bottom.
```

<a id="ex-dead-bug"></a>

### 40. Dead Bug

Archivo: `dead-bug.mp4` · id `452fdf9d-7fe0-4421-9e63-d8d174dbb0b9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dead Bug.
Equipment: no equipment, bodyweight only.
Position: lying face up.
Alternate sides, one repetition each.
Camera: side profile view, camera low, at floor level.
Movement: keep the trunk rigid and the lower back neutral against the pull into extension, moving only the limbs as the exercise requires. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, pelvis slightly tucked; lower back never arches; core braced throughout.
```

<a id="ex-dominada-prona"></a>

### 41. Dominada Prona

Archivo: `dominada-prona.mp4` · id `1606de75-aba9-4ed7-8510-d5f7c5a93c83` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Pull-Up (Dominada Prona).
Equipment: pull-up bar.
Position: hanging from the bar; slightly wider than shoulder-width overhand grip.
Handling: Hands on the bar overhead, body hanging freely.
Camera: rear three-quarter view, camera at shoulder height.
Movement: pull until the chin clears the bar (or the bar reaches the upper chest), then return to a full hang with straight arms. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: start from a full hang with the shoulders active; elbows drive down and back; full extension at the bottom.
```

<a id="ex-dominada-supina"></a>

### 42. Dominada Supina

Archivo: `dominada-supina.mp4` · id `93706ac3-0674-4414-a2aa-11538df4fe0f` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Chin-Up (Dominada Supina).
Equipment: pull-up bar.
Position: hanging from the bar; shoulder-width underhand grip.
Handling: Hands on the bar overhead, body hanging freely.
Camera: rear three-quarter view, camera at shoulder height.
Movement: pull until the chin clears the bar (or the bar reaches the upper chest), then return to a full hang with straight arms. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: start from a full hang with the shoulders active; elbows drive down and back; full extension at the bottom.
```

<a id="ex-elevacion-de-piernas-colgado"></a>

### 43. Elevación de Piernas Colgado

Archivo: `elevacion-de-piernas-colgado.mp4` · id `718bb923-1e1a-4f3d-a5b9-aee9046c6a8f` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Hanging Leg Raise (Elevación de Piernas Colgado).
Equipment: pull-up bar.
Position: hanging from the bar; medium-width overhand grip.
Handling: Hands on the bar overhead, body hanging freely.
Camera: side profile view, camera at shoulder height.
Movement: lift the knees towards the chest by flexing the hips, then lower under control. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no swinging; pelvis tilts slightly back at the top; controlled lowering.
```

<a id="ex-elevacion-de-talon-unilateral"></a>

### 44. Elevación de Talón Unilateral

Archivo: `elevacion-de-talon-unilateral.mp4` · id `6f0ec6db-9181-4c49-a2ee-5810d9728321` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Single-Leg Standing Calf Raise (Elevación de Talón Unilateral).
Equipment: bodyweight (a dumbbell can be added).
Position: standing, holding a support for balance.
Handling: If dumbbells are used, one in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees fixed (straight or at a set bend); pause at the top; full stretch at the bottom.
```

<a id="ex-elevacion-de-talones-de-pie"></a>

### 45. Elevación de Talones de Pie

Archivo: `elevacion-de-talones-de-pie.mp4` · id `96c66297-261c-43ca-ac5d-8edb0c9e3564` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Standing Calf Raise (Elevación de Talones de Pie).
Equipment: standing calf raise machine.
Position: standing, holding a support for balance.
Handling: Shoulders under the pads, balls of the feet on the edge of the platform.
Camera: side profile view, camera at hip height.
Movement: rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees fixed (straight or at a set bend); pause at the top; full stretch at the bottom.
```

<a id="ex-elevacion-de-talones-sentado"></a>

### 46. Elevación de Talones Sentado

Archivo: `elevacion-de-talones-sentado.mp4` · id `2c460fb3-a359-4c57-90c6-c8cccc931e0c` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Seated Calf Raise (Elevación de Talones Sentado).
Equipment: standing calf raise machine.
Position: seated.
Handling: Shoulders under the pads, balls of the feet on the edge of the platform.
Camera: side profile view, camera at hip height.
Movement: rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees fixed (straight or at a set bend); pause at the top; full stretch at the bottom.
```

<a id="ex-elevacion-de-tibial-anterior"></a>

### 47. Elevación de Tibial Anterior

Archivo: `elevacion-de-tibial-anterior.mp4` · id `2d0fc2fc-8d6d-4ab0-b612-5a814f0d27d3` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Tibialis Raise (Elevación de Tibial Anterior).
Equipment: bodyweight (or an assisted machine).
Position: standing, holding a support for balance.
Camera: side profile view, camera at hip height.
Movement: drive the knee forward over the toes as far as possible with the heel on the floor, then return. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: heel stays down; knee tracks straight over the second toe; slow and controlled.
```

<a id="ex-elevacion-donkey"></a>

### 48. Elevación Donkey

Archivo: `elevacion-donkey.mp4` · id `a158e809-8413-404e-aff5-1be5b99572f9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Donkey Calf Raise (Elevación Donkey).
Equipment: donkey calf raise machine.
Position: hinged forward with one hand braced for support, torso at about 20 degrees from horizontal.
Handling: Hips under the pad, torso bent forward, balls of the feet on the edge of the platform.
Camera: side profile view, camera at hip height.
Movement: rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees fixed (straight or at a set bend); pause at the top; full stretch at the bottom.
```

<a id="ex-elevacion-frontal"></a>

### 49. Elevación Frontal

Archivo: `elevacion-frontal.mp4` · id `ee529b53-57a1-4303-ba1b-bc593f79f33b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Front Raise (Elevación Frontal).
Equipment: dumbbells.
Position: standing; neutral (or overhand) grip.
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at chest height.
Movement: raise the load in front of the body to shoulder height with nearly straight arms, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: no swinging; stop at shoulder height; controlled lowering.
```

<a id="ex-elevacion-lateral-con-mancuernas"></a>

### 50. Elevación Lateral con Mancuernas

Archivo: `elevacion-lateral-con-mancuernas.mp4` · id `af3f41ce-7c03-413f-a430-94a5f1e41498` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Lateral Raise (Elevación Lateral con Mancuernas).
Equipment: dumbbells.
Position: standing; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: front view, camera at chest height.
Movement: raise the arms out to the sides to shoulder height with a slight elbow bend, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbows; stop at shoulder height; no shrugging.
```

<a id="ex-elevacion-lateral-en-cable"></a>

### 51. Elevación Lateral en Cable

Archivo: `elevacion-lateral-en-cable.mp4` · id `1acdf16d-8b46-4809-ad36-5df539e0f76c` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Lateral Raise (Elevación Lateral en Cable).
Equipment: cable machine with single D-handle.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front view, camera at chest height.
Movement: raise the arms out to the sides to shoulder height with a slight elbow bend, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbows; stop at shoulder height; no shrugging.
```

<a id="ex-elevacion-lateral-en-cable-inclinado"></a>

### 52. Elevación Lateral en Cable Inclinado

Archivo: `elevacion-lateral-en-cable-inclinado.mp4` · id `d34bfa0c-125e-4c1b-acc6-de431a0b8da2` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Lean-Away Cable Lateral Raise (Elevación Lateral en Cable Inclinado).
Equipment: cable machine with single D-handle.
Position: standing, leaning away from the anchor point; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front view, camera at chest height.
Movement: raise the arms out to the sides to shoulder height with a slight elbow bend, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbows; stop at shoulder height; no shrugging.
```

<a id="ex-elevacion-lateral-en-maquina"></a>

### 53. Elevación Lateral en Máquina

Archivo: `elevacion-lateral-en-maquina.mp4` · id `a06e928c-c247-4de0-878c-0a130412513b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Lateral Raise (Elevación Lateral en Máquina).
Equipment: weight-stack machine.
Position: seated; neutral grip (palms facing each other).
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front view, camera at chest height.
Movement: raise the arms out to the sides to shoulder height with a slight elbow bend, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbows; stop at shoulder height; no shrugging.
```

<a id="ex-encogimientos-con-barra"></a>

### 54. Encogimientos con Barra

Archivo: `encogimientos-con-barra.mp4` · id `843392f0-a76d-424b-aad8-d4437d5bd312` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Shrug (Encogimientos con Barra).
Equipment: Olympic barbell.
Position: standing; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front view, camera at chest height.
Movement: shrug the shoulders straight up towards the ears, pause, then lower fully. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: straight up, no rolling; pause at the top; full stretch at the bottom.
```

<a id="ex-extension-cruzada-de-triceps-en-cable"></a>

### 55. Extensión Cruzada de Tríceps en Cable

Archivo: `extension-cruzada-de-triceps-en-cable.mp4` · id `0f8e081a-5147-4b61-a02c-c53fea847643` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cross-Body Cable Triceps Extension (Extensión Cruzada de Tríceps en Cable).
Equipment: cable machine with single D-handle.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-extension-de-muneca"></a>

### 56. Extensión de Muñeca

Archivo: `extension-de-muneca.mp4` · id `3c1c4ce8-b088-4842-a8a7-ddead9b09840` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Wrist Extension (Extensión de Muñeca).
Equipment: Olympic barbell (dumbbells are an alternative).
Position: seated with the back supported; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front view, camera close, at forearm height.
Movement: extend the wrists upwards against the load, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: forearms stay on the support; full range; slow.
```

<a id="ex-extension-de-rodilla-en-maquina"></a>

### 57. Extensión de Rodilla en Máquina

Archivo: `extension-de-rodilla-en-maquina.mp4` · id `39d57e35-2e04-48a7-b95b-319096d79105` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Leg Extension (Extensión de Rodilla en Máquina).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at hip height.
Movement: extend the knees to lift the pad until the legs are straight, pause, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: back against the seat; no swinging; pause at full extension.
```

<a id="ex-extension-de-triceps-en-polea-con-barra"></a>

### 58. Extensión de Tríceps en Polea con Barra

Archivo: `extension-de-triceps-en-polea-con-barra.mp4` · id `b0e29d93-2a1d-4a37-859b-69c56eaf14b8` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Straight-Bar Triceps Pushdown (Extensión de Tríceps en Polea con Barra).
Equipment: cable machine with straight bar attachment.
Position: standing; medium-width overhand grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-extension-de-triceps-en-polea-con-cuerda"></a>

### 59. Extensión de Tríceps en Polea con Cuerda

Archivo: `extension-de-triceps-en-polea-con-cuerda.mp4` · id `d5641ec0-c730-4116-813f-18841eb49f41` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Rope Triceps Pushdown (Extensión de Tríceps en Polea con Cuerda).
Equipment: cable machine with rope attachment.
Position: standing; medium-width neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-extension-de-triceps-sobre-cabeza-con-cuerda"></a>

### 60. Extensión de Tríceps sobre Cabeza con Cuerda

Archivo: `extension-de-triceps-sobre-cabeza-con-cuerda.mp4` · id `68109383-6ce4-47ab-ab85-66d1813b4c90` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Overhead Rope Triceps Extension (Extensión de Tríceps sobre Cabeza con Cuerda).
Equipment: cable machine with rope attachment.
Position: standing; medium-width neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-extension-unilateral-sobre-cabeza-en-cable"></a>

### 61. Extensión Unilateral sobre Cabeza en Cable

Archivo: `extension-unilateral-sobre-cabeza-en-cable.mp4` · id `f895ca7e-0b81-4c79-9564-4aa4214bffb5` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Single-Arm Overhead Cable Triceps Extension (Extensión Unilateral sobre Cabeza en Cable).
Equipment: cable machine with single D-handle.
Position: standing; neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-face-pull"></a>

### 62. Face Pull

Archivo: `face-pull.mp4` · id `ad529f8d-45cd-4b99-aea8-cdb2e09ff0d0` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Face Pull.
Equipment: cable machine with rope attachment.
Position: standing; wide neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: pull the handles apart and back towards the face with the elbows high, then return. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows stay high; squeeze the rear shoulders; no torso swing.
```

<a id="ex-flexiones-de-brazos"></a>

### 63. Flexiones de Brazos

Archivo: `flexiones-de-brazos.mp4` · id `02d0e74a-7e08-40eb-acb3-ba0d182dfaa1` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Push-Up (Flexiones de Brazos).
Equipment: no equipment, bodyweight only.
Position: prone plank position on the forearms; medium-width neutral grip (palms facing each other).
Camera: side profile view, camera low, at floor level.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-fondos-con-sesgo-a-pecho"></a>

### 64. Fondos con Sesgo a Pecho

Archivo: `fondos-con-sesgo-a-pecho.mp4` · id `fdf31671-948e-4483-820d-c4f763b20b5e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Chest-Biased Dip (Fondos con Sesgo a Pecho).
Equipment: parallel dip bars.
Position: hanging from the bar; medium-width neutral grip (palms facing each other).
Handling: One hand on each parallel bar, body suspended between them.
Camera: side profile view, camera at shoulder height.
Movement: lower the body by bending the elbows until the upper arms are about parallel to the floor, then press back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: shoulders stay down, not shrugged; slight forward lean; controlled depth.
```

<a id="ex-fondos-con-sesgo-a-triceps"></a>

### 65. Fondos con Sesgo a Tríceps

Archivo: `fondos-con-sesgo-a-triceps.mp4` · id `20d82cc8-60d0-4b45-8495-7325fd74831b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Triceps-Biased Dip (Fondos con Sesgo a Tríceps).
Equipment: parallel dip bars.
Position: hanging from the bar; medium-width neutral grip (palms facing each other).
Handling: One hand on each parallel bar, body suspended between them.
Camera: side profile view, camera at shoulder height.
Movement: lower the body by bending the elbows until the upper arms are about parallel to the floor, then press back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: shoulders stay down, not shrugged; slight forward lean; controlled depth.
```

<a id="ex-fondos-en-maquina"></a>

### 66. Fondos en Máquina

Archivo: `fondos-en-maquina.mp4` · id `57727d37-5894-49b0-8ce5-d85ab6a64ed8` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Dip (Fondos en Máquina).
Equipment: weight-stack machine.
Position: seated; medium-width neutral grip (palms facing each other).
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at chest height.
Movement: lower the body by bending the elbows until the upper arms are about parallel to the floor, then press back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: shoulders stay down, not shrugged; slight forward lean; controlled depth.
```

<a id="ex-gemelos-en-prensa"></a>

### 67. Gemelos en Prensa

Archivo: `gemelos-en-prensa.mp4` · id `1792e1b2-ab65-4340-972c-f56a645f6311` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Leg Press Calf Raise (Gemelos en Prensa).
Equipment: leg press machine.
Position: reclined, upper back supported.
Handling: Seated in the leg press with the back against the pad and both feet flat on the platform.
Camera: side profile view, camera at hip height.
Movement: rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees fixed (straight or at a set bend); pause at the top; full stretch at the bottom.
```

<a id="ex-hack-squat"></a>

### 68. Hack Squat

Archivo: `hack-squat.mp4` · id `1ad8c755-a020-4852-b76e-12360186ae4a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Hack Squat.
Equipment: plate-loaded machine.
Position: chest supported on an incline bench, bench set to about 75 degrees.
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at bench height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-hip-thrust-con-barra"></a>

### 69. Hip Thrust con Barra

Archivo: `hip-thrust-con-barra.mp4` · id `de10e766-24e1-4449-b4c6-823dc9ae1861` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Hip Thrust (Hip Thrust con Barra).
Equipment: Olympic barbell.
Position: upper back resting on a bench, feet flat on the floor.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at bench height.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-hip-thrust-en-smith"></a>

### 70. Hip Thrust en Smith

Archivo: `hip-thrust-en-smith.mp4` · id `a5ba5528-bc93-4e0b-9180-8ea6c0ea7f6a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Smith Machine Hip Thrust (Hip Thrust en Smith).
Equipment: Smith machine.
Position: upper back resting on a bench, feet flat on the floor.
Handling: Both hands on the Smith machine bar, which slides on its fixed vertical rails.
Camera: side profile view, camera at bench height.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-hiperextension-45-con-sesgo-femoral"></a>

### 71. Hiperextensión 45° con Sesgo Femoral

Archivo: `hiperextension-45-con-sesgo-femoral.mp4` · id `7cee799e-ba83-4e99-b402-4523f0cce464` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: 45-Degree Back Extension - Hamstring Bias (Hiperextensión 45° con Sesgo Femoral).
Equipment: 45-degree back extension bench.
Position: lying face down on an incline bench, bench set to about 45 degrees.
Handling: Thighs on the pad, heels locked under the rollers.
Camera: side profile view, camera at bench height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-hiperextension-45-con-sesgo-gluteo"></a>

### 72. Hiperextensión 45° con Sesgo Glúteo

Archivo: `hiperextension-45-con-sesgo-gluteo.mp4` · id `8adcef0f-73b8-4a4d-879d-526ea63746d6` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: 45-Degree Back Extension - Glute Bias (Hiperextensión 45° con Sesgo Glúteo).
Equipment: 45-degree back extension bench.
Position: lying face down on an incline bench, bench set to about 45 degrees.
Handling: Thighs on the pad, heels locked under the rollers.
Camera: side profile view, camera at bench height.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-hiperextension-inversa"></a>

### 73. Hiperextensión Inversa

Archivo: `hiperextension-inversa.mp4` · id `487d3af7-d412-4626-b3ae-3ceb403f1234` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Reverse Hyperextension (Hiperextensión Inversa).
Equipment: reverse hyperextension machine.
Position: face down, supported on the pad.
Handling: Torso on the pad, legs hanging, ankles in the straps.
Camera: side profile view, camera at bench height.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-hollow-body-hold"></a>

### 74. Hollow Body Hold

Archivo: `hollow-body-hold.mp4` · id `16ec6401-2912-4ffa-8b2f-665a3184960b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Hollow Body Hold.
Equipment: no equipment, bodyweight only.
Position: lying face up.
Camera: side profile view, camera low, at floor level.
Movement: keep the trunk rigid and the lower back neutral against the pull into extension, moving only the limbs as the exercise requires. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: ribs down, pelvis slightly tucked; lower back never arches; core braced throughout.
```

<a id="ex-jalon-al-pecho-agarre-neutro"></a>

### 75. Jalón al Pecho Agarre Neutro

Archivo: `jalon-al-pecho-agarre-neutro.mp4` · id `5be5e696-a231-4b34-99cf-315df501e190` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Neutral-Grip Lat Pulldown (Jalón al Pecho Agarre Neutro).
Equipment: cable machine with neutral-grip handle.
Position: seated; medium-width neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: rear three-quarter view, camera at shoulder height.
Movement: pull until the chin clears the bar (or the bar reaches the upper chest), then return to a full hang with straight arms. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: start from a full hang with the shoulders active; elbows drive down and back; full extension at the bottom.
```

<a id="ex-jalon-al-pecho-prono"></a>

### 76. Jalón al Pecho Prono

Archivo: `jalon-al-pecho-prono.mp4` · id `606d171b-b870-4d24-ab03-142ec1ce845e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Lat Pulldown Pronated Grip (Jalón al Pecho Prono).
Equipment: cable machine with wide lat bar.
Position: seated; slightly wider than shoulder-width overhand grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: rear three-quarter view, camera at shoulder height.
Movement: pull until the chin clears the bar (or the bar reaches the upper chest), then return to a full hang with straight arms. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: start from a full hang with the shoulders active; elbows drive down and back; full extension at the bottom.
```

<a id="ex-jalon-con-brazos-rectos"></a>

### 77. Jalón con Brazos Rectos

Archivo: `jalon-con-brazos-rectos.mp4` · id `ffb308be-7d1c-4209-8475-4272b8b3e320` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Straight-Arm Cable Pulldown (Jalón con Brazos Rectos).
Equipment: cable machine with straight bar (or rope) attachment.
Position: standing; medium-width overhand (or neutral) grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: side profile view, camera at chest height.
Movement: pull the nearly straight arms down and back past the hips, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: arms stay nearly straight; chest up; controlled return.
```

<a id="ex-pajaros-con-mancuernas"></a>

### 78. Pájaros con Mancuernas

Archivo: `pajaros-con-mancuernas.mp4` · id `ef4eb8db-9aa2-4298-b27c-8f171a6ea19d` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bent-Over Dumbbell Rear Delt Raise (Pájaros con Mancuernas).
Equipment: dumbbells.
Position: standing, hinged forward at the hips, torso at about 30 degrees from horizontal; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: open the arms out to the sides against the resistance with a slight elbow bend, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: squeeze the shoulder blades together; arms stay slightly bent; no torso movement.
```

<a id="ex-patada-de-gluteo-en-cable"></a>

### 79. Patada de Glúteo en Cable

Archivo: `patada-de-gluteo-en-cable.mp4` · id `fcff6525-7267-47a9-b126-323c78fbcbd3` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Glute Kickback (Patada de Glúteo en Cable).
Equipment: cable machine with ankle strap.
Position: standing, holding a support for balance.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-pec-deck"></a>

### 80. Pec Deck

Archivo: `pec-deck.mp4` · id `9974ee58-c8ad-4f1b-9a13-3d90157c1478` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Pec Deck Fly (Pec Deck).
Equipment: weight-stack machine.
Position: seated; neutral grip (palms facing each other).
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: bring the arms together in front of the chest in a wide arc, then open them under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: slight, fixed elbow bend; stretch across the chest at the open position; squeeze at the closed position.
```

<a id="ex-pec-deck-inverso"></a>

### 81. Pec Deck Inverso

Archivo: `pec-deck-inverso.mp4` · id `2bc6b044-5126-46b6-bc9c-fbbb4f49036b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Reverse Pec Deck (Pec Deck Inverso).
Equipment: weight-stack machine.
Position: seated; neutral grip (palms facing each other).
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: open the arms out to the sides against the resistance with a slight elbow bend, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: squeeze the shoulder blades together; arms stay slightly bent; no torso movement.
```

<a id="ex-pendulum-squat"></a>

### 82. Pendulum Squat

Archivo: `pendulum-squat.mp4` · id `bd3495fe-c51e-443f-a77a-3963f8d8d805` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Pendulum Squat.
Equipment: plate-loaded machine.
Position: upper back on a bench, hips free (bridge position).
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at bench height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-peso-muerto-piernas-rigidas"></a>

### 83. Peso Muerto Piernas Rígidas

Archivo: `peso-muerto-piernas-rigidas.mp4` · id `d20ef09d-908e-4bb0-bfb1-49125637def4` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Stiff-Leg Deadlift (Peso Muerto Piernas Rígidas).
Equipment: Olympic barbell.
Position: standing, hinged at the hips, torso at about 25 degrees from horizontal; medium-width overhand (or mixed) grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at hip height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-peso-muerto-rumano-con-barra"></a>

### 84. Peso Muerto Rumano con Barra

Archivo: `peso-muerto-rumano-con-barra.mp4` · id `24c152ee-2f2c-4edc-9868-c1fd53ea8e61` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Romanian Deadlift (Peso Muerto Rumano con Barra).
Equipment: Olympic barbell.
Position: standing, hinged at the hips, torso at about 30 degrees from horizontal; medium-width overhand (or mixed) grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at hip height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-peso-muerto-rumano-con-mancuernas"></a>

### 85. Peso Muerto Rumano con Mancuernas

Archivo: `peso-muerto-rumano-con-mancuernas.mp4` · id `da07fe35-f695-412e-81f9-e0a255ee4560` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Romanian Deadlift (Peso Muerto Rumano con Mancuernas).
Equipment: dumbbells.
Position: standing, hinged at the hips, torso at about 30 degrees from horizontal; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at hip height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-pinza-de-discos"></a>

### 86. Pinza de Discos

Archivo: `pinza-de-discos.mp4` · id `fe7252e1-7598-44f5-8a9f-72e3178f0fd2` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Plate Pinch Hold (Pinza de Discos).
Equipment: weight plates.
Position: standing; pinch grip (fingers and thumb only).
Handling: Plates held with the fingers and thumb.
Camera: front view, camera at chest height.
Movement: hold the load with a firm grip without moving. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: shoulders active, not shrugged; body still; steady breathing.
```

<a id="ex-plancha"></a>

### 87. Plancha

Archivo: `plancha.mp4` · id `cccd7aa0-03a3-4e23-a074-d3be81604ab4` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Front Plank (Plancha).
Equipment: no equipment, bodyweight only.
Position: prone plank position on the forearms.
Camera: side profile view, camera low, at floor level.
Movement: keep the trunk rigid and the lower back neutral against the pull into extension, moving only the limbs as the exercise requires. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: ribs down, pelvis slightly tucked; lower back never arches; core braced throughout.
```

<a id="ex-plancha-copenhagen"></a>

### 88. Plancha Copenhagen

Archivo: `plancha-copenhagen.mp4` · id `524308e7-bc4a-4bb1-a89b-c7c90b35cae5` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Copenhagen Plank (Plancha Copenhagen).
Equipment: flat bench.
Position: side plank position on the forearm.
One side at a time: demonstrate with the right side.
Camera: front view, camera low, at floor level.
Movement: bring the legs together against the resistance, then return under control. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: torso still; squeeze at the closed position; controlled return.
```

<a id="ex-plancha-lateral"></a>

### 89. Plancha Lateral

Archivo: `plancha-lateral.mp4` · id `6f0f1a19-c3a3-4b8f-a534-f9d5a04deb63` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Side Plank (Plancha Lateral).
Equipment: no equipment, bodyweight only.
Position: side plank position on the forearm.
One side at a time: demonstrate with the right side.
Camera: front view, camera low, at floor level.
Movement: keep the trunk straight and level against the sideways pull. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: body in one straight line; hips stay high; no bending sideways.
```

<a id="ex-prensa-45-grados"></a>

### 90. Prensa 45 Grados

Archivo: `prensa-45-grados.mp4` · id `36b3c617-1166-4d62-9150-fc31cca02d59` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: 45-Degree Leg Press (Prensa 45 Grados).
Equipment: plate-loaded machine.
Position: reclined, upper back supported, bench set to about 45 degrees.
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-prensa-horizontal"></a>

### 91. Prensa Horizontal

Archivo: `prensa-horizontal.mp4` · id `1fb2a980-b997-4607-bce3-ad78ae45210c` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Horizontal Leg Press (Prensa Horizontal).
Equipment: weight-stack machine.
Position: seated.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-press-arnold"></a>

### 92. Press Arnold

Archivo: `press-arnold.mp4` · id `413c005d-bf7a-4076-8024-c48302ae8268` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Arnold Press (Press Arnold).
Equipment: dumbbells.
Position: seated; rotating grip (palms turn during the lift).
Handling: One dumbbell in each hand, wrists straight.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: press the load straight overhead to full extension, then lower under control to shoulder level. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching; head moves slightly back to let the bar pass; biceps by the ears at lockout.
```

<a id="ex-press-banca-agarre-cerrado"></a>

### 93. Press Banca Agarre Cerrado

Archivo: `press-banca-agarre-cerrado.mp4` · id `a5874d29-f507-4b84-b24f-9b0f4cc76975` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Close-Grip Bench Press (Press Banca Agarre Cerrado).
Equipment: Olympic barbell.
Position: lying face up on a flat bench; close overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-press-banca-con-barra"></a>

### 94. Press Banca con Barra

Archivo: `press-banca-con-barra.mp4` · id `702f1a51-3956-4d90-af7d-00af67b2f1de` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Bench Press (Press Banca con Barra).
Equipment: Olympic barbell.
Position: lying face up on a flat bench; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-press-banca-con-mancuernas"></a>

### 95. Press Banca con Mancuernas

Archivo: `press-banca-con-mancuernas.mp4` · id `b825c8a7-eb6b-4071-9712-ca5a63daa7b2` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Bench Press (Press Banca con Mancuernas).
Equipment: dumbbells.
Position: lying face up on a flat bench; grip rotating from neutral to overhand.
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-press-banca-en-smith"></a>

### 96. Press Banca en Smith

Archivo: `press-banca-en-smith.mp4` · id `0f985a6b-40d9-4bb5-a2f3-c6acab3d67bc` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Smith Machine Bench Press (Press Banca en Smith).
Equipment: Smith machine.
Position: lying face up on a flat bench; medium-width overhand grip.
Handling: Both hands on the Smith machine bar, which slides on its fixed vertical rails.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-press-de-hombro-con-mancuernas-sentado"></a>

### 97. Press de Hombro con Mancuernas Sentado

Archivo: `press-de-hombro-con-mancuernas-sentado.mp4` · id `463f907b-64d1-4bab-8e4d-e3f7dd4e77bf` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Seated Dumbbell Shoulder Press (Press de Hombro con Mancuernas Sentado).
Equipment: dumbbells.
Position: seated; grip rotating from neutral to overhand.
Handling: One dumbbell in each hand, wrists straight.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: press the load straight overhead to full extension, then lower under control to shoulder level. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching; head moves slightly back to let the bar pass; biceps by the ears at lockout.
```

<a id="ex-press-de-hombro-en-maquina"></a>

### 98. Press de Hombro en Máquina

Archivo: `press-de-hombro-en-maquina.mp4` · id `5fdec4b4-0b41-4d5e-a79b-7826484ee145` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Shoulder Press (Press de Hombro en Máquina).
Equipment: weight-stack machine.
Position: seated; medium-width neutral (or overhand) grip.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: press the load straight overhead to full extension, then lower under control to shoulder level. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching; head moves slightly back to let the bar pass; biceps by the ears at lockout.
```

<a id="ex-press-de-pecho-en-maquina"></a>

### 99. Press de Pecho en Máquina

Archivo: `press-de-pecho-en-maquina.mp4` · id `b38ce993-8481-42ee-8bee-bb3dfbe27c1f` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Chest Press (Press de Pecho en Máquina).
Equipment: weight-stack machine.
Position: seated; medium-width neutral (or overhand) grip.
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at chest height.
Movement: start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows at about 45 degrees to the torso; shoulder blades retracted and down; wrists stacked over the elbows.
```

<a id="ex-press-declinado-con-barra"></a>

### 100. Press Declinado con Barra

Archivo: `press-declinado-con-barra.mp4` · id `06ab2272-e2df-48af-95b7-e4b382605e85` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Decline Barbell Bench Press (Press Declinado con Barra).
Equipment: Olympic barbell.
Position: lying face up on a decline bench; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows about 45 degrees from the torso; shoulder blades down and back; controlled lowering.
```

<a id="ex-press-frances-con-mancuerna"></a>

### 101. Press Francés con Mancuerna

Archivo: `press-frances-con-mancuerna.mp4` · id `5fefd583-67a8-4261-9665-429fb39975f9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell French Press (Press Francés con Mancuerna).
Equipment: dumbbells.
Position: seated; close neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-press-inclinado-con-barra"></a>

### 102. Press Inclinado con Barra

Archivo: `press-inclinado-con-barra.mp4` · id `74360acc-8fdb-49ca-bfc2-cf11c0cc4f21` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Barbell Bench Press (Press Inclinado con Barra).
Equipment: Olympic barbell.
Position: lying face up on an incline bench, bench set to about 30 degrees; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows about 45 degrees from the torso; shoulder blades down and back; controlled lowering.
```

<a id="ex-press-inclinado-con-mancuernas"></a>

### 103. Press Inclinado con Mancuernas

Archivo: `press-inclinado-con-mancuernas.mp4` · id `e870d89d-6b0c-4ed5-9d7f-627ad52b9d7b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Dumbbell Bench Press (Press Inclinado con Mancuernas).
Equipment: dumbbells.
Position: lying face up on an incline bench, bench set to about 30 degrees; grip rotating from neutral to overhand.
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows about 45 degrees from the torso; shoulder blades down and back; controlled lowering.
```

<a id="ex-press-inclinado-en-maquina"></a>

### 104. Press Inclinado en Máquina

Archivo: `press-inclinado-en-maquina.mp4` · id `7c2d632a-6b3d-4399-924a-324769ca6a19` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Machine Chest Press (Press Inclinado en Máquina).
Equipment: plate-loaded machine.
Position: seated on an incline bench, bench set to about 30 degrees; medium-width neutral (or overhand) grip.
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at chest height.
Movement: start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows about 45 degrees from the torso; shoulder blades down and back; controlled lowering.
```

<a id="ex-press-inclinado-en-smith"></a>

### 105. Press Inclinado en Smith

Archivo: `press-inclinado-en-smith.mp4` · id `c5aa1c54-2702-4256-b993-7c11eff22fd0` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Smith Machine Press (Press Inclinado en Smith).
Equipment: Smith machine.
Position: lying face up on an incline bench, bench set to about 30 degrees; medium-width overhand grip.
Handling: Both hands on the Smith machine bar, which slides on its fixed vertical rails.
Camera: side profile view, camera at bench height.
Movement: start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows about 45 degrees from the torso; shoulder blades down and back; controlled lowering.
```

<a id="ex-press-militar-con-barra"></a>

### 106. Press Militar con Barra

Archivo: `press-militar-con-barra.mp4` · id `c750b038-e824-4d08-b6f0-b23aadfe84af` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Overhead Press (Press Militar con Barra).
Equipment: Olympic barbell.
Position: standing; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at chest height.
Movement: press the load straight overhead to full extension, then lower under control to shoulder level. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching; head moves slightly back to let the bar pass; biceps by the ears at lockout.
```

<a id="ex-press-pallof"></a>

### 107. Press Pallof

Archivo: `press-pallof.mp4` · id `e280dfd0-48d9-478a-a318-7a53c3564f73` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Pallof Press (Press Pallof).
Equipment: cable machine with single D-handle.
Position: standing.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: front view, camera at chest height.
Movement: hold the load in front of the chest and press it out to arm's length while resisting the pull to rotate, then bring it back. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: hips and shoulders stay square; no leaning; slow press out and back.
```

<a id="ex-pronacion-y-supinacion-con-mancuerna"></a>

### 108. Pronación y Supinación con Mancuerna

Archivo: `pronacion-y-supinacion-con-mancuerna.mp4` · id `a7477c0d-6f0c-437f-8bbf-a8678cdf78fd` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Forearm Pronation-Supination (Pronación y Supinación con Mancuerna).
Equipment: dumbbells.
Position: seated with the back supported; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: front view, camera close, at forearm height.
Movement: rotate the forearm from palm-down to palm-up and back with the elbow fixed. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbow stays still; full rotation both ways; controlled.
```

<a id="ex-puente-de-gluteos"></a>

### 109. Puente de Glúteos

Archivo: `puente-de-gluteos.mp4` · id `e194b6d9-429e-4347-ae6a-80d82c9f93d7` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Glute Bridge (Puente de Glúteos).
Equipment: bodyweight (a barbell can be added).
Position: lying face up.
Handling: If a bar is used, both hands on it, horizontal and perpendicular to the body.
Camera: side profile view, camera low, at floor level.
Movement: drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, no lower-back arching at the top; chin tucked, neutral neck; full glute squeeze at lockout.
```

<a id="ex-pull-through-en-cable"></a>

### 110. Pull-Through en Cable

Archivo: `pull-through-en-cable.mp4` · id `d604ac72-a49d-4194-accb-76277880801b` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Pull-Through (Pull-Through en Cable).
Equipment: cable machine with rope attachment.
Position: standing, hinged at the hips, torso at about 35 degrees from horizontal; close neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: side profile view, camera at hip height.
Movement: push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: neutral spine throughout, no rounding; shins stay vertical; load stays close to the body.
```

<a id="ex-pullover-con-mancuerna"></a>

### 111. Pullover con Mancuerna

Archivo: `pullover-con-mancuerna.mp4` · id `7c5cb314-6c09-4632-8a9f-ed8ba9bd976a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Dumbbell Pullover (Pullover con Mancuerna).
Equipment: dumbbells.
Position: lying face up on a flat bench; close neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at bench height.
Movement: pull the nearly straight arms down and back past the hips, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: arms stay nearly straight; chest up; controlled return.
```

<a id="ex-pullover-en-maquina"></a>

### 112. Pullover en Máquina

Archivo: `pullover-en-maquina.mp4` · id `a1f6f03b-f7b7-4c56-b0fa-e8389e6ae192` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Machine Pullover (Pullover en Máquina).
Equipment: weight-stack machine.
Position: seated; medium-width neutral grip (palms facing each other).
Handling: Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side profile view, camera at chest height.
Movement: pull the nearly straight arms down and back past the hips, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: arms stay nearly straight; chest up; controlled return.
```

<a id="ex-remo-alto-iso-lateral"></a>

### 113. Remo Alto Iso-Lateral

Archivo: `remo-alto-iso-lateral.mp4` · id `5723718b-6600-4f71-8df8-9ca1828d33e2` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Iso-Lateral High Row (Remo Alto Iso-Lateral).
Equipment: plate-loaded machine.
Position: seated; medium-width neutral grip (palms facing each other).
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Both sides at the same time, each with its own implement.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull along a diagonal line towards the hip or chest, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbow; shoulder blade moves with the arm; controlled return.
```

<a id="ex-remo-con-barra"></a>

### 114. Remo con Barra

Archivo: `remo-con-barra.mp4` · id `5a5d4f1c-5733-4009-a025-3dedf219ac07` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Bent-Over Row (Remo con Barra).
Equipment: Olympic barbell.
Position: standing, hinged forward at the hips, torso at about 45 degrees from horizontal; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-con-mancuerna-a-una-mano"></a>

### 115. Remo con Mancuerna a una Mano

Archivo: `remo-con-mancuerna-a-una-mano.mp4` · id `79dc56ff-4564-4868-b656-3f17eed2e068` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: One-Arm Dumbbell Row (Remo con Mancuerna a una Mano).
Equipment: dumbbells.
Position: one knee and one hand on a bench, the other foot on the floor; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side three-quarter view from slightly behind, camera at bench height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-con-mancuernas-pecho-apoyado"></a>

### 116. Remo con Mancuernas Pecho Apoyado

Archivo: `remo-con-mancuernas-pecho-apoyado.mp4` · id `91d0615e-81d2-4206-a7c8-26ecf38d2b67` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Chest-Supported Dumbbell Row (Remo con Mancuernas Pecho Apoyado).
Equipment: dumbbells.
Position: chest down on an incline bench, bench set to about 30 degrees; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: side three-quarter view from slightly behind, camera at bench height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-en-maquina-con-pecho-apoyado"></a>

### 117. Remo en Máquina con Pecho Apoyado

Archivo: `remo-en-maquina-con-pecho-apoyado.mp4` · id `6d62de90-9327-4c94-b3d9-179abad74062` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Chest-Supported Machine Row (Remo en Máquina con Pecho Apoyado).
Equipment: plate-loaded machine.
Position: seated; medium-width neutral (or overhand) grip.
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-meadows"></a>

### 118. Remo Meadows

Archivo: `remo-meadows.mp4` · id `ddd455c5-d759-46c1-87ae-4242b740d857` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Meadows Row (Remo Meadows).
Equipment: landmine (barbell anchored at one end) with barbell sleeve.
Position: staggered stance, hinged forward at the hips, torso at about 40 degrees from horizontal; neutral grip (palms facing each other).
Handling: One end of the barbell is anchored to the floor; the trainer holds the free end.
One side at a time: demonstrate with the right side.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull along a diagonal line towards the hip or chest, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: lead with the elbow; shoulder blade moves with the arm; controlled return.
```

<a id="ex-remo-pendlay"></a>

### 119. Remo Pendlay

Archivo: `remo-pendlay.mp4` · id `16c2306b-534c-423a-862d-e9ee7858e3c0` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Pendlay Row (Remo Pendlay).
Equipment: Olympic barbell.
Position: standing, hinged forward at the hips, torso at about 15 degrees from horizontal; medium-width overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-sentado-en-cable-agarre-amplio"></a>

### 120. Remo Sentado en Cable Agarre Amplio

Archivo: `remo-sentado-en-cable-agarre-amplio.mp4` · id `a5074968-2414-42e5-a0e4-f47fa69bafdd` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Seated Cable Row Wide Grip (Remo Sentado en Cable Agarre Amplio).
Equipment: cable machine with wide lat bar.
Position: seated; wide overhand grip.
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-sentado-en-cable-agarre-neutro"></a>

### 121. Remo Sentado en Cable Agarre Neutro

Archivo: `remo-sentado-en-cable-agarre-neutro.mp4` · id `f8f0a37d-ca01-4ac6-945b-21f6199f1b32` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Seated Cable Row Neutral Grip (Remo Sentado en Cable Agarre Neutro).
Equipment: cable machine with close neutral-grip handle.
Position: seated; close neutral grip (palms facing each other).
Handling: The cable runs taut from the machine to the handle throughout the movement.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-t-bar"></a>

### 122. Remo T-Bar

Archivo: `remo-t-bar.mp4` · id `5081ae59-9021-45c7-bb67-194d5b934692` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: T-Bar Row (Remo T-Bar).
Equipment: landmine (barbell anchored at one end) with T-bar row handle.
Position: standing, hinged forward at the hips, torso at about 45 degrees from horizontal; close neutral grip (palms facing each other).
Handling: One end of the barbell is anchored to the floor; the trainer holds the free end.
Camera: side three-quarter view from slightly behind, camera at hip height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-remo-t-bar-con-pecho-apoyado"></a>

### 123. Remo T-Bar con Pecho Apoyado

Archivo: `remo-t-bar-con-pecho-apoyado.mp4` · id `eb5d83ed-952e-45c8-a50a-634be7293fdc` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Chest-Supported T-Bar Row (Remo T-Bar con Pecho Apoyado).
Equipment: plate-loaded machine with neutral-grip handles.
Position: chest down on an incline bench, bench set to about 35 degrees; medium-width neutral grip (palms facing each other).
Handling: Positioned in the machine as designed, pads adjusted to the body, hands on its handles.
Camera: side three-quarter view from slightly behind, camera at bench height.
Movement: pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: elbows drive back, not out; shoulder blades retract at the end; torso stays still, no jerking.
```

<a id="ex-rodillo-de-muneca"></a>

### 124. Rodillo de Muñeca

Archivo: `rodillo-de-muneca.mp4` · id `e7f6a2d9-cad1-4916-84c7-3c6539f15165` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Wrist Roller (Rodillo de Muñeca).
Equipment: wrist roller.
Position: standing; medium-width overhand grip.
Handling: Both hands on the roller, arms extended in front.
Camera: front view, camera close, at forearm height.
Movement: roll the wrists to wind the rope up, then unwind under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: arms stay still; full turns; steady rhythm.
```

<a id="ex-rompecraneos-con-barra-ez"></a>

### 125. Rompecráneos con Barra EZ

Archivo: `rompecraneos-con-barra-ez.mp4` · id `cd041515-c7a1-4b33-9190-880c019808d6` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: EZ-Bar Skull Crusher (Rompecráneos con Barra EZ).
Equipment: EZ curl bar.
Position: lying face up on a flat bench; medium-width semi-overhand grip.
Handling: Both hands on the EZ bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: front three-quarter view (45 degrees), camera at bench height.
Movement: extend the elbows fully against the resistance, pause, then bend them under control back to the start. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: upper arms fixed; full lockout at the end; controlled return.
```

<a id="ex-rotacion-de-tronco-en-cable"></a>

### 126. Rotación de Tronco en Cable

Archivo: `rotacion-de-tronco-en-cable.mp4` · id `8c92e9bb-aa28-42b9-8e3b-1cd767bafa8f` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Cable Trunk Rotation (Rotación de Tronco en Cable).
Equipment: cable machine with single D-handle.
Position: standing.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One direction at a time: demonstrate towards the right.
Camera: front view, camera at chest height.
Movement: rotate the trunk across the body through the hips and upper back, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: pivot the back foot; arms stay long; rotate from the hips, not the lower back.
```

<a id="ex-rueda-abdominal"></a>

### 127. Rueda Abdominal

Archivo: `rueda-abdominal.mp4` · id `eaeb8f46-b21f-4a14-977d-84fccae59656` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Ab Wheel Rollout (Rueda Abdominal).
Equipment: ab wheel.
Position: kneeling; medium-width neutral grip (palms facing each other).
Handling: Both hands on the wheel handles.
Camera: side profile view, camera low, at knee height.
Movement: keep the trunk rigid and the lower back neutral against the pull into extension, moving only the limbs as the exercise requires. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: ribs down, pelvis slightly tucked; lower back never arches; core braced throughout.
```

<a id="ex-sentadilla-bulgara-sesgo-cuadriceps"></a>

### 128. Sentadilla Búlgara - Sesgo Cuádriceps

Archivo: `sentadilla-bulgara-sesgo-cuadriceps.mp4` · id `112bda40-c1fc-4c62-a72a-a1f2c33e15f7` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bulgarian Split Squat - Quad Bias (Sentadilla Búlgara - Sesgo Cuádriceps).
Equipment: dumbbells.
Position: split stance with the rear foot elevated on a bench; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: front knee tracks over the foot; torso upright; rear knee hovers just above the floor.
```

<a id="ex-sentadilla-bulgara-sesgo-gluteo"></a>

### 129. Sentadilla Búlgara - Sesgo Glúteo

Archivo: `sentadilla-bulgara-sesgo-gluteo.mp4` · id `7410f3a3-d899-4fa0-8084-b1d99b3aa971` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bulgarian Split Squat - Glute Bias (Sentadilla Búlgara - Sesgo Glúteo).
Equipment: dumbbells.
Position: split stance with the rear foot elevated on a bench; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: front knee tracks over the foot; torso upright; rear knee hovers just above the floor.
```

<a id="ex-sentadilla-en-smith"></a>

### 130. Sentadilla en Smith

Archivo: `sentadilla-en-smith.mp4` · id `c5f5ab48-ca8e-4887-98b3-6fcd57f0816a` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Smith Machine Squat (Sentadilla en Smith).
Equipment: Smith machine.
Position: standing.
Handling: Both hands on the Smith machine bar, which slides on its fixed vertical rails.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-sentadilla-frontal"></a>

### 131. Sentadilla Frontal

Archivo: `sentadilla-frontal.mp4` · id `af842bf3-37c4-4252-90dc-c8acb3d79873` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Front Squat (Sentadilla Frontal).
Equipment: Olympic barbell.
Position: standing; shoulder-width front-rack position.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-sentadilla-goblet"></a>

### 132. Sentadilla Goblet

Archivo: `sentadilla-goblet.mp4` · id `c181333a-8fc6-403f-a707-c36056759a3f` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Goblet Squat (Sentadilla Goblet).
Equipment: dumbbells.
Position: standing; close neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-sentadilla-trasera"></a>

### 133. Sentadilla Trasera

Archivo: `sentadilla-trasera.mp4` · id `4f54d023-d529-416f-8faf-7a5c8791d172` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Barbell Back Squat (Sentadilla Trasera).
Equipment: Olympic barbell.
Position: standing; wide overhand grip.
Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.
Camera: side profile view, camera at hip height.
Movement: sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: knees track over the toes; chest up, neutral spine; whole foot stays flat on the floor.
```

<a id="ex-split-squat"></a>

### 134. Split Squat

Archivo: `split-squat.mp4` · id `92001e5e-6a5e-4464-8eb8-d550861a0b54` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Split Squat.
Equipment: dumbbells.
Position: split stance, one foot forward; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: front knee tracks over the foot; torso upright; rear knee hovers just above the floor.
```

<a id="ex-step-up-alto-con-sesgo-gluteo"></a>

### 135. Step-Up Alto con Sesgo Glúteo

Archivo: `step-up-alto-con-sesgo-gluteo.mp4` · id `3ffb5c23-21b7-4d38-9768-c3ab9c297cb4` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: High Step-Up - Glute Bias (Step-Up Alto con Sesgo Glúteo).
Equipment: dumbbells.
Position: standing on a step or platform; neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: front knee tracks over the foot; torso upright; rear knee hovers just above the floor.
```

<a id="ex-woodchop-alto-bajo"></a>

### 136. Woodchop Alto-Bajo

Archivo: `woodchop-alto-bajo.mp4` · id `06ac38a1-6b6d-46d9-9471-8870ad45e5c9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: High-to-Low Cable Woodchop (Woodchop Alto-Bajo).
Equipment: cable machine with single D-handle.
Position: standing.
Handling: The cable runs taut from the machine to the handle throughout the movement.
One direction at a time: demonstrate towards the right.
Camera: front view, camera at chest height.
Movement: rotate the trunk across the body through the hips and upper back, then return under control. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: pivot the back foot; arms stay long; rotate from the hips, not the lower back.
```

<a id="ex-zancada-inversa"></a>

### 137. Zancada Inversa

Archivo: `zancada-inversa.mp4` · id `211cb236-151e-44a0-8430-9dccce7bd0a3` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Reverse Lunge (Zancada Inversa).
Equipment: dumbbells.
Position: moving split stance (stepping); neutral grip (palms facing each other).
Handling: One dumbbell in each hand, wrists straight.
Alternate sides, one repetition each.
Camera: side profile view, camera at hip height.
Movement: step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up. Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.
Key form cues: front knee tracks over the foot; torso upright; rear knee hovers just above the floor.
```

## Cardio (8)

<a id="ex-air-bike"></a>

### 138. Air Bike

Archivo: `air-bike.mp4` · id `d476f58e-149a-4535-aff4-63874dbb057e` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Air Bike.
Equipment: air bike (fan bike).
Position: seated, with a continuous rowing or pedalling motion.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-bicicleta-estatica"></a>

### 139. Bicicleta Estática

Archivo: `bicicleta-estatica.mp4` · id `0fc5392c-ddac-4505-9f07-3ce9fea1c0bf` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Stationary Bike (Bicicleta Estática).
Equipment: stationary bike.
Position: seated.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-caminata-en-cinta"></a>

### 140. Caminata en Cinta

Archivo: `caminata-en-cinta.mp4` · id `d781fbfe-de0b-4282-a5eb-1136cc4e7350` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Treadmill Walking (Caminata en Cinta).
Equipment: treadmill.
Position: walking.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-caminata-inclinada-en-cinta"></a>

### 141. Caminata Inclinada en Cinta

Archivo: `caminata-inclinada-en-cinta.mp4` · id `0fa983b1-160a-419d-b508-8d5cae4f6ebd` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Incline Treadmill Walking (Caminata Inclinada en Cinta).
Equipment: treadmill.
Position: walking.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-carrera-en-cinta"></a>

### 142. Carrera en Cinta

Archivo: `carrera-en-cinta.mp4` · id `eda832b9-5a7a-49a3-a18e-1662913c97c9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Treadmill Running (Carrera en Cinta).
Equipment: treadmill.
Position: running.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-eliptica"></a>

### 143. Elíptica

Archivo: `eliptica.mp4` · id `b0dead4b-ca38-4903-b294-6bc1cefc4aaa` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Elliptical Trainer (Elíptica).
Equipment: elliptical trainer.
Position: standing.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-escaladora"></a>

### 144. Escaladora

Archivo: `escaladora.mp4` · id `290778aa-949f-4af6-ad42-25df0d2f92bf` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Stair Climber (Escaladora).
Equipment: stair climber machine.
Position: standing.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

<a id="ex-remo-ergometro"></a>

### 145. Remo Ergómetro

Archivo: `remo-ergometro.mp4` · id `22f7fbe9-15f5-4ee8-8336-1d68e52bd8b0` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Rowing Ergometer (Remo Ergómetro).
Equipment: rowing ergometer.
Position: seated, with a continuous rowing or pedalling motion.
Camera: side profile view, camera at hip height.
Movement: perform the continuous locomotion at a steady, moderate pace. Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.
Key form cues: relaxed shoulders; even rhythm; natural posture.
```

## Estiramiento (6)

<a id="ex-estiramiento-de-cuadriceps"></a>

### 146. Estiramiento de Cuádriceps

Archivo: `estiramiento-de-cuadriceps.mp4` · id `bff71b29-c365-4b44-ab49-d1b735f36ea0` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Standing Quadriceps Stretch (Estiramiento de Cuádriceps).
Equipment: no equipment, bodyweight only.
Position: standing, holding a support for balance.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

<a id="ex-estiramiento-de-dorsal-en-banco"></a>

### 147. Estiramiento de Dorsal en Banco

Archivo: `estiramiento-de-dorsal-en-banco.mp4` · id `065ea689-b5ea-427e-afd5-dbb8c611d8d9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Bench Lat Stretch (Estiramiento de Dorsal en Banco).
Equipment: flat bench.
Position: kneeling.
Camera: side profile view, camera low, at knee height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

<a id="ex-estiramiento-de-flexor-de-cadera"></a>

### 148. Estiramiento de Flexor de Cadera

Archivo: `estiramiento-de-flexor-de-cadera.mp4` · id `22816682-d48c-4d01-911b-171716547b12` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Half-Kneeling Hip Flexor Stretch (Estiramiento de Flexor de Cadera).
Equipment: no equipment, bodyweight only.
Position: half-kneeling, one knee down.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera low, at knee height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

<a id="ex-estiramiento-de-gemelo-en-pared"></a>

### 149. Estiramiento de Gemelo en Pared

Archivo: `estiramiento-de-gemelo-en-pared.mp4` · id `a4d39464-5ac8-47f0-89de-c90a788378a9` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Wall Calf Stretch (Estiramiento de Gemelo en Pared).
Equipment: a wall.
Position: split stance, one foot forward.
One side at a time: demonstrate with the right side.
Camera: side profile view, camera at hip height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

<a id="ex-estiramiento-de-isquiotibiales"></a>

### 150. Estiramiento de Isquiotibiales

Archivo: `estiramiento-de-isquiotibiales.mp4` · id `1ba90014-f510-4a90-9e9b-a478b7fb9398` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Hamstring Stretch (Estiramiento de Isquiotibiales).
Equipment: no equipment, bodyweight only.
Position: seated (standing is also valid).
Camera: side profile view, camera at hip height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

<a id="ex-estiramiento-de-pectoral-en-marco"></a>

### 151. Estiramiento de Pectoral en Marco

Archivo: `estiramiento-de-pectoral-en-marco.mp4` · id `71a43f01-b08a-4fb2-a6e5-33167c416fbf` · [↑ índice](#índice)

```text
Instructional fitness video for a workout app: a certified personal trainer
demonstrates one exercise with correct technique, in plain dark training clothes.
Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,
nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.
Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.
Clean footage without on-screen text or music.

Exercise: Doorway Chest Stretch (Estiramiento de Pectoral en Marco).
Equipment: a doorway frame.
Position: standing.
Camera: side profile view, camera at hip height.
Movement: move slowly into the stretch position until a gentle stretch is felt. Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.
Key form cues: no bouncing; relaxed breathing; stretch, never pain.
```

