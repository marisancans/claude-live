import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Bash tool projectile: lightning bolt shape (shell command execution).
 */
export class BashProjectile extends ProjectileObject {
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

    // Redraw lightning bolt shape
    this.graphics.clear()
    const alpha = (1 - this.progress) * 0.9
    const scale = 8

    // Lightning bolt: jagged diagonal line
    this.graphics.moveTo(0, -scale)
    this.graphics.lineTo(scale * 0.3, -scale * 0.5)
    this.graphics.lineTo(scale * 0.1, 0)
    this.graphics.lineTo(scale * 0.4, scale * 0.5)
    this.graphics.lineTo(0, scale)
    this.graphics.lineTo(-scale * 0.3, scale * 0.5)
    this.graphics.lineTo(-scale * 0.1, 0)
    this.graphics.lineTo(-scale * 0.4, -scale * 0.5)
    this.graphics.lineTo(0, -scale)
    this.graphics.stroke({ width: 2, color: this.color, alpha })
  }
}
