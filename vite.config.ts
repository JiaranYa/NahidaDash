import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [
    vue(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: 'src/electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: 'src/electron/preload.ts',
      },
    }),
  ],
})
