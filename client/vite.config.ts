import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT || '43451'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/events': `http://localhost:${port}`,
      '/hook': `http://localhost:${port}`,
      '/buffer': `http://localhost:${port}`,
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
