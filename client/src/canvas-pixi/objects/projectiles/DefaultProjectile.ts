import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Default tool projectile: simple lerp dot with fade (fallback for unknown tools).
 */
export class DefaultProjectile extends ProjectileObject {
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

    // Redraw simple pulsing dot with fade
    this.graphics.clear()
    const alpha = (1 - this.progress) * 0.8
    const pulse = Math.sin(this.progress * Math.PI * 3) * 0.5 + 0.5
    const radius = 4 + pulse * 2
    this.graphics.circle(0, 0, radius).fill({ color: this.color, alpha })
  }
}
