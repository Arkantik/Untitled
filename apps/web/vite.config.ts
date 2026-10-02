import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/static': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [tanstackStart(), react()],
  optimizeDeps: {
    include: ['@hugeicons/react', '@hugeicons/core-free-icons'],
  },
  ssr: {
    noExternal: ['@hugeicons/react', '@hugeicons/core-free-icons'],
  },
});
