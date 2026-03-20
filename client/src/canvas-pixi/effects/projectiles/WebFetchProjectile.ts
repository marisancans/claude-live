import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

const WAVE_SEGMENTS = 50

interface WaveLayer {
  width: number
  alpha: number
}

const LAYERS: WaveLayer[] = [
  { width: 8, alpha: 0.04 },   // outer glow
  { width: 3, alpha: 0.1 },    // mid
  { width: 1.5, alpha: 0.7 },  // core
]

/**
 * WebFetch tool projectile: triple-layered sine wave beam (web request oscillation).
 */
export class WebFetchProjectile extends ProjectileObject {
  color: number
  graphics: Graphics

  constructor(startPos: Point, endPos: Point, color: number, _inbound: boolean = false, duration: number = 0.6) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    // Alpha: fade out in last 20%
    const alpha = this.progress > 0.8 ? (1 - this.progress) / 0.2 : 1.0

    this.graphics.clear()

    const dx = this.endPos.x - this.startPos.x
    const dy = this.endPos.y - this.startPos.y
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 0.001) return

    // Unit direction and perpendicular
    const ux = dx / len
    const uy = dy / len
    const px = -uy  // perpendicular
    const py = ux

    // Draw each wave layer (outer to inner)
    for (const layer of LAYERS) {
      const layerAlpha = layer.alpha * alpha

      this.graphics.moveTo(this.startPos.x, this.startPos.y)

      for (let i = 1; i <= WAVE_SEGMENTS; i++) {
        const t = i / WAVE_SEGMENTS
        // Base point along the line
        const bx = this.startPos.x + dx * t
        const by = this.startPos.y + dy * t
        // Perpendicular offset from sine wave with temporal oscillation
        const perpOffset = Math.sin(t * 5 * Math.PI + this.progress * 10) * 8
        const wx = bx + px * perpOffset
        const wy = by + py * perpOffset
        this.graphics.lineTo(wx, wy)
      }

      this.graphics.stroke({ width: layer.width, color: this.color, alpha: layerAlpha })
    }

    // Head dot at progress position along the wave
    const headT = this.progress
    const headBaseX = this.startPos.x + dx * headT
    const headBaseY = this.startPos.y + dy * headT
    const headPerp = Math.sin(headT * 5 * Math.PI + this.progress * 10) * 8
    const headX = headBaseX + px * headPerp
    const headY = headBaseY + py * headPerp

    // White core dot
    this.graphics.circle(headX, headY, 3).fill({ color: 0xffffff, alpha: alpha * 0.9 })
    // Colored outer glow
    this.graphics.circle(headX, headY, 5).fill({ color: this.color, alpha: alpha * 0.2 })
  }

  destroy(): void {
    this.graphics.destroy()
    super.destroy()
  }
}
