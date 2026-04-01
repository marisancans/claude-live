import { createServer } from 'http'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname, resolve, sep } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { homedir } from 'os'
import { SessionScanner } from './session-scanner.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const VERSION = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')).version
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
const eventHistory = [] // all events seen since server start
const MAX_HISTORY = 5000

function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    try { res.write(msg) } catch { clients.delete(res) }
  }
  // Buffer for history API
  if (data.type === 'event') {
    eventHistory.push(data.data)
    if (eventHistory.length > MAX_HISTORY) eventHistory.splice(0, eventHistory.length - MAX_HISTORY)
  }
}

const server = createServer((req, res) => {
  // POST /hook — used by debug panel to inject test events
  if (req.method === 'POST' && req.url === '/hook') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const event = JSON.parse(body)
        if (!event.id) event.id = `hook-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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

  // GET /health — health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, version: VERSION, clients: clients.size, port: PORT }))
    return
  }

  // GET /api/history?session=ID — events for a specific session since last compact
  if (req.method === 'GET' && req.url.startsWith('/api/history')) {
    const url = new URL(req.url, 'http://localhost')
    const sessionFilter = url.searchParams.get('session')
    let events = sessionFilter
      ? eventHistory.filter(e => e.session_id === sessionFilter)
      : eventHistory
    // Only return events since the last PostCompact — history before that is irrelevant
    let lastCompact = -1
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].hook_event_name === 'PostCompact') { lastCompact = i; break }
    }
    if (lastCompact >= 0) events = events.slice(lastCompact + 1)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(events))
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
  const urlPath = new URL(req.url, 'http://localhost').pathname
  let filePath = join(DIST, urlPath === '/' ? 'index.html' : urlPath)
  if (!resolve(filePath).startsWith(resolve(DIST) + sep) && resolve(filePath) !== resolve(DIST)) {
    filePath = join(DIST, 'index.html')
  }
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

const PROJECTS_DIR = process.env.CLAUDE_PROJECTS_DIR
  || join(homedir(), '.claude', 'projects')

const scanner = new SessionScanner(PROJECTS_DIR, event => {
  broadcast({ type: 'event', data: event })
})

// Only auto-start when run directly (not imported for testing)
const isMainModule = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
if (isMainModule) {
  server.listen(PORT, () => {
    console.log(`claude-live running at http://localhost:${PORT}`)
    scanner.start()
    console.log(`watching ${PROJECTS_DIR} for sessions`)
  })
}

export { server, scanner, broadcast }
