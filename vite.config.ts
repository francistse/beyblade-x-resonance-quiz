import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Pages project site: https://<user>.github.io/<repo>/ */
const GITHUB_PAGES_REPO = 'beyblade-x-resonance-quiz';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${GITHUB_PAGES_REPO}/` : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
          }
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
  },
}));
