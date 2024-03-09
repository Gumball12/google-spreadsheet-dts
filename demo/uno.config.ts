import { defineConfig } from 'unocss';
import presetWind from '@unocss/preset-wind';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  shortcuts: {
    btn: 'flex items-center justify-center p-2 text-white rounded-md transition bg-neutral-800 hover:bg-neutral-800/80 active:bg-neutral-800/60',
  },
  presets: [
    presetWind(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
});
