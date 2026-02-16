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
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'framework';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('jspdf')) {
              return 'jspdf';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            if (id.includes('react-toastify') || id.includes('react-slick') || id.includes('slick-carousel')) {
              return 'ui-libs';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
