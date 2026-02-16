import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Set the base path to root
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks removed to fix dependency loading order
      },
    },
  },
});
