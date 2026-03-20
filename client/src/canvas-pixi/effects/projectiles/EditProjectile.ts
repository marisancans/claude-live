import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

/**
 * Edit tool projectile: ink bleed beam with orbiting blobs at head.
 * Faithfully matches the original Canvas2D renderer.
 */
export class EditProjectile extends ProjectileObject {
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
    const hx = this.startPos.x + (this.endPos.x - this.startPos.x) * e
    const hy = this.startPos.y + (this.endPos.y - this.startPos.y) * e

    this.graphics.clear()

    // Outer glow beam (8px wide, low alpha)
    this.graphics
      .moveTo(this.startPos.x, this.startPos.y)
      .lineTo(hx, hy)
      .stroke({ width: 8, color: this.color, alpha: 0.07 })

    // Core beam (2px, gradient approximation: 3 segments with varying alpha)
    const dx = hx - this.startPos.x
    const dy = hy - this.startPos.y
    const segments = [
      { t0: 0, t1: 0.35, alpha: 0.5 },
      { t0: 0.35, t1: 0.7, alpha: 0.35 },
      { t0: 0.7, t1: 1.0, alpha: 0.75 },
    ]
    for (const seg of segments) {
      const x0 = this.startPos.x + dx * seg.t0
      const y0 = this.startPos.y + dy * seg.t0
      const x1 = this.startPos.x + dx * seg.t1
      const y1 = this.startPos.y + dy * seg.t1
      this.graphics
        .moveTo(x0, y0)
        .lineTo(x1, y1)
        .stroke({ width: 2, color: this.color, alpha: seg.alpha })
    }

    // 4 orbiting blobs at the head
    for (let i = 3; i >= 0; i--) {
      const blobR = (4 - i) * 2.5 + 1
      const blobA = (0.08 - i * 0.015) * (1 + Math.sin(this.time * 12 + i) * 0.3)
      const ox = Math.cos(this.time * 5 + i * 1.4) * i * 1.5
      const oy = Math.sin(this.time * 4 + i * 2.1) * i * 1.5
      this.graphics
        .circle(hx + ox, hy + oy, blobR)
        .fill({ color: this.color, alpha: Math.max(0, blobA) })
    }

    // Lead dot: colored 2px
    this.graphics
      .circle(hx, hy, 2)
      .fill({ color: this.color, alpha: 0.95 })

    // White inner core 0.7px
    this.graphics
      .circle(hx, hy, 0.7)
      .fill({ color: 0xffffff, alpha: 0.9 })
  }
}
