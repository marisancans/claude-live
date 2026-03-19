import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend port (default 43451, overridable with PORT env var)
const backendPort = process.env.PORT || '43451'

// Vite dev server port (hardcoded to 7979 to avoid conflicts)
const vitePort = 7979

export default defineConfig({
  plugins: [react()],
  server: {
    port: vitePort,
    proxy: {
      '/events': `http://localhost:${backendPort}`,
      '/hook': `http://localhost:${backendPort}`,
      '/buffer': `http://localhost:${backendPort}`,
    }
  },
  build: {
    outDir: 'dist'
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
