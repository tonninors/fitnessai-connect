# Despliegue

La app se despliega como **un solo servicio**: el mismo proceso Express sirve la
API en `/api/*` y el build de la SPA en el resto de rutas.

Por qué así y no frontend y backend separados:

- Todo queda en el mismo origen, así que **CORS deja de intervenir** y no hay que
  mantener `FRONTEND_URL` sincronizada con el dominio del frontend.
- `client.js` ya cae a `/api` relativo cuando `VITE_API_URL` no está definida, así
  que no hace falta tocar código para cambiar de modo.
- Se paga un servicio, no dos.

Si en el futuro el frontend se mueve a un CDN (Vercel, Cloudflare Pages), basta
con definir `VITE_API_URL` en el build y `FRONTEND_URL` en el backend: el código
soporta los dos modos sin cambios.

---

## Cómo funciona el modo un solo servicio

`resolveFrontendDist()` en `backend/app.js` busca `frontend/dist/index.html`:

- **Si existe** → Express sirve los estáticos y hace fallback a `index.html` en
  cualquier ruta que no empiece por `/api/`, para que los deep links de la SPA
  funcionen al recargar.
- **Si no existe** → la app se comporta como una API pura. Es lo que pasa en
  desarrollo, donde el frontend lo sirve Vite en el 5173 con su propio proxy.

Dos detalles que importan:

- Los estáticos se montan **antes del rate limiter**. Una sola carga de la SPA
  pide decenas de assets y agotaría por sí sola la cuota de 100 peticiones por
  ventana.
- `index.html` se sirve con `Cache-Control: no-cache` y los assets con
  `max-age=31536000`. Los assets llevan hash en el nombre, así que son
  cacheables para siempre; el `index.html` no puede serlo, o tras un despliegue
  el navegador seguiría pidiendo bundles que ya no existen.

`FRONTEND_DIST` permite apuntar a otra carpeta de build. Solo se usa en tests.

---

## Desplegar en Railway

1. **Crear el proyecto**: New Project → Deploy from GitHub repo → elegir este
   repositorio. Railway lee `railway.json` de la raíz, así que el build y el
   arranque ya están definidos:
   - build → `npm run build:deploy` (instala backend y frontend, y compila la SPA)
   - start → `npm start --prefix backend`
   - healthcheck → `/health`

2. **Cargar las variables de entorno** (Variables → RAW Editor):

   ```
   NODE_ENV=production
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   SUPABASE_ANON_KEY=eyJ...
   GROQ_API_KEY=gsk_...
   APP_TIMEZONE=America/Mexico_City
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

   - `PORT` la inyecta Railway, no hay que definirla.
   - **No definir `VITE_API_URL`**: si queda vacía, el frontend usa `/api`
     relativo, que es justo lo que se quiere aquí.
   - **No definir `FRONTEND_URL`**: al ser mismo origen no hace falta, y dejarla
     vacía en producción hace que `allowedOrigins()` devuelva `[]`, o sea que
     ningún sitio externo puede llamar a la API desde un navegador.
   - Las `VITE_*` se leen en **tiempo de build**, no en ejecución. Si las cambiás
     hay que volver a desplegar para que entren al bundle.

3. **Generar el dominio**: Settings → Networking → Generate Domain. Queda algo
   como `https://fitnessai-connect-production.up.railway.app`.

4. **Actualizar Supabase Auth**: Authentication → URL Configuration, agregar ese
   dominio a *Site URL* y a *Redirect URLs*. Sin esto, el correo de recuperación
   de contraseña sigue apuntando a `localhost` y no abre desde el celular.
   `Login.jsx` usa `redirectTo: window.location.origin`.

5. **Verificar**:
   ```bash
   curl https://TU-DOMINIO.up.railway.app/health
   curl -o /dev/null -w "%{http_code}\n" https://TU-DOMINIO.up.railway.app/
   ```
   El primero devuelve `{"status":"ok",...}` y el segundo `200`.

---

## Seguridad

`SUPABASE_SERVICE_ROLE_KEY` **saltea RLS por completo**: cualquiera que la tenga
puede leer y escribir toda la base. Va solo en variables del backend, nunca en
una `VITE_*` — todo lo que empieza con `VITE_` termina dentro del bundle público
que se descarga el navegador.

El backend usa `service_role`, así que RLS no protege los endpoints. La única
barrera son los chequeos explícitos de propiedad (`assertSessionOwnership()` y
`assertExerciseInSession()` en `routes/workouts.js`) y el scope por
`req.user.id` en cada consulta.

---

## Notas

- `npm start` en el backend corre `node server.js` sin `--env-file`. En
  producción no existe un archivo `.env` y Node aborta si se le pasa uno que no
  está; las variables llegan del entorno y `server.js` ya llama a
  `dotenv.config()` para el caso local.
- `server.js` sale con código 1 si faltan `SUPABASE_URL` o
  `SUPABASE_SERVICE_ROLE_KEY`. Si el deploy queda en *crashed* nada más arrancar,
  ese suele ser el motivo: mirar los logs.
- Sin `GROQ_API_KEY` la app levanta igual, pero los endpoints de IA responden 503.
- `frontend/dist/` está en `.gitignore`. Se genera en cada build del deploy, no
  se commitea.
