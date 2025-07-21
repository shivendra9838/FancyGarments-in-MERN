// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  root: './',
  build: {
    outDir: 'dist',
  },
  server: {port: 5173,
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API calls to Express
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
