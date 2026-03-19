import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend port (default 43451, overridable with PORT env var)
const backendPort = process.env.PORT || '43451'

// Vite dev server port (default 5173, overridable with VITE_PORT env var)
const vitePort = parseInt(process.env.VITE_PORT || '5173', 10)

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
