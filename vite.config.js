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
        manualChunks(id) {
          // React core libraries
          if (id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }

          // Firebase packages
          if (id.includes('node_modules/firebase') ||
            id.includes('node_modules/@firebase')) {
            return 'firebase-vendor';
          }

          // Chart libraries (only loaded on Dashboard)
          if (id.includes('node_modules/recharts') ||
            id.includes('node_modules/d3-')) {
            return 'charts-vendor';
          }

          // PDF generation (only loaded when downloading receipts)
          if (id.includes('node_modules/jspdf') ||
            id.includes('node_modules/jspdf-autotable')) {
            return 'pdf-vendor';
          }

          // UI libraries
          if (id.includes('node_modules/react-toastify') ||
            id.includes('node_modules/react-datepicker') ||
            id.includes('node_modules/react-icons')) {
            return 'ui-vendor';
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'misc-vendor';
          }
        },
      },
    },
  },
});
