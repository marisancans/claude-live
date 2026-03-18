import type { Cluster } from '../types'
import { redistributeRing } from '../store'
import { ORBIT_RADII, CANVAS_W, CANVAS_H } from '../constants'

const MARK_PX_SPACING = 5   // pixels between stamp centers (uniform across all rings)
const MARK_MAX = 12         // half trail length


// Place all clusters on a circle with dynamic spacing based on active ring radii
export function layoutClusters(clusters: Map<string, Cluster>) {
  const arr = [...clusters.values()]
  if (arr.length === 0) return
  const N = arr.length

  // Dynamic spacing from max active radius
  let maxActiveR = ORBIT_RADII[0]
  for (const cluster of arr) {
    for (let ri = 4; ri >= 0; ri--) {
      if (cluster.ringSpawnProgress[ri] > 0) {
        if (ORBIT_RADII[ri] > maxActiveR) maxActiveR = ORBIT_RADII[ri]
        break
      }
    }
  }
  const SPACING = 2 * maxActiveR + 20
  const r = N === 1 ? 0 : SPACING / (2 * Math.sin(Math.PI / N))
  const cx = CANVAS_W / 2, cy = CANVAS_H / 2

  arr.forEach((cluster, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2
    const wasAtTarget = cluster.centerX === cluster.targetCenterX && cluster.centerY === cluster.targetCenterY
    cluster.targetCenterX = cx + Math.cos(angle) * r
    cluster.targetCenterY = cy + Math.sin(angle) * r
    cluster.layoutAngle = angle
    if (wasAtTarget) {  // snap new clusters immediately
      cluster.centerX = cluster.targetCenterX
      cluster.centerY = cluster.targetCenterY
    }
  })
}

export function tickSimulation(clusters: Map<string, Cluster>) {
  for (const cluster of clusters.values()) {
    // Decay compacting animation state
    cluster.compacting = Math.max(0, cluster.compacting - 0.0003)
    cluster.compacted = Math.max(0, cluster.compacted - 0.0005)

    // Advance ring spawn animations
    for (let ri = 0; ri < 5; ri++) {
      const p = cluster.ringSpawnProgress[ri]
      if (p > 0 && p < 1) {
        cluster.ringSpawnProgress[ri] = Math.min(1, p + 0.004)
      }
    }

    // Lerp cluster center toward target position for smooth repositioning
    cluster.centerX += (cluster.targetCenterX - cluster.centerX) * 0.025
    cluster.centerY += (cluster.targetCenterY - cluster.centerY) * 0.025

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

    // Remove dead ephemerals and redistribute remaining nodes on affected rings
    const removedRings = new Set<number>()
    for (const [key, node] of cluster.nodes) {
      if (node.nodeType !== 'file' && node.life <= 0) {
        if (node.orbitRing >= 0) {
          removedRings.add(node.orbitRing)
          cluster.ringCounts[node.orbitRing] = Math.max(0, cluster.ringCounts[node.orbitRing] - 1)
        }
        cluster.nodes.delete(key)
      }
    }
    for (const ring of removedRings) redistributeRing(cluster, ring)
  }
}
