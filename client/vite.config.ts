import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Backend port (default 43451, overridable with PORT env var)
const backendPort = process.env.PORT || '43451'

// Vite dev server port (hardcoded to 7979 to avoid conflicts)
const vitePort = 7979
const strictPort = true  // fail if port is in use instead of incrementing

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
    port: vitePort,
    strictPort,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/events': `http://localhost:${backendPort}`,
      '/hook': `http://localhost:${backendPort}`,
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
