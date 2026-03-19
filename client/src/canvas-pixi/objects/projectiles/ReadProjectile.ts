import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Read tool projectile: expanding scan ring (data acquisition visual).
 */
export class ReadProjectile extends ProjectileObject {
  color: number
  inbound: boolean
  graphics: Graphics

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 0.6) {
    super(startPos, endPos, duration)
    this.color = color
    this.inbound = inbound

    // Create graphics object for animation
    this.graphics = new Graphics()
    this.container.position.set(startPos.x, startPos.y)
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    // Lerp position
    const x = this.startPos.x + (this.endPos.x - this.startPos.x) * this.progress
    const y = this.startPos.y + (this.endPos.y - this.startPos.y) * this.progress
    this.container.position.set(x, y)

    // Redraw expanding scan ring
    this.graphics.clear()
    const ringRadius = 8 + this.progress * 16
    const alpha = (1 - this.progress) * 0.8
    this.graphics.circle(0, 0, ringRadius).stroke({ width: 2, color: this.color, alpha })

    // Optional: add inner ring for scanning effect
    const innerRadius = 4 + this.progress * 8
    const innerAlpha = (1 - this.progress) * 0.5
    this.graphics.circle(0, 0, innerRadius).stroke({ width: 1, color: this.color, alpha: innerAlpha })
  }
}
