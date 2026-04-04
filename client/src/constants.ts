// Orbital geometry constants — SINGLE SOURCE OF TRUTH
export const ORBIT_RADII = [70, 120, 175, 225]       // px distance from cluster center per ring (base)
export const RING_CAPACITIES = [4, 8, 18, 20]        // max nodes per ring (base, unlimited rings)
export const ORBIT_SPEEDS = [0.0015, 0.001, 0.0006, 0.0004]
export const NODE_VISUAL_RADIUS = 15                  // approximate px radius of a rendered node

// Render quality — multiplier on top of devicePixelRatio (e.g. 2 = 2× supersampling)
export const RENDER_SCALE = 2

// Canvas dimensions
export const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
export const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

// Cluster layout
export const MAX_CLUSTERS = 6
export const MIN_CLUSTER_DIST = 720  // outermost orbit ~340px radius each side

// Tool colors mapping
export const TOOL_COLOR_HEX: Record<string, string> = {
  Read:         '#4ade80',
  Edit:         '#60a5fa',
  Write:        '#60a5fa',
  Bash:         '#f59e0b',
  Grep:         '#a78bfa',
  Glob:         '#a78bfa',
  WebFetch:     '#f472b6',
  Stop:         '#aaaaaa',
  Notification: '#34d399',
  prompt:       '#b0c8f0',
  response:     '#7eb8f0',
  compact:      '#FFD060',
  error:        '#f87171',
  SubagentStop: '#c084fc',
}
export const DEFAULT_HEX = '#4ade80'  // default to green rather than gray

// Utility: Desaturate toward white — same formula as mockup
export function desaturate(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const mr = Math.round(r * 0.3 + 190 * 0.7)
  const mg = Math.round(g * 0.3 + 190 * 0.7)
  const mb = Math.round(b * 0.3 + 190 * 0.7)
  return `#${mr.toString(16).padStart(2, '0')}${mg.toString(16).padStart(2, '0')}${mb.toString(16).padStart(2, '0')}`
}

// Utility: Convert hex color string to integer format
export function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}

export function orbitRadiusFor(ring: number): number {
  if (ring < ORBIT_RADII.length) return ORBIT_RADII[ring]
  const last = ORBIT_RADII[ORBIT_RADII.length - 1] ?? 200
  const prev = ORBIT_RADII[ORBIT_RADII.length - 2] ?? last - 55
  const gap = Math.max(40, last - prev)
  return last + gap * (ring - (ORBIT_RADII.length - 1))
}

export function orbitSpeedFor(ring: number): number {
  if (ring < ORBIT_SPEEDS.length) return ORBIT_SPEEDS[ring]
  const last = ORBIT_SPEEDS[ORBIT_SPEEDS.length - 1] ?? 0.0004
  const extra = ring - (ORBIT_SPEEDS.length - 1)
  return Math.max(last * Math.pow(0.85, extra), last * 0.2)
}

export function ringCapacityFor(ring: number): number {
  if (ring < RING_CAPACITIES.length) return RING_CAPACITIES[ring]
  return RING_CAPACITIES[RING_CAPACITIES.length - 1] ?? 20
}

// Model-based core colors: [baseR, baseG, baseB], [brightR, brightG, brightB]
// Parse model string ignoring version: "claude-sonnet-4-5-20250514" → "sonnet"
export function parseModelFamily(model: string): string {
  const lower = model.toLowerCase().replace('claude-', '')
  if (lower.startsWith('opus')) return 'opus'
  if (lower.startsWith('sonnet')) return 'sonnet'
  if (lower.startsWith('haiku')) return 'haiku'
  return 'unknown'
}

export const MODEL_COLORS: Record<string, { base: [number, number, number]; bright: [number, number, number]; glow: number; core: number; brightHex: number }> = {
  opus:    { base: [1.0, 0.45, 0.12], bright: [1.0, 0.75, 0.4],  glow: 0xF07020, core: 0xFFBB66, brightHex: 0xFFCC88 },
  sonnet:  { base: [0.25, 0.5, 1.0],  bright: [0.5, 0.75, 1.0],  glow: 0x4080FF, core: 0x80B0FF, brightHex: 0xAAD0FF },
  haiku:   { base: [0.2, 0.85, 0.45], bright: [0.5, 1.0, 0.7],   glow: 0x30D870, core: 0x70FFB0, brightHex: 0xA0FFC8 },
  unknown: { base: [0.78, 0.84, 0.94], bright: [0.94, 0.96, 1.0], glow: 0xC8D5F0, core: 0xF0F5FF, brightHex: 0xFFFFFF },
}

// Utility: Small deterministic radial offset per node so trails on the same ring don't overlap
export function radialJitter(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193)
  return ((h >>> 0) % 15) - 7  // -7 to +7 px
}
