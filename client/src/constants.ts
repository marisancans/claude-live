// Orbital geometry
export const ORBIT_RADII = [55, 90, 125, 160, 195]
export const ORBIT_SPEEDS = [0.0015, 0.001, 0.0006, 0.0004, 0.00025]
export const RING_CAPACITY = [999, 999, 999, 999, 999]

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
  Stop:         '#888888',
  Notification: '#34d399',
}
export const DEFAULT_HEX = '#555555'

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

// Utility: Convert hex color to PixiJS integer format
export function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}

// Utility: Small deterministic radial offset per node so trails on the same ring don't overlap
export function radialJitter(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193)
  return ((h >>> 0) % 15) - 7  // -7 to +7 px
}

// Utility: Generate short hash from string
export function shortHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(16).slice(0, 8)
}
