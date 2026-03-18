import express from 'express'
import { createHash, randomUUID } from 'crypto'
import { createServer as createHttpServer } from 'http'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, '../client/dist')
const EVENTS_PER_SESSION = 50  // rolling buffer per session
const SESSION_TIMEOUT_MS = 11 * 60 * 1000  // 11 minutes (server-side cleanup)
const HEARTBEAT_MS = 15000

// ── Ported from client constants/nodeKeys (JS) ──────────────────────────────

const TOOL_COLOR_HEX = {
  Read: '#4ade80', Edit: '#60a5fa', Write: '#60a5fa',
  Bash: '#f59e0b', Grep: '#a78bfa', Glob: '#a78bfa',
  WebFetch: '#f472b6', Stop: '#888888', Notification: '#34d399',
}
const DEFAULT_HEX = '#555555'
const FILE_TOOLS = new Set(['Read', 'Edit', 'Write', 'Glob', 'Grep'])

function nodeKeyFor(event) {
  const t = event.tool_name
  if (!t) {
    if (event.hook_event_name === 'Stop') return 'session:stop'
    if (event.hook_event_name === 'Notification') {
      const msg = event.tool_input?.message || ''
      return `notification:${msg.slice(0, 20)}`
    }
    return null
  }
  const input = event.tool_input || {}
  if (FILE_TOOLS.has(t)) {
    const fp = input.file_path || input.path || null
    return fp ? `file:${fp}` : null
  }
  if (t === 'Bash') return `bash:${input.command || ''}`
  if (t === 'WebFetch') {
    try { return `web:${new URL(input.url || '').hostname}` } catch { return 'web:unknown' }
  }
  return `tool:${t}`
}

function nodeTypeFor(event) {
  const t = event.tool_name
  if (FILE_TOOLS.has(t || '')) return 'file'
  if (t === 'Bash') return 'bash'
  if (t === 'WebFetch') return 'web'
  if (event.hook_event_name === 'Stop') return 'stop'
  if (event.hook_event_name === 'Notification') return 'notification'
  return 'tool'
}

function labelFor(event) {
  const t = event.tool_name
  const input = event.tool_input || {}
  if (FILE_TOOLS.has(t || '')) {
    const fp = input.file_path || input.path || ''
    return fp.split('/').pop() || fp
  }
  if (t === 'Bash') return `$ ${(input.command || '').slice(0, 22)}`
  if (t === 'WebFetch') { try { return `↗ ${new URL(input.url || '').hostname}` } catch { return '↗ web' } }
  if (event.hook_event_name === 'Stop') return '✓ done'
  if (event.hook_event_name === 'Notification') return (input.message || 'notification').slice(0, 24)
  return t || event.hook_event_name || '?'
}

// ── State snapshot computation ───────────────────────────────────────────────

// Compute a lightweight state snapshot from a session's event buffer.
// Returns null if the session has no events.
function computeSessionSnapshot(session_id, events) {
  if (events.length === 0) return null

  let label = null
  let cwd = null
  let stopping = false
  let eventCount = events.length

  // file nodes: persistent, grow with each touch
  const fileNodes = new Map()  // key → { key, nodeType, label, colorHex, baseRadius }
  // ephemeral keys seen in recent N events (they decay fast so only show recent ones)
  const RECENT_N = 15
  const recentEphemeralKeys = new Set()

  for (let i = 0; i < events.length; i++) {
    const event = events[i]

    if (event.cwd) cwd = event.cwd
    if (cwd && (!label || label.length <= 8)) {
      const parts = cwd.split('/').filter(Boolean)
      label = parts[parts.length - 1] || null
    }

    if (event.hook_event_name === 'Stop') {
      stopping = true
    } else if (event.hook_event_name !== 'SessionEnd') {
      stopping = false
    }

    const key = nodeKeyFor(event)
    if (!key) continue
    const type = nodeTypeFor(event)
    const isFile = type === 'file'
    const colorHex = TOOL_COLOR_HEX[event.tool_name || event.hook_event_name] ?? DEFAULT_HEX

    if (isFile) {
      if (fileNodes.has(key)) {
        fileNodes.get(key).baseRadius = Math.min(8, fileNodes.get(key).baseRadius + 0.3)
      } else {
        fileNodes.set(key, { key, nodeType: type, label: labelFor(event), colorHex, baseRadius: 2.5 })
      }
    } else if (i >= events.length - RECENT_N) {
      recentEphemeralKeys.add(key)
    }
  }

  // Build node list: files first, then recent ephemerals
  const nodes = [...fileNodes.values()]

  // Add recent ephemerals (not already in files)
  const fileKeySet = new Set(fileNodes.keys())
  for (let i = Math.max(0, events.length - RECENT_N); i < events.length; i++) {
    const event = events[i]
    const key = nodeKeyFor(event)
    if (!key || fileKeySet.has(key)) continue
    const type = nodeTypeFor(event)
    const colorHex = TOOL_COLOR_HEX[event.tool_name || event.hook_event_name] ?? DEFAULT_HEX
    if (!nodes.find(n => n.key === key)) {
      nodes.push({ key, nodeType: type, label: labelFor(event), colorHex, baseRadius: 4 })
    }
  }

  // Ring assignment is handled by the client (server just sends node data)
  return {
    session_id,
    label: label || session_id.slice(0, 8),
    cwd,
    stopping,
    eventCount,
    nodes,  // [{ key, nodeType, label, colorHex, baseRadius }]
  }
}

// ── Server ───────────────────────────────────────────────────────────────────

function makeSessionId(ip, ts) {
  return 'unknown-' + createHash('sha1').update(ip + ts).digest('hex').slice(0, 8)
}

function normalizeEvent(raw, remoteIp) {
  const session_id = raw.session_id?.trim() || makeSessionId(remoteIp, Date.now().toString())
  return {
    id: randomUUID(),
    session_id,
    timestamp: Date.now(),
    hook_event_name: raw.hook_event_name ?? null,
    tool_name: raw.tool_name ?? null,
    tool_input: raw.tool_input ?? null,
    tool_response: raw.tool_response ?? null,
    agent_id: raw.agent_id ?? null,
    agent_type: raw.agent_type ?? null,
    cwd: raw.cwd ?? null,
    error: raw.error ?? null,
    tool_use_id: raw.tool_use_id ?? null,
    prompt: raw.prompt ?? null,
    model: raw.model ?? null,
    source: raw.source ?? null,
    reason: raw.reason ?? null,
    permission_mode: raw.permission_mode ?? null,
    is_interrupt: raw.is_interrupt ?? null,
    trigger: raw.trigger ?? null,
    compact_summary: raw.compact_summary ?? null,
    last_assistant_message: raw.last_assistant_message ?? null,
    notification_type: raw.notification_type ?? null,
    title: raw.title ?? null,
    agent_transcript_path: raw.agent_transcript_path ?? null,
    file_path_loaded: raw.file_path ?? null,
    memory_type: raw.memory_type ?? null,
  }
}

export function createServer({ port = 43451 } = {}) {
  const app = express()
  const clients = new Set()
  const sessionBuffers = new Map()  // session_id -> { events: [], lastEventTime: number }

  function getOrCreateSession(sessionId) {
    if (!sessionBuffers.has(sessionId)) {
      sessionBuffers.set(sessionId, { events: [], lastEventTime: Date.now() })
    }
    return sessionBuffers.get(sessionId)
  }

  function cleanupStaleSessions() {
    const now = Date.now()
    for (const [sid, session] of sessionBuffers) {
      if (now - session.lastEventTime > SESSION_TIMEOUT_MS) {
        sessionBuffers.delete(sid)
      }
    }
  }

  app.use(express.json())

  app.post('/hook', (req, res) => {
    const raw = req.body
    if (!raw || typeof raw !== 'object') return res.status(400).json({ error: 'invalid json' })
    const event = normalizeEvent(raw, req.ip)
    const session = getOrCreateSession(event.session_id)
    session.events.push(event)
    session.lastEventTime = Date.now()
    if (session.events.length > EVENTS_PER_SESSION) session.events.shift()

    const data = `data: ${JSON.stringify(event)}\n\n`
    for (const client of clients) {
      try { client.write(data) } catch { clients.delete(client) }
    }
    res.json({ ok: true })
  })

  app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // Send state snapshot instead of replaying raw events
    const sessions = []
    for (const [sid, session] of sessionBuffers) {
      const snap = computeSessionSnapshot(sid, session.events)
      if (snap) sessions.push(snap)
    }
    res.write(`data: ${JSON.stringify({ type: 'state_snapshot', sessions })}\n\n`)

    clients.add(res)
    const heartbeat = setInterval(() => {
      try { res.write(': heartbeat\n\n') } catch { clients.delete(res); clearInterval(heartbeat) }
    }, HEARTBEAT_MS)
    req.on('close', () => { clients.delete(res); clearInterval(heartbeat) })
    res.on('error', () => { clients.delete(res); clearInterval(heartbeat) })
  })

  // expose session buffers for tests
  app.get('/buffer', (req, res) => {
    const allEvents = []
    for (const session of sessionBuffers.values()) {
      allEvents.push(...session.events)
    }
    res.json(allEvents)
  })

  // cleanup stale sessions periodically
  setInterval(cleanupStaleSessions, 60000)

  // serve static build
  app.use(express.static(DIST_DIR))

  return new Promise((resolve, reject) => {
    const httpServer = createHttpServer(app)
    httpServer.listen(port, () => {
      const actualPort = httpServer.address().port
      resolve({ server: httpServer, port: actualPort, app })
    })
    httpServer.on('error', reject)
  })
}

// Run standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const desiredPort = parseInt(process.env.PORT || '43451', 10)
  let p = desiredPort
  const tryStart = async () => {
    try {
      const { port } = await createServer({ port: p })
      console.log(`claude-live server listening on http://localhost:${port}`)
      if (p !== desiredPort) {
        console.log(`(port ${desiredPort} was in use, using ${port} instead)`)
        console.log(`Update your hook URL to: http://localhost:${port}/hook`)
      }
    } catch (e) {
      if (e.code === 'EADDRINUSE') { p++; tryStart() }
      else { console.error(e); process.exit(1) }
    }
  }
  tryStart()
}
