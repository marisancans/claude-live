import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Write tool projectile: glowing dot trail (5 staggered dots, like a pen stroke).
 */
export class WriteProjectile extends ProjectileObject {
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

    // Redraw trail of 5 staggered glowing dots
    this.graphics.clear()
    const dotCount = 5
    const dx = this.endPos.x - this.startPos.x
    const dy = this.endPos.y - this.startPos.y
    const spacing = 0.15

    for (let i = 0; i < dotCount; i++) {
      const t = this.progress - spacing * i
      if (t < 0) continue

      const alpha = Math.min(1, (1 - t) * 2) * 0.8
      const glow = Math.sin(t * Math.PI) * 0.5 + 0.5
      const radius = 3 + glow * 2

      const px = -dx * t
      const py = -dy * t
      this.graphics.circle(px, py, radius).fill({ color: this.color, alpha })
    }
  }
}
