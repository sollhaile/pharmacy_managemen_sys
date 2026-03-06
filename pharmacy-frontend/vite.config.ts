import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: false // This removes the error overlay
    }
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // This reduces source map warnings
  css: {
    devSourcemap: false
  }
})
