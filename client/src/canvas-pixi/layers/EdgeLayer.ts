import { Graphics } from 'pixi.js'
import type { ClusterObject } from '../objects/ClusterObject'

/**
 * Edge layer: energy tethers between parent↔child clusters and node→node connections.
 * Redrawn each frame with animated pulse effects.
 */
export class EdgeLayer {
  graphics: Graphics
  private time: number = 0

  constructor() {
    this.graphics = new Graphics()
  }

  /**
   * Redraw all edges each frame.
   */
  redraw(clusters: Map<string, ClusterObject>, dt: number = 1/60) {
    this.graphics.clear()
    this.time += dt

    for (const clusterObj of clusters.values()) {
      const cluster = clusterObj.data

      // Parent→child cluster energy tether
      if (cluster.parentSessionId) {
        const parentObj = Array.from(clusters.values()).find(
          c => c.data.sessionId === cluster.parentSessionId
        )
        if (parentObj) {
          this.drawEnergyTether(
            parentObj.data.centerX, parentObj.data.centerY,
            cluster.centerX, cluster.centerY,
            cluster.isChild
          )
        }
      }

      // Node→node edge lines (file sequence connections)
      // node.x/y are set by tickSimulation() in world space
      for (const edge of cluster.edges) {
        const fromNode = cluster.nodes.get(edge.fromKey)
        const toNode = cluster.nodes.get(edge.toKey)
        if (fromNode && toNode) {
          this.graphics
            .moveTo(fromNode.x, fromNode.y)
            .lineTo(toNode.x, toNode.y)
            .stroke({ width: 0.4, color: 0xffffff, alpha: 0.08 })
        }
      }
    }
  }

  /**
   * Animated energy tether between parent and child clusters.
   * Features: pulsing glow line, traveling energy dots, subtle sine wave displacement.
   */
  private drawEnergyTether(
    px: number, py: number,
    cx: number, cy: number,
    isChild: boolean,
  ) {
    const dx = cx - px
    const dy = cy - py
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1) return

    const nx = dx / dist
    const ny = dy / dist
    // Perpendicular
    const perpX = -ny
    const perpY = nx

    const t = this.time
    const color = isChild ? 0xDCBE78 : 0xA0B4DC

    // Base tether: faint solid line with subtle sine wave
    const segments = Math.max(8, Math.floor(dist / 6))
    for (let i = 0; i < segments; i++) {
      const t0 = i / segments
      const t1 = (i + 1) / segments

      // Sine wave displacement
      const wave0 = Math.sin(t0 * Math.PI * 3 + t * 1.5) * 3
      const wave1 = Math.sin(t1 * Math.PI * 3 + t * 1.5) * 3

      // Taper displacement at endpoints
      const taper0 = Math.sin(t0 * Math.PI)
      const taper1 = Math.sin(t1 * Math.PI)

      const x0 = px + dx * t0 + perpX * wave0 * taper0
      const y0 = py + dy * t0 + perpY * wave0 * taper0
      const x1 = px + dx * t1 + perpX * wave1 * taper1
      const y1 = py + dy * t1 + perpY * wave1 * taper1

      this.graphics
        .moveTo(x0, y0)
        .lineTo(x1, y1)
        .stroke({ width: 0.6, color, alpha: 0.1 })
    }

    // Traveling energy dots along the tether
    const dotCount = 3
    for (let d = 0; d < dotCount; d++) {
      const phase = (t * 0.4 + d / dotCount) % 1.0
      const wave = Math.sin(phase * Math.PI * 3 + t * 1.5) * 3
      const taper = Math.sin(phase * Math.PI)
      const dotX = px + dx * phase + perpX * wave * taper
      const dotY = py + dy * phase + perpY * wave * taper

      // Dot fades at endpoints
      const dotAlpha = Math.sin(phase * Math.PI) * 0.5
      if (dotAlpha > 0.02) {
        this.graphics.circle(dotX, dotY, 1.5).fill({ color, alpha: dotAlpha * 0.6 })
        this.graphics.circle(dotX, dotY, 3).fill({ color, alpha: dotAlpha * 0.15 })
      }
    }
  }
}
