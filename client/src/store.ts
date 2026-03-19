import type { RawEvent, GraphNode, Cluster, PromptSnake } from './types'
import type { Point } from './utils/spline'
import { generateRandomSpline } from './utils/spline'
import { playChordForEvent } from './audio'
import { EventProcessor } from './events/EventProcessor'

// Small deterministic radial offset per node so trails on the same ring don't overlap
function radialJitter(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193)
  return ((h >>> 0) % 15) - 7  // -7 to +7 px
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


/**
 * Get the animation origin point for an action.
 * If agentId exists and points to an active agent, returns agent position.
 * Otherwise, returns cluster core position.
 */
export function getAnimationOrigin(
  cluster: Cluster,
  agentId: string | null
): Point {
  if (agentId && cluster.agentPositionMap.has(agentId)) {
    return cluster.agentPositionMap.get(agentId)!
  }
  // Fallback to core position
  return {x: cluster.centerX, y: cluster.centerY}
}

// Atomic orbital structure: each ring has progressively more slots
// Ring capacities based on electron orbitals
const RING_CAPACITIES = [4, 8, 18, 20]  // sum = 50 total slots per session
const ORBIT_RADII = [70, 120, 175, 225] // distances for each ring
const ORBIT_SPEEDS = [0.0015, 0.001, 0.0006, 0.0004]

const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

// Find which ring to assign a new node to, respecting per-ring capacities
// Only spawns next ring when current ring is full
function assignRing(cluster: Cluster): number {
  // Find the first ring that isn't full yet
  for (let i = 0; i < RING_CAPACITIES.length; i++) {
    // Initialize ring if needed
    if (i >= cluster.ringCounts.length) {
      cluster.ringCounts[i] = 0
    }
    // If this ring has space, use it
    if (cluster.ringCounts[i] < RING_CAPACITIES[i]) {
      return i
    }
  }

  // All rings full (shouldn't happen with 50 cap), use last ring
  return RING_CAPACITIES.length - 1
}

export function redistributeRing(cluster: Cluster, ring: number) {
  const nodes = [...cluster.nodes.values()]
    .filter(n => n.orbitRing === ring)
    .sort((a, b) => a.orbitAngle - b.orbitAngle)
  const n = nodes.length
  if (n === 0) return
  const base = nodes[0].orbitAngle
  nodes.forEach((node, i) => {
    const newAngle = base + (i / n) * Math.PI * 2
    // Set target for smooth interpolation instead of snapping
    node.targetOrbitAngle = newAngle
  })
}

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
    return `bash:${cmd}`
  }
  if (t === 'WebFetch') {
    try { return `web:${new URL(input?.url || '').hostname}` } catch { return 'web:unknown' }
  }
  return `tool:${t}`
}

// Shorten MCP tool names: mcp__plugin_foo__bar__action → action
function shortToolName(name: string): string {
  if (name.startsWith('mcp_')) {
    const parts = name.split('__')
    return parts[parts.length - 1].replace(/_/g, ' ')
  }
  return name
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
  if (t && t.startsWith('mcp_')) return shortToolName(t).slice(0, 20)
  return t || event.hook_event_name || '?'
}

// Generate enriched action label with stats from tool_input/tool_response
function enrichedLabel(event: RawEvent, latency?: string): string {
  const t = event.tool_name || event.hook_event_name || '?'
  const input = event.tool_input as Record<string, any> | null
  const resp = event.tool_response as Record<string, any> | null
  const short = t.startsWith('mcp_') ? shortToolName(t).slice(0, 14) : t
  const suffix = latency ? ` ${latency}` : ''

  // Handle is_interrupt for PostToolUseFailure
  if (event.hook_event_name === 'PostToolUseFailure' && event.is_interrupt) {
    return `⏹ interrupted${suffix}`
  }

  if (event.hook_event_name === 'PostToolUse' && resp) {
    // Enrich with response data
    if (t === 'Bash') {
      const code = resp.exitCode ?? resp.exit_code ?? resp.code
      if (code !== undefined && code !== null) return code === 0 ? `${short} ✓${suffix}` : `${short} ✗ ${code}${suffix}`
    }
    if (t === 'Grep') {
      const count = resp.count ?? resp.numMatches ?? resp.total
      if (count !== undefined) return `${short} ${count} hits${suffix}`
    }
    if (t === 'Glob') {
      const files = Array.isArray(resp) ? resp.length : (resp.files?.length ?? resp.count)
      if (files !== undefined) return `${short} ${files} files${suffix}`
    }
  }

  if (input) {
    if (t === 'Edit') {
      const ns = (input.new_string || '') as string
      const os = (input.old_string || '') as string
      const added = ns.split('\n').length
      const removed = os.split('\n').length
      if (added !== removed) return `${short} +${added} -${removed}${suffix}`
      return `${short} ${added}L${suffix}`
    }
    if (t === 'Write') {
      const content = (input.content || '') as string
      const lines = content.split('\n').length
      return `${short} ${lines}L${suffix}`
    }
    if (t === 'Read') {
      const limit = input.limit
      const offset = input.offset
      if (offset) return `${short} @${offset}${suffix}`
      if (limit) return `${short} ${limit}L${suffix}`
    }
    if (t === 'Bash') {
      const cmd = (input.command || '') as string
      const first = cmd.split(/\s+/)[0]?.split('/').pop() || ''
      return `$ ${first}${suffix}`
    }
    if (t === 'Grep') {
      return `${short} /${(input.pattern || '').toString().slice(0, 10)}/${suffix}`
    }
  }

  return short + suffix
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

// Calculate actual outer radius of a cluster based on its current nodes
function getClusterOuterRadius(cluster: Cluster): number {
  const lastActiveRing = Math.max(0, cluster.ringCounts.length - 1)
  return ORBIT_RADII[Math.min(lastActiveRing, ORBIT_RADII.length - 1)]
}

function clusterPosition(index: number, existing: Cluster[]): { x: number; y: number } {
  // Calculate minimum distance based on actual cluster sizes
  const getMinDist = (c1: Cluster, c2: Cluster) => {
    const r1 = getClusterOuterRadius(c1)
    const r2 = getClusterOuterRadius(c2)
    return (r1 + r2) * 2 + 100  // 2x radius of each + 100px buffer
  }

  // Try evenly-spaced angles first, then nudge if too close
  const candidates = 24 // angular candidates to try
  for (let attempt = 0; attempt < candidates; attempt++) {
    const angle = ((index + attempt / candidates) / Math.max(MAX_CLUSTERS, 1)) * Math.PI * 2
    // Scale radius so clusters fit
    const avgRadius = existing.length > 0
      ? existing.reduce((sum, c) => sum + getClusterOuterRadius(c), 0) / existing.length
      : ORBIT_RADII[0]
    const minR = (avgRadius * 4) / Math.sin(Math.PI / Math.max(MAX_CLUSTERS, 2))
    const r = Math.max(minR, Math.min(CANVAS_W, CANVAS_H) * 0.38)
    const x = CANVAS_W / 2 + Math.cos(angle) * r
    const y = CANVAS_H / 2 + Math.sin(angle) * r

    const tooClose = existing.some(c => {
      const minDist = getMinDist(c, { ringCounts: [] } as any)
      return Math.hypot(c.centerX - x, c.centerY - y) < minDist
    })
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
  const pendingTimings = new Map<string, number>()  // tool_use_id → timestamp
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
      const nodesToDelete: string[] = []
      for (const [key, node] of cluster.nodes) {
        if (!sMap?.has(key)) {
          if (node.nodeType === 'file') {
            // File nodes are removed when pushed out of buffer
            nodesToDelete.push(key)
            if (node.orbitRing >= 0 && node.orbitRing < cluster.ringCounts.length) {
              cluster.ringCounts[node.orbitRing] = Math.max(0, cluster.ringCounts[node.orbitRing] - 1)
            }
          } else {
            node.life = Math.min(node.life, 0.15) // start fade-out
          }
          continue
        }
        const idx = sMap.get(key)!
        const newAge = buffer.length - 1 - idx
        node.age = cluster.stopping && node.age >= 80 ? node.age : newAge
        node.lastEventIndex = idx
      }
      // Delete nodes that were pushed out of buffer
      for (const key of nodesToDelete) {
        cluster.nodes.delete(key)
      }
      cluster.edges = cluster.edges.filter(
        e => cluster.nodes.has(e.fromKey) && cluster.nodes.has(e.toKey)
      )
      if (cluster.stopping && cluster.nodes.size === 0) {
        sessions.delete(sid)
      }
    }
  }

  function addEvent(event: RawEvent, skipAnimations: boolean = false) {
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

      const c = {
        sessionId: event.session_id,
        label,
        centerX: pos.x,
        centerY: pos.y,
        nodes: new Map(),
        edges: [],
        stopping: false,
        lastFileKey: null,
        parentSessionId,
        ringCounts: [],  // dynamically grows; each index i has max RING_CAPACITIES[i]
        layoutAngle,
        isChild,
        childIndex,
        compacting: 0,
        compacted: 0,
        promptSnakes: [],
        agentPositionMap: new Map<string, Point>(),
      }
      // Per-ring speed jitter (±20%) — unique to this cluster, shared by all nodes on the ring
      const rj = radialJitter(event.session_id)
      ;(c as any).ringSpeeds = ORBIT_SPEEDS.map((speed, i) =>
        speed * (1 + (rj + (i * 2 - 1)) / 7 * 0.2)
      )
      sessions.set(event.session_id, c)
    }

    const cluster = sessions.get(event.session_id)!
    ;(cluster as any).eventCount = ((cluster as any).eventCount || 0) + 1

    // Update cluster label from cwd or file paths (better than hash)
    if (cluster.label.length <= 8 || cluster.label.startsWith('#')) {
      let project = ''
      if (event.cwd) {
        const parts = event.cwd.split('/').filter(Boolean)
        project = parts[parts.length - 1] || ''
      }
      // Fallback: extract project name from file_path in tool_input
      if (!project) {
        const fp = (event.tool_input as Record<string, string> | null)?.file_path
          || (event.tool_input as Record<string, string> | null)?.path || ''
        if (fp.includes('/')) {
          const segs = fp.split('/').filter(Boolean)
          // Look for segment after common dirs (Users, home, src, etc.)
          const srcIdx = segs.lastIndexOf('src')
          if (srcIdx > 0) project = segs[srcIdx - 1]
          else if (segs.length >= 3) project = segs[segs.length - 3]
        }
      }
      if (project && project.length > 1) cluster.label = project
    }

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

    // Track tool latency: store start timestamp on PreToolUse
    if (event.hook_event_name === 'PreToolUse' && event.tool_use_id) {
      pendingTimings.set(event.tool_use_id, event.timestamp)
    }

    // SubagentStart: spawn satellite node orbiting close to core
    if (event.hook_event_name === 'SubagentStart') {
      const agentId = event.agent_id || `${event.session_id}-sub`
      const agentKey = `agent:${agentId}`
      if (!cluster.nodes.has(agentKey)) {
        const angle = Math.random() * Math.PI * 2
        cluster.nodes.set(agentKey, {
          key: agentKey,
          label: event.agent_type || 'agent',
          nodeType: 'agent',
          baseRadius: 3,
          color: hexToInt('#c084fc'),
          colorHex: '#c084fc',
          x: cluster.centerX + Math.cos(angle) * 32,
          y: cluster.centerY + Math.sin(angle) * 32,
          age: 0,
          lastEventIndex: buffer.length - 1,
          lastTool: null,
          lastTimestamp: event.timestamp,
          eventCount: 1,
          awaitingPermission: false,
          orbitRing: -1,
          orbitAngle: angle,
          orbitSpeed: 0.007,
          orbitRadius: 32,
          life: 1.0,
          entry: 0,
          impactType: null,
          impactTime: 0,
          actionLabel: null,
          actionFade: 0,
          marks: [],
        })
        // Register agent position for animation routing
        const agentNode = cluster.nodes.get(agentKey)!
        cluster.agentPositionMap.set(agentId, {
          x: agentNode.x,
          y: agentNode.y
        })
        console.log(`[Store] Agent ${agentId} registered at (${agentNode.x.toFixed(0)}, ${agentNode.y.toFixed(0)})`)
      }
      recomputeAges()
      return
    }

    // SubagentStop: fade out agent satellite
    if (event.hook_event_name === 'SubagentStop') {
      const agentId = event.agent_id || `${event.session_id}-sub`
      const agentKey = `agent:${agentId}`
      const agentNode = cluster.nodes.get(agentKey)
      if (agentNode) {
        agentNode.life = 0.08
        agentNode.impactType = 'fade'
        agentNode.impactTime = 1.0
        // Clean up position map immediately so no new animations route to this agent
        cluster.agentPositionMap.delete(agentId)
      }
      recomputeAges()
      return
    }

    // SessionEnd: dissolve the cluster
    if (event.hook_event_name === 'SessionEnd') {
      cluster.stopping = true
      for (const node of cluster.nodes.values()) node.age = Math.max(node.age, 80)
      recomputeAges()
      return
    }

    // UserPromptSubmit: create PromptSnake objects with random splines
    if (event.hook_event_name === 'UserPromptSubmit') {
      if (!skipAnimations) {
        ;(cluster as any).coreAct = 1.0
        const promptText = event.prompt || ''

        // Split prompt into words
        const words = promptText.trim().split(/\s+/).filter(w => w.length > 0)

        if (words.length > 0) {
          // Generate random spawn angle (0-2π)
          const spawnAngle = Math.random() * Math.PI * 2

          // Generate random spline from well outside viewport to cluster center
          const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.8
          const splinePath = generateRandomSpline(
            cluster.centerX,
            cluster.centerY,
            spawnAngle,
            maxDist
          )

          // Get color from event or use default
          const color = (event as any).color || '#b0c8f0'

          // Create snake object
          const snake: PromptSnake = {
            words,
            color,
            progress: 0,      // start at 0, will animate to 1
            splinePath,
            startAngle: spawnAngle
          }

          // Add to snakes array
          cluster.promptSnakes.push(snake)

          // Play audio chord
          playChordForEvent(undefined, 'UserPromptSubmit')
        }
      }

      // console.log('[prompt-flying] triggered:', { promptText: cluster.promptText, flying: cluster.promptFlying, snakes: cluster.promptSnakes?.length || 0 })
      recomputeAges()
      return
    }

    // SessionStart: store model on cluster
    if (event.hook_event_name === 'SessionStart') {
      if (event.model) (cluster as any).model = event.model
      if (event.source) (cluster as any).source = event.source
      ;(cluster as any).coreAct = 1.0
      recomputeAges()
      return
    }

    // PreCompact: implosion animation (skip during replay)
    if (event.hook_event_name === 'PreCompact') {
      if (replayDone) {
        ;(cluster as any).coreAct = 1.0
        ;(cluster as any).compacting = 1.0
      }
      recomputeAges()
      return
    }

    // PostCompact: rebirth burst + reset context counter (skip during replay)
    if (event.hook_event_name === 'PostCompact') {
      if (replayDone) {
        ;(cluster as any).coreAct = 1.0
        ;(cluster as any).compacted = 1.0
      }
      ;(cluster as any).eventCount = Math.floor(((cluster as any).eventCount || 0) * 0.25)
      recomputeAges()
      return
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

    // Compute tool latency for PostToolUse / PostToolUseFailure
    let latencyStr = ''
    if ((event.hook_event_name === 'PostToolUse' || event.hook_event_name === 'PostToolUseFailure') && event.tool_use_id) {
      const startTs = pendingTimings.get(event.tool_use_id)
      if (startTs) {
        const ms = event.timestamp - startTs
        latencyStr = ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(1)}s`
        pendingTimings.delete(event.tool_use_id)
      }
    }

    if (!cluster.nodes.has(key)) {
      // Skip ephemeral node creation during replay — only show live ephemerals
      if (!isFile && !replayDone) {
        recomputeAges()
        return
      }

      // Assign to ring based on capacity (atomic orbital structure)
      const orbitRing = assignRing(cluster)
      cluster.ringCounts[orbitRing]++
      // Use per-ring speed from cluster (all nodes on same ring share the same speed)
      const ringSpeeds = (cluster as any).ringSpeeds as number[] | undefined
      const orbitSpeed = ringSpeeds ? ringSpeeds[orbitRing] : ORBIT_SPEEDS[orbitRing]
      const orbitRadius = ORBIT_RADII[orbitRing]

      // Assign angle as a placeholder — will be redistributed below
      const orbitAngle = 0

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

      // Redistribute all nodes on this ring evenly, anchored to the lowest current angle
      redistributeRing(cluster, orbitRing)

      // Mark fail impact on freshly-created nodes from a failure event
      if (event.hook_event_name === 'PostToolUseFailure') {
        const newNode = cluster.nodes.get(key)!
        newNode.impactType = 'fail'
        newNode.impactTime = 1.0
        if (event.is_interrupt) {
          newNode.actionLabel = '⏹ interrupted' + (latencyStr ? ` ${latencyStr}` : '')
        } else {
          newNode.actionLabel = '✗ error' + (latencyStr ? ` ${latencyStr}` : '')
        }
        newNode.actionFade = 0  // projectile triggers display
      } else if (event.hook_event_name === 'Stop' || event.hook_event_name === 'Notification') {
        const newNode = cluster.nodes.get(key)!
        newNode.actionLabel = event.tool_name || event.hook_event_name
        newNode.actionFade = 1.0  // show immediately (no directional projectile)
      }
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
      if (event.hook_event_name === 'PostToolUseFailure') {
        node.impactType = 'fail'
        node.impactTime = 1.0
        if (event.is_interrupt) {
          node.actionLabel = '⏹ interrupted' + (latencyStr ? ` ${latencyStr}` : '')
        } else {
          node.actionLabel = '✗ error' + (latencyStr ? ` ${latencyStr}` : '')
        }
        node.actionFade = 0  // projectile triggers display
      } else if (event.hook_event_name === 'PostToolUse') {
        // Refresh impact visual; enrich label with response data
        const tool = event.tool_name || ''
        if (['Read','Grep','Glob'].includes(tool)) node.impactType = 'scan'
        else if (['Edit','Write'].includes(tool)) node.impactType = 'morph'
        else if (tool === 'Bash') node.impactType = 'spark'
        else node.impactType = 'scan'
        node.impactTime = 1.0
        // Enrich label with PostToolUse response (exit codes, match counts, latency)
        // Only update the text — projectile handles the fade trigger
        const enriched = enrichedLabel(event, latencyStr || undefined)
        if (enriched !== tool) {
          node.actionLabel = enriched
        }
      } else {
        const tool = event.tool_name || event.hook_event_name || ''
        if (['Read','Grep','Glob'].includes(tool)) node.impactType = 'scan'
        else if (['Edit','Write'].includes(tool)) node.impactType = 'morph'
        else if (tool === 'Bash') node.impactType = 'spark'
        else if (tool === 'Notification') node.impactType = 'ping'
        else if (tool === 'Stop') node.impactType = 'fade'
        else node.impactType = 'scan'
        node.impactTime = 1.0
        node.actionLabel = enrichedLabel(event)
        // Stop/Notification: label shows immediately (no directional projectile)
        node.actionFade = (event.hook_event_name === 'Stop' || event.hook_event_name === 'Notification') ? 1.0 : 0
      }
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

    // Emit domain events to EventBus for PixiJS animations
    const affectedNode = cluster.nodes.get(nodeKeyFor(event)) ?? null
    EventProcessor.process(event, cluster, affectedNode)
  }

  function markReplayDone() { replayDone = true }

  // Initialize cluster state directly from a server snapshot — no event replay, no animations
  function initFromSnapshot(snapshotSessions: Array<{
    session_id: string
    label: string
    cwd: string | null
    stopping: boolean
    eventCount: number
    nodes: Array<{ key: string; nodeType: string; label: string; colorHex: string; baseRadius: number }>
  }>) {
    for (const snap of snapshotSessions) {
      const sid = snap.session_id
      const pos = clusterPosition(sessions.size, [...sessions.values()])
      const rj = radialJitter(sid)

      const c = {
        sessionId: sid,
        label: snap.label,
        centerX: pos.x,
        centerY: pos.y,
        nodes: new Map(),
        edges: [],
        stopping: snap.stopping,
        lastFileKey: null,
        parentSessionId: null,
        ringCounts: [] as number[],
        layoutAngle: 0,
        isChild: false,
        childIndex: 0,
        compacting: 0,
        compacted: 0,
        promptSnakes: [] as PromptSnake[],
        agentPositionMap: new Map<string, Point>(),
      }
      ;(c as any).ringSpeeds = ORBIT_SPEEDS.map((speed, i) =>
        speed * (1 + (rj + (i * 2 - 1)) / 7 * 0.2)
      )
      ;(c as any).eventCount = snap.eventCount

      for (const nodeSnap of snap.nodes) {
        const orbitRing = assignRing(c as Cluster)
        c.ringCounts[orbitRing] = (c.ringCounts[orbitRing] || 0) + 1
        const ringSpeeds = (c as any).ringSpeeds as number[]
        const orbitSpeed = ringSpeeds[orbitRing] ?? ORBIT_SPEEDS[orbitRing]
        const orbitRadius = ORBIT_RADII[orbitRing]
        const orbitAngle = 0

        const colorHex = desaturate(nodeSnap.colorHex)
        c.nodes.set(nodeSnap.key, {
          key: nodeSnap.key,
          label: nodeSnap.label,
          nodeType: nodeSnap.nodeType as any,
          baseRadius: nodeSnap.baseRadius,
          color: hexToInt(colorHex),
          colorHex,
          x: pos.x + Math.cos(orbitAngle) * orbitRadius,
          y: pos.y + Math.sin(orbitAngle) * orbitRadius,
          age: 0,
          lastEventIndex: 0,
          lastTool: null,
          lastTimestamp: Date.now(),
          eventCount: 1,
          awaitingPermission: false,
          orbitRing,
          orbitAngle,
          orbitSpeed,
          orbitRadius,
          life: 1.0,
          entry: 1.0,  // already arrived, skip entry animation
          impactType: null,
          impactTime: 0,
          actionLabel: null,
          actionFade: 0,
          marks: [],
        })
      }

      // Spread all nodes evenly per ring
      const usedRings = new Set(c.ringCounts.map((_, i) => i).filter(i => c.ringCounts[i] > 0))
      for (const ring of usedRings) redistributeRing(c as Cluster, ring)

      sessions.set(sid, c as Cluster)
    }

    replayDone = true
  }

  return {
    addEvent,
    markReplayDone,
    initFromSnapshot,
    getBuffer: () => [...buffer],
    getSessions: () => sessions,
  }
}
