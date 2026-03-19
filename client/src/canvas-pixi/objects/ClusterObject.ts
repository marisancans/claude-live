import { Container, Sprite, Text, Graphics } from 'pixi.js'
import { GlowFilter } from 'pixi-filters'
import type { Cluster } from '../../types'

/**
 * Visual representation of a cluster (session).
 * Contains: core sprite (glowing), orbit ring graphics, core label, and child nodes.
 */
export class ClusterObject {
  container: Container
  data: Cluster
  coreSprite: Sprite | null = null
  coreLabel: Text | null = null
  orbitRingGraphics: Graphics[] = []
  nodeObjects: Map<string, any> = new Map() // Will hold NodeObjects

  constructor(cluster: Cluster) {
    this.data = cluster
    this.container = new Container()
    this.container.position.set(cluster.centerX, cluster.centerY)

    this.createCoreSprite()
    this.createCoreLabel()
  }

  /**
   * Create the glowing core sphere.
   * In PixiJS v8, add Graphics directly without Sprite.from() wrapper.
   */
  private createCoreSprite() {
    const g = new Graphics()
    const r = 12
    g.circle(0, 0, r).fill({ color: 0x4ade80, alpha: 0.8 })
    g.position.set(0, 0)

    // Apply glow filter from pixi-filters
    const glowFilter = new GlowFilter({ distance: 15, outerStrength: 2 })
    g.filters = [glowFilter]

    this.container.addChild(g)
    this.coreSprite = null // Track as Graphics, not Sprite
  }

  /**
   * Create label above core.
   * PixiJS v8 Text constructor: new Text({ text, style: { ... } })
   */
  private createCoreLabel() {
    this.coreLabel = new Text({
      text: this.data.label,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fill: 0xffffff,
        align: 'center',
      },
    })
    this.coreLabel.position.set(0, -30)
    this.container.addChild(this.coreLabel)
  }

  /**
   * Create orbit ring graphics (redrawn only when ring membership changes).
   */
  updateOrbitRings() {
    // Remove old rings
    for (const ring of this.orbitRingGraphics) {
      this.container.removeChild(ring)
    }
    this.orbitRingGraphics = []

    // Draw new rings based on ringCounts
    const ORBIT_RADII = [70, 120, 175, 225]
    for (let i = 0; i < this.data.ringCounts.length; i++) {
      if (this.data.ringCounts[i] > 0) {
        const g = new Graphics()
        const radius = ORBIT_RADII[i] || ORBIT_RADII[ORBIT_RADII.length - 1]
        g.circle(0, 0, radius).stroke({ width: 0.5, color: 0xffffff, alpha: 0.2 })

        this.container.addChildAt(g, 0) // Add behind nodes
        this.orbitRingGraphics.push(g)
      }
    }
  }

  tick(dt: number) {
    // Update cluster position (handled externally)
    this.container.position.set(this.data.centerX, this.data.centerY)
  }

  destroy() {
    for (const ring of this.orbitRingGraphics) {
      this.container.removeChild(ring)
    }
    this.container.destroy()
  }
}
