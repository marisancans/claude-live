import type { Cluster } from '../types'

const ORBIT_RADII = [70, 120, 175]

const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

const MARK_SPACING = 0.10 // radians between marks (speed-independent)
const MARK_MAX = 28

// Place all clusters instantly on a circle with guaranteed spacing — no physics
export function layoutClusters(clusters: Map<string, Cluster>) {
  const arr = [...clusters.values()]
  if (arr.length === 0) return
  const N = arr.length
  const SPACING = 520
  const r = N === 1 ? 0 : SPACING / (2 * Math.sin(Math.PI / N))
  const cx = CANVAS_W / 2, cy = CANVAS_H / 2
  arr.forEach((cluster, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2
    cluster.centerX = cx + Math.cos(angle) * r
    cluster.centerY = cy + Math.sin(angle) * r
    cluster.layoutAngle = angle
  })
}

export function tickSimulation(clusters: Map<string, Cluster>) {
  for (const cluster of clusters.values()) {
    for (const node of cluster.nodes.values()) {
      // Advance orbit angle
      node.orbitAngle += node.orbitSpeed
      node.x = cluster.centerX + Math.cos(node.orbitAngle) * node.orbitRadius
      node.y = cluster.centerY + Math.sin(node.orbitAngle) * node.orbitRadius

      // Stamp a mark every MARK_SPACING radians regardless of speed
      const lastMark = node.marks.length > 0 ? node.marks[node.marks.length - 1] : null
      if (!lastMark || Math.abs(node.orbitAngle - lastMark.a) >= MARK_SPACING) {
        node.marks.push({ a: node.orbitAngle, life: 1.0 })
        if (node.marks.length > MARK_MAX) node.marks.shift()
      }
      // Decay marks
      for (const m of node.marks) m.life = Math.max(0, m.life - 0.004)
      node.marks = node.marks.filter(m => m.life > 0)

      // Decay timers
      node.impactTime = Math.max(0, node.impactTime - 0.022)
      node.actionFade = Math.max(0, node.actionFade - 0.008)
      node.entry = Math.min(1, node.entry + 0.05)

      // Ephemerals only decay when evicted from buffer (store sets life < 0.15)
      if (node.nodeType !== 'file' && node.life < 0.15) {
        node.life = Math.max(0, node.life - 0.004)
      }
    }

    // Remove dead ephemerals
    for (const [key, node] of cluster.nodes) {
      if (node.nodeType !== 'file' && node.life <= 0) {
        cluster.nodes.delete(key)
      }
    }
  }
}
