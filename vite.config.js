import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // the site is served from a subpath on GitHub Pages, in dev and prod alike
  base: '/portfolio/',
  plugins: [
    // classic runtime: this app is on React 16, which predates the automatic one
    react({ jsxRuntime: 'classic' }),
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
});
