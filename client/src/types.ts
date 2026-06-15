import type { Point, SplinePath } from './utils/spline'

// Raw event shape as received from server over SSE
export interface RawEvent {
  id: string
  session_id: string
  timestamp: number
  hook_event_name: 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure' | 'Stop' | 'Notification' | 'PermissionRequest' | 'SubagentStart' | 'SubagentStop' | 'SessionEnd' | 'UserPromptSubmit' | 'PreCompact' | 'PostCompact' | 'SessionStart' | 'InstructionsLoaded' | 'WorktreeCreate' | 'WorktreeRemove' | 'ConfigChange' | 'WorkflowLaunched' | 'AiTitle' | 'PrLink' | 'TurnDuration' | 'CompactBoundary' | 'ApiError' | 'Informational' | 'PermissionMode' | 'ModeChange' | 'QueueOperation' | 'LocalCommand' | 'AwaySummary' | 'ScheduledTask'
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  tool_response: Record<string, unknown> | null
  agent_id: string | null
  agent_type: string | null
  cwd: string | null
  error: string | null
  // Extended fields
  tool_use_id: string | null
  prompt: string | null
  model: string | null
  source: string | null
  reason: string | null
  permission_mode: string | null
  is_interrupt: boolean | null
  trigger: string | null
  compact_summary: string | null
  last_assistant_message: string | null
  notification_type: string | null
  title: string | null
  agent_transcript_path: string | null
  memory_type: string | null
  workflow_dir?: string | null
}

// A node in the solar system
export interface GraphNode {
  key: string
  label: string
  nodeType: 'file' | 'bash' | 'web' | 'stop' | 'notification' | 'tool' | 'agent'
  baseRadius: number
  color: number         // hex int (kept for HUD compatibility)
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
  targetOrbitAngle?: number // for smooth redistribution transitions

  // Ephemeral fields (non-file nodes)
  orbitRadius: number   // distance from cluster center
  life: number          // 1.0 → 0.0 for ephemerals
  entry: number         // 0 → 1 entry animation progress

  // Impact / action label
  impactType: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail' | null
  impactTime: number    // 1.0 → 0.0
  actionLabel: string | null
  actionFade: number    // 1.0 → 0.0

  // Trail stamps (fixed angles left behind as node orbits)
  marks: number[]       // angle values, newest last
}

// Maps agent IDs to their current positions for animation routing
// Key: agent ID from SubagentStart event (e.g., "abc123")
// Value: {x, y} position of agent node in space
export type AgentPositionMap = Map<string, Point>

// A prompt snake: animated words flowing along a spline path
export interface PromptSnake {
  words: string[]           // split prompt text
  color: string             // animation color (hex)
  progress: number          // 0-1 animation progress
  splinePath: SplinePath    // pre-computed spline curve
  startAngle: number        // 0-360° spawn direction in radians
  trajectory?: 'curved' | 'straight'  // 'curved' for PromptSnakes, 'straight' for ResponseSnakes
  sourceNodeKey?: string    // for ResponseSnakes: key of the source node to track
  controlOffset?: number    // for ResponseSnakes: cached control point offset for consistency
  controlSign?: number      // for ResponseSnakes: cached control point sign (-1 or 1)
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
  // Orbit ring assignment state (dynamic, grows as needed up to 5 rings)
  ringCounts: number[]
  // Base angle on the global layout circle (set at creation, used for repulsion)
  layoutAngle: number
  // Agent/subagent
  isChild: boolean
  childIndex: number  // which child of parent (0, 1, 2...)
  // Compacting animation state (1.0 → 0.0)
  compacting: number
  // Post-compaction hold state (1.0 → 0.0)
  compacted: number
  // Ring spawn animation progress per ring (0 = not yet visible, 1 = fully spawned)
  ringSpawnProgress?: [number, number, number, number, number]
  // Last event timestamp (ms) — used for stale session detection
  lastEventTime?: number
  // Array of in-flight prompt snakes
  promptSnakes: PromptSnake[]
  // Maps agent IDs to their current star positions (for animation routing)
  // Populated by SubagentStart, updated each frame, cleared by SubagentStop
  agentPositionMap: AgentPositionMap
}

