import type { RawEvent, GraphNode, Cluster } from './types'

function shortHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(16).slice(0, 8)
}

const BUFFER_SIZE = 100
const MAX_CLUSTERS = 6

const TOOL_COLOR_HEX: Record<string, string> = {
  Read:         '#4ade80',
  Edit:         '#60a5fa',
  Write:        '#60a5fa',
  Bash:         '#f59e0b',
  Grep:         '#a78bfa',
  Glob:         '#a78bfa',
  WebFetch:     '#f472b6',
  Stop:         '#888888',
  Notification: '#34d399',
}
const DEFAULT_HEX = '#555555'

// Desaturate toward white — same formula as mockup
function desaturate(hex: string): string {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  const mr = Math.round(r*0.3 + 190*0.7), mg = Math.round(g*0.3 + 190*0.7), mb = Math.round(b*0.3 + 190*0.7)
  return `#${mr.toString(16).padStart(2,'0')}${mg.toString(16).padStart(2,'0')}${mb.toString(16).padStart(2,'0')}`
}

function hexToInt(hex: string): number {
  return parseInt(hex.replace('#',''), 16)
}

const ORBIT_RADII = [70, 120, 175]
const ORBIT_SPEEDS = [0.003, 0.002, 0.0012]

const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

export function nodeKeyFor(event: RawEvent): string | null {
  const t = event.tool_name
  if (!t) {
    if (event.hook_event_name === 'Stop') return 'session:stop'
    if (event.hook_event_name === 'Notification') {
      const msg = (event.tool_input as Record<string, string> | null)?.message || ''
      return `notification:${msg.slice(0, 20)}`
    }
    if (event.hook_event_name === 'PermissionRequest') return null // handled at cluster level
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
  if (t === 'Bash') return `$ ${(input?.command || '').slice(0, 22)}`
  if (t === 'WebFetch') { try { return `↗ ${new URL(input?.url || '').hostname}` } catch { return '↗ web' } }
  if (event.hook_event_name === 'Stop') return '✓ done'
  if (event.hook_event_name === 'Notification') {
    const msg = (event.tool_input as Record<string, string> | null)?.message || 'notification'
    return msg.slice(0, 24)
  }
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

// Minimum distance between cluster centers (outermost orbit ~340px radius each side)
const MIN_CLUSTER_DIST = 720

function clusterPosition(index: number, existing: { centerX: number; centerY: number }[]): { x: number; y: number } {
  // Try evenly-spaced angles first, then nudge if too close
  const candidates = 24 // angular candidates to try
  for (let attempt = 0; attempt < candidates; attempt++) {
    const angle = ((index + attempt / candidates) / Math.max(MAX_CLUSTERS, 1)) * Math.PI * 2
    // Scale radius so clusters fit: for N clusters on a circle, chord = 2r*sin(π/N) >= MIN_DIST
    const minR = (MIN_CLUSTER_DIST / 2) / Math.sin(Math.PI / Math.max(MAX_CLUSTERS, 2))
    const r = Math.max(minR, Math.min(CANVAS_W, CANVAS_H) * 0.38)
    const x = CANVAS_W / 2 + Math.cos(angle) * r
    const y = CANVAS_H / 2 + Math.sin(angle) * r
    const tooClose = existing.some(c => Math.hypot(c.centerX - x, c.centerY - y) < MIN_CLUSTER_DIST)
    if (!tooClose) return { x, y }
  }
  // Fallback: just use evenly spaced
  const angle = (index / Math.max(MAX_CLUSTERS, 1)) * Math.PI * 2
  const r = Math.min(CANVAS_W, CANVAS_H) * 0.38
  return { x: CANVAS_W / 2 + Math.cos(angle) * r, y: CANVAS_H / 2 + Math.sin(angle) * r }
}

export function createStore() {
  const buffer: RawEvent[] = []
  const sessions = new Map<string, Cluster>()
  let replayDone = false

  function recomputeAges() {
    const lastIndex = new Map<string, Map<string, number>>()
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
          if (node.nodeType !== 'file') {
            node.life = Math.min(node.life, 0.15) // start fade-out
          }
          continue
        }
        const idx = sMap.get(key)!
        const newAge = buffer.length - 1 - idx
        node.age = cluster.stopping && node.age >= 80 ? node.age : newAge
        node.lastEventIndex = idx
      }
      cluster.edges = cluster.edges.filter(
        e => cluster.nodes.has(e.fromKey) && cluster.nodes.has(e.toKey)
      )
      if (cluster.stopping && cluster.nodes.size === 0) {
        sessions.delete(sid)
      }
    }
  }

  function addEvent(event: RawEvent) {
    buffer.push(event)
    if (buffer.length > BUFFER_SIZE) buffer.shift()

    if (!sessions.has(event.session_id)) {
      if (sessions.size >= MAX_CLUSTERS) {
        const oldestKey = sessions.keys().next().value
        if (oldestKey !== undefined) sessions.delete(oldestKey)
      }
      const idx = sessions.size
      const sid = event.session_id
      const label = sid.startsWith('unknown-') ? `#${sid.slice(8, 12)}` : sid.slice(0, 8)

      let parentSessionId: string | null = null
      const subMatch = sid.match(/^([a-f0-9-]{36})[-_]sub[-_]/i) || sid.match(/^([a-f0-9-]{36})\//i)
      if (subMatch) {
        parentSessionId = subMatch[1]
      } else if (sid.includes('_sub_') || sid.includes('-sub-')) {
        const idx2 = sid.indexOf('_sub_') !== -1 ? sid.indexOf('_sub_') : sid.indexOf('-sub-')
        parentSessionId = sid.slice(0, idx2)
      }

      const parent = parentSessionId ? sessions.get(parentSessionId) ?? null : null
      const isChild = parent !== null

      // Count existing children of this parent
      const childIndex = isChild
        ? [...sessions.values()].filter(s => s.parentSessionId === parentSessionId).length
        : 0

      // Child: spawn offset from parent; otherwise use global layout
      let pos: { x: number; y: number }
      let layoutAngle = (idx / Math.max(MAX_CLUSTERS, 1)) * Math.PI * 2
      if (parent) {
        // Offset ~480px from parent at a consistent angle per child index
        const spawnAngle = (childIndex / 3) * Math.PI * 2 - Math.PI / 4
        pos = {
          x: parent.centerX + Math.cos(spawnAngle) * 480,
          y: parent.centerY + Math.sin(spawnAngle) * 480,
        }
        layoutAngle = spawnAngle
      } else {
        pos = clusterPosition(idx, [...sessions.values()])
      }

      sessions.set(event.session_id, {
        sessionId: event.session_id,
        label,
        centerX: pos.x,
        centerY: pos.y,
        nodes: new Map(),
        edges: [],
        stopping: false,
        lastFileKey: null,
        parentSessionId,
        ringCounts: [0, 0, 0],
        layoutAngle,
        isChild,
        childIndex,
      })
    }

    const cluster = sessions.get(event.session_id)!

    if (event.hook_event_name === 'Stop') {
      cluster.stopping = true
      for (const node of cluster.nodes.values()) node.age = Math.max(node.age, 80)
    }

    // PermissionRequest: flag on cluster (shown on core), not on a file node
    if (event.hook_event_name === 'PermissionRequest') {
      (cluster as any).awaitingPermission = true
    }
    if (event.hook_event_name === 'PostToolUse' || event.hook_event_name === 'PreToolUse') {
      (cluster as any).awaitingPermission = false
    }

    const key = nodeKeyFor(event)
    if (!key) {
      recomputeAges()
      return
    }

    const rawHex = TOOL_COLOR_HEX[event.tool_name || event.hook_event_name] ?? DEFAULT_HEX
    const colorHex = desaturate(rawHex)
    const colorInt = hexToInt(colorHex)
    const type = nodeTypeFor(event)
    const isFile = type === 'file'

    if (!cluster.nodes.has(key)) {
      // Skip ephemeral node creation during replay — only show live ephemerals
      if (!isFile && !replayDone) {
        recomputeAges()
        return
      }

      // Assign orbit ring for file nodes
      let orbitRing = 0, orbitSpeed = ORBIT_SPEEDS[0]
      let orbitRadius = ORBIT_RADII[2] + 35 + Math.random() * 25

      if (isFile) {
        // Assign to least-populated ring
        const minCount = Math.min(...cluster.ringCounts)
        orbitRing = cluster.ringCounts.indexOf(minCount)
        const countOnRing = cluster.ringCounts[orbitRing]
        cluster.ringCounts[orbitRing]++
        orbitSpeed = ORBIT_SPEEDS[orbitRing]
        orbitRadius = ORBIT_RADII[orbitRing]
      }

      // Space nodes evenly on their ring based on current count
      const nodesOnSameRing = [...cluster.nodes.values()].filter(n =>
        isFile ? n.orbitRing === orbitRing : n.orbitRadius === orbitRadius
      ).length
      const orbitAngle = (nodesOnSameRing / Math.max(nodesOnSameRing + 1, 6)) * Math.PI * 2 + Math.random() * 0.3

      cluster.nodes.set(key, {
        key,
        label: labelFor(event),
        nodeType: type,
        baseRadius: isFile ? 2.5 + Math.min(9, 1) * 0.45 : 4,
        color: colorInt,
        colorHex,
        x: cluster.centerX + Math.cos(orbitAngle) * orbitRadius,
        y: cluster.centerY + Math.sin(orbitAngle) * orbitRadius,
        vx: 0, vy: 0,
        age: 0,
        lastEventIndex: buffer.length - 1,
        lastTool: event.tool_name || event.hook_event_name || null,
        lastTimestamp: event.timestamp,
        eventCount: 1,
        awaitingPermission: false, // now on cluster, not node
        orbitRing,
        orbitAngle,
        orbitSpeed,
        orbitRadius,
        life: isFile ? 1.0 : 1.0,
        entry: 0,
        impactType: null,
        impactTime: 0,
        actionLabel: null,
        actionFade: 0,
        marks: [],
      })
    } else {
      const node = cluster.nodes.get(key)!
      node.lastTool = event.tool_name || event.hook_event_name || null
      node.lastTimestamp = event.timestamp
      node.eventCount++
      node.colorHex = colorHex
      node.color = colorInt
      // Grow file node radius slightly with each touch, cap at 8
      if (isFile) {
        node.baseRadius = Math.min(8, node.baseRadius + 0.3)
      }
      // Trigger impact
      const tool = event.tool_name || event.hook_event_name || ''
      if (['Read','Grep','Glob'].includes(tool)) node.impactType = 'scan'
      else if (['Edit','Write'].includes(tool)) node.impactType = 'morph'
      else if (tool === 'Bash') node.impactType = 'spark'
      else if (tool === 'Notification') node.impactType = 'ping'
      else if (tool === 'Stop') node.impactType = 'fade'
      else node.impactType = 'scan'
      node.impactTime = 1.0
      node.actionLabel = tool
      node.actionFade = 1.0
    }

    // Edge between consecutive file nodes
    if (key && isFile) {
      if (cluster.lastFileKey && cluster.lastFileKey !== key && cluster.nodes.has(cluster.lastFileKey)) {
        const edgeExists = cluster.edges.some(e => e.fromKey === cluster.lastFileKey && e.toKey === key)
        if (!edgeExists) {
          cluster.edges.push({
            fromKey: cluster.lastFileKey,
            toKey: key,
            color: colorInt,
            colorHex,
            age: 0,
          })
        }
      }
      cluster.lastFileKey = key
    }

    recomputeAges()
  }

  function markReplayDone() { replayDone = true }

  return {
    addEvent,
    markReplayDone,
    getBuffer: () => [...buffer],
    getSessions: () => sessions,
  }
}
