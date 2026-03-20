import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

/**
 * Write tool projectile: data injection tube with 5 racing packets.
 * Faithfully matches the original Canvas2D renderer.
 */
export class WriteProjectile extends ProjectileObject {
  color: number
  graphics: Graphics
  time: number = 0

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 0.8) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    this.time += dt

    const e = eio(Math.min(this.progress, 1))

    this.graphics.clear()

    // Outer glow tube: 14px width, very low alpha
    this.graphics
      .moveTo(this.startPos.x, this.startPos.y)
      .lineTo(this.endPos.x, this.endPos.y)
      .stroke({ width: 14, color: this.color, alpha: 0.07 })

    // Core tube: 3px width
    this.graphics
      .moveTo(this.startPos.x, this.startPos.y)
      .lineTo(this.endPos.x, this.endPos.y)
      .stroke({ width: 3, color: this.color, alpha: 0.18 })

    // 5 racing packets along the tube with cyclic offsets
    const dx = this.endPos.x - this.startPos.x
    const dy = this.endPos.y - this.startPos.y

    for (let i = 0; i < 5; i++) {
      const phase = ((e * 1.6 - i * 0.2) % 1 + 1) % 1
      if (phase > 0.98) continue
      const pe = eio(phase)
      const px = this.startPos.x + dx * pe
      const py = this.startPos.y + dy * pe
      const fadeOut = phase > 0.85 ? (1 - phase) / 0.15 : 1
      const pulse = 0.7 + 0.3 * Math.sin(this.time * 22 + i * 1.4)

      // Colored packet dot: 3.8px
      this.graphics
        .circle(px, py, 3.8)
        .fill({ color: this.color, alpha: fadeOut * 0.75 })

      // White inner core: 1.3px with pulse
      this.graphics
        .circle(px, py, 1.3)
        .fill({ color: 0xffffff, alpha: fadeOut * pulse * 0.95 })
    }

    // Arrival pulse ring at target when progress > 0.8
    if (this.progress > 0.8) {
      const fl = (this.progress - 0.8) / 0.2
      const ringRadius = fl * 14
      this.graphics
        .circle(this.endPos.x, this.endPos.y, ringRadius)
        .stroke({ width: 1, color: this.color, alpha: (1 - fl) * 0.5 })
    }
  }
}
