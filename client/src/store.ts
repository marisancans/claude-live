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
  if (!t) {
    if (event.hook_event_name === 'Stop') return 'session:stop'
    if (event.hook_event_name === 'Notification') {
      const msg = (event.tool_input as Record<string, string> | null)?.message || ''
      return `notification:${msg.slice(0, 20)}`
    }
    return null
  }
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
        // Preserve age >= 80 for stopping clusters to let them fade out
        const newAge = buffer.length - 1 - idx
        node.age = cluster.stopping && node.age >= 80 ? node.age : newAge
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
        if (oldestKey !== undefined) sessions.delete(oldestKey)
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
        const initialAge = event.hook_event_name === 'Stop' ? 80 : 0
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
          age: initialAge,
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
