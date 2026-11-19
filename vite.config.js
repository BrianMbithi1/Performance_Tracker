import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // The CODM API doesn't allow requests from other websites (no CORS headers),
  // so during development Vite forwards /codm-api/... to it for us.
  // vercel.json does the same job once the app is deployed.
  server: {
    proxy: {
      '/codm-api': {
        target: 'https://callofdutymobile.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/codm-api/, ''),
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    coverage: {
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/tests/**'],
      thresholds: { lines: 65, functions: 65, branches: 65, statements: 65 },
    },
  },
});
