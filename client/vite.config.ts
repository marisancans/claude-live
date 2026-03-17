import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/events': 'http://localhost:43451',
      '/hook': 'http://localhost:43451',
      '/buffer': 'http://localhost:43451',
    }
  },
  build: {
    outDir: 'dist'
  }
})
