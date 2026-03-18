import type { Cluster } from '../types'
import { redistributeRing } from '../store'

// Atomic orbital structure: dynamically grows from 1 to 4 rings
const RING_CAPACITIES = [4, 8, 18, 20]  // sum = 50 total slots per session
const ORBIT_RADII = [70, 120, 175, 225] // distances for each ring
const MARK_PX_SPACING = 5   // pixels between stamp centers (uniform across all rings)
const MARK_MAX = 12         // half trail length

// Get actual radii based on how many rings exist in cluster
function getOrbitRadii(cluster: any): number[] {
  const numRings = Math.max(1, Math.ceil(cluster.nodes.size / 10))
  return ORBIT_RADII.slice(0, Math.min(numRings, RING_CAPACITIES.length))
}

const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800


// Place all clusters instantly on a circle with guaranteed spacing — no physics
export function layoutClusters(clusters: Map<string, Cluster>) {
  const arr = [...clusters.values()]
  if (arr.length === 0) return
  const N = arr.length
  const SPACING = 380
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
    // Decay animation states
    cluster.compacting = Math.max(0, cluster.compacting - 0.0003)
    cluster.compacted = Math.max(0, cluster.compacted - 0.0005)
    cluster.promptFlying = Math.max(0, cluster.promptFlying - 0.008)  // ~2.5s flight

    for (const node of cluster.nodes.values()) {
      // Smooth transition to target angle (if being redistributed)
      if (node.targetOrbitAngle !== undefined) {
        const diff = node.targetOrbitAngle - node.orbitAngle
        // Normalize difference to -π to π range
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff))
        // Smoothly interpolate toward target with easing
        node.orbitAngle += normalizedDiff * 0.015 // 1.5% per frame = ~3-4s transition
        // Clear stale trail stamps during transition
        if (Math.abs(normalizedDiff) > 0.01) {
          node.marks = []
        }
        // Stop transitioning when close enough
        if (Math.abs(normalizedDiff) < 0.01) {
          node.orbitAngle = node.targetOrbitAngle
          delete node.targetOrbitAngle
        }
      } else {
        // Normal orbit advancement
        node.orbitAngle += node.orbitSpeed
      }
      node.x = cluster.centerX + Math.cos(node.orbitAngle) * node.orbitRadius
      node.y = cluster.centerY + Math.sin(node.orbitAngle) * node.orbitRadius

      // Sync agent position to animation routing map each frame
      if (node.nodeType === 'agent') {
        const agentId = node.key.replace('agent:', '')  // extract ID from key
        cluster.agentPositionMap.set(agentId, {
          x: node.x,
          y: node.y
        })
      }

      // Stamp trail marks at uniform pixel intervals (skip agent satellites)
      if (node.orbitRing >= 0) {
        const spacing = MARK_PX_SPACING / node.orbitRadius // radians for constant px gap
        const last = node.marks.length > 0 ? node.marks[node.marks.length - 1] : null
        if (last === null || Math.abs(node.orbitAngle - last) >= spacing) {
          node.marks.push(node.orbitAngle)
          if (node.marks.length > MARK_MAX) node.marks.shift()
        }
      }

      // Decay timers
      node.impactTime = Math.max(0, node.impactTime - 0.022)
      node.actionFade = Math.max(0, node.actionFade - 0.003)
      node.entry = Math.min(1, node.entry + 0.01) // Slower entry: ~3.2 seconds instead of 1.2

      // Ephemerals only decay when evicted from buffer (store sets life < 0.15)
      if (node.nodeType !== 'file' && node.life < 0.15) {
        node.life = Math.max(0, node.life - 0.004)
      }
    }

    // Update snake animations
    if (!cluster.promptSnakes) cluster.promptSnakes = []

    // Decay progress for each snake
    for (const snake of cluster.promptSnakes) {
      snake.progress = Math.min(1, snake.progress + 0.005)  // ~3s duration (0.005/frame * ~180 frames at 60fps)
    }

    // Remove completed snakes (progress >= 1)
    cluster.promptSnakes = cluster.promptSnakes.filter(s => s.progress < 1)

    // Remove dead ephemerals and redistribute remaining nodes on affected rings
    const removedRings = new Set<number>()
    for (const [key, node] of cluster.nodes) {
      if (node.nodeType !== 'file' && node.life <= 0) {
        if (node.orbitRing >= 0 && node.orbitRing < cluster.ringCounts.length) {
          removedRings.add(node.orbitRing)
          cluster.ringCounts[node.orbitRing] = Math.max(0, cluster.ringCounts[node.orbitRing] - 1)
        }
        cluster.nodes.delete(key)
      }
    }
    for (const ring of removedRings) redistributeRing(cluster, ring)
  }
}
