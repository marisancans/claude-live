import { Container, Graphics } from 'pixi.js'
import type { Cluster } from '../../types'

/**
 * Trail object: particles following orbiting nodes as they circle.
 * Marks left behind by orbiting nodes fade out over time.
 */
export class TrailObject {
  container: Container
  cluster: Cluster
  trailGraphics: Graphics
  private markAges: Map<number, number> = new Map() // angle → age

  constructor(cluster: Cluster) {
    this.container = new Container()
    this.cluster = cluster
    this.trailGraphics = new Graphics()
    this.container.addChild(this.trailGraphics)
  }

  tick(dt: number) {
    const orbitRadii = [70, 120, 175, 225]
    this.trailGraphics.clear()

    // Age all existing marks
    for (const [angle, age] of this.markAges) {
      const newAge = age + dt
      if (newAge > 1.0) {
        this.markAges.delete(angle)
      } else {
        this.markAges.set(angle, newAge)
      }
    }

    // Draw trail marks
    for (const node of this.cluster.nodes.values()) {
      // Add current position as a trail mark
      const angle = node.orbitAngle
      if (!this.markAges.has(angle)) {
        const ring = Math.max(0, Math.min(node.orbitRing, orbitRadii.length - 1))
        const radius = orbitRadii[ring]
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        this.markAges.set(angle, 0)

        // Draw small fading dot at this position
        const alpha = 0.4 * (1 - 0) // Start bright, fade quickly
        this.trailGraphics.circle(x, y, 1).fill({ color: node.color, alpha })
      }
    }

    // Redraw all marks with their current age
    for (const [angle, age] of this.markAges) {
      // Find which node this angle belonged to (approximate)
      let closestNode = null
      let minDiff = Infinity
      for (const node of this.cluster.nodes.values()) {
        const diff = Math.abs(angle - node.orbitAngle)
        if (diff < minDiff && diff < 0.1) {
          minDiff = diff
          closestNode = node
        }
      }

      if (closestNode) {
        const ring = Math.max(0, Math.min(closestNode.orbitRing, orbitRadii.length - 1))
        const radius = orbitRadii[ring]
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const alpha = 0.3 * (1 - age) // Fade as age increases
        if (alpha > 0.01) {
          this.trailGraphics.circle(x, y, 1).fill({ color: closestNode.color, alpha })
        }
      }
    }
  }

  destroy() {
    this.container.destroy()
  }
}
