import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * WebFetch tool projectile: sine-wave path (web request oscillation).
 */
export class WebFetchProjectile extends ProjectileObject {
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

    // Redraw sine-wave path
    this.graphics.clear()
    const dx = this.endPos.x - this.startPos.x
    const dy = this.endPos.y - this.startPos.y
    const amplitude = 12
    const frequency = 6
    const points = 20
    const alpha = (1 - this.progress) * 0.8

    for (let i = 0; i < points; i++) {
      const t = i / (points - 1)
      const progress = t * this.progress
      const px = -dx * progress
      const py = -dy * progress + Math.sin(progress * frequency * Math.PI * 2) * amplitude

      if (i === 0) {
        this.graphics.moveTo(px, py)
      } else {
        this.graphics.lineTo(px, py)
      }
    }
    this.graphics.stroke({ width: 2, color: this.color, alpha })

    // Draw leading dot
    const dotPx = -dx * this.progress
    const dotPy = -dy * this.progress + Math.sin(this.progress * frequency * Math.PI * 2) * amplitude
    const dotGraphics = new Graphics()
    dotGraphics.circle(dotPx, dotPy, 4).fill({ color: this.color, alpha })
    this.graphics.addChild(dotGraphics)
  }
}
