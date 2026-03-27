import { createServer } from 'http'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = parseInt(process.env.PORT || '43451', 10)
const DIST = process.env.CLAUDE_LIVE_STATIC_DIR
  || join(__dirname, '..', 'client', 'dist')

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
}

const clients = new Set()

function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    try { res.write(msg) } catch { clients.delete(res) }
  }
}

const server = createServer((req, res) => {
  // POST /hook — receive event, broadcast to SSE clients
  if (req.method === 'POST' && req.url === '/hook') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const event = JSON.parse(body)
        broadcast({ type: 'event', data: event })
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end('{"ok":true}')
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end('{"error":"invalid json"}')
      }
    })
    return
  }

  // GET /events — SSE stream
  if (req.method === 'GET' && req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })
    res.write(': connected\n\n')
    clients.add(res)
    const heartbeat = setInterval(() => {
      try { res.write(': heartbeat\n\n') } catch { clearInterval(heartbeat); clients.delete(res) }
    }, 15000)
    req.on('close', () => { clearInterval(heartbeat); clients.delete(res) })
    return
  }

  // Static files
  let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url)
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(DIST, 'index.html') // SPA fallback
  }
  if (!existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }
  const ext = extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': mime })
  res.end(readFileSync(filePath))
})

server.listen(PORT, () => {
  console.log(`claude-live running at http://localhost:${PORT}`)
})
