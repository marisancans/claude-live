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
  lastFileKey: string | null   // key of most recently touched file node
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
