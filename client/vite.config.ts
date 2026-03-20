import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT || '43451'

// WebGL contexts are incompatible with HMR — force full page reload
// for any file in canvas-pixi/ instead of attempting hot-swap
function pixiFullReload(): Plugin {
  return {
    name: 'pixi-full-reload',
    handleHotUpdate({ file, server }) {
      if (file.includes('/canvas-pixi/')) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), pixiFullReload()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
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
