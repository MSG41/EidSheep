import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/Users/salim/Desktop/EidSheep/EidSheep/EidSheep/src'
    }
  },
  assetsInclude: ['**/*.glb', '**/*.mp3']
})
