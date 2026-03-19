import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Edit tool projectile: beam line from start to end with pulsing width (modification).
 */
export class EditProjectile extends ProjectileObject {
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

    // Redraw beam line with pulsing width
    this.graphics.clear()
    const pulse = Math.sin(this.progress * Math.PI * 4) * 0.5 + 0.5 // Pulse between 0-1
    const width = 1 + pulse * 4 // Pulse width from 1 to 5
    const alpha = (1 - this.progress) * 0.8

    // Draw line from start to this projectile position
    const dx = this.endPos.x - this.startPos.x
    const dy = this.endPos.y - this.startPos.y
    this.graphics.moveTo(-dx * this.progress, -dy * this.progress)
    this.graphics.lineTo(0, 0)
    this.graphics.stroke({ width, color: this.color, alpha })
  }
}
