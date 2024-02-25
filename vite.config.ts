import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        parser: resolve(__dirname, 'src/parser/index.ts'),
      },
      name: 'googleSpreadsheetDts',
    },
    rollupOptions: {
      external: ['node:fs'],
    },
  },
});
