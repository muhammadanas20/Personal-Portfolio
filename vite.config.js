import { defineConfig } from 'vite'
import react from '@vitejs.plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://anastrix.live',
      // Add client-side paths if you have multiple pages:
      dynamicRoutes: ['/about', '/projects', '/contact'],
      robots: [{ userAgent: '*', allow: '/' }]
    })
  ]
})
