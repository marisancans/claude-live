import { createServer } from 'http'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname, resolve, sep } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { homedir } from 'os'
import { SessionScanner } from './session-scanner.js'
import { buildProjectTree, listActiveProjects } from './project-tree.js'
import { readProjectHistoryFromDisk } from './history-reader.js'

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
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function filterHistory(events, { sessionId, projectId }) {
  return events.filter(event => {
    if (sessionId && event.session_id !== sessionId) return false
    if (projectId && resolve(event.cwd || '') !== projectId) return false
    return true
  })
}

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
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value)
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const requestUrl = new URL(req.url || '/', 'http://localhost')
  const pathname = requestUrl.pathname

  // POST /hook — used by debug panel to inject test events
  if (req.method === 'POST' && pathname === '/hook') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const event = {
          id: payload.id || `hook-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          session_id: payload.session_id || 'debug',
          timestamp: payload.timestamp || Date.now(),
          hook_event_name: payload.hook_event_name || null,
          tool_name: payload.tool_name || null,
          tool_input: payload.tool_input || null,
          tool_response: payload.tool_response || null,
          agent_id: payload.agent_id || null,
          agent_type: payload.agent_type || null,
          cwd: payload.cwd || null,
          error: payload.error || null,
          tool_use_id: payload.tool_use_id || null,
          prompt: payload.prompt || null,
          model: payload.model || null,
          source: 'hook',
          reason: payload.reason || null,
          permission_mode: payload.permission_mode || null,
          is_interrupt: payload.is_interrupt || null,
          trigger: payload.trigger || null,
          compact_summary: payload.compact_summary || null,
          last_assistant_message: payload.last_assistant_message || null,
          notification_type: payload.notification_type || null,
          title: payload.title || null,
          agent_transcript_path: payload.agent_transcript_path || null,
          memory_type: payload.memory_type || null,
        }
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
  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, version: VERSION, clients: clients.size, port: PORT }))
    return
  }

  if (req.method === 'GET' && pathname === '/api/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ projects: listActiveProjects(eventHistory) }))
    return
  }

  if (req.method === 'GET' && pathname === '/api/project-tree') {
    const projects = listActiveProjects(eventHistory)
    const projectId = requestUrl.searchParams.get('project')
    if (!projectId) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'missing project query parameter' }))
      return
    }

    const normalizedId = resolve(projectId)
    const project = projects.find(item => resolve(item.root) === normalizedId)
    if (!project) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'project not active or unavailable' }))
      return
    }

    try {
      const tree = buildProjectTree(project.root)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tree))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'failed to build tree' }))
    }
    return
  }

  // GET /api/history?session=ID — events for a specific session since last compact
  if (req.method === 'GET' && pathname === '/api/history') {
    const sessionFilter = requestUrl.searchParams.get('session')
    const projectFilter = requestUrl.searchParams.get('project')
    const persisted = requestUrl.searchParams.get('persisted') === '1'
    const normalizedProject = projectFilter ? resolve(projectFilter) : null
    let events = persisted && normalizedProject
      ? readProjectHistoryFromDisk(PROJECTS_DIR, normalizedProject)
      : eventHistory

    events = filterHistory(events, { sessionId: sessionFilter, projectId: normalizedProject })
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
  if (req.method === 'GET' && pathname === '/events') {
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
  const urlPath = pathname
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
