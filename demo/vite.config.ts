import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import UnoCss from 'unocss/vite';

export default defineConfig({
  base: '/google-spreadsheet-dts/',
  plugins: [react(), UnoCss()],
  build: {
    rollupOptions: {
      external: ['node:fs'],
    },
  },
});
