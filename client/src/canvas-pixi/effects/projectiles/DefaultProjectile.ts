import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

/**
 * Default tool projectile: fallback dot trail with gradient-like line.
 * Faithfully matches the original Canvas2D renderer.
 */
export class DefaultProjectile extends ProjectileObject {
  color: number
  graphics: Graphics

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 0.6) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    const e = eio(Math.min(this.progress, 1))

    // Head position
    const hx = this.startPos.x + (this.endPos.x - this.startPos.x) * e
    const hy = this.startPos.y + (this.endPos.y - this.startPos.y) * e

    // Trail start: 25% behind the head
    const trail = Math.max(0, e - 0.25)
    const tx = this.startPos.x + (this.endPos.x - this.startPos.x) * trail
    const ty = this.startPos.y + (this.endPos.y - this.startPos.y) * trail

    this.graphics.clear()

    // Approximate gradient trail with 4 segments of increasing alpha
    const segCount = 4
    for (let s = 0; s < segCount; s++) {
      const t0 = s / segCount
      const t1 = (s + 1) / segCount
      const alpha = (t1 * 0.8) // linearly increase from 0 to 0.8 along trail

      const x0 = tx + (hx - tx) * t0
      const y0 = ty + (hy - ty) * t0
      const x1 = tx + (hx - tx) * t1
      const y1 = ty + (hy - ty) * t1

      this.graphics
        .moveTo(x0, y0)
        .lineTo(x1, y1)
        .stroke({ width: 1.2, color: this.color, alpha })
    }

    // Lead dot at head: colored 2px circle
    this.graphics
      .circle(hx, hy, 2)
      .fill({ color: this.color, alpha: 0.9 })
  }
}
