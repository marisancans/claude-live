import type { RawEvent, GraphNode, Cluster } from '../types'
import {
  ORBIT_RADII,
  ORBIT_SPEEDS,
  RING_CAPACITIES,
  MAX_CLUSTERS,
  TOOL_COLOR_HEX,
  DEFAULT_HEX,
  desaturate,
  hexToInt,
  radialJitter,
} from '../constants'
import { nodeKeyFor, labelFor, enrichedLabel, nodeTypeFor } from './nodeKeys'
import { redistributeRing, clusterPosition } from './orbitLayout'
import { generateRandomSpline } from '../utils/spline'

// Re-exports for backward compatibility
export { nodeKeyFor } from './nodeKeys'
export { redistributeRing } from './orbitLayout'

/**
 * Extract words from tool response/input for ResponseSnake animation.
 * Handles different tools and limits to ~15 words for readability.
 */
function extractWords(event: RawEvent): string[] {
  const tool = event.tool_name || ''
  const resp = event.tool_response as Record<string, any> | null
  const input = event.tool_input as Record<string, any> | null
  const MAX = 15

  if (tool === 'Read') {
    const text: string = resp?.content ?? resp?.text ?? resp?.output ?? ''
    const words = text.trim().split(/\s+/).filter(Boolean).slice(0, MAX)
    return words
  }
  if (tool === 'Write') {
    const text: string = input?.content ?? ''
    return text.trim().split(/\s+/).filter(Boolean).slice(0, MAX)
  }
  if (tool === 'Bash') {
    const code = resp?.exitCode ?? resp?.exit_code ?? resp?.code
    const cmd = (input?.command ?? '').split(/\s+/)[0] || '$'
    return [cmd, code === 0 ? '✓' : `✗${code}`]
  }
  if (tool === 'Grep') {
    const n = resp?.count ?? resp?.numMatches ?? resp?.total
    return n != null ? [`${n} matches`] : []
  }
  if (tool === 'Glob') {
    const files: string[] = resp?.files ?? (Array.isArray(resp) ? resp : [])
    return files.length > 0 ? [`${files.length} files`] : []
  }
  if (tool === 'WebFetch') {
    const status = resp?.status ?? resp?.statusCode ?? '?'
    const host = (() => {
      try {
        return new URL((input?.url ?? '') as string).hostname
      } catch {
        return 'web'
      }
    })()
    return [host, String(status)]
  }
  return []
}

export function createStore() {
  const buffer: RawEvent[] = []  // transient buffer for visualization only
  const sessions = new Map<string, Cluster>()
  const pendingTimings = new Map<string, number>()  // tool_use_id → timestamp
  let replayDone = false
  const MAX_BUFFER_SIZE = 500  // keep some history for visualization, server enforces session limits

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
          // Only fade out non-file nodes if the cluster is stopping
          if (cluster.stopping && node.nodeType !== 'file') {
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

  function addEvent(event: RawEvent, skipAnimations: boolean = false) {
    if (event.hook_event_name === 'PostToolUse') {
    }

    // Strip large payload fields before buffering — file contents can be megabytes.
    // Everything needed for visualization is extracted above; we only need metadata.
    const lean: RawEvent = { ...event }
    if (lean.tool_input && typeof lean.tool_input === 'object') {
      const inp = lean.tool_input as Record<string, any>
      lean.tool_input = {
        file_path: inp.file_path,
        path: inp.path,
        command: inp.command ? String(inp.command).slice(0, 120) : undefined,
        pattern: inp.pattern,
        url: inp.url,
      }
    }
    lean.tool_response = null

    buffer.push(lean)
    if (buffer.length > MAX_BUFFER_SIZE) buffer.shift()

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
        targetCenterX: pos.x,
        targetCenterY: pos.y,
        targetRadius: 0,
        currentRadius: 0,
        nodes: new Map(),
        edges: [],
        stopping: false,
        lastFileKey: null,
        parentSessionId,
        ringCounts: [0, 0, 0, 0, 0] as [number, number, number, number, number],
        ringSpawnProgress: [1.0, 0.0, 0.0, 0.0, 0.0] as [number, number, number, number, number],
        layoutAngle,
        isChild,
        childIndex,
        compacting: 0,
        compacted: 0,
        lastEventTime: Date.now(),
        promptSnakes: [],
        agentPositionMap: new Map(),
      }
      // Per-ring speed jitter (±20%) — unique to this cluster, shared by all nodes on the ring
      const rj = radialJitter(event.session_id)
      ;(c as any).ringSpeeds = [
        ORBIT_SPEEDS[0] * (1 + (rj + 3) / 7 * 0.2),
        ORBIT_SPEEDS[1] * (1 + (rj - 1) / 7 * 0.2),
        ORBIT_SPEEDS[2] * (1 + (rj + 5) / 7 * 0.2),
        ORBIT_SPEEDS[3] * (1 + (rj + 2) / 7 * 0.2),
        ORBIT_SPEEDS[4] * (1 + (rj - 3) / 7 * 0.2),
      ]
      sessions.set(event.session_id, c)
    }

    const cluster = sessions.get(event.session_id)!
    cluster.lastEventTime = Date.now()
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
      // Use agent_id if available, otherwise generate unique key from existing count
      const existingAgents = [...cluster.nodes.keys()].filter(k => k.startsWith('agent:')).length
      const agentId = event.agent_id || `${event.session_id}-sub-${existingAgents}`
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
          vx: 0, vy: 0,
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
      }
      recomputeAges()
      return
    }

    // SubagentStop: fade out agent satellite
    if (event.hook_event_name === 'SubagentStop') {
      let agentNode: GraphNode | undefined
      if (event.agent_id) {
        agentNode = cluster.nodes.get(`agent:${event.agent_id}`)
      }
      // Fallback: find first alive agent satellite (for when agent_id is missing)
      if (!agentNode) {
        for (const [k, n] of cluster.nodes) {
          if (k.startsWith('agent:') && n.life > 0.15) { agentNode = n; break }
        }
      }
      if (agentNode) {
        agentNode.life = 0.08
        agentNode.impactType = 'fade'
        agentNode.impactTime = 1.0
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

    // UserPromptSubmit: pulse core + show prompt snippet
    if (event.hook_event_name === 'UserPromptSubmit') {
      ;(cluster as any).coreAct = 1.0
      const promptText = event.prompt || ''
      ;(cluster as any).coreLabelText = promptText.slice(0, 28) + (promptText.length > 28 ? '…' : '')
      ;(cluster as any).coreLabelFade = 1.0
      ;(cluster as any).coreLabelColor = '#38bdf8'
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

      // Assign orbit ring (all node types use same logic)
      let orbitRing = 0
      for (let ri = 0; ri < 5; ri++) {
        if (cluster.ringSpawnProgress[ri] > 0 && cluster.ringCounts[ri] < RING_CAPACITIES[ri]) {
          orbitRing = ri
          break
        }
      }
      // Ensure at least ring 0 is spawning
      if (cluster.ringSpawnProgress[0] === 0) {
        cluster.ringSpawnProgress[0] = 0.001
      }
      // If this ring will now be full, preemptively activate next ring
      const nextRing = orbitRing + 1
      if (nextRing < 5 && cluster.ringCounts[orbitRing] + 1 >= RING_CAPACITIES[orbitRing]) {
        if (cluster.ringSpawnProgress[nextRing] === 0) {
          cluster.ringSpawnProgress[nextRing] = 0.001
        }
      }
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
        // Spawn ResponseSnake with tool output words
        const words = extractWords(event)
        if (!skipAnimations && words.length > 0) {
          const dist = Math.hypot(node.x - cluster.centerX, node.y - cluster.centerY) || 80
          const angle = Math.atan2(node.y - cluster.centerY, node.x - cluster.centerX)
          const splinePath = generateRandomSpline(cluster.centerX, cluster.centerY, angle, dist)
          const color = TOOL_COLOR_HEX[tool] || DEFAULT_HEX
          cluster.promptSnakes.push({
            words,
            color,
            progress: 0,
            splinePath,
            startAngle: angle
          })
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
      const ringSpeeds = [
        ORBIT_SPEEDS[0] * (1 + (rj + 3) / 7 * 0.2),
        ORBIT_SPEEDS[1] * (1 + (rj - 1) / 7 * 0.2),
        ORBIT_SPEEDS[2] * (1 + (rj + 5) / 7 * 0.2),
        ORBIT_SPEEDS[3] * (1 + (rj + 2) / 7 * 0.2),
        ORBIT_SPEEDS[4] * (1 + (rj - 3) / 7 * 0.2),
      ]

      const ca: any = {
        sessionId: sid,
        label: snap.label,
        centerX: pos.x,
        centerY: pos.y,
        targetRadius: 0,
        currentRadius: 0,
        nodes: new Map(),
        edges: [],
        stopping: snap.stopping,
        lastFileKey: null,
        parentSessionId: null,
        ringCounts: [0, 0, 0, 0, 0],
        ringSpawnProgress: [1.0, 0.0, 0.0, 0.0, 0.0],
        layoutAngle: 0,
        isChild: false,
        childIndex: 0,
        compacting: 0,
        compacted: 0,
        lastEventTime: Date.now(),
        promptSnakes: [],
        agentPositionMap: new Map(),
        ringSpeeds,
        eventCount: snap.eventCount,
      }
      const c = ca as Cluster

      for (const nodeSnap of snap.nodes) {
        // Assign ring using same logic as live addEvent (RING_CAPACITY=999 so always ring 0)
        let orbitRing = 0
        for (let ri = 0; ri < 5; ri++) {
          if (ca.ringSpawnProgress[ri] > 0 && ca.ringCounts[ri] < RING_CAPACITIES[ri]) {
            orbitRing = ri; break
          }
        }
        if (ca.ringSpawnProgress[0] === 0) ca.ringSpawnProgress[0] = 0.001
        ca.ringCounts[orbitRing]++

        const colorHex = desaturate(nodeSnap.colorHex)
        const orbitRadius = ORBIT_RADII[orbitRing]
        const orbitSpeed = ringSpeeds[orbitRing]
        const orbitAngle = 0  // redistributeRing will spread evenly

        c.nodes.set(nodeSnap.key, {
          key: nodeSnap.key,
          label: nodeSnap.label,
          nodeType: nodeSnap.nodeType as any,
          baseRadius: nodeSnap.baseRadius,
          color: hexToInt(colorHex),
          colorHex,
          x: pos.x + Math.cos(orbitAngle) * orbitRadius,
          y: pos.y + Math.sin(orbitAngle) * orbitRadius,
          vx: 0, vy: 0,
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

      // Spread all nodes evenly around the ring
      redistributeRing(c, 0)
      sessions.set(sid, c)
    }

    replayDone = true
  }

  function checkStaleSessions(thresholdMs: number) {
    const now = Date.now()
    for (const cluster of sessions.values()) {
      if (!cluster.stopping && now - cluster.lastEventTime > thresholdMs) {
        cluster.stopping = true
        for (const node of cluster.nodes.values()) node.age = Math.max(node.age, 80)
      }
    }
  }

  return {
    addEvent,
    markReplayDone,
    initFromSnapshot,
    getBuffer: () => [...buffer],
    getSessions: () => sessions,
    checkStaleSessions,
  }
}
