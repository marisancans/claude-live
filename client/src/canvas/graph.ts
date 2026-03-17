import type { Cluster } from '../types'

const K_REPULSE = 800          // node-node repulsion constant
const K_ATTRACT = 0.03         // edge attraction factor
const TARGET_DIST = 80         // edge rest length (simulation units)
const K_GRAVITY = 0.005        // cluster gravity toward centerX/centerY
const K_CLUSTER_REPULSE = 2000 // cluster-cluster repulsion
const MIN_CLUSTER_DIST = 250   // minimum cluster separation
const BOUNDARY_DIST = 60       // canvas boundary repulsion kickin distance
const DAMPING = 0.88
const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800

export function tickSimulation(clusters: Map<string, Cluster>) {
  const clusterList = [...clusters.values()]
  const allNodes = clusterList.flatMap(c => [...c.nodes.values()])

  // 1. Node-node repulsion (within each cluster only)
  for (const cluster of clusterList) {
    const nodes = [...cluster.nodes.values()]
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist < 150) {
          const f = K_REPULSE / (dist * dist)
          const nx = dx / dist, ny = dy / dist
          a.vx += nx * f; a.vy += ny * f
          b.vx -= nx * f; b.vy -= ny * f
        }
      }
    }
  }

  // 2. Edge attraction (within each cluster)
  for (const cluster of clusterList) {
    for (const edge of cluster.edges) {
      const a = cluster.nodes.get(edge.fromKey)
      const b = cluster.nodes.get(edge.toKey)
      if (!a || !b) continue
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const f = (dist - TARGET_DIST) * K_ATTRACT
      const nx = dx / dist, ny = dy / dist
      a.vx += nx * f; a.vy += ny * f
      b.vx -= nx * f; b.vy -= ny * f
    }
  }

  // 3. Cluster gravity (each node toward cluster centerX/centerY)
  for (const cluster of clusterList) {
    for (const node of cluster.nodes.values()) {
      node.vx += (cluster.centerX - node.x) * K_GRAVITY
      node.vy += (cluster.centerY - node.y) * K_GRAVITY
    }
  }

  // 4. Cluster-cluster repulsion
  for (let i = 0; i < clusterList.length; i++) {
    for (let j = i + 1; j < clusterList.length; j++) {
      const a = clusterList[i], b = clusterList[j]
      const dx = a.centerX - b.centerX, dy = a.centerY - b.centerY
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      if (dist < MIN_CLUSTER_DIST) {
        const f = K_CLUSTER_REPULSE / (dist * dist)
        const nx = dx / dist, ny = dy / dist
        a.centerX += nx * f * 0.1; a.centerY += ny * f * 0.1
        b.centerX -= nx * f * 0.1; b.centerY -= ny * f * 0.1
      }
    }
  }

  // 5. Canvas boundary repulsion + integrate
  for (const node of allNodes) {
    if (node.x < BOUNDARY_DIST) node.vx += (BOUNDARY_DIST - node.x) * 0.1
    if (node.x > CANVAS_W - BOUNDARY_DIST) node.vx -= (node.x - (CANVAS_W - BOUNDARY_DIST)) * 0.1
    if (node.y < BOUNDARY_DIST) node.vy += (BOUNDARY_DIST - node.y) * 0.1
    if (node.y > CANVAS_H - BOUNDARY_DIST) node.vy -= (node.y - (CANVAS_H - BOUNDARY_DIST)) * 0.1
    node.vx *= DAMPING; node.vy *= DAMPING
    node.x += node.vx; node.y += node.vy
  }
}
