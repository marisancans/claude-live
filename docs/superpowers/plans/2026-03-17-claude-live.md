# claude-live Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an npm package (`claude-live`) that streams Claude Code hook events over SSE and renders them as an animated PixiJS force-directed graph in the browser.

**Architecture:** A Node.js/Express server receives POST `/hook` from Claude Code shell hooks and fans out normalized events to all connected SSE clients. The React+PixiJS frontend opens an `EventSource('/events')`, maintains a 100-event rolling buffer, and renders a live force-directed graph with per-session clusters, decaying nodes, and ripple animations on each event. The package ships with a pre-built client bundle so `npx claude-live` requires no build step at runtime.

**Tech Stack:** Node.js 18+, Express, React 18, Vite, PixiJS 7, TypeScript, Vitest, concurrently, open (npm)

---

## File Map

```
claude-live/
├─ package.json                   # root scripts, bin, dependencies
├─ .gitignore
├─ README.md
├─ bin/
│  └─ claude-live.js              # CLI entry: find free port, start server, open browser
├─ server/
│  └─ index.js                    # Express: POST /hook, GET /events (SSE), GET / (static)
├─ client/
│  ├─ index.html
│  ├─ vite.config.ts              # proxy /events → :3141 in dev
│  ├─ tsconfig.json
│  ├─ dist/                       # pre-built bundle (committed)
│  └─ src/
│     ├─ main.tsx                 # React root
│     ├─ App.tsx                  # EventSource setup, passes events to store
│     ├─ store.ts                 # rolling buffer, session map, node age calculation
│     ├─ types.ts                 # shared TypeScript types
│     └─ canvas/
│        ├─ PixiScene.tsx         # mounts PixiJS Application, owns render loop
│        ├─ graph.ts              # Node/Edge/Cluster types + force simulation tick
│        └─ renderer.ts           # draws nodes, edges, ripples, labels each frame
└─ tests/
   ├─ server.test.js              # SSE server unit tests
   └─ store.test.ts               # rolling buffer + age calculation tests
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `client/tsconfig.json`
- Create: `client/vite.config.ts`
- Create: `client/index.html`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "claude-live",
  "version": "0.1.0",
  "description": "Realtime Claude Code activity visualizer",
  "bin": { "claude-live": "./bin/claude-live.js" },
  "scripts": {
    "dev": "concurrently \"node server/index.js\" \"vite dev --root client\"",
    "build": "vite build --root client",
    "start": "node server/index.js",
    "test": "vitest run",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "open": "^10.1.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "concurrently": "^8.2.0",
    "pixi.js": "^7.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.1.0",
    "vitest": "^1.3.0"
  },
  "type": "module",
  "engines": { "node": ">=18" }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
client/dist/
*.log
```

Note: `client/dist/` is intentionally NOT gitignored — it is committed so `npx claude-live` works without a build step.

- [ ] **Step 3: Create `client/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `client/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/events': 'http://localhost:3141'
    }
  },
  build: {
    outDir: 'dist'
  }
})
```

- [ ] **Step 5: Create `client/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>claude-live</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; overflow: hidden; }
      #root { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
git init
git add package.json .gitignore client/tsconfig.json client/vite.config.ts client/index.html
git commit -m "chore: project scaffold"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `client/src/types.ts`

- [ ] **Step 1: Write `client/src/types.ts`**

```ts
// Raw event shape as received from server over SSE
export interface RawEvent {
  id: string
  session_id: string
  timestamp: number
  hook_event_name: 'PreToolUse' | 'PostToolUse' | 'Stop' | 'Notification'
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  tool_response: Record<string, unknown> | null
}

// A node in the force graph
export interface GraphNode {
  key: string           // unique within session: "file:/src/foo.ts", "bash:<sha1>", etc.
  label: string         // display label (basename for files, truncated command, etc.)
  nodeType: 'file' | 'bash' | 'web' | 'stop' | 'notification' | 'tool'
  baseRadius: number    // 12 for file nodes, 7 for others
  color: number         // PixiJS color integer (e.g. 0x4ade80)
  x: number
  y: number
  vx: number
  vy: number
  age: number           // 0 (newest) to 100 (evicted). Computed from buffer position.
  lastEventIndex: number // index in rolling buffer of most recent event referencing this node
}

// A directed edge between two nodes (tool action → file)
export interface GraphEdge {
  fromKey: string
  toKey: string
  color: number
  age: number
}

// A session cluster
export interface Cluster {
  sessionId: string
  label: string
  centerX: number       // stable assigned canvas position
  centerY: number
  nodes: Map<string, GraphNode>
  edges: GraphEdge[]
  stopping: boolean     // true after Stop event received
}

// A ripple animation
export interface Ripple {
  x: number
  y: number
  color: number
  radius: number
  maxRadius: number     // 300
  alpha: number
  startTime: number     // performance.now() at creation
  duration: number      // 600ms
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: SSE Server

**Files:**
- Create: `server/index.js`
- Create: `tests/server.test.js`

- [ ] **Step 1: Write the failing test**

```js
// tests/server.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../server/index.js'

describe('SSE server', () => {
  let server, port

  beforeAll(async () => {
    ({ server, port } = await createServer({ port: 0 })) // port 0 = OS assigns
  })

  afterAll(() => server.close())

  it('returns 200 on POST /hook with valid JSON', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: { file_path: '/src/foo.ts' },
        session_id: 'test-session'
      })
    })
    expect(res.status).toBe(200)
  })

  it('normalizes missing session_id to fallback', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hook_event_name: 'Stop' })
    })
    expect(res.status).toBe(200)
    // buffer should have an event with a non-empty session_id
    const events = await fetch(`http://localhost:${port}/buffer`).then(r => r.json())
    expect(events[events.length - 1].session_id).toBeTruthy()
  })

  it('returns 400 on invalid JSON', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json'
    })
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- tests/server.test.js
```

Expected: FAIL — `createServer` not found.

- [ ] **Step 3: Implement `server/index.js`**

```js
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

export function createServer({ port = 3141 } = {}) {
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
    for (const client of clients) client.write(data)
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
    clients.add(res)
    const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), HEARTBEAT_MS)
    req.on('close', () => { clients.delete(res); clearInterval(heartbeat) })
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
  const desiredPort = parseInt(process.env.PORT || '3141', 10)
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/server.test.js
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add server/index.js tests/server.test.js
git commit -m "feat: SSE server with rolling buffer and event normalization"
```

---

## Task 4: CLI Entry Point

**Files:**
- Create: `bin/claude-live.js`

- [ ] **Step 1: Create `bin/claude-live.js`**

```js
#!/usr/bin/env node
import { createServer } from '../server/index.js'
import open from 'open'

const portArgIdx = process.argv.findIndex(a => a === '--port' || a.startsWith('--port='))
const portArg = portArgIdx >= 0
  ? (process.argv[portArgIdx].includes('=') ? process.argv[portArgIdx].split('=')[1] : process.argv[portArgIdx + 1])
  : '3141'
const desiredPort = parseInt(portArg, 10)

let p = desiredPort
const tryStart = async () => {
  try {
    const { port } = await createServer({ port: p })
    const url = `http://localhost:${port}`
    console.log(`claude-live running at ${url}`)
    if (p !== desiredPort) {
      console.log(`(port ${desiredPort} was in use)`)
      console.log(`Update your hook command to use port ${port}`)
    }
    console.log('\nAdd this to ~/.claude/settings.json hooks:')
    console.log(`  curl -s -X POST ${url}/hook -H 'Content-Type: application/json' -d @- || true`)
    open(url)
  } catch (e) {
    if (e.code === 'EADDRINUSE') { p++; tryStart() }
    else { console.error(e); process.exit(1) }
  }
}
tryStart()
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x bin/claude-live.js
```

- [ ] **Step 3: Smoke test**

```bash
node bin/claude-live.js &
sleep 1
curl -s http://localhost:3141/buffer | head -c 100
kill %1
```

Expected: `[]` (empty buffer JSON).

- [ ] **Step 4: Commit**

```bash
git add bin/claude-live.js
git commit -m "feat: CLI entry point with auto port selection"
```

---

## Task 5: Client Store (Rolling Buffer + Session Map)

**Files:**
- Create: `client/src/store.ts`
- Create: `client/src/types.ts` (already exists from Task 2)
- Create: `tests/store.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/store.test.ts
import { describe, it, expect } from 'vitest'
import { createStore } from '../client/src/store'

const makeEvent = (overrides = {}) => ({
  id: Math.random().toString(),
  session_id: 'sess-1',
  timestamp: Date.now(),
  hook_event_name: 'PreToolUse' as const,
  tool_name: 'Read',
  tool_input: { file_path: '/src/foo.ts' },
  tool_response: null,
  ...overrides
})

describe('store', () => {
  it('keeps last 100 events', () => {
    const store = createStore()
    for (let i = 0; i < 110; i++) store.addEvent(makeEvent({ id: String(i) }))
    expect(store.getBuffer()).toHaveLength(100)
    expect(store.getBuffer()[0].id).toBe('10') // oldest remaining
  })

  it('derives node age as distance from end of buffer', () => {
    const store = createStore()
    store.addEvent(makeEvent({ id: '1', tool_input: { file_path: '/a.ts' } }))
    store.addEvent(makeEvent({ id: '2', tool_input: { file_path: '/b.ts' } }))
    store.addEvent(makeEvent({ id: '3', tool_input: { file_path: '/a.ts' } })) // a.ts touched again
    const sessions = store.getSessions()
    const cluster = sessions.get('sess-1')!
    expect(cluster.nodes.get('file:/a.ts')!.age).toBe(0) // most recent
    expect(cluster.nodes.get('file:/b.ts')!.age).toBe(1) // second from end
  })

  it('removes nodes pushed out of buffer', () => {
    const store = createStore()
    store.addEvent(makeEvent({ id: '1', tool_input: { file_path: '/old.ts' } }))
    for (let i = 2; i <= 102; i++) {
      store.addEvent(makeEvent({ id: String(i), tool_input: { file_path: '/new.ts' } }))
    }
    const cluster = store.getSessions().get('sess-1')!
    expect(cluster.nodes.has('file:/old.ts')).toBe(false)
  })

  it('creates separate clusters per session_id', () => {
    const store = createStore()
    store.addEvent(makeEvent({ session_id: 'sess-a' }))
    store.addEvent(makeEvent({ session_id: 'sess-b' }))
    expect(store.getSessions().size).toBe(2)
  })

  it('sets stopping=true on Stop event', () => {
    const store = createStore()
    store.addEvent(makeEvent())
    store.addEvent(makeEvent({ hook_event_name: 'Stop', tool_name: null, tool_input: null }))
    const cluster = store.getSessions().get('sess-1')!
    expect(cluster.stopping).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test -- tests/store.test.ts
```

Expected: FAIL — `createStore` not found.

- [ ] **Step 3: Implement `client/src/store.ts`**

```ts
import type { RawEvent, GraphNode, GraphEdge, Cluster } from './types'

// Simple djb2 hash — browser-safe, no Node crypto needed
function shortHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(16).slice(0, 8)
}

const BUFFER_SIZE = 100
const MAX_CLUSTERS = 6
const TOOL_COLORS: Record<string, number> = {
  Read:         0x4ade80,
  Edit:         0x60a5fa,
  Write:        0x60a5fa,
  Bash:         0xf59e0b,
  Grep:         0xa78bfa,
  Glob:         0xa78bfa,
  WebFetch:     0xf472b6,
  Stop:         0x888888,
  Notification: 0x34d399,
}
const DEFAULT_COLOR = 0x555555
const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

function nodeKeyFor(event: RawEvent): string | null {
  const t = event.tool_name
  if (!t) return null
  const input = event.tool_input as Record<string, string> | null
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t)) {
    const fp = input?.file_path || input?.path || null
    return fp ? `file:${fp}` : null
  }
  if (t === 'Bash') {
    const cmd = input?.command || ''
    return `bash:${shortHash(cmd)}`
  }
  if (t === 'WebFetch') {
    try { return `web:${new URL(input?.url || '').hostname}` } catch { return 'web:unknown' }
  }
  if (event.hook_event_name === 'Stop') return 'session:stop'
  if (event.hook_event_name === 'Notification') {
    const msg = (event.tool_input as Record<string, string> | null)?.message || ''
    return `notification:${msg.slice(0, 20)}`
  }
  return `tool:${t}`
}

function labelFor(event: RawEvent): string {
  const t = event.tool_name
  const input = event.tool_input as Record<string, string> | null
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t || '')) {
    const fp = input?.file_path || input?.path || ''
    return fp.split('/').pop() || fp
  }
  if (t === 'Bash') return `$ ${(input?.command || '').slice(0, 20)}`
  if (t === 'WebFetch') { try { return new URL(input?.url || '').hostname } catch { return 'web' } }
  if (event.hook_event_name === 'Stop') return '✓ done'
  return t || event.hook_event_name || '?'
}

function nodeTypeFor(event: RawEvent): GraphNode['nodeType'] {
  const t = event.tool_name
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t || '')) return 'file'
  if (t === 'Bash') return 'bash'
  if (t === 'WebFetch') return 'web'
  if (event.hook_event_name === 'Stop') return 'stop'
  if (event.hook_event_name === 'Notification') return 'notification'
  return 'tool'
}

function clusterPosition(index: number, total: number): { x: number; y: number } {
  // Distribute clusters evenly around canvas center
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const r = Math.min(CANVAS_W, CANVAS_H) * 0.3
  return { x: CANVAS_W / 2 + Math.cos(angle) * r, y: CANVAS_H / 2 + Math.sin(angle) * r }
}

export function createStore() {
  const buffer: RawEvent[] = []
  const sessions = new Map<string, Cluster>()

  function recomputeAges() {
    // For each cluster node, find the most recent buffer index that references it
    const lastIndex = new Map<string, Map<string, number>>() // sessionId -> nodeKey -> bufferIdx

    for (let i = 0; i < buffer.length; i++) {
      const ev = buffer[i]
      const key = nodeKeyFor(ev)
      if (!key) continue
      if (!lastIndex.has(ev.session_id)) lastIndex.set(ev.session_id, new Map())
      lastIndex.get(ev.session_id)!.set(key, i)
    }

    for (const [sid, cluster] of sessions) {
      const sMap = lastIndex.get(sid)
      for (const [key, node] of cluster.nodes) {
        if (!sMap?.has(key)) {
          // node was pushed out of buffer
          cluster.nodes.delete(key)
          continue
        }
        const idx = sMap.get(key)!
        node.age = buffer.length - 1 - idx // 0 = most recent
        node.lastEventIndex = idx
      }
      // remove edges whose nodes are gone
      cluster.edges = cluster.edges.filter(
        e => cluster.nodes.has(e.fromKey) && cluster.nodes.has(e.toKey)
      )
      // remove stopping clusters once all nodes have faded out
      if (cluster.stopping && cluster.nodes.size === 0) {
        sessions.delete(sid)
      }
    }
  }

  function addEvent(event: RawEvent) {
    buffer.push(event)
    if (buffer.length > BUFFER_SIZE) buffer.shift()

    // Ensure cluster exists
    if (!sessions.has(event.session_id)) {
      if (sessions.size >= MAX_CLUSTERS) {
        // evict oldest (first inserted)
        const oldestKey = sessions.keys().next().value
        sessions.delete(oldestKey)
      }
      const idx = sessions.size
      const pos = clusterPosition(idx, Math.max(sessions.size + 1, 1))
      sessions.set(event.session_id, {
        sessionId: event.session_id,
        label: event.session_id.slice(0, 8),
        centerX: pos.x,
        centerY: pos.y,
        nodes: new Map(),
        edges: [],
        stopping: false,
      })
    }

    const cluster = sessions.get(event.session_id)!

    if (event.hook_event_name === 'Stop') {
      cluster.stopping = true
      // Advance all nodes to age 80 so they fade out over the next ~20 events
      for (const node of cluster.nodes.values()) {
        node.age = Math.max(node.age, 80)
      }
    }

    // Add/update node
    const key = nodeKeyFor(event)
    if (key) {
      const color = TOOL_COLORS[event.tool_name || event.hook_event_name] ?? DEFAULT_COLOR
      if (!cluster.nodes.has(key)) {
        const isFile = nodeTypeFor(event) === 'file'
        cluster.nodes.set(key, {
          key,
          label: labelFor(event),
          nodeType: nodeTypeFor(event),
          baseRadius: isFile ? 12 : 7,
          color,
          x: cluster.centerX + (Math.random() - 0.5) * 100,
          y: cluster.centerY + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0,
          age: 0,
          lastEventIndex: buffer.length - 1,
        })
      }
    }

    recomputeAges()
  }

  return {
    addEvent,
    getBuffer: () => [...buffer],
    getSessions: () => sessions,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/store.test.ts
```

Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add client/src/store.ts tests/store.test.ts
git commit -m "feat: rolling buffer store with session clustering and node age"
```

---

## Task 6: Force Simulation

**Files:**
- Create: `client/src/canvas/graph.ts`

- [ ] **Step 1: Create `client/src/canvas/graph.ts`**

```ts
import type { Cluster } from '../types'

const K_REPULSE = 800          // node-node repulsion constant
const K_ATTRACT = 0.03         // edge attraction factor
const TARGET_DIST = 80         // edge rest length (simulation units)
const K_GRAVITY = 0.005        // cluster gravity toward centerX/centerY
const K_CLUSTER_REPULSE = 2000 // cluster-cluster repulsion
const MIN_CLUSTER_DIST = 250   // minimum cluster separation
const BOUNDARY_DIST = 60       // canvas boundary repulsion kickin distance
const DAMPING = 0.88
const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

export function tickSimulation(clusters: Map<string, Cluster>) {
  const clusterList = [...clusters.values()]
  const allNodes = clusterList.flatMap(c => [...c.nodes.values()])

  // 1. Node-node repulsion (within each cluster only)
  for (const cluster of clusterList) {
    const nodes = [...cluster.nodes.values()]
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist < 150) {
          const f = K_REPULSE / (dist * dist)
          const nx = dx / dist, ny = dy / dist
          a.vx += nx * f; a.vy += ny * f
          b.vx -= nx * f; b.vy -= ny * f
        }
      }
    }
  }

  // 2. Edge attraction (within each cluster)
  for (const cluster of clusterList) {
    for (const edge of cluster.edges) {
      const a = cluster.nodes.get(edge.fromKey)
      const b = cluster.nodes.get(edge.toKey)
      if (!a || !b) continue
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const f = (dist - TARGET_DIST) * K_ATTRACT
      const nx = dx / dist, ny = dy / dist
      a.vx += nx * f; a.vy += ny * f
      b.vx -= nx * f; b.vy -= ny * f
    }
  }

  // 3. Cluster gravity (each node toward cluster centerX/centerY)
  for (const cluster of clusterList) {
    for (const node of cluster.nodes.values()) {
      node.vx += (cluster.centerX - node.x) * K_GRAVITY
      node.vy += (cluster.centerY - node.y) * K_GRAVITY
    }
  }

  // 4. Cluster-cluster repulsion
  for (let i = 0; i < clusterList.length; i++) {
    for (let j = i + 1; j < clusterList.length; j++) {
      const a = clusterList[i], b = clusterList[j]
      const dx = a.centerX - b.centerX, dy = a.centerY - b.centerY
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      if (dist < MIN_CLUSTER_DIST) {
        const f = K_CLUSTER_REPULSE / (dist * dist)
        const nx = dx / dist, ny = dy / dist
        // nudge cluster centers (they drift toward node centers of mass, so just nudge)
        a.centerX += nx * f * 0.1; a.centerY += ny * f * 0.1
        b.centerX -= nx * f * 0.1; b.centerY -= ny * f * 0.1
      }
    }
  }

  // 5. Canvas boundary repulsion + integrate
  for (const node of allNodes) {
    // boundary
    if (node.x < BOUNDARY_DIST) node.vx += (BOUNDARY_DIST - node.x) * 0.1
    if (node.x > CANVAS_W - BOUNDARY_DIST) node.vx -= (node.x - (CANVAS_W - BOUNDARY_DIST)) * 0.1
    if (node.y < BOUNDARY_DIST) node.vy += (BOUNDARY_DIST - node.y) * 0.1
    if (node.y > CANVAS_H - BOUNDARY_DIST) node.vy -= (node.y - (CANVAS_H - BOUNDARY_DIST)) * 0.1
    // integrate
    node.vx *= DAMPING; node.vy *= DAMPING
    node.x += node.vx; node.y += node.vy
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/canvas/graph.ts
git commit -m "feat: force simulation (repulsion, attraction, gravity, boundary)"
```

---

## Task 7: PixiJS Renderer

**Files:**
- Create: `client/src/canvas/renderer.ts`

- [ ] **Step 1: Create `client/src/canvas/renderer.ts`**

```ts
import * as PIXI from 'pixi.js'
import type { Cluster, Ripple } from '../types'

export function drawScene(
  app: PIXI.Application,
  gfx: PIXI.Graphics,
  textContainer: PIXI.Container,
  clusters: Map<string, Cluster>,
  ripples: Ripple[],
  now: number
) {
  gfx.clear()
  // clear old text
  textContainer.removeChildren()

  // Draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i]
    const elapsed = now - rp.startTime
    const progress = Math.min(elapsed / rp.duration, 1)
    rp.radius = progress * rp.maxRadius
    rp.alpha = (1 - progress) * 0.8
    if (progress >= 1) { ripples.splice(i, 1); continue }
    const r = (rp.color >> 16) & 0xff
    const g = (rp.color >> 8) & 0xff
    const b = rp.color & 0xff
    gfx.lineStyle(1.5, rp.color, rp.alpha)
    gfx.drawCircle(rp.x, rp.y, rp.radius)
  }

  for (const cluster of clusters.values()) {
    // Draw edges
    for (const edge of cluster.edges) {
      const a = cluster.nodes.get(edge.fromKey)
      const b = cluster.nodes.get(edge.toKey)
      if (!a || !b) continue
      const alpha = (1 - edge.age / 100) * 0.7
      if (alpha <= 0) continue
      gfx.lineStyle(1, edge.color, alpha)
      gfx.moveTo(a.x, a.y)
      gfx.lineTo(b.x, b.y)
    }

    // Draw nodes
    for (const node of cluster.nodes.values()) {
      const ageFraction = node.age / 100
      const opacity = 1 - ageFraction
      const radius = node.baseRadius * (1 - ageFraction * 0.6) // 100% to 40%
      if (opacity <= 0) continue

      // glow
      const glowR = radius * 2.5
      gfx.beginFill(node.color, opacity * 0.25)
      gfx.drawCircle(node.x, node.y, glowR)
      gfx.endFill()

      // core
      gfx.beginFill(node.color, opacity)
      gfx.drawCircle(node.x, node.y, radius)
      gfx.endFill()

      // label
      if (opacity > 0.2) {
        const label = new PIXI.Text(node.label, {
          fontSize: 11,
          fill: 0xffffff,
          alpha: opacity,
          fontFamily: 'SF Mono, monospace',
        })
        label.alpha = opacity
        label.x = node.x - label.width / 2
        label.y = node.y + radius + 3
        textContainer.addChild(label)
      }
    }

    // cluster label
    const clusterLabel = new PIXI.Text(cluster.label, {
      fontSize: 9,
      fill: 0x444444,
      fontFamily: 'SF Mono, monospace',
    })
    clusterLabel.x = cluster.centerX - clusterLabel.width / 2
    clusterLabel.y = cluster.centerY - 8
    textContainer.addChild(clusterLabel)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/canvas/renderer.ts
git commit -m "feat: PixiJS renderer (nodes, edges, ripples, labels)"
```

---

## Task 8: PixiJS Scene Component

**Files:**
- Create: `client/src/canvas/PixiScene.tsx`

- [ ] **Step 1: Create `client/src/canvas/PixiScene.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import type { Cluster, Ripple, RawEvent } from '../types'
import { tickSimulation } from './graph'
import { drawScene } from './renderer'

interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
}

export function PixiScene({ clusters, lastEvent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const gfxRef = useRef<PIXI.Graphics | null>(null)
  const textRef = useRef<PIXI.Container | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const lastEventRef = useRef<RawEvent | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x080808,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })
    containerRef.current.appendChild(app.view as HTMLCanvasElement)
    appRef.current = app

    const gfx = new PIXI.Graphics()
    const textContainer = new PIXI.Container()
    app.stage.addChild(gfx)
    app.stage.addChild(textContainer)
    gfxRef.current = gfx
    textRef.current = textContainer

    app.ticker.add(() => {
      tickSimulation(clusters)
      drawScene(app, gfx, textContainer, clusters, ripplesRef.current, performance.now())
    })

    return () => { app.destroy(true); appRef.current = null }
  }, [])

  // Spawn ripple on new event
  useEffect(() => {
    if (!lastEvent || lastEvent === lastEventRef.current) return
    lastEventRef.current = lastEvent
    const cluster = clusters.get(lastEvent.session_id)
    if (!cluster) return
    // find the node for this event
    const nodeKey = [...cluster.nodes.keys()].find(k => {
      const n = cluster.nodes.get(k)!
      return n.age === 0
    })
    if (!nodeKey) return
    const node = cluster.nodes.get(nodeKey)!
    const TOOL_COLORS: Record<string, number> = {
      Read: 0x4ade80, Edit: 0x60a5fa, Write: 0x60a5fa,
      Bash: 0xf59e0b, Grep: 0xa78bfa, Glob: 0xa78bfa,
      WebFetch: 0xf472b6, Stop: 0x888888, Notification: 0x34d399,
    }
    const color = TOOL_COLORS[lastEvent.tool_name || lastEvent.hook_event_name] ?? 0x555555
    ripplesRef.current.push({
      x: node.x, y: node.y,
      color,
      radius: 0,
      maxRadius: 300,
      alpha: 0.8,
      startTime: performance.now(),
      duration: 600,
    })
  }, [lastEvent])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: PixiScene component with render loop and ripple spawning"
```

---

## Task 9: App + EventSource

**Files:**
- Create: `client/src/App.tsx`
- Create: `client/src/main.tsx`

- [ ] **Step 1: Create `client/src/App.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import type { RawEvent } from './types'
import { createStore } from './store'
import { PixiScene } from './canvas/PixiScene'

const store = createStore()

export function App() {
  const [clusters, setClusters] = useState(store.getSessions())
  const [lastEvent, setLastEvent] = useState<RawEvent | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource('/events')
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const event: RawEvent = JSON.parse(e.data)
        store.addEvent(event)
        setClusters(new Map(store.getSessions()))
        setLastEvent(event)
      } catch { /* ignore malformed */ }
    }
    es.onerror = () => {
      // EventSource auto-reconnects — no action needed
    }
    return () => es.close()
  }, [])

  return (
    <PixiScene clusters={clusters} lastEvent={lastEvent} />
  )
}
```

- [ ] **Step 2: Create `client/src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx client/src/main.tsx
git commit -m "feat: App component with EventSource and store integration"
```

---

## Task 10: Build + README + Hook Config

**Files:**
- Create: `README.md`
- Build: `client/dist/`

- [ ] **Step 1: Build the client**

```bash
npm run build
```

Expected: `client/dist/` created with `index.html`, `assets/`.

- [ ] **Step 2: Create `README.md`**

````markdown
# claude-live

Realtime animated visualization of Claude Code activity. Watch files being read, edited, searched — rendered as a living force-directed graph.

## Quick Start

```bash
npx claude-live
```

Then add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":   [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "PostToolUse":  [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "Stop":         [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "Notification": [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}]
  }
}
```

Start a Claude Code session — the graph comes alive.

## Dev Mode

```bash
git clone <repo>
cd claude-live
npm install
npm run dev
```

Open http://localhost:5173

## Custom Port

```bash
npx claude-live --port=4000
```

Update your hook URLs to match.

## What You See

- **Green nodes** = files being read
- **Blue nodes** = files being edited
- **Amber nodes** = bash commands
- **Purple nodes** = grep/glob searches
- **Pink nodes** = web fetches
- **Clusters** = separate Claude Code sessions
- **Ripples** = each event as it fires
- Nodes fade as they age (last 100 events shown)

## Requirements

- Node.js 18+
- `curl` (for the hook command)
````

- [ ] **Step 3: Commit everything**

```bash
git add client/dist/ README.md
git commit -m "feat: built client bundle and README"
```

---

## Task 11: End-to-End Smoke Test

- [ ] **Step 1: Start the server**

```bash
node server/index.js &
```

Expected: `claude-live server listening on http://localhost:3141`

- [ ] **Step 2: Post a test event**

```bash
curl -s -X POST http://localhost:3141/hook \
  -H 'Content-Type: application/json' \
  -d '{"hook_event_name":"PreToolUse","tool_name":"Read","tool_input":{"file_path":"/src/test.ts"},"session_id":"smoke-test"}'
```

Expected: `{"ok":true}`

- [ ] **Step 3: Verify it's in the buffer**

```bash
curl -s http://localhost:3141/buffer | python3 -m json.tool | grep tool_name
```

Expected: `"tool_name": "Read"`

- [ ] **Step 4: Open the UI**

```bash
npm run dev
```

Open http://localhost:5173. Post a few more events and verify a green node appears.

- [ ] **Step 5: Kill background server**

```bash
kill %1
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: end-to-end verified"
```

---

## Task 12: Publish Prep (optional)

- [ ] **Step 1: Verify `npx` works locally**

```bash
npm pack
npx ./claude-live-0.1.0.tgz
```

Expected: server starts, browser opens.

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: publish prep verified"
```
