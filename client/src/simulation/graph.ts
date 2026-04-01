import type { Cluster } from '../types'
import { redistributeRing } from '../store'

export function tickSimulation(clusters: Map<string, Cluster>) {
  // Cluster positions are managed by physics in PixiScene — do not overwrite here

  for (const cluster of clusters.values()) {
    // Decay animation states — slow decay to sustain the dramatic compaction visuals
    // Implosion lasts ~3.5s (210 frames @ 60fps), rebirth ~2.5s (150 frames)
    cluster.compacting = Math.max(0, cluster.compacting - 0.005)
    cluster.compacted = Math.max(0, cluster.compacted - 0.007)

    for (const node of cluster.nodes.values()) {
      // Smooth transition to target angle (if being redistributed)
      if (node.targetOrbitAngle !== undefined) {
        const diff = node.targetOrbitAngle - node.orbitAngle
        // Normalize difference to -π to π range
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff))
        // Smoothly interpolate toward target with easing
        node.orbitAngle += normalizedDiff * 0.05 // 5% per frame = ~1s smooth glide
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

      // Decay timers
      node.impactTime = Math.max(0, node.impactTime - 0.022)
      node.actionFade = Math.max(0, node.actionFade - 0.003)
      node.entry = Math.min(1, node.entry + 0.01) // Slower entry: ~3.2 seconds instead of 1.2

    }

    // Update snake animations
    if (!cluster.promptSnakes) cluster.promptSnakes = []

    // Decay progress for each snake — fixed speed for all prompts
    for (const snake of cluster.promptSnakes) {
      snake.progress = Math.min(1, snake.progress + 0.003)
    }

    // Remove completed snakes (progress >= 1)
    cluster.promptSnakes = cluster.promptSnakes.filter(s => s.progress < 1)
  }
}
