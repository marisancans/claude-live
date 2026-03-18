import type { Cluster } from '../types'
import { MAX_CLUSTERS, MIN_CLUSTER_DIST, CANVAS_W, CANVAS_H } from '../constants'

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

export function clusterPosition(index: number, existing: { centerX: number; centerY: number }[]): { x: number; y: number } {
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
