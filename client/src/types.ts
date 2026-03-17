// Raw event shape as received from server over SSE
export interface RawEvent {
  id: string
  session_id: string
  timestamp: number
  hook_event_name: 'PreToolUse' | 'PostToolUse' | 'Stop' | 'Notification' | 'PermissionRequest'
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  tool_response: Record<string, unknown> | null
}

// A node in the solar system
export interface GraphNode {
  key: string
  label: string
  nodeType: 'file' | 'bash' | 'web' | 'stop' | 'notification' | 'tool'
  baseRadius: number
  color: number         // PixiJS-style hex int (kept for HUD compatibility)
  colorHex: string      // CSS hex string e.g. '#60a5fa'
  x: number
  y: number
  vx: number
  vy: number
  age: number
  lastEventIndex: number
  lastTool: string | null
  lastTimestamp: number
  eventCount: number
  awaitingPermission: boolean

  // Solar system fields (file nodes only)
  orbitRing: number     // 0, 1, or 2
  orbitAngle: number    // current angle in radians
  orbitSpeed: number    // radians per frame

  // Ephemeral fields (non-file nodes)
  orbitRadius: number   // distance from cluster center
  life: number          // 1.0 → 0.0 for ephemerals
  entry: number         // 0 → 1 entry animation progress

  // Impact / action label
  impactType: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | null
  impactTime: number    // 1.0 → 0.0
  actionLabel: string | null
  actionFade: number    // 1.0 → 0.0

  // Orbit trail marks (fixed-position dots left on orbit)
  marks: Array<{ a: number; life: number }>
}

// A projectile flying from cluster center to a target node
export interface Projectile {
  sessionId: string
  cluster: Cluster                    // live ref for core position
  node: GraphNode                     // live ref for planet position
  inbound: boolean                    // true = planet→core, false = core→planet
  colorHex: string
  tool: string
  progress: number      // 0 → 1
  duration: number      // seconds
}

// A session cluster (solar system)
export interface Cluster {
  sessionId: string
  label: string
  centerX: number
  centerY: number
  nodes: Map<string, GraphNode>
  edges: Array<{ fromKey: string; toKey: string; color: number; colorHex: string; age: number }>
  stopping: boolean
  lastFileKey: string | null
  parentSessionId: string | null
  // Orbit ring assignment state
  ringCounts: [number, number, number]
  // Base angle on the global layout circle (set at creation, used for repulsion)
  layoutAngle: number
  // Agent/subagent
  isChild: boolean
  childIndex: number  // which child of parent (0, 1, 2...)
}

// Ripple (kept for compatibility, not used in solar renderer)
export interface Ripple {
  x: number; y: number; color: number; radius: number
  maxRadius: number; alpha: number; startTime: number; duration: number
}
