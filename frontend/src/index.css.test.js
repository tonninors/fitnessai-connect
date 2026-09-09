import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// jsdom no calcula layout ni compila Tailwind, así que estos bugs no se pueden
// reproducir renderizando el componente. Lo que sí se puede fijar es la regla
// de CSS: las cuatro de acá abajo se ven redundantes y alguien las podría
// borrar en una limpieza sin saber qué rompe. El test explica el porqué.
// Se resuelve desde `process.cwd()` (la raíz de /frontend, donde vive
// `vitest.config.js`): Vite reescribe `import.meta.url` y deja de ser file://.
const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

describe('index.css — reglas de layout móvil', () => {
  it('#root ocupa todo el ancho', () => {
    // Sin esto, `#root` es un hijo flex de un body con `align-items: center` y
    // su ancho lo fija el contenido. Login y ResetPassword quedaban tan
    // angostos como su texto más largo.
    expect(css).toMatch(/#root\s*\{[^}]*width:\s*100%/);
  });

  it('no oculta el contenedor de decoración de los campos de texto', () => {
    // `display: none` sobre este pseudo dejaba el campo de contraseña sin
    // placeholder y colapsado a una línea en WebKit (iOS).
    expect(css).not.toMatch(/::-webkit-textfield-decoration-container\s*\{/);
  });

  it('los campos miden 16px en móvil para que iOS no haga zoom al enfocar', () => {
    const movil = css.match(/@media\s*\(max-width:\s*460px\)\s*\{[\s\S]*?\n\}/);
    expect(movil, 'falta el bloque @media (max-width: 460px)').not.toBeNull();
    expect(movil[0]).toMatch(/input:is\([^)]*\[type="password"\][^)]*\)[\s\S]*?font-size:\s*16px/);
  });

  it('las pantallas a altura completa usan dvh además de vh', () => {
    // En iOS `100vh` mide la ventana con la barra del navegador retraída y
    // deja un scroll muerto; `dvh` sigue a la barra. El `vh` se conserva como
    // fallback para navegadores sin soporte.
    for (const selector of ['body', '\\.login-wrap']) {
      const bloque = css.match(new RegExp(`^${selector}\\s*\\{[^}]*\\}`, 'm'));
      expect(bloque, `no se encontró el bloque de ${selector}`).not.toBeNull();
      expect(bloque[0], `${selector} sin fallback vh`).toMatch(/min-height:\s*100vh/);
      expect(bloque[0], `${selector} sin dvh`).toMatch(/min-height:\s*100dvh/);
    }
  });
});
