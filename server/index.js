import express from 'express'
import { createHash, randomUUID } from 'crypto'
import { createServer as createHttpServer } from 'http'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, '../client/dist')
const BUFFER_SIZE = 100
const HEARTBEAT_MS = 15000

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
    tool_response: raw.tool_response ?? null
  }
}

export function createServer({ port = 43451 } = {}) {
  const app = express()
  const clients = new Set()
  const buffer = [] // rolling 100-event buffer

  app.use(express.json())

  app.post('/hook', (req, res) => {
    const raw = req.body
    if (!raw || typeof raw !== 'object') return res.status(400).json({ error: 'invalid json' })
    const event = normalizeEvent(raw, req.ip)
    buffer.push(event)
    if (buffer.length > BUFFER_SIZE) buffer.shift()
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
    // replay buffer
    for (const event of buffer) {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
    }
    res.write(`data: ${JSON.stringify({ type: 'replay_done' })}\n\n`)
    clients.add(res)
    const heartbeat = setInterval(() => {
      try { res.write(': heartbeat\n\n') } catch { clients.delete(res); clearInterval(heartbeat) }
    }, HEARTBEAT_MS)
    req.on('close', () => { clients.delete(res); clearInterval(heartbeat) })
    res.on('error', () => { clients.delete(res); clearInterval(heartbeat) })
  })

  // expose buffer for tests
  app.get('/buffer', (req, res) => res.json(buffer))

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
