import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuración separada de `vite.config.js`: los tests no necesitan el plugin
// de Tailwind (no se compila CSS) y así el arranque es mucho más rápido.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/tests/**', 'src/**/*.test.{js,jsx}'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 65,
        statements: 60,
      },
    },
  },
});
