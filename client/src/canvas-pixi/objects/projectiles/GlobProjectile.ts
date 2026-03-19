import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

/**
 * Glob tool projectile: spiral arc sweeping outward (file pattern match).
 */
export class GlobProjectile extends ProjectileObject {
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

    // Redraw spiral arc
    this.graphics.clear()
    const maxRadius = 25 * this.progress
    const turns = 2 // Number of spiral turns
    const points = 32
    const alpha = (1 - this.progress) * 0.8

    for (let i = 0; i < points; i++) {
      const t = i / points
      const angle = t * Math.PI * 2 * turns
      const radius = t * maxRadius
      const px = Math.cos(angle) * radius
      const py = Math.sin(angle) * radius

      if (i === 0) {
        this.graphics.moveTo(px, py)
      } else {
        this.graphics.lineTo(px, py)
      }
    }
    this.graphics.stroke({ width: 2, color: this.color, alpha })
  }
}
