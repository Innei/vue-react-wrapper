import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { presetWind } from '@unocss/preset-wind'
import vue from '@vitejs/plugin-vue'

const { resolve } = require('path')

export default defineConfig({
  base: '',
  plugins: [
    unocss({
      presets: [presetWind()],
    }),
    tsconfigPaths({
      projects: [
        resolve(__dirname, './example/tsconfig.json'),
        resolve(__dirname, './tsconfig.json'),
      ],
    }),
    vue(),
  ],
  root: resolve(__dirname, './example'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './example/index.html'),
      },
    },
  },
})
