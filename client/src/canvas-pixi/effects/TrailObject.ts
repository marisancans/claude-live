import { Container, Graphics } from 'pixi.js'
import type { Cluster } from '../../types'
import { orbitRadiusFor } from '../../constants'
const DASH_PX = 3

/**
 * Trail marks: small arc dashes left behind orbiting nodes.
 * Reads node.marks[] which are stamped by tickSimulation() in graph.ts.
 */
export class TrailObject {
  container: Container
  cluster: Cluster
  private gfx: Graphics

  constructor(cluster: Cluster) {
    this.container = new Container()
    this.cluster = cluster
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)
  }

  tick(_dt: number) {
    this.gfx.clear()

    // Dim trails during compaction
    const compacting = this.cluster.compacting ?? 0
    if (compacting > 0.5) {
      this.container.alpha = 1 - compacting
    } else {
      this.container.alpha = 1
    }

    for (const node of this.cluster.nodes.values()) {
      if (node.orbitRing < 0 || node.marks.length === 0) continue

      const baseAl = node.nodeType === 'file'
        ? 0.5
        : node.life * 0.4 * Math.min(1, node.entry)
      if (baseAl <= 0.01) continue

      const ring = Math.max(0, node.orbitRing)
      const radius = orbitRadiusFor(ring)
      const dashArc = DASH_PX / radius

      const n = node.marks.length
      for (let i = 0; i < n; i++) {
        const fade = (i + 1) / n
        const al = baseAl * fade
        if (al <= 0.01) continue

        const a = node.marks[i]
        this.gfx
          .arc(0, 0, radius, a - dashArc / 2, a + dashArc / 2)
          .stroke({ width: 1.2, color: 0xffffff, alpha: al })
        // Move to break the path for next arc
        if (i < n - 1) {
          const nextA = node.marks[i + 1]
          this.gfx.moveTo(
            Math.cos(nextA - dashArc / 2) * radius,
            Math.sin(nextA - dashArc / 2) * radius
          )
        }
      }
    }
  }

  destroy() {
    this.container.destroy({ children: true })
  }
}
