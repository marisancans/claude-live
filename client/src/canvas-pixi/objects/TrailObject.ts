import { Container, Graphics } from 'pixi.js'
import type { Cluster } from '../../types'

/**
 * Trail object: RenderTexture trail with fade effect per cluster.
 * Marks left behind by orbiting nodes as they circle.
 */
export class TrailObject {
  container: Container
  cluster: Cluster
  trailGraphics: Graphics

  constructor(cluster: Cluster) {
    this.container = new Container()
    this.cluster = cluster
    this.trailGraphics = new Graphics()
    this.container.addChild(this.trailGraphics)
  }

  tick(dt: number) {
    // TODO: render trail marks from cluster.nodes[].marks[]
  }

  destroy() {
    this.container.destroy()
  }
}
