import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Grep tool projectile: 6 pellet dots fanning outward (search pattern).
 */
export class GrepProjectile extends ProjectileObject {
  color: number
  graphics: Graphics

  constructor(startPos: Point, endPos: Point, color: number, duration: number = 0.6) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    this.container.position.set(startPos.x, startPos.y)
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    const x = this.startPos.x + (this.endPos.x - this.startPos.x) * this.progress
    const y = this.startPos.y + (this.endPos.y - this.startPos.y) * this.progress
    this.container.position.set(x, y)

    // Redraw 6 pellets fanning outward
    this.graphics.clear()
    const pelletCount = 6
    const maxDist = 20 * this.progress
    const alpha = (1 - this.progress) * 0.8

    for (let i = 0; i < pelletCount; i++) {
      const angle = (i / pelletCount) * Math.PI * 2
      const px = Math.cos(angle) * maxDist
      const py = Math.sin(angle) * maxDist
      this.graphics.circle(px, py, 2).fill({ color: this.color, alpha })
    }
  }
}
