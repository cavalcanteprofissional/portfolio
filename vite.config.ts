import { resolve } from 'node:path';
import { mkdirSync, copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typegpu from 'unplugin-typegpu/vite';

export default defineConfig({
  plugins: [
    typegpu(),
    react(),
    {
      name: 'gh-pages-spa-404',
      apply: 'build',
      closeBundle() {
        // SPA fallback do site (rota inexistente -> index)
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
        // Admin como pagina propria também acessível como /admin (sem extensão)
        mkdirSync(resolve('dist/admin'), { recursive: true });
        copyFileSync(resolve('dist/admin.html'), resolve('dist/admin/index.html'));
        copyFileSync(resolve('dist/admin.html'), resolve('dist/admin/404.html'));
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        admin: resolve('admin.html'),
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion'],
          'vendor-lucide': ['lucide-react'],
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
  base: '/portfolio-cavalcante/',
});