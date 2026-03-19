import { Graphics } from 'pixi.js'
import type { ClusterObject } from '../objects/ClusterObject'

/**
 * Edge layer: single Graphics object redrawn each frame.
 * Draws parent→child cluster lines and node→node edges from cluster.edges[].
 */
export class EdgeLayer {
  graphics: Graphics

  constructor() {
    this.graphics = new Graphics()
  }

  /**
   * Redraw all edges each frame.
   * Note: In PixiJS v8, each moveTo/lineTo must be followed by stroke() call.
   */
  redraw(clusters: Map<string, ClusterObject>) {
    this.graphics.clear()

    for (const clusterObj of clusters.values()) {
      const cluster = clusterObj.data

      // Draw parent→child cluster lines
      if (cluster.parentSessionId) {
        const parentObj = Array.from(clusters.values()).find(
          c => c.data.sessionId === cluster.parentSessionId
        )
        if (parentObj) {
          const parentX = parentObj.data.centerX
          const parentY = parentObj.data.centerY
          const childX = cluster.centerX
          const childY = cluster.centerY

          this.graphics
            .moveTo(parentX, parentY)
            .lineTo(childX, childY)
            .stroke({ width: 1, color: 0xffaa44, alpha: 0.3 })
        }
      }

      // Draw node→node edges from cluster.edges[]
      for (const edge of cluster.edges) {
        const fromNode = cluster.nodes.get(edge.fromKey)
        const toNode = cluster.nodes.get(edge.toKey)
        if (fromNode && toNode) {
          this.graphics
            .moveTo(fromNode.x, fromNode.y)
            .lineTo(toNode.x, toNode.y)
            .stroke({ width: 0.5, color: 0xffffff, alpha: 0.15 })
        }
      }
    }
  }
}
