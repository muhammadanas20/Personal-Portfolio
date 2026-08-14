import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  resolve: {
    alias: {
      // Lets src files import via "@/components/..." etc.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
