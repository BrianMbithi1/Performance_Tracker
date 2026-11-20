import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

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
