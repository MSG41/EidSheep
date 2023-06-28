import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/Users/salim/Desktop/EidSheep/EidSheep/EidSheep/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  assetsInclude: ['**/*.glb', '**/*.mp3']
})
